export default [
  {
    name: 'approvalIndex',
    path: '/approvalIndex',
    meta: {
      title: '审批'
    },
    component: () => import('@/views/approval/index'),
    children: [
      {
        name: 'approvalSearch',
        path: 'approvalSearch',
        meta: {
          title: '搜索'
        },
        component: () => import('@/views/approval/search')
      }, {
        name: 'approvalDetail',
        path: 'approvalDetail/:id',
        meta: {
          title: '详情'
        },
        component: () => import('@/views/approval/detail'),
        children: [
          {
            name: 'approvalAction',
            path: 'approvalAction',
            meta: {
              title: ''
            },
            component: () => import('@/views/approval/action'),
            children: [
              {
                name: 'approvalChoose',
                path: 'approvalChoose',
                component: () => import('@/views/customerService/responsibleChoose'),
                meta: {
                  title: '责任人'
                }
              }
            ]
          }
        ]
      }, {
        name: 'approvalDetailQuick',
        path: '/approvalDetailQuick/:id',
        meta: {
          title: '详情'
        },
        component: () => import('@/views/approval/detail'),
        children: [
          {
            name: 'approvalActionQuick',
            path: 'approvalActionQuick',
            meta: {
              title: ''
            },
            component: () => import('@/views/approval/action'),
            children: [
              {
                name: 'approvalChooseQuick',
                path: 'approvalChooseQuick',
                component: () => import('@/views/customerService/responsibleChoose'),
                meta: {
                  title: '责任人'
                }
              }
            ]
          }
        ]
      }
      // {
      //   name: 'approvalAction',
      //   path: 'approvalAction/:id',
      //   meta: {
      //     title: ''
      //   },
      //   component: () => import('@/views/approval/action'),
      //   children: [
      //     {
      //       name: 'approvalResponsibleChoose',
      //       path: 'approvalResponsibleChoose',
      //       component: () => import('@/views/customerService/responsibleChoose'),
      //       meta: {
      //         title: '责任人'
      //       }
      //     }
      //   ]
      // }
    ]
  }
]
