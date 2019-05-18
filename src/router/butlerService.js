const GetCst = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/butlerService/getCst') // 选择客户
const CustomerList = () => import(/* webpackChunkName:'baseIndex' */ '@/views/butlerService/customerList')
const ButlerCstDetail = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/butlerService/cstDetail') // 客户详情
const ButlerIndex = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/butlerService/index') // 管家服务
export default [{
  path: '/getCst',
  name: 'getCst',
  component: GetCst,
  children: [
    {
      path: 'cstServiceList/:roomId',
      name: 'cstServiceList',
      component: CustomerList
    },
    {
      path: '/butlerCstDetail/:cstId',
      name: 'butlerCstDetail',
      component: ButlerCstDetail,
      meta: {
        title: '客户详情'
      }
    }
  ]
}, {
  path: '/butlerService',
  name: 'butlerService',
  component: ButlerIndex
}]
