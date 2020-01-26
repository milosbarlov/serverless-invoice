export function asyncSetReceipt({ commit }, payload) {
  commit('setEmail', payload.email);
  commit('setNumber', payload.receipt);
}
