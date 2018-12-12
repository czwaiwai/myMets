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
export default {
  state: {
    user: null,
    ip: '',
    auth: '',
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
          UserID: 'LiaoJiangWei',
          PositionName: '财务经理',
          OrgName: '思源大厦',
          OrgID: 10000,
          // OrgName: '银河世纪花园',
          // OrgID: '11091315263400010000',
          PositionID: '11091316310300010000',
          memberId: '18102416111400010024',
          memberName: '廖江伟'
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
    }
  }
}
