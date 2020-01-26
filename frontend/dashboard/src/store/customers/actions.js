import { axiosInstance } from 'boot/axios';
import { axiosError, notifyError } from 'utils/error-handler';
import { Loading, QSpinner } from 'quasar';
import qs from 'qs';

export const asyncUpdateCustomers = async ({ commit, rootState }, payload) => {
  const { filter = {}, pagination = {} } = payload;

  commit('setLoading', true);

  const params = {
    descending: pagination.descending,
    filter: filter.search,
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    sortBy: pagination.sortBy,
    startDate: filter.startDate,
    endDate: filter.endDate,
  };

  try {
    const response = await axiosInstance.get('/customers', {
      headers: {
        Authorization: `Bearer ${rootState.auth.token}`,
      },
      params,
      paramsSerializer: param =>
        qs.stringify(param, { skipNulls: true, arrayFormat: 'repeat' }),
    });

    if (response.status === 200) {
      commit('setCustomers', response.data.customers);
      commit('setPagination', pagination);
      commit('setRowsNumber', response.data.rowsNumber);
    }
  } catch (error) {
    console.error(error);
    notifyError(axiosError(error));
  } finally {
    commit('setLoading', false);
  }
};

export const asyncUpdateCustomer = async ({ commit, rootState }, payload) => {
  Loading.show({
    message: 'Loading customer...',
    spinner: QSpinner,
    spinnerColor: 'purple',
    sanitize: true,
  });

  try {
    const response = await axiosInstance.get(`/customers/${payload.id}`, {
      headers: {
        Authorization: `Bearer ${rootState.auth.token}`,
      },
    });

    if (response.status === 200) {
      commit('setCustomer', response.data);
    }
  } catch (error) {
    console.error(error);
    notifyError(axiosError(error));
  } finally {
    Loading.hide();
  }
};
