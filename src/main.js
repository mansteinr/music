import Vue from 'vue'
import 'babel-polyfill' // es6语法转义
import App from './App.vue'
import store from './store'
import router from './router'
import fastclick from 'fastclick'
import '@/common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'

Vue.config.silent = true
Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('@/common/image/default.png')
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})