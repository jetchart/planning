import Vuex from 'vuex'
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    user: null
  },
  getters: {
    getConnected: state => {
      return state.connected;
    },
    getUser: state => {
      return state.user;
    }
  },
  actions: {
  },
  mutations: {
    join (state, value) {
      state.connected = true;
      state.user = value;
    },
    unjoin (state) {
      state.connected = false;
      state.user = null;
    }
  }
});
