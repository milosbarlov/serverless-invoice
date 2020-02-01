import { Notify } from 'quasar';

export const axiosError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return `Error ${error.response.status}: ${error.response.data.message}`;
  }
  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return `Error ${error.request.status}: ${error.request.statusText}`;
  }
  // Something happened in setting up the request that triggered an Error
  return `Error ${error.status}: ${error.statusText}`;
};

export const notifyError = message => {
  const dismiss = Notify.create({
    actions: [{ label: 'dismiss', color: 'white', handler: () => dismiss() }],
    color: 'negative',
    icon: 'warning',
    message,
    position: 'top',
    timeout: 0,
    textColor: 'white',
  });
  return dismiss;
};
