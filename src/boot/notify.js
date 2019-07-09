import { Notify } from 'quasar';

function notifySuccess(message) {
  const dismiss = Notify.create({
    actions: [{ label: 'dismiss', color: 'white', handler: () => dismiss() }],
    color: 'positive',
    icon: 'check_circle',
    message,
    position: 'top',
    timeout: 0,
    textColor: 'white',
  });
  return dismiss;
}

function notifyError(message) {
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
}

export default async ({ Vue }) => {
  Vue.prototype.$notifySuccess = notifySuccess;
  Vue.prototype.$notifyError = notifyError;
};

export { notifyError, notifySuccess };
