import App from './App.vue'
import router from './router'
import store from './store/store'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuetify from 'vuetify'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
