import sess from '../../utils/sess'
import app from '../../utils/appApi'
import {Toast} from 'mint-ui'
function coverAuth (areaInfo) {
  let auth = {}
  areaInfo.forEach(item => {
    auth[item['FuncName']] = item['CheckColumn'] === 'True'
  })
  return auth
}
// 权限测试
let initAuth = ''
if (process.env.NODE_ENV === 'development') {
  initAuth = {
    APP_Service: true, // 客服
    APP_Inspection: true, // 巡检
    ETS_APPAudit: true, // 审批
    APP_MeterRead: true, // 抄表
    APP_FinancePay: true, // 收款
    APP_Monitoring: true, // 监控中心
    APP_Maintain: true, // 保养
    APP_LLOA: true, // 蓝凌OA
    APP_Lease: true, // 租赁
    APP_Meeting: true, // 会议
    APP_Property: true, // 投资性物业
    APP_Rectification: true, // 整改对比
    APP_Service_PostIt: true, // 报事
    APP_Service_Repair: true, // 报修

    // 租赁
    APP_LeaseCst: true,
    APP_LeaseHouse: true,
    APP_LeaseOpport: true,

    // 监控中心
    APP_KFWorkOrder: true,
    APP_WXWorkOrder: true,
    APP_XBWorkOrder: true
  }
}
export default {
  state: {
    user: null,
    ip: '',
    auth: initAuth,
    isPos: false,
    rand: 0
  },
  getters: {
    rand: state => state.rand,
    ip: state => state.ip,
    isPos: state => state.isPos,
    auth: state => state.auth,
    user: state => {
      if (!state.user) {
        state.user = sess.get('user')
      }
      if (!state.user) {
        return {
          UserID: 'tangxc',
          PositionName: '财务经理',
          // OrgName: '思源大厦',
          // OrgID: 10000,
          OrgName: '银河世纪花园',
          OrgID: '11091315263400010000', // 项目id
          PositionID: '11091316310300010000', // 职位id
          memberId: '1604271708130001001E',
          memberName: '糖新村'
          // --------------------------
          // UserID: 'LiaoJiangWei',
          // PositionName: '财务经理',
          // // OrgName: '思源大厦',
          // // OrgID: 10000,
          // OrgName: '银河世纪花园',
          // OrgID: '11091315263400010000', // 项目id
          // PositionID: '11091316310300010000', // 职位id
          // memberId: '18102416111400010024',
          // memberName: '廖江伟'
          // --------------------------
          // UserID: 'test1',
          // PositionName: '财务经理',
          // OrgName: '测试项目名',
          // OrgID: '11091315263400010000', // 项目id
          // PositionID: '11091316310300010000', // 职位id
          // memberId: '30',
          // memberName: '廖江伟'
        }
      }
      return state.user
    }
  },
  mutations: {
    setPos (state, bool) {
      state.isPos = bool
    },
    setRandNum (state, date) {
      state.rand = date
    },
    setAuth (state, auth) {
      state.auth = auth
    },
    setIp (state, ip) {
      state.ip = ip
    },
    login (state, user) {
      state.user = user
      sess.set('user', user)
      state.isLogin = true
    },
    logout (state) {
      sess.remove('user')
      state.user = null
    }
  },
  actions: {
    async getUserAction ({getters, commit}) {
      // return Promise.resolve("{}")
      try {
        let login = await app.getUser()
        if (typeof login === 'string') {
          return Promise.reject(new Error('登录数据格式为string类型'))
        }
        let ip = login['serverAddress']
        let data = login['loginInfo']['User_LoginAppNew'][0]['Syswin'][0]
        console.log('ip:', ip, data)
        if (data.status + '' === '1') {
          let user = data.data
          if (login['phoneType'] && login['phoneType'] === 'pos') {
            user.isPos = true
            commit('setPos', true)
          }
          if (login['projectId']) {
            user.OrgID = login['projectId']
            user.OrgName = login['projectName'] || user['OrgName']
          }
          if (login['positionId']) {
            user.PositionID = login['positionId']
            user.PositionName = login['positionName'] || user['PositionName']
            user.AreaInfo = login['positionInfo'] || user['AreaInfo']
          }
          commit('login', user)
          commit('setIp', ip)
          commit('setAuth', coverAuth(user['AreaInfo']))
          return user // 返回User对象
        } else {
          commit('setIp', '172.31.118.201')
          console.log('网络异常，请重新登录')
          Toast({
            message: status.msg + ';返回值' + data.status,
            position: 'bottom',
            duration: 1500
          })
          return Promise.reject(new Error('网络异常，请重新登录'))
        }
      } catch (err) {
        console.log(err, 'errIN.................')
      }
    }
  }
}
