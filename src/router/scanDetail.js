const ScanDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/index') // 出租率
const ScanSubDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/detail') // 设备运行状态
const RepairDetail = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/repairDetail') // 设备运行状态
const RepairDetailTracking = () => import(/* webpackChunkName:'scanDetail' */ '@/views/scanDetail/repairDetailTracking') // 设备运行状态
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
        path: 'scanSubDetail',
        name: 'scanSubDetail',
        component: ScanSubDetail,
        meta: {
          title: '设备详情'
        }
      },
      {
        path: 'repairDetail',
        name: 'repairDetail',
        component: RepairDetail,
        meta: {
          title: '设备详情'
        }
      },
      {
        path: 'repairDetailTracking',
        name: 'repairDetailTracking',
        component: RepairDetailTracking,
        meta: {
          title: '设备详情'
        }
      }
    ]
  }
]
