import Vue from 'vue'
import App from './App.vue'
import vuetify from "./plugins/vuetify";
import store from './store'
import notify from "./plugins/notify";

Vue.config.productionTip = false

Vue.use(notify);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
