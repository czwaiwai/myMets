import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import meeting from './module/meeting'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user,
    meeting
  }
})
