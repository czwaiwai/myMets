const Customer = () => import(/* webpackChunkName:'report' */ '@/views/report/customer') // 客服服务
const Device = () => import(/* webpackChunkName:'report' */ '@/views/report/device') // 设备管理
const Cash = () => import(/* webpackChunkName:'report' */ '@/views/report/cash') //  项目收款
const Lease = () => import(/* webpackChunkName:'report' */ '@/views/report/lease') // 项目出租
const Building = () => import(/* webpackChunkName:'report' */ '@/views/report/building') // 建筑
const Income = () => import(/* webpackChunkName:'report' */ '@/views/report/income') // 收入
const Rent = () => import(/* webpackChunkName:'report' */ '@/views/report/rent') // 租赁
const Features = () => import(/* webpackChunkName:'report' */ '@/views/report/features') // 特色园
const RentCash = () => import(/* webpackChunkName:'report' */ '@/views/report/rentCash') // 租金
const RentRate = () => import(/* webpackChunkName:'report' */ '@/views/report/rentRate') // 出租率
const ChangeProject = () => import(/* webpackChunkName:'report' */ '@/views/report/changeProject') // 出租率
const DeviceRate = () => import(/* webpackChunkName:'report' */ '@/views/report/child/deviceRate') // 设备运行状态
export default [
  {
    path: '/report/customer',
    name: 'report_customer',
    component: Customer,
    meta: {
      title: '客服服务'
    },
    children: [{
      path: 'changeProject',
      name: 'report_changeProject',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }]
  },
  {
    path: '/report/device',
    name: 'report_device',
    component: Device,
    meta: {
      title: '设备管理'
    },
    children: [{
      path: 'changeProject',
      name: 'report_device_change',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }, {
      path: 'deviceRate',
      name: 'report_device_rate',
      component: DeviceRate,
      meta: {
        title: '设备运行状况'
      }
    }]
  },
  {
    path: '/report/cash',
    name: 'report_cash',
    component: Cash,
    meta: {
      title: '项目收款'
    },
    children: [{
      path: 'changeProject',
      name: 'report_cash_change',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }]
  },
  {
    path: '/report/lease',
    name: 'report_lease',
    component: Lease,
    meta: {
      title: '项目出租'
    },
    children: [{
      path: 'changeProject',
      name: 'report_lease_change',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }]
  },
  {
    path: '/report/building',
    name: 'report_building',
    component: Building,
    meta: {
      title: '建筑面积'
    }
  },
  {
    path: '/report/income',
    name: 'report_income',
    component: Income,
    meta: {
      title: '收入分析'
    }
  },
  {
    path: '/report/rent',
    name: 'report_rent',
    component: Rent,
    meta: {
      title: '租赁分析'
    }
  },
  {
    path: '/report/features',
    name: 'report_features',
    component: Features,
    meta: {
      title: '特色园分析'
    }
  },
  {
    path: '/report/rentCash',
    name: 'report_rentCash',
    component: RentCash,
    meta: {
      title: '租金'
    }
  },
  {
    path: '/report/rentRate',
    name: 'report_rentRate',
    component: RentRate,
    meta: {
      title: '出租率'
    }
  }
]
