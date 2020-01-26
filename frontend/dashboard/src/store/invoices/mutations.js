import Vue from 'vue';

export const addItem = (state, payload) => {
  state.lines.push(payload);
};

export const deleteItem = (state, payload) => {
  state.lines.splice(payload, 1);
};

export const resetLines = state => {
  state.lines = [
    {
      amount: '0',
      description: '',
      discount_type: '$',
      item_discount: '',
      quantity: '0',
      unit_amount: '0',
    },
  ];
};

export const setAmount = (state, { index, value }) => {
  Vue.set(state.lines[index], 'amount', value);
};

export const setDescription = (state, { index, value }) => {
  Vue.set(state.lines[index], 'description', value);
};

export const setDiscountType = (state, { index, value }) => {
  Vue.set(state.lines[index], 'discount_type', value);
};

export const setItemDiscount = (state, { index, value }) => {
  Vue.set(state.lines[index], 'item_discount', value);
};

export const setLines = (state, value) => {
  state.lines = value;
};

export const setUnitAmount = (state, { index, value }) => {
  Vue.set(state.lines[index], 'unit_amount', value);
};

export const setIndex = (state, payload) => {
  state.index = payload;
};

export const setInvoices = (state, payload) => {
  state.invoicesData = payload;
};

export const setQuantity = (state, { index, value }) => {
  Vue.set(state.lines[index], 'quantity', value);
};

export const setItem = (state, { index, value }) => {
  Object.keys(value).forEach(key => {
    Vue.set(state.lines[index], key, value[key]);
  });
};

export const setShipping = (state, payload) => {
  state.shipping = payload;
};
