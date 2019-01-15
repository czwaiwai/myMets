// 监控中心
const MonitorCenter = () => import(/* webpackChunkName:'monitorCenter' */ '@/views/monitorCenter/index') // 监控中心
const MonitorCustomer = () => import(/* webpackChunkName:'monitorCenter' */ '@/views/monitorCenter/monitorCustomer') // 客服工单监控
const MonitorInspection = () => import(/* webpackChunkName:'monitorCenter' */ '@/views/monitorCenter/monitorInspection') // 巡保工作监控
const MonitorInsDetail = () => import(/* webpackChunkName:'monitorCenter' */ '@/views/monitorCenter/monitorInsDetail') // 巡保工作监控
const MonitorRepair = () => import(/* webpackChunkName:'monitorCenter' */ '@/views/monitorCenter/monitorRepair') // 维修工单监控

export default [
  {
    path: '/monitor/index',
    name: 'monitorCenter',
    component: MonitorCenter,
    meta: {
      title: '监控中心'
    }
  },
  {
    path: '/monitor/monitorCustomer',
    name: 'monitorCustomer',
    component: MonitorCustomer,
    meta: {
      title: '客服工单监控'
    }
  },
  {
    path: '/monitor/monitorInspection',
    name: 'monitorInspection',
    component: MonitorInspection,
    meta: {
      title: '巡保工作监控'
    },
    children: [
      {
        name: 'monitorInsDetail',
        path: 'monitorInsDetail',
        component: MonitorInsDetail,
        meta: {
          title: '巡保详情'
        }
      }
    ]
  },
  {
    path: '/monitor/monitorRepair',
    name: 'monitorRepair',
    component: MonitorRepair,
    meta: {
      title: '维修工单监控'
    }
  }
]
