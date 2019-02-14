const CustomerService = () => import(/* webpackChunkName:'customerService' */'@/views/customerService/index')
// const CustomerService = () => import(/* webpackChunkName:'customerService' */'@/views/customerService/indexSingle')
const LocationChoose = () => import(/* webpackChunkName:'customerService' */'@/views/customerService/locationChoose')
const ResponsibleChoose = () => import(/* webpackChunkName:'customerService' */'@/views/customerService/responsibleChoose')
const ServiceTypeChoose = () => import(/* webpackChunkName:'customerService' */'@/views/customerService/serviceTypeChoose')
const DeviceChoose = () => import(/* webpackChunkName:'customerService' */'@/views/customerService/deviceChoose')

export default [
  {
    name: 'customerService',
    path: '/customerService',
    meta: {
      title: '客服报事'
    },
    component: CustomerService,
    children: [{
      name: 'locationChoose',
      path: 'locationChoose',
      component: LocationChoose,
      meta: {
        title: '报事位置'
      }
    }, {
      name: 'responsibleChoose',
      path: 'responsibleChoose',
      component: ResponsibleChoose,
      meta: {
        title: '责任人'
      }
    }, {
      name: 'serviceTypeChoose',
      path: 'serviceTypeChoose',
      component: ServiceTypeChoose,
      meta: {
        title: '报事类型'
      }
    }, {
      name: 'deviceChoose',
      path: 'deviceChoose',
      component: DeviceChoose,
      meta: {
        title: '选择位置'
      }
    }]
  }
]
