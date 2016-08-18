import Vue from 'vue'

export default {
  '/': {
    component: Vue.component('dashboard', require('../views/dashboard')),
    name: 'dashboard'
  },
  '/start': {
    component: Vue.component('start', require('../views/start')),
    name: 'start'
  },
  '/watch/:item': {
    component: Vue.component('watch', require('../views/watch')),
    name: 'watch'
  }
}
