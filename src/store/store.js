import Vuex from 'vuex'
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    user: null,
    socket: null
  },
  getters: {
    getConnected: state => {
      return state.connected;
    },
    getSocket: state => {
      return state.socket;
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
    setSocket (state, value) {
      state.socket = value;
    },
    unjoin (state) {
      state.connected = false;
      state.user = null;
    }
  }
});
