import App from './App.vue'
import router from './router'
import store from './store/store'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuetify from 'vuetify'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueClipboard from 'vue-clipboard2'
import jspdf from 'jspdf'
import JsonExcel from "vue-json-excel";

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueClipboard)
Vue.use(jspdf)
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.component("downloadExcel", JsonExcel)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
