import App from './App.vue'
import router from './router'
import store from './store/store'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuetify from 'vuetify'
import * as io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(Vuetify)

/*Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
}));*/

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
