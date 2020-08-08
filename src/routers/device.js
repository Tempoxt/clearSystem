export default [
    {
      name: 'gatemanage',
      meta: {
        title: '考勤门禁设置'
      },
      component: () => import('@/views/device/devicelistmanage')
    },
    {
      name: 'devicetype',
      meta: {
        title: '设备类型'
      },
      component: () => import('@/views/device/devicetypeTable')
    },
  ]