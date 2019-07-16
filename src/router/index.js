import Vue from 'vue'
import Router from 'vue-router'
import Rank from '../components/rank'
import Recommend from '../components/recommend'
import Singer from '../components/singer'
import Search from '../components/search'
import SingerDetail from '../components/singer-detail'
import Disc from '../components/disc'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/rank',
    name: 'Rank',
    component: Rank
  }, {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Disc
    }]
  }, {
    path: '/singer',
    name: 'Singer',
    component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
    }]
  }, {
    path: '/search',
    name: 'Search',
    component: Search
  }]
})