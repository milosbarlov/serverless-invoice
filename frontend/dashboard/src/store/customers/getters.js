export const getCustomerSourceData = state =>
  state.customerData.info.sources.data;

export const getCustomerCardData = state =>
  state.customerData.info.sources.data.filter(
    source => source.object === 'card'
  );

export const getCustomerBankData = state =>
  state.customerData.info.sources.data.filter(
    source => source.object === 'bank_account'
  );

export const getEmails = state => {
  return state.customersData.map(customer => customer.email);
};

export const getBilling = state => {
  return state.customersData.map(customer => {
    return {
      address: customer.address,
      currency: customer.currency,
      email: customer.email,
      id: customer.id,
      invoice_prefix: customer.invoice_prefix,
      name: customer.name,
      phone: customer.phone,
      shipping: customer.shipping,
    };
  });
};
