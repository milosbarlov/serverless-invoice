export default {
  customersData: [],
  customerData: { info: { sources: { data: [] } } },
  filter: {
    search: '',
    status: [],
    date: {
      startDate: '',
      endDate: '',
    },
  },
  fullscreen: false,
  loading: false,
  selectedCardData: {},
  serverPagination: {
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0, // Total number of customers
    sortBy: null,
  },
};
