// 巡检保养模块
const Inspection = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/inspection') // 巡检
const InspectionDetail = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/inspectionDetail') // 巡检
const Photo = () => import(/* webpackChunkName:'workOrder' */ '@/views/workOrder/photo') // 巡检
const PersonSelector = () => import(/* webpackChunkName:'workOrder' */ '@/views/customerService/responsibleChoose') // 巡检

// 客服工单
const CustomerService = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customer') // 客服工单
const CustomerServiceDetail = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerDetail') // 客服工单详情
const CustomerTracking = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerTracking') // 服务跟踪
const VisitDetail = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerChild/visitDetail') // 服务跟踪
const Visit = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerChild/visit') // 服务跟踪
const TakeOrder = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerChild/takeOrder') // 服务跟踪
const Feedback = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerChild/feedback') // 工单反馈
const FeedbackMaterial = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/customerChild/feedbackMaterial') // 工单反馈
const Material = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/materialChild/index') // 材料申请
const MaterialAdd = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/materialChild/add') // 添加材料
const MaterialDetail = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/materialChild/detail') // 材料详情
const PersonSelectorMulti = () => import(/* webpackChunkName:'customerOrder' */ '@/views/workOrder/person') // 人员选择多选
export default [
  {
    path: '/workOrder/inspection',
    name: 'inspection',
    component: Inspection,
    meta: {
      title: '巡检工单'
    },
    children: [
      {
        path: 'detail/:workId',
        name: 'inspectionDetail',
        component: InspectionDetail,
        meta: {
          title: '巡检详情'
        },
        children: [{
          path: 'photo/:type',
          name: 'photo',
          component: Photo,
          meta: {
            title: '拍照确认'
          }
        }]
      },
      {
        path: 'personSelector',
        name: 'personSelector',
        component: PersonSelector,
        meta: {
          title: '转单'
        }
      }
    ]
  },
  {
    path: '/customerNotice/:taskId',
    name: 'customerNotice',
    component: CustomerServiceDetail,
    children: [{
      path: 'customerTracking',
      name: 'customerTracking',
      component: CustomerTracking,
      meta: {
        title: '服务跟踪'
      }
    },
    {
      path: 'personSelector',
      name: 'detailCusPersonSelector',
      component: PersonSelector,
      meta: {
        title: '转单'
      }
    },
    {
      path: 'visit',
      name: 'detailVisit',
      component: Visit,
      meta: {
        title: '填报回访'
      }
    },
    {
      path: 'visitDetail',
      name: 'detailVisitDetail',
      component: VisitDetail,
      meta: {
        title: '回访详情'
      }
    },
    {
      path: 'takeOrder',
      name: 'detailTakeOrder',
      component: TakeOrder,
      meta: {
        title: '接单'
      },
      children: [
        {
          path: 'personSelector',
          name: 'detailTakeOrderPersonSelector',
          component: PersonSelector,
          meta: {
            title: '选择人员'
          }
        },
        {
          path: 'personSelectorMulti',
          name: 'detailTakeOrderPersonSelectorMulti',
          component: PersonSelectorMulti,
          meta: {
            title: '选择人员'
          }
        }
      ]
    },
    {
      path: 'feedback',
      name: 'detailFeedback',
      component: Feedback,
      meta: {
        title: '工单反馈'
      },
      children: [{
        path: 'materialDetail',
        name: 'detailfeedMaterialDetail',
        component: FeedbackMaterial,
        meta: {
          title: '材料申请详情'
        }
      }]
    },
    {
      path: 'material',
      name: 'detailMaterial',
      component: Material,
      meta: {
        title: '材料申请'
      },
      children: [
        {
          path: 'materialAdd',
          name: 'detailMaterialAdd',
          component: MaterialAdd,
          meta: {
            title: '查找添加'
          }
        },
        {
          path: 'materialDetail',
          name: 'detailMaterialDetail',
          component: MaterialDetail,
          meta: {
            title: '材料申请详情'
          }
        }
      ]
    }
    ]
  },
  {
    path: '/workOrder/customerService',
    name: 'customerService',
    component: CustomerService,
    meta: {
      title: '客服工单'
    },
    children: [
      {
        path: 'detail/:taskId',
        name: 'customerServiceDetail',
        component: CustomerServiceDetail,
        meta: {
          title: '客服详情'
        },
        children: [{
          path: 'customerTracking',
          name: 'customerTracking',
          component: CustomerTracking,
          meta: {
            title: '服务跟踪'
          }
        },
        {
          path: 'personSelector',
          name: 'detailCusPersonSelector',
          component: PersonSelector,
          meta: {
            title: '转单'
          }
        },
        {
          path: 'visit',
          name: 'detailVisit',
          component: Visit,
          meta: {
            title: '填报回访'
          }
        },
        {
          path: 'visitDetail',
          name: 'detailVisitDetail',
          component: VisitDetail,
          meta: {
            title: '回访详情'
          }
        },
        {
          path: 'takeOrder',
          name: 'detailTakeOrder',
          component: TakeOrder,
          meta: {
            title: '接单'
          },
          children: [
            {
              path: 'personSelector',
              name: 'detailTakeOrderPersonSelector',
              component: PersonSelector,
              meta: {
                title: '选择人员'
              }
            },
            {
              path: 'personSelectorMulti',
              name: 'detailTakeOrderPersonSelectorMulti',
              component: PersonSelectorMulti,
              meta: {
                title: '选择人员'
              }
            }
          ]
        },
        {
          path: 'feedback',
          name: 'detailFeedback',
          component: Feedback,
          meta: {
            title: '工单反馈'
          },
          children: [{
            path: 'materialDetail',
            name: 'detailfeedMaterialDetail',
            component: FeedbackMaterial,
            meta: {
              title: '材料申请详情'
            }
          }]
        },
        {
          path: 'material',
          name: 'detailMaterial',
          component: Material,
          meta: {
            title: '材料申请'
          },
          children: [
            {
              path: 'materialAdd',
              name: 'detailMaterialAdd',
              component: MaterialAdd,
              meta: {
                title: '查找添加'
              }
            },
            {
              path: 'materialDetail',
              name: 'detailMaterialDetail',
              component: MaterialDetail,
              meta: {
                title: '材料申请详情'
              }
            }
          ]
        }
        ]
      },
      {
        path: 'personSelector',
        name: 'cusPersonSelector',
        component: PersonSelector,
        meta: {
          title: '转单'
        }
      },
      {
        path: 'visit',
        name: 'visit',
        component: Visit,
        meta: {
          title: '填报回访'
        }
      },
      {
        path: 'visitDetail',
        name: 'visitDetail',
        component: VisitDetail,
        meta: {
          title: '回访详情'
        }
      },
      {
        path: 'takeOrder',
        name: 'takeOrder',
        component: TakeOrder,
        meta: {
          title: '接单'
        },
        children: [
          {
            path: 'personSelector',
            name: 'takeOrderPersonSelector',
            component: PersonSelector,
            meta: {
              title: '选择人员'
            }
          },
          {
            path: 'personSelectorMulti',
            name: 'takeOrderPersonSelectorMulti',
            component: PersonSelectorMulti,
            meta: {
              title: '选择人员'
            }
          }
        ]
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: Feedback,
        meta: {
          title: '工单反馈'
        },
        children: [{
          path: 'materialDetail',
          name: 'feedMaterialDetail',
          component: FeedbackMaterial,
          meta: {
            title: '材料申请详情'
          }
        }]
      },
      {
        path: 'material',
        name: 'material',
        component: Material,
        meta: {
          title: '材料申请'
        },
        children: [
          {
            path: 'materialAdd',
            name: 'materialAdd',
            component: MaterialAdd,
            meta: {
              title: '查找添加'
            }
          },
          {
            path: 'materialDetail',
            name: 'materialDetail',
            component: MaterialDetail,
            meta: {
              title: '材料申请详情'
            }
          }
        ]
      }
    ]
  }
]
