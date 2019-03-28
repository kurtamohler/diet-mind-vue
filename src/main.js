import Vue from 'vue'
import './plugins/vuetify'
import Vuetify from 'vuetify'
import App from './App.vue'

import VueLodash from 'vue-lodash'
import '@mdi/font/css/materialdesignicons.css'
// import VueScrollTo from 'vue-scrollto'
var VueScrollTo = require('vue-scrollto')


Vue.config.productionTip = false

Vue.use(VueLodash, {name: 'lodash'})
Vue.use(Vuetify, {iconfont: 'mdi'})
Vue.use(VueScrollTo)

new Vue({
  render: h => h(App),
}).$mount('#app')
