import { router, generateRoutes } from '../router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import auth from '@/utils/auth'
import store from '@/store'
import request from '@/plugins/request'
import { Message, MessageBox } from 'element-ui'
let routerHash = {}
const createdRouterHash = (router) => {

}
let req = async (tk, next) => {
  // let userInfo = await request.get('/doc/erp/login', {
  //   params: { token: tk }
  // })
  // if (userInfo.code !== 0) {
  //   Message({ type: 'error', message: userInfo.msg })
  //   setTimeout(() => {
  //     window.location = process.env.VUE_APP_EIP
  //   }, 2000);
  // } else {
  //   // Message({ type: 'success', message: userInfo.msg })
  //   const { token } = userInfo.data;

  //   store.commit("user/SET_LOGINFO", userInfo.data);
  //   store.commit("user/login", token);
  //   console.log(auth.getToken())
    next({
      path: '/home'
    })
    return

  // }
}
router.beforeEach(async (to, from, next) => {

  NProgress.start()
  // if (!auth.getToken() && to.path !== '/account/login') {
  //     next({
  //         path: '/account/login'
  //     })
  //     return
  // }
  console.log(process.env)
  // to.query.token &&
  if (to.path === '/') {  
    // if (to.query.token && to.path === '/') {

    // req('8235ee90-66a7-340a-8ce3-c3d1a5353a44', next)
    req('79a1de3f-f131-36c6-89ca-701f1713a219', next)
    // req(to.query.token, next)
    return
  }
  if (!auth.getToken()) {
    // window.location = process.env.VUE_APP_EIP
  } else if (auth.getToken() && to.path === '/') {
    next({
      path: '/home'
    })
    return
  }
  // if (auth.getToken()) {
  //     // if (to.path === '/account/login') {
  //         next()
  //         return
  //     // }
  //     // if (sreal_name
  //     // 比对 to 和 hash

  // }
  next()
  return

})
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - 文档管理系统'
  }
  next()
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
