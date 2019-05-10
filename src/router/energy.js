export default [
  {
    name: 'energyIndex',
    path: '/energyIndex',
    meta: {
      title: '能耗抄表'
    },
    component: () => import('@/views/appEnergy/index')
  },
  {
    name: 'orgChoose',
    path: '/orgChoose',
    meta: {
      title: '选择项目列表'
    },
    component: () => import('@/views/appEnergy/orgChoose')
  }
]
