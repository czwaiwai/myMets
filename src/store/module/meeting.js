export default {
  state: {
    dateData: {
      year: '',
      month: '',
      day: ''
    },
    searchKey: ''
  },
  getters: {
    getDate: state => state.dateData,
    getSearchKey: state => state.searchKey
  },
  mutations: {
    setDate (state, bool) {
      state.dateData = bool
    },
    setSearchKey (state, data) {
      state.searchKey = data
    }
  },
  actions: {
  }
}
