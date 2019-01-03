export default [
  {
    name: 'investmentIndex',
    path: '/investmentIndex',
    meta: {
      title: '投资物业'
    },
    component: () => import('@/views/investment/index')
  },
  {
    name: 'investmentList',
    path: '/investmentList',
    meta: {
      title: ''
    },
    component: () => import('@/views/investment/investmentList'),
    children: [{
      name: 'investmentSearch',
      path: 'investmentSearch',
      meta: {
        title: '搜索'
      },
      component: () => import('@/views/investment/investmentSearch')
    }, {
      name: 'investmentDetail',
      path: 'investmentDetail/:id',
      meta: {
        title: '项目详情'
      },
      component: () => import('@/views/investment/investmentDetail')
    }, {
      name: 'investmentMoreMsg',
      path: 'investmentMoreMsg/:id',
      meta: {
        title: '更多信息'
      },
      component: () => import('@/views/investment/investmentMoreMsg')
    }]
  }
  // {
  //   name: 'investmentSearch',
  //   path: '/investmentSearch',
  //   meta: {
  //     title: '搜索'
  //   },
  //   component: () => import('@/views/investment/investmentSearch')
  // },
  // {
  //   name: 'projectDetail',
  //   path: '/projectDetail/:id',
  //   meta: {
  //     title: '项目详情'
  //   },
  //   component: () => import('@/views/investment/projectDetail')
  // },
  // {
  //   name: 'investmentMoreMsg',
  //   path: '/investmentMoreMsg/:id',
  //   meta: {
  //     title: '更多信息'
  //   },
  //   component: () => import('@/views/investment/investmentMoreMsg')
  // }
]
