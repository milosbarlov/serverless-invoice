export const updateLoading = (state, payload) => {
  state.loading = payload;
};

export const updateCustomers = (state, payload) => {
  state.customersData = payload;
};

export const updateCustomer = (state, payload) => {
  state.customerData = payload;
};

export const updateServerPagination = (state, payload) => {
  state.serverPagination = payload;
};

export const updateFilter = (state, payload) => {
  state.filter = payload;
};

export const updateDate = (state, payload) => {
  state.date = payload;
};

export const updateRowsNumber = (state, payload) => {
  state.serverPagination.rowsNumber = payload;
};

export const updatePage = (state, payload) => {
  state.serverPagination.page = payload;
};

export const updateFullscreen = (state, payload) => {
  state.fullscreen = payload;
};

export const updateSelectedCardData = (state, payload) => {
  state.selectedCardData = payload;
};
