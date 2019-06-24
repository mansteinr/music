import 'babel-polyfill' // es6语法转义
import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import router from './router'

import '@/common/stylus/index.styl'

Vue.config.productionTip = false

fastclick.attach(document.body)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
