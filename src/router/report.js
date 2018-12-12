const Customer = () => import(/* webpackChunkName:'report' */ '@/views/report/customer')
const Device = () => import(/* webpackChunkName:'report' */ '@/views/report/device')
const Cash = () => import(/* webpackChunkName:'report' */ '@/views/report/cash')
const Lease = () => import(/* webpackChunkName:'report' */ '@/views/report/lease')
const Building = () => import(/* webpackChunkName:'report' */ '@/views/report/building') // 建筑
const Income = () => import(/* webpackChunkName:'report' */ '@/views/report/income') // 收入
const Rent = () => import(/* webpackChunkName:'report' */ '@/views/report/rent') // 租赁
const Features = () => import(/* webpackChunkName:'report' */ '@/views/report/features') // 特色园
const RentCash = () => import(/* webpackChunkName:'report' */ '@/views/report/rentCash') // 租金
const RentRate = () => import(/* webpackChunkName:'report' */ '@/views/report/rentRate') // 出租率
export default [
  {
    path: '/report/customer',
    name: 'report_customer',
    component: Customer
  },
  {
    path: '/report/device',
    name: 'report_device',
    component: Device
  },
  {
    path: '/report/cash',
    name: 'report_cash',
    component: Cash
  },
  {
    path: '/report/lease',
    name: 'report_lease',
    component: Lease
  },
  {
    path: '/report/building',
    name: 'report_building',
    component: Building
  },
  {
    path: '/report/income',
    name: 'report_income',
    component: Income
  },
  {
    path: '/report/rent',
    name: 'report_rent',
    component: Rent
  },
  {
    path: '/report/features',
    name: 'report_features',
    component: Features
  },
  {
    path: '/report/rentCash',
    name: 'report_rentCash',
    component: RentCash
  },
  {
    path: '/report/rentRate',
    name: 'report_rentRate',
    component: RentRate
  }
]
