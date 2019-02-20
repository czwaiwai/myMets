import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import meeting from './module/meeting'
import meter from './module/meter'
import investment from './module/investment'
import rent from './module/rent'
import approval from './module/approval'
import home from './module/home'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user,
    meeting,
    meter,
    investment,
    rent,
    approval,
    home
  }
})
