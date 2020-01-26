export const clearAuthData = state => {
  state.token = null;
  state.userId = null;
};

export const setError = (state, payload) => {
  state.error = payload;
};

export const setAuthUser = (state, payload) => {
  state.token = payload.token;
  state.userId = payload.userId;
};
