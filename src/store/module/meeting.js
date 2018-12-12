export default {
  state: {
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
    getStatusColor: state => state.statusColor
  },
  mutations: {
    setDate (state, bool) {
      state.dateData = bool
    },
    setSearchKey (state, data) {
      state.searchKey = data
    },
    setStatusColor (state, data) {
      state.statusColor = data
    }
  },
  actions: {
  }
}
