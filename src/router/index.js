import Vue from 'vue'
import Router from 'vue-router'
import TreeTransferDemo from './TreeTransferDemo.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TreeTransferDemo',
      component: TreeTransferDemo
    }
  ]
})
