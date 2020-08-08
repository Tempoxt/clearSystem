import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import elDragDialog from '@/directive/el-dragDialog'
import {
  sync
} from 'vuex-router-sync'

import '@assets/style/theme/0BB2D4/index.css'
import '@assets/style/theme/DC5D03/index.css'
import '@assets/style/theme/F2353C/index.css'
import '@assets/style/theme/9463F7/index.css'

import '@assets/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@assets/style/index.scss'
// import '@assets/style/element-variables.scss'
import './config/permission'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Fragment from 'vue-fragment'
import VueAMap from 'vue-amap';
Vue.use(Fragment.Plugin)
// import '@assets/style/theme/test/index.css'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)


// import XEUtils from 'xe-utils'
// import {
//   VXETable,
//   Column,
//   Checkbox,
//   Tooltip,
//   Loading,
//   Resize,
//   Table
// } from 'vxe-table'

// [VXETable,
//   Column,
//   Checkbox,
//   Tooltip,
//   Loading,
//   Resize,
//   Table].forEach(c=>{
//     Vue.use(c)
//   })

sync(store, router)
Vue.use(iView)
Vue.directive("elDragDialog",elDragDialog)

import request from '@/plugins/request'
Vue.prototype.$request = request

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '160cab8ad6c50752175d76e61ef92c50',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView','AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'Geocoder'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});



Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
Vue.mixin({
  methods: {
    $t (s) {
      return s
    }
  },
  
})
Vue.use(Element, {
  size: 'small' // set element-ui default size
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
