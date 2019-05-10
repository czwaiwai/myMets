// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/main.scss'
import './assets/font/iconfont.css'
import 'vue-photo-preview/dist/skin.css'
// import 'babel-polyfill'
import 'core-js/es6/array'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import dateForm from './utils/dateFormat'
import axiosHelper from './utils/axiosConfig'
import routerDirect from './utils/routerDirect'
import appApi from './utils/appApi' // app 的 调用api
import filter from './utils/filter'
import toLower from './utils/toLower'
// Navbar, TabContainer, TabContainerItem, Cell, Button,
import { DatetimePicker, MessageBox, Toast, InfiniteScroll, Loadmore, Indicator } from 'mint-ui'
import FastClick from 'fastclick'
import bus from './utils/pushMsg'
import '@/utils/rem'
import preview from 'vue-photo-preview'
import NavTitle from '@/components/navTitle'
import iosFixed from '@/utils/iosfixed'
iosFixed()
console.log(bus)

if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$dev = true
  Vue.dev = true
} else {
  Vue.prototype.$dev = false
  Vue.dev = false
}
FastClick.attach(document.body)
dateForm()
Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$dev = true
  Vue.dev = true
} else {
  Vue.prototype.$dev = false
  Vue.dev = false
}
FastClick.attach(document.body)
dateForm()
Vue.config.productionTip = false
Vue.config.errorHandler = function (error, vm) {
  console.log('出现错误----')
  console.error(error)
  console.error(error.message)
  console.log(error.stack)
  console.log(vm.name)
}
Vue.component(NavTitle.name, NavTitle)
Vue.component(DatetimePicker.name, DatetimePicker)
// Vue.component(IndexList.name, IndexList)
// Vue.component(IndexSection.name, IndexSection)
// Vue.component(Button.name, Button)
// Vue.component(Cell.name, Cell)
// Vue.component(Tabbar.name, Tabbar)
// Vue.component(TabItem.name, TabItem)
// Vue.component(Navbar.name, Navbar)
// Vue.component(TabContainer.name, TabContainer)
// Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Loadmore.name, Loadmore)
Vue.use(preview, {fullscreenEl: false})
Vue.use(InfiniteScroll)
Vue.use(routerDirect, {
  router,
  appId: 'app'
})
let toast = function (msg, time = 2000) {
  return Toast({
    message: msg,
    // position: 'bottom',
    duration: time
  })
}
filter(Vue)
Vue.toast = toast
Vue.prototype.$toast = toast
Vue.prototype.$message = MessageBox
Vue.prototype.$app = appApi
Vue.prototype.$toLower = toLower
Vue.prototype.$indicator = Indicator

// Vue.use(axiosHelper, {
//   ip: ''
// })
// let vue = new Vue({
//   store,
//   router,
//   components: { App },
//   template: '<App/>'
// })
// vue.$mount('#app')

store.dispatch('getUserAction').then(user => {
  store.commit('setRandNum', Date.now())
  /* eslint-disable no-new */
  console.log(user)
  // if (Vue.dev) {
  //   Vue.isPos = true
  // }
  if (user && user.isEnergy) {
    Vue.isEnergy = true
  }
  if (store.getters.isPos) {
    Vue.isPos = true
    Vue.prototype.$isPos = true
  }
  Vue.use(axiosHelper, {
    ip: store.getters.ip,
    store
  })
  let vue = new Vue({
    store,
    router,
    components: { App },
    template: '<App/>'
  })
  vue.$mount('#app')
}).catch(err => {
  console.log(err)
  // 开发环境虚假登录
  if (Vue.dev) {
    Vue.isEnergy = true
    if (store.getters.isPos) {
      Vue.isPos = true
      Vue.prototype.$isPos = true
    }
    Vue.use(axiosHelper, {
      ip: '',
      store
    })
    let vue = new Vue({
      store,
      router,
      components: { App },
      template: '<App/>'
    })
    vue.$mount('#app')
  } else {
    // 如果没有获取到登录对象应该立即退出
    appApi.logout()
  }
})
