// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/main.scss'
import 'vue-photo-preview/dist/skin.css'
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
import { MessageBox, Toast, IndexList, IndexSection, Header, Button, Cell, Tabbar, TabItem, Navbar, TabContainer, TabContainerItem, InfiniteScroll, Loadmore } from 'mint-ui'
import FastClick from 'fastclick'
import bus from './utils/pushMsg'
import '@/utils/rem'
import preview from 'vue-photo-preview'
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
Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Navbar.name, Navbar)
Vue.component(TabContainer.name, TabContainer)
Vue.component(Loadmore.name, Loadmore)
Vue.component(TabContainerItem.name, TabContainerItem)
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
// document.addEventListener("deviceready", function () {
//   console.log('设备初始化------------------', arguments)
// }, false)

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
  if (store.getters.isPos) {
    Vue.isPos = true
    Vue.prototype.$isPos = true
  }
  Vue.use(axiosHelper, {
    ip: store.getters.ip
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
    if (store.getters.isPos) {
      Vue.isPos = true
      Vue.prototype.$isPos = true
    }
    Vue.use(axiosHelper, {
      ip: ''
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

// var previous = null;
// var atleast = 10;
// document.querySelectorAll('.page').on('touchmove', function (e) {
//   var now = +new Date();
//   if(!previous){
//     previous = now;
//   }
//   if (now - previous > atleast){
//     method();//要执行的操作
//     // 重置上一次开始时间为本次结束时间
//     previous = now;
//   }
//   else{
//     clearTimeout(timer);
//     timer = setTimeout(function(){
//       checkScroll(e);
//     },200);
//   }
// }
// document.addEventListener('touchmove', function (event) {
//   if (event.cancelable) {
//     // 判断默认行为是否已经被禁用
//     if (!event.defaultPrevented) {
//       event.preventDefault()
//     }
//   }
// }, { passive: false })
