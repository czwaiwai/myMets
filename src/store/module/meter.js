export default {
  state: {
    meterLocation: {
      orgData: {},
      grpItem: {},
      budItem: {}
    },
    meterDateTime: {}
  },
  getters: {
    getMeterLocation: state => state.meterLocation,
    getMeterDateTime: state => state.meterDateTime
  },
  mutations: {
    // 缓存临时页面会议列表页面 日期及搜索数据
    setMeterLocation (state, data) {
      state.meterLocation = data
    },
    setMeterDateTime (state, data) {
      state.meterDateTime = data
    }
  },
  actions: {
  }
}
