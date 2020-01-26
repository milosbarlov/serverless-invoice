export default {
  customersData: [],
  customerData: { info: { sources: { data: [] } } },
  filter: {
    search: '',
    startDate: '',
    endDate: '',
  },
  fullscreen: false,
  loading: false,
  selectedCardData: {},
  pagination: {
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0, // Total number of customers
    sortBy: null,
  },
};
