import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import customers from './customers';
import invoices from './invoices';
import layout from './layout';
import payments from './payments';
import stripe from './stripe';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      customers,
      invoices,
      layout,
      payments,
      stripe,
    },
  });

  return Store;
}
