import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import http from './utils/request'

Vue.use(ElementUI, { locale: ElementUI.lang.zhCN })

Vue.config.productionTip = false

Vue.prototype.$http = http

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
