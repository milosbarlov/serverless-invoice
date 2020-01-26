import { Notify } from 'quasar';

export const notifySuccess = message => {
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
};
