import { date } from 'quasar';

export const isPastDue = dueDate => {
  return date.getDateDiff(new Date(), dueDate, 'days') > 0;
};
