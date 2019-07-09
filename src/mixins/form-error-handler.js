export const formErrorHandler = {
  methods: {
    formError(error) {
      this.alert = true;
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        this.alertMsg = error.response.data.message;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
        this.alertMsg = error.request;
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        this.alertMsg = error.message;
      } else {
        this.alertMsg = error;
      }
      console.error(error.config);
    },
  },
};
