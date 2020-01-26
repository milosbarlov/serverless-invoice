import Vue from 'vue';

export const setLoading = (state, payload) => {
  state.loading = payload;
};

export const setCustomers = (state, payload) => {
  state.customersData = payload;
};

export const setCustomer = (state, payload) => {
  state.customerData = payload;
};

export const setPagination = (state, payload) => {
  state.pagination = payload;
};

export const setFilter = (state, payload) => {
  state.filter = payload;
};

export const setRowsNumber = (state, payload) => {
  state.pagination.rowsNumber = payload;
};

export const setPage = (state, payload) => {
  state.pagination.page = payload;
};

export const setFullscreen = (state, payload) => {
  state.fullscreen = payload;
};

export const setSelectedCardData = (state, payload) => {
  state.selectedCardData = payload;
};

export const setSearch = (state, payload) => {
  Vue.set(state.filter, 'search', payload);
};

export const setStatus = (state, payload) => {
  Vue.set(state.filter, 'status', payload);
};

export const setStartDate = (state, payload) => {
  Vue.set(state.filter, 'startDate', payload);
};

export const setEndDate = (state, payload) => {
  Vue.set(state.filter, 'endDate', payload);
};
