export default {
  state: {
    investmentSearchKey: ''
  },
  getters: {
    getInvestmentSearchKey: state => state.investmentSearchKey
  },
  mutations: {
    setInvestmentSearchKey (state, data) {
      state.investmentSearchKey = data
    }
  }
}
