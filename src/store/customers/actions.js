import { axiosInstance } from 'boot/axios';
import { notifyError } from 'boot/notify';
import { date, Loading, QSpinner } from 'quasar';

export const asyncUpdateCustomers = async ({ commit }, payload) => {
  const { pagination, filter } = payload || '';
  const { descending, page, rowsPerPage, sortBy } = payload.pagination;
  const { startDate, endDate } = payload.filter.date || '';

  commit('updateLoading', true);

  // axiosInstance
  //   .get('/customers', {
  //     params: {
  //       descending,
  //       filter: filter.search,
  //       page,
  //       rowsPerPage,
  //       sortBy,
  //       startDate: date.formatDate(startDate, 'X'),
  //       endDate: date.formatDate(endDate, 'X'),
  //     },
  //   })
  //   .then(response => {
  //     commit('updateCustomers', response.data.customers);
  //     commit('updateServerPagination', pagination);
  //     commit('updateRowsNumber', response.data.rowsNumber);
  //   })
  //   .catch(error => {
  //     Notify({
  //       message: error.response.data.errorMessage,
  //       closeBtn: 'dismiss',
  //       color: 'negative',
  //       icon: 'fas fa-exclamation-triangle',
  //       position: 'top',
  //       timeout: 0,
  //     });
  //   })
  //   .finally(() => {
  //     commit('updateLoading', false);
  //   });
  try {
    const response = await axiosInstance.get('/customers', {
      params: {
        descending,
        filter: filter.search,
        page,
        rowsPerPage,
        sortBy,
        startDate: date.formatDate(startDate, 'X'),
        endDate: date.formatDate(endDate, 'X'),
      },
    });

    if (response.status === 200) {
      commit('updateCustomers', response.data.customers);
      commit('updateServerPagination', pagination);
      commit('updateRowsNumber', response.data.rowsNumber);
    }
  } catch (error) {
    console.error(error);
    notifyError(error);
  } finally {
    commit('updateLoading', false);
  }
};

export const asyncUpdateCustomer = async ({ commit }, payload) => {
  Loading.show({
    message: 'Loading customer...',
    spinner: QSpinner,
    spinnerColor: 'light-blue',
  });

  // commit('updateLoading', true);

  // axiosInstance
  //   .get(`/customers/${payload.id}`)
  //   .then(response => {
  //     commit('updateCustomer', response.data);
  //   })
  //   .catch(error => {
  //     Notify({
  //       message: error.response.data.errorMessage,
  //       closeBtn: 'dismiss',
  //       color: 'negative',
  //       icon: 'fas fa-exclamation-triangle',
  //       position: 'top',
  //       timeout: 0,
  //     });
  //   })
  //   .finally(() => {
  //     commit('updateLoading', false);
  //   });
  try {
    const response = await axiosInstance.get(`/customers/${payload.id}`);

    if (response.status === 200) {
      commit('updateCustomer', response.data);
    }
  } catch (error) {
    console.error(error);
    notifyError(error);
  } finally {
    // commit('updateLoading', false);
    Loading.hide();
  }
};
