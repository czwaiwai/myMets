export default [
  {
    name: 'meeting',
    path: '/meeting',
    meta: {
      title: '会议'
    },
    component: () => import('@/views/meeting/index')
  },
  {
    name: 'destine',
    path: '/destine',
    meta: {
      title: '会议室'
    },
    component: () => import('@/views/meeting/destine'),
    children: [{
      name: 'destineChangeProject',
      path: 'destineChangeProject',
      meta: {
        title: '切换项目'
      },
      component: () => import('@/views/meeting/destine/child/changeProject')
    }]
  },
  {
    name: 'destineDetail',
    path: '/destineDetail/:id',
    meta: {
      title: '高效厅'
    },
    component: () => import('@/views/meeting/destineDetail'),
    children: [{
      name: 'otherDetail',
      path: 'otherDetail',
      meta: {
        title: '其他详情'
      },
      component: () => import('@/views/meeting/otherDetail')
    }, {
      name: 'hasReserve',
      path: 'hasReserve',
      meta: {
        title: '已预订'
      },
      component: () => import('@/views/meeting/hasReserve')
    }, {
      name: 'picDetail',
      path: 'picDetail',
      meta: {
        title: '平面位置图'
      },
      component: () => import('@/views/meeting/picDetail')
    }, {
      name: 'reserve',
      path: 'reserve',
      meta: {
        title: '预订'
      },
      component: () => import('@/views/meeting/reserve'),
      children: [
        {
          name: 'meetResponsibleChoose',
          path: 'meetResponsibleChoose',
          component: () => import('@/views/customerService/responsibleChoose'),
          meta: {
            title: '责任人'
          }
        }
      ]
    }]
  },
  {
    name: 'reserve',
    path: '/reserve/:id',
    meta: {
      title: '预订'
    },
    component: () => import('@/views/meeting/reserve')
  },
  {
    name: 'editDestine',
    path: '/editDestine/:id',
    meta: {
      title: '预订详情'
    },
    component: () => import('@/views/meeting/editDestine')
  },
  {
    name: 'reserveDetail',
    path: '/reserveDetail/:id',
    meta: {
      title: '预订详情'
    },
    component: () => import('@/views/meeting/reserveDetail')
  },
  {
    name: 'archives',
    path: '/archives/:id',
    meta: {
      title: ''
    },
    component: () => import('@/views/meeting/archives'),
    children: [{
      name: 'photo',
      path: 'photo',
      meta: {
        title: '平面位置图'
      },
      component: () => import('@/views/meeting/picDetail')
    }]
  },
  {
    name: 'myDestine',
    path: '/myDestine',
    meta: {
      title: '我的预定'
    },
    component: () => import('@/views/meeting/myDestine')
  },
  {
    name: 'myMeeting',
    path: '/myMeeting',
    meta: {
      title: '我的会议'
    },
    component: () => import('@/views/meeting/myMeeting')
  },
  {
    name: 'meetingDetail',
    path: '/meetingDetail/:id',
    meta: {
      title: '会议详情'
    },
    component: () => import('@/views/meeting/meetingDetail'),
    children: [{
      name: 'meetingSummary',
      path: 'meetingSummary',
      meta: {
        title: '会议纪要'
      },
      component: () => import('@/views/meeting/meetingSummary')
    }]
  }
  // {
  //   name: 'meetingSummary',
  //   path: '/meetingSummary/:id',
  //   meta: {
  //     title: '会议纪要'
  //   },
  //   component: () => import('@/views/meeting/meetingSummary')
  // }
]
