export const getCustomerSourceData = state =>
  state.customerData.info.sources.data;

export const getCustomerCardData = state =>
  state.customerData.info.sources.data.filter(
    source => source.object === 'card'
  );

export const getCustomerBankData = state =>
  state.customerData.info.sources.data.filter(
    source => source.object === 'bank_account'
  );

export const getServerPagination = state => state.serverPagination;

export const getFilter = state => state.filter;

export const getDate = state => state.date;
