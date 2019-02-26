import Vue from 'vue'
import Router from 'vue-router'
// import sess from '@/utils/sess'
import customerService from './customerService'
// 会议室
import meeting from './meeting'
// 抄表
import meter from './meter'
// 投资物业
import investment from './investment'
// 租赁
import rent from './rent'
// 审批
import approval from './approval'
// 扫码进入的设备详情
import scanDetail from './scanDetail'
// 报表
import report from './report'
// 巡检保养
import workOrder from './workOrder'
// 监控中心
import monitorCenter from './monitorCenter'
// 整改对比
import comparedBuild from './comparedBuild'

import Index from '@/views/index'
import TabHome from '@/views/tabHome'
import TabWork from '@/views/tabWork'
import TabReport from '@/views/tabReport'
import TabMy from '@/views/tabMy'
import About from '@/views/publicPage/about'
import Status from '@/views/publicPage/status'
import Setting from '@/views/publicPage/setting'
import BtnFunc from '@/views/publicPage/btnFunc'
import GetCash from '@/views/cashInfo/getCash'
import CustomerList from '@/views/cashInfo/customerList'
import ExpenseList from '@/views/cashInfo/expenseList'
import CashPaySucc from '@/views/cashInfo/cashPaySucc'
import CashPayDetail from '@/views/cashInfo/cashPayDetail'
import Test from '@/views/test'

/* webpackChunkName:'baseIndex' */
const Home = () => import(/* webpackChunkName:'baseIndex' */ '@/views/home')
const Login = () => import(/* webpackChunkName:'baseIndex' */ '@/views/login')
const My = () => import(/* webpackChunkName:'baseIndex' */ '@/views/my')
const ChangeProject = () => import('@/views/changeProject')
const Detail = () => import('@/views/detail')
const SubDetail = () => import('@/views/subDetail')
const CashInfo = () => import('@/views/cashInfo/index')
const CashTest = () => import('@/views/cashInfo/cash')

const CashHistory = () => import('@/views/cashInfo/cashHistory')
const ServerAddress = () => import('@/views/serverAddress')
const PositionId = () => import('@/views/cashInfo/positionId')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: to => {
        if (Vue.isPos) {
          return '/home'
        } else {
          // return '/tab/work'
          // 报表
          return '/tab/report'
          // // 投资性物业
          // return '/investmentIndex'
          // 整改对比
          // return '/comparedBuild'
          // 会议室
          // return '/meeting'
          // return '/monitor/monitorInspection'
        }
      }
    },
    {
      path: '/page=4',
      redirect: to => {
        if (to.path === '/page=4') {
          return '/cashInfo'
        }
      }
    },
    {
      path: '/page=0',
      redirect: to => {
        if (to.path === '/page=0') {
          return '/getCash'
        }
      }
      // beforeEnter: (to, from, next) => {
      //   console.log(to, from)
      // }
    },
    {
      path: '/home',
      name: 'home',
      // beforeEnter: (to, from, next) => {
      //   // if (from.path == '/') {
      //   //   router.back();
      //   //   return next(false)
      //   // }
      //   if (sess.get('user')) {
      //     next()
      //   } else {
      //     console.log('跳转到ｌｏｇｉｎ')
      //     return next({name: 'login'})
      //   }
      // },
      component: Home
    },
    {
      path: '/test1',
      name: 'test1',
      component: () => import('@/views/test1'),
      children: [{
        path: 'test',
        name: 'test',
        component: Test
      }]
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/changeProject',
      name: 'changeProject',
      component: ChangeProject
    },
    {
      path: '/my',
      name: 'my',
      component: My
    },
    {
      path: '/getCash',
      name: 'getCash',
      component: GetCash,
      children: [
        {
          path: 'customerList/:roomId',
          name: 'customerList',
          component: CustomerList
        },
        {
          path: 'expenseList/:roomId',
          name: 'expenseList',
          component: ExpenseList
        },
        {
          path: 'cashPaySucc/:id',
          name: 'cashPaySucc',
          component: CashPaySucc
        },
        {
          path: 'cashPayDetail/:id',
          name: 'cashPayDetail',
          component: CashPayDetail
        }
      ]
    },
    // 测试使用
    {
      path: '/cash',
      name: 'cash',
      component: CashTest
    },
    {
      path: '/cashInfo',
      name: 'cashInfo',
      component: CashInfo,
      children: [
        {
          path: 'cashPayDetailProp',
          name: 'cashPayDetailProp',
          component: CashPayDetail
        }
      ]
    },
    // {
    //   path: '/cashDetail',
    //   name: 'cashDetail',
    //   component: CashDetail
    // },
    {
      path: '/cashHistory',
      name: 'cashHistory',
      component: CashHistory,
      children: [
        {
          path: 'cashPayDetailHis',
          name: 'cashPayDetailHis',
          component: CashPayDetail
        }
      ]
    },
    {
      path: '/serverAddress',
      name: 'serverAddress',
      component: ServerAddress
    }, {
      name: 'positionId',
      path: '/positionId',
      component: PositionId,
      meta: {
        title: '职位'
      }
    },
    {
      path: '/tab',
      name: 'tab',
      component: Index,
      meta: {
        isTab: true
      },
      children: [
        {
          path: 'home',
          name: 'tabHome',
          component: TabHome,
          meta: {
            title: '消息'
          }
        },
        {
          path: 'work',
          name: 'tabWork',
          component: TabWork,
          meta: {
            title: '工作'
          }
        },
        {
          path: 'report',
          name: 'tabReport',
          component: TabReport,
          meta: {
            title: '报表统计'
          }
        },
        {
          path: 'my',
          name: 'tabMy',
          component: TabMy,
          meta: {
            title: '我的'
          }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: '关于'
      }
    },
    {
      path: '/btnFunc',
      name: 'btnFunc',
      component: BtnFunc,
      meta: {
        title: '请选择功能'
      }
    },
    {
      path: '/setting',
      name: 'name',
      component: Setting,
      meta: {
        title: '个人信息'
      }
    },
    {
      path: '/status',
      name: 'status',
      component: Status,
      meta: {
        title: '状态设置'
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    },
    {
      path: '/subDetail',
      name: 'subDetail',
      component: SubDetail
    },
    ...customerService,
    ...meeting,
    ...report,
    ...meter,
    ...investment,
    ...scanDetail,
    ...workOrder,
    ...monitorCenter,
    ...rent,
    ...approval,
    ...comparedBuild,
    {
      path: '*',
      redirect: to => {
        console.log(location.hash, location.hash)
        return '/'
      }
    }
  ]
})
