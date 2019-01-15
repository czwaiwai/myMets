// 巡检保养模块
const Inspection = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/inspection') // 巡检
const InspectionDetail = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/inspectionDetail') // 巡检
const Photo = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/photo') // 巡检
const PersonSelector = () => import(/* webpackChunkName:'workOrder' */ '@/views/customerService/responsibleChoose') // 巡检

// 客服工单
const CustomerService = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/customer') // 客服工单
const CustomerServiceDetail = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/customerDetail') // 客服工单详情
const CustomerTracking = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/customerTracking') // 服务跟踪
export default [
  {
    path: '/workOrder/inspection',
    name: 'inspection',
    component: Inspection,
    meta: {
      title: '巡检工单'
    },
    children: [
      {
        path: 'detail',
        name: 'inspectionDetail',
        component: InspectionDetail,
        meta: {
          title: '巡检详情'
        },
        children: [{
          path: 'photo',
          name: 'photo',
          component: Photo,
          meta: {
            title: '拍照确认'
          }
        }]
      },
      {
        path: 'personSelector',
        name: 'personSelector',
        component: PersonSelector,
        meta: {
          title: '转单'
        }
      }
    ]
  },
  {
    path: '/workOrder/customerService',
    name: 'customerService',
    component: CustomerService,
    meta: {
      title: '客服工单'
    },
    children: [
      {
        path: 'detail',
        name: 'sustomerServiceDetail',
        component: CustomerServiceDetail,
        meta: {
          title: '客服详情'
        },
        children: [{
          path: 'customerTracking',
          name: 'customerTracking',
          component: CustomerTracking,
          meta: {
            title: '服务跟踪'
          }
        }]
      }
    ]
  }
]
