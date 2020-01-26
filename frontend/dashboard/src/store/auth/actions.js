import { axiosInstance } from 'boot/axios';
import { axiosError, notifyError } from 'utils/error-handler';
import { Loading, QSpinner } from 'quasar';

let timeout;

// Signup
export async function signup(payload) {
  const { email, username, password } = payload;

  const params = {
    email,
    username,
    password,
  };

  try {
    const { data, status } = await axiosInstance.post('/auth/signup', params);

    if (status === 201) {
      console.log(data.message);
    }
  } catch (error) {
    console.error(error);
    notifyError(axiosError(error));
  }
}

// Login
export async function login({ state, commit, dispatch }, payload) {
  const { username, password } = payload;

  const params = {
    username,
    password,
  };

  Loading.show({
    message: 'Logging in...',
    spinner: QSpinner,
    spinnerColor: 'purple',
    sanitize: true,
  });

  try {
    const { data, status } = await axiosInstance.post('/auth/login', params);

    if (status === 200) {
      const expirationDate = new Date(Date.now() + data.expiresIn);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('expirationDate', expirationDate);
      commit('setAuthUser', { token: data.token, userId: data.userId });
      if (state.error) {
        commit('setError', '');
      }
      commit('setError', '');
      dispatch('setLogoutTimer', data.expiresIn);
      this.$router.push({ name: 'dashboard' });
    }
  } catch (error) {
    commit('setError', error.response.data.message);
  } finally {
    Loading.hide();
  }
}

// Logout
export function logout({ commit }) {
  Loading.show({
    message: 'Logging out...',
    spinner: QSpinner,
    spinnerColor: 'purple',
    sanitize: true,
  });

  localStorage.removeItem('expirationDate');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  commit('clearAuthData');
  clearTimeout(timeout);
  this.$router.replace('/login', () => {
    Loading.hide();
  });
}

// Set logout timer
export function setLogoutTimer({ commit }, payload) {
  timeout = setTimeout(() => {
    commit('clearAuthData');
    commit('setError', 'Session timed out. Please re-login.');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.$router.replace('/login');
  }, payload);
}

// Try auto login
export function autoLogin({ commit, dispatch }) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const expirationDate = Date.parse(localStorage.getItem('expirationDate'));
  const now = new Date();

  if (!token) {
    return;
  }

  if (now >= expirationDate) {
    return;
  }

  dispatch('setLogoutTimer', expirationDate - now);

  commit('setAuthUser', {
    token,
    userId,
  });
}
