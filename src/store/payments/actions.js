import { axiosInstance } from 'boot/axios';
import qs from 'qs';
import { date } from 'quasar';
import { notifyError } from 'boot/notify';

export const asyncUpdatePayments = async ({ commit }, payload) => {
  const { pagination, filter } = payload || '';
  const { descending, page, rowsPerPage, sortBy } = payload.pagination;
  const { startDate, endDate } = payload.filter.date || '';
  const status =
    payload.filter.status.length > 0 ? [...payload.filter.status] : null;

  commit('updateLoading', true);

  const params = {
    descending,
    filter: filter.search === '' ? null : filter.search,
    page,
    rowsPerPage,
    status,
    sortBy,
    startDate: date.formatDate(startDate, 'X'),
    endDate: date.formatDate(endDate, 'X'),
  };

  // axiosInstance
  //   .get(
  //     `https://gap3qjalyc.execute-api.us-east-1.amazonaws.com/test/payments`,
  //     {
  //       params,
  //       paramsSerializer: param =>
  //         qs.stringify(param, { skipNulls: true, arrayFormat: 'repeat' }),
  //     }
  //   )
  //   .then(response => {
  //     commit('updatePayments', response.data.payments);
  //     commit('updateServerPagination', pagination);
  //     commit('updateRowsNumber', response.data.rowsNumber);
  //   })
  //   .catch(error => {
  //     Notify({
  //       message: error.response.data.errorMessage,
  //       color: 'negative',
  //       icon: 'fas fa-exclamation-triangle',
  //       position: 'top',
  //     });
  //   })
  //   .finally(() => {
  //     commit('updateIsLoading', false);
  //   });
  try {
    const response = await axiosInstance.get('/payments', {
      params,
      paramsSerializer: param =>
        qs.stringify(param, { skipNulls: true, arrayFormat: 'repeat' }),
    });

    if (response.status === 200) {
      commit('updatePayments', response.data.payments);
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
