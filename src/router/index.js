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
// 地块统计
import massifStatistics from './massifStatistics'
// 管家服务
import butlerService from './butlerService'
// pos机模块
import Pos from './pos'
// 收款模块
import Cash from './cash'

// 能耗抄表app部分模块
import Energy from './energy'

import Index from '@/views/index'
import TabHome from '@/views/tabHome'
// import TabWork from '@/views/tabWork'
import TabWorkTwo from '@/views/tabWork'
import TabReport from '@/views/tabReport'
import TabMy from '@/views/tabMy'
import About from '@/views/publicPage/about'

import Setting from '@/views/publicPage/setting'
import BtnFunc from '@/views/publicPage/btnFunc'
// import Status from '@/views/publicPage/status'

const ChangeProject = () => import('@/views/changeProject')
const ServerAddress = () => import('@/views/publicPage/serverAddress')
const PositionId = () => import('@/views/cashInfo/positionId')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: to => {
        if (Vue.isEnergy) {
          return '/energyIndex'
        }
        if (Vue.isPos) {
          return '/home'
        } else {
          return '/tab/work'
          // 报表
          // return '/tab/report'
          // 投资性物业
          // return '/investmentIndex'
          // 整改对比
          // return '/comparedBuild'
          // 会议室
          // return '/meeting'
          // 工单监控
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
    },
    {
      path: '/changeProject',
      name: 'changeProject',
      component: ChangeProject
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
          component: TabWorkTwo,
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
      path: '/testPos',
      name: 'name',
      component: () => import('@/views/testPos'),
      meta: {
        title: 'pos机打印pos'
      }
    },
    // 暂时无用
    // {
    //   path: '/status',
    //   name: 'status',
    //   component: () => import('@/views/publicPage/status'),
    //   meta: {
    //     title: '状态设置'
    //   }
    // },
    // 测试页面 start
    {
      path: '/test1',
      name: 'test1',
      component: () => import('@/views/test1'),
      children: [{
        path: 'test',
        name: 'test',
        component: () => import('@/views/test'),
        children: [{
          path: 'test2',
          name: 'test2',
          component: () => import('@/views/test')
        }]
      }]
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/test')
    },
    {
      path: '/test2',
      name: 'test2',
      component: () => import('@/views/test2')
    },
    // 测试用 end
    ...Cash,
    ...Pos,
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
    ...massifStatistics,
    ...butlerService,
    ...Energy,
    {
      path: '*',
      redirect: to => {
        console.log(location.hash, location.hash)
        return '/'
      }
    }
  ]
})
