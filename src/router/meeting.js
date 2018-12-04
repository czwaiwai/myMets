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
    component: () => import('@/views/meeting/destine')
  },
  {
    name: 'destineDetail',
    path: '/destineDetail/:id',
    meta: {
      title: '高效厅'
    },
    component: () => import('@/views/meeting/destineDetail')
  },
  {
    name: 'otherDetail',
    path: '/otherDetail/:id',
    meta: {
      title: '其他详情'
    },
    component: () => import('@/views/meeting/otherDetail')
  },
  {
    name: 'hasReserve',
    path: '/hasReserve/:id',
    meta: {
      title: '已预订'
    },
    component: () => import('@/views/meeting/hasReserve')
  },
  {
    name: 'picDetail',
    path: '/picDetail/:id',
    meta: {
      title: '平面位置图'
    },
    component: () => import('@/views/meeting/picDetail')
  },
  {
    name: 'reserve',
    path: '/reserve/:id',
    meta: {
      title: '预定'
    },
    component: () => import('@/views/meeting/reserve')
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
  }
]
