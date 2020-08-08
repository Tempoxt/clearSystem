import Cookies from 'js-cookie'
import * as api_common from '@/api/common'
const app = {
  getters: {
    sideBarMenu(state) {
      var subs = []
      if (state.menuList) {
        var res = state.menuList.menu.find(item => {
          return item.id == state.currentMenuKey
        })
        if (res) {
          subs = res.subs
        }
      }
      return subs
    },
    appName(state){
      return '文档管理系统'
    },
    getOriginDoc(state) {
      return state.originDoc
    }
  },
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium',
    // theme: +Cookies.get('status') === 2 ? '9463F7' : '0BB2D4',
    theme: '0BB2D4',
    status: +Cookies.get('status') || 1,
    menuList: null,
    currentMenuKey: '',
    appType:+window.location.port === 8999 ? 'labor' :'erp',
    originDoc: {}
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    updateMenuList(state, list) {
      state.menuList = list
    },
    updateCurrentMenu(state, key) {
      state.currentMenuKey = key
    },
    toggleStatus(state, status) {
 
      const _status = status?status : (state.status == 1 ? 2 : 1)

      Cookies.set('status', _status)
      window.location.href = '/'
    },
    SET_ORIGIN_DOC(state, obj) {
      state.originDoc = obj
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    async getMenuList({ commit, state }, size) {
      const result = await api_common.getMenu(state.status)
      commit('updateMenuList', result)
      return result
    },
    setOriginDoc({ commit }, item) {
      commit('SET_ORIGIN_DOC', item)
    }
  }
}

export default app
