import Vue from 'vue';
import Vuex from 'vuex';

import customers from './customers';
import payments from './payments';
import layout from './layout';
import stripe from './stripe';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      customers,
      payments,
      layout,
      stripe,
    },
  });

  return Store;
}
