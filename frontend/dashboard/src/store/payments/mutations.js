import Vue from 'vue';

export const setLoading = (state, payload) => {
  state.loading = payload;
};

export const setPayments = (state, payload) => {
  state.paymentsData = payload;
};

export const setPagination = (state, payload) => {
  state.pagination = payload;
};

export const setFilter = (state, payload) => {
  state.filter = payload;
};

export const setRowsNumber = (state, payload) => {
  Vue.set(state.pagination, 'rowsNumber', payload);
};

export const setPage = (state, payload) => {
  Vue.set(state.pagination, 'page', payload);
};
