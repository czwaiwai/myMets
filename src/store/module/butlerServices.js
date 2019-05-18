export default {
  state: {
    resInfo: {},
    cstInfo: {}
  },
  getters: {
    getResInfo: state => state.resInfo,
    getCstInfo: state => state.cstInfo
  },
  mutations: {
    // 缓存临时页面会议列表页面 日期及搜索数据
    setResInfo (state, data) {
      console.log('tag', data)
      state.resInfo = data
    },
    setCstInfo (state, data) {
      state.cstInfo = data
    }
  }
}
