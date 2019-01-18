export default [
  {
    name: 'rentIndex',
    path: '/rentIndex',
    meta: {
      title: '租赁'
    },
    component: () => import('@/views/rent/index')
  },
  {
    name: 'houseList',
    path: '/houseList',
    meta: {
      title: '租赁房源'
    },
    component: () => import('@/views/rent/house/houseList')
  },
  {
    name: 'selectLocation',
    path: '/selectLocation',
    meta: {
      title: '选择范围'
    },
    component: () => import('@/views/rent/house/selectLocation')
  },
  {
    name: 'houseDetail',
    path: '/houseDetail/:id',
    meta: {
      title: '房源详情'
    },
    component: () => import('@/views/rent/house/houseDetail')
  },
  {
    name: 'contractMsg',
    path: '/contractMsg/:id',
    meta: {
      title: '资源合同'
    },
    component: () => import('@/views/rent/house/contractMsg')
  },
  {
    name: 'saveRes',
    path: '/saveRes/:id',
    meta: {
      title: ''
    },
    component: () => import('@/views/rent/house/saveRes')
  },
  {
    name: 'clearRes',
    path: '/clearRes/:id',
    meta: {
      title: ''
    },
    component: () => import('@/views/rent/house/clearRes')
  },
  {
    name: 'searchHouse',
    path: '/searchHouse',
    meta: {
      title: '搜索房源'
    },
    component: () => import('@/views/rent/house/searchHouse')
  },
  {
    name: 'guestList',
    path: '/guestList',
    meta: {
      title: '租赁客源'
    },
    component: () => import('@/views/rent/guest/guestList')
  },
  {
    name: 'searchGuest',
    path: '/searchGuest',
    meta: {
      title: '搜索客源'
    },
    component: () => import('@/views/rent/guest/searchGuest')
  },
  {
    name: 'screenType',
    path: '/screenType',
    meta: {
      title: '筛选客户'
    },
    component: () => import('@/views/rent/guest/screenType')
  },
  {
    name: 'guestDetail',
    path: '/guestDetail/:id',
    meta: {
      title: '客户详情'
    },
    component: () => import('@/views/rent/guest/guestDetail')
  },
  // {
  //   name: 'customerDetail',
  //   path: '/customerDetail',
  //   meta: {
  //     title: '客户资料'
  //   },
  //   component: () => import('@/views/rent/guest/customerDetail')
  // },
  {
    name: 'houseMsg',
    path: '/houseMsg/:id',
    meta: {
      title: '房源信息'
    },
    component: () => import('@/views/rent/guest/houseMsg')
  },
  {
    name: 'newGuest',
    path: '/newGuest',
    meta: {
      title: '新增客源'
    },
    component: () => import('@/views/rent/guest/newGuest')
  },
  {
    name: 'changeGuest',
    path: '/changeGuest/:id',
    meta: {
      title: '修改信息'
    },
    component: () => import('@/views/rent/guest/changeGuest')
  },
  {
    name: 'businessList',
    path: '/businessList',
    meta: {
      title: '商机'
    },
    component: () => import('@/views/rent/business/businessList')
  },
  {
    name: 'businessType',
    path: '/businessType',
    meta: {
      title: '筛选商机'
    },
    component: () => import('@/views/rent/business/businessType')
  },
  {
    name: 'searchBusiness',
    path: '/searchBusiness',
    meta: {
      title: '搜索商机'
    },
    component: () => import('@/views/rent/business/searchBusiness')
  },
  {
    name: 'businessDetail',
    path: '/businessDetail/:id',
    meta: {
      title: '详情'
    },
    component: () => import('@/views/rent/business/businessDetail')
  },
  {
    name: 'newOrEditFollow',
    path: '/newOrEditFollow/:id',
    meta: {
      title: ''
    },
    component: () => import('@/views/rent/business/newOrEditFollow')
  },
  {
    name: 'newOrEditBusiness',
    path: '/newOrEditBusiness/:id?',
    meta: {
      title: ''
    },
    component: () => import('@/views/rent/business/newOrEditBusiness')
  },
  {
    name: 'newOrEditOrder',
    path: '/newOrEditOrder/:id',
    meta: {
      title: ''
    },
    component: () => import('@/views/rent/business/newOrEditOrder')
  },
  {
    name: 'newOrEditNeeds',
    path: '/newOrEditNeeds/:id',
    meta: {
      title: ''
    },
    component: () => import('@/views/rent/business/newOrEditNeeds')
  },
  {
    name: 'matchOrder',
    path: '/matchOrder',
    meta: {
      title: '匹配意向'
    },
    component: () => import('@/views/rent/business/matchOrder')
  },
  {
    name: 'selectTime',
    path: '/selectTime',
    meta: {
      title: '选择有效时间'
    },
    component: () => import('@/views/rent/business/selectTime')
  },
  {
    name: 'selectGuest',
    path: '/selectGuest',
    meta: {
      title: '选择客源'
    },
    component: () => import('@/views/rent/business/selectGuest')
  },
  {
    name: 'selectResHouse',
    path: '/selectResHouse',
    meta: {
      title: '选择预定房屋'
    },
    component: () => import('@/views/rent/business/selectResHouse')
  },
  {
    name: 'selectSearchHouse',
    path: '/selectSearchHouse',
    meta: {
      title: '选择预定房屋'
    },
    component: () => import('@/views/rent/business/selectSearchHouse')
  },
  {
    name: 'selectHouse',
    path: '/selectHouse',
    meta: {
      title: '选择房屋'
    },
    component: () => import('@/views/rent/business/selectHouse')
  }
]
