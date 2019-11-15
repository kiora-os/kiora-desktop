import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'desktop',
      component: require('@/components/desktop').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
