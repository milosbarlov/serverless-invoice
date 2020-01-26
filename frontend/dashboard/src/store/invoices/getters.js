export const getEmails = state => {
  const emails = state.invoicesData.map(invoice => invoice.customer.email);
  return emails;
};

export const getCurrencyFormattedShipping = state => {
  if (state.shipping === '0') {
    return '―';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(state.shipping / 100);
};
