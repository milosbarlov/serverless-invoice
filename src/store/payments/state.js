export default {
  filter: {
    search: '',
    status: [],
    date: {
      startDate: '',
      endDate: '',
    },
  },
  loading: false,
  paymentsData: [],
  serverPagination: {
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: null,
  },
};
