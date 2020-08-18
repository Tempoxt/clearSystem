import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/layout'

Vue.use(Router)

let asyncRoutes = [
]

let router = new Router({
  mode: 'history',
  routes: [
    {
      component: Layout,
      path: '/',
      meta: {
        requiresAuth: true,
        title: '面板'
      },
      children: [
        {
          name: '首页',
          path: '/home',
          component: () => import('./views/Home'),
          meta: {
            requiresAuth: true,
            title: '首页'
          }
        }
      ]
    },

    {
      component: () => import('@/views/account/login'),
      path: '/account/login'
    },
    {
      path: '/404',
      component: () => import('@/views/prompt/404'),
      hidden: true
    },
    // { path: '*', redirect: to => { return { path: '/404', query: { path: to.fullPath } } } }
  ]
})

const generateRoutes = (menu, base) => {
  let res = []
  if (!base) {
    for (let router of menu) {
      let r = {
        component: Layout,
        path: router.url || Math.random() + '',
        children: [],
      }
      if (router.subs && router.subs.length) {

        r.children = generateRoutes(router.subs, router.url)
        var c = asyncRoutes.find(o => o.name === router.url)
        if (c) {
          r.children.push(c)
        }

      }
      res.push(r)
    }
  } else {
    for (let router of menu) {
      var c = asyncRoutes.find(o => o.name === router.unieCode)
      if (!c) {
        // console.error('找不到路由' + router.name + '' + router.unieCode)
      }
      let r = {
        meta: {},
        ...c,
        path: router.url ? base + '/' + router.url : Math.random() + '',
      }
      r.meta.title = router.name

      if (router.subs && router.subs.length) {
        res.push(...generateRoutes(router.subs, base))
        // r.children = generateRoutes(router.subs,base)
      }
      res.push(r)
    }
  }
  return res
}

export default router
export { router, generateRoutes }