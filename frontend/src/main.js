import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import API from "./plugins/api"
// import io from "socket.io-client"

Vue.config.productionTip = false

Vue.use(API)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
