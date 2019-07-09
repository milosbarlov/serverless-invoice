import currencyFormatter from 'currency-formatter';

export default async ({ Vue }) => {
  Vue.prototype.$currencyFormatter = currencyFormatter;
};
