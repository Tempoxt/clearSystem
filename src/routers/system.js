export default [
    {
      name: 'menu',
      meta: {
        title: '菜单管理'
      },
      component: () => import('@/views/system/menusheet')
    },
    {
      name: 'pageManager',
      meta: {
        title: '页面管理'
      },
      component: () => import('@/views/system/pagemanager')
    },
    {
      name: 'actionsheet',
      meta: {
        title: '功能管理'
      },
      component: () => import('@/views/system/actionsheet')
    },
    {
      name: 'org',
      meta: {
        title: '组织架构'
      },
      component: () => import('@/views/system/org')
    },
    {
      name: 'user',
      meta: {
        title: '用户管理'
      },
      component: () => import('@/views/system/user')
    },
    {
      name: 'permission',
      component: () => import('@/views/system/permission')
    },
    {
      name: 'roles',
      meta: {
        title: '角色权限管理'
      },
      component: () => import('@/views/system/roles')
    },
    {
      name: 'operatelog',
      meta: {
        title: '操作日志'
      },
      component: () => import('@/views/system/opratelog')
    },
    {
      name: 'loginlog',
      meta: {
        title: '登录日志'
      },
      component: () => import('@/views/system/loginlog')
    },
    {
      name: 'loginlist',
      meta: {
        title: '登陆黑白名单'
      },
      component: () => import('@/views/Null')
    }
  ]