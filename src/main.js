import 'babel-polyfill' // es6语法转义
import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import loading from '@/base/loading'
import '@/common/stylus/index.styl'
import store from './store'

Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('@/common/image/default.png')
})

Vue.prototype.loading = loading

console.log(process.env.NODE_ENV)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})