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

const Agreement = () => import(/* webpackChunkName:'report' */ '@/views/report/agreement') // 合同统计
const AgreementDetail = () => import(/* webpackChunkName:'report' */ '@/views/report/agreementDetail') // 合同统计
const CountLease = () => import(/* webpackChunkName:'report' */ '@/views/report/countLease') // 租赁统计
// const Warrant = () => import(/* webpackChunkName:'report' */ '@/views/report/warrant') // 权证统计
const WarrantDetail = () => import(/* webpackChunkName:'report' */ '@/views/report/warrantDetail') // 权证统计
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
  },
  {
    path: '/report/agreement',
    name: 'report_agreement',
    component: Agreement,
    meta: {
      title: '合同统计'
    },
    children: [{
      path: 'changeProject',
      name: 'report_agreement_change',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }, {
      path: 'agreementDetail/:id',
      name: 'report_agreementDetail',
      component: AgreementDetail,
      meta: {
        title: '合同统计详情'
      }
    }]
  },
  {
    path: '/report/countLease',
    name: 'report_countLease',
    component: CountLease,
    meta: {
      title: '租赁统计'
    },
    children: [{
      path: 'changeProject',
      name: 'report_countLease_change',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }]
  },
  {
    path: '/report/warrant',
    name: 'report_warrant',
    component: WarrantDetail, // Warrant,
    meta: {
      title: '权证统计'
    },
    children: [{
      path: 'changeProject',
      name: 'report_warrant_countLease_change',
      component: ChangeProject,
      meta: {
        title: '切换项目'
      }
    }, {
      path: 'warrantDetail/:id',
      name: 'report_warrantDetail',
      component: WarrantDetail,
      meta: {
        title: '权证统计详情'
      }
    }]
  }
]
