import Vue from 'vue'
import Vuex from 'vuex'
import tagsView from './store/modules/tagsView'
import app from './store/modules/app'
import user from './store/modules/user'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    tagsView,
    user
  },
  getters: {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
  },
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
