export default {
  state: {
    meetingLocation: {
      orgId: '',
      orgName: '',
      employeeId: '',
      employeeJobId: ''
    },
    dateData: {
      year: '',
      month: '',
      day: ''
    },
    destineConfig: {
      dateStr: '',
      orgId: '',
      orgName: '',
      filterObj: {
        MeetType: '',
        CapacityMin: '',
        CapacityMax: '',
        Floor: '',
        MeetName: '',
        MaterialName: ''
      }
    },
    searchKey: '',
    statusColor: {}
  },
  getters: {
    destineConfig: state => state.destineConfig,
    getDate: state => state.dateData,
    getSearchKey: state => state.searchKey,
    getStatusColor: state => state.statusColor,
    getMeetingLocation: state => state.meetingLocation
  },
  mutations: {
    // 缓存临时页面会议列表页面 日期及搜索数据
    setDestineConfig (state, data) {
      state.destineConfig = data
    },
    setDate (state, data) {
      state.dateData = data
    },
    setSearchKey (state, data) {
      state.searchKey = data
    },
    setStatusColor (state, data) {
      state.statusColor = data
    },
    setMeetingLocation (state, data) {
      state.meetingLocation = data
    }
  },
  actions: {
  }
}
