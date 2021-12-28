import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notify: {
      status: null,
      message: null,
      value: false,
      timeout: 2000,
    },
  },
  mutations: {
    setNotify: (state, notifyData) => {
      state.notify = Object.assign(state.notify, notifyData);
    },
  },
  actions: {},
  modules: {},
});
