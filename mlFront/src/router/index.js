import Vue from 'vue'
import Router from 'vue-router'
const MlPlakIndex = () => import('@/components/MlPlakIndex')
const ClientViewExecutor = () => import('@/components/ClientView/ClientViewExecutor')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MlPlakIndex',
      component: MlPlakIndex
    },
    {
      path: '/clientView/:id',
      name: 'clientView',
      component: ClientViewExecutor
    }
  ]
})
