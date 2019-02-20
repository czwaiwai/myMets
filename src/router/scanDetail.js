const ScanDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/index') // 出租率
const ScanSubDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/detail') // 设备运行状态
// const RepairDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/repairDetail') // 设备运行状态
// const RepairDetailTracking = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/repairDetailTracking') // 设备运行状态
const RepairDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/workOrder/customerDetail') // 客服工单详情
const RepairDetailTracking = () => import(/* webpackChunkName:'scanDetail' */ '@/views/workOrder/customerTracking') // 服务跟踪
export default [
  {
    path: '/scan/ScanDetail/:id',
    name: 'scanDetail',
    component: ScanDetail,
    meta: {
      title: '设备详情'
    },
    children: [
      {
        path: 'scanInspectionDetail',
        name: 'scanInspectionDetail',
        component: ScanSubDetail,
        meta: {
          title: '巡检记录'
        }
      },
      {
        path: 'scanKeepFitDetail',
        name: 'scanKeepFitDetail',
        component: ScanSubDetail,
        meta: {
          title: '保养记录'
        }
      },
      {
        path: 'repairDetail',
        name: 'repairDetail',
        component: RepairDetail,
        meta: {
          title: '维修记录'
        },
        children: [{
          path: 'customerTracking',
          name: 'repairDetailTracking',
          component: RepairDetailTracking,
          meta: {
            title: '服务跟踪'
          }
        }]
      }
    ]
  }
]
