import Vue from 'vue'
import './plugins/vuetify'
import Vuetify from 'vuetify'
import App from './App.vue'

import VueLodash from 'vue-lodash'
import '@mdi/font/css/materialdesignicons.css'

import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

// import VueScrollTo from 'vue-scrollto'
let VueScrollTo = require('vue-scrollto')


Vue.config.productionTip = false

Vue.use(VueLodash, {name: 'lodash'})
Vue.use(Vuetify, {iconfont: 'mdi'})
Vue.use(VueScrollTo)

Vue.use(VueChartkick, {adapter: Chart})

new Vue({
  render: h => h(App),
}).$mount('#app')
