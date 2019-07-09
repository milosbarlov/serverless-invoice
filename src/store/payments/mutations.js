export const updateLoading = (state, payload) => {
  state.loading = payload;
};

export const updatePayments = (state, payload) => {
  state.paymentsData = payload;
};

export const updateServerPagination = (state, payload) => {
  state.serverPagination = payload;
};

export const updateFilter = (state, payload) => {
  state.filter = payload;
};

export const updateRowsNumber = (state, payload) => {
  state.serverPagination.rowsNumber = payload;
};

export const updatePage = (state, payload) => {
  state.serverPagination.page = payload;
};
