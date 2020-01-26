import { axiosInstance } from 'boot/axios';
import qs from 'qs';
import { axiosError, notifyError } from 'utils/error-handler';

export const asyncUpdatePayments = async ({ commit, rootState }, payload) => {
  // const { pagination, filter } = payload;
  // const { descending, page, rowsPerPage, sortBy } = payload.pagination;
  // const { startDate, endDate } = payload.filter;
  // const status =
  //   payload.filter.status.length > 0 ? [...payload.filter.status] : null;
  const { filter = {}, pagination = {} } = payload;

  commit('setLoading', true);

  const params = {
    descending: pagination.descending,
    filter: filter.search,
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    sortBy: pagination.sortBy,
    status: filter.status,
    startDate: filter.startDate,
    endDate: filter.endDate,
  };

  try {
    const response = await axiosInstance.get('/payments', {
      headers: {
        Authorization: `Bearer ${rootState.auth.token}`,
      },
      params,
      paramsSerializer: param =>
        qs.stringify(param, { skipNulls: true, arrayFormat: 'repeat' }),
    });

    if (response.status === 200) {
      commit('setPayments', response.data.payments);
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
