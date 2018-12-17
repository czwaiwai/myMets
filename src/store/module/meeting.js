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
    searchKey: '',
    statusColor: {}
  },
  getters: {
    getDate: state => state.dateData,
    getSearchKey: state => state.searchKey,
    getStatusColor: state => state.statusColor,
    getMeetingLocation: state => state.meetingLocation
  },
  mutations: {
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
