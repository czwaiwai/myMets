// 收款模块
const GetCash = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/getCash')
const CustomerList = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/customerList')
const ExpenseList = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/expenseList')
const CashPaySucc = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/cashPaySucc')
const CashPayDetail = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/cashPayDetail')
const CashInfo = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/index')
const CashTest = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/cash')
const CashHistory = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/cashHistory')
const Invoice = () => import(/* webpackChunkName:'baseIndex' */ '@/views/cashInfo/invoice')
export default [
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
  {
    path: '/invoice/:id/:orgId',
    name: 'invoice',
    component: Invoice
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
  }
]
