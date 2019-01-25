export default {
  state: {
    approvalSearchKey: '',
    selectItemData: {}
  },
  getters: {
    getApprovalSearchKey: state => state.approvalSearchKey,
    getSelectItemData: state => state.selectItemData
  },
  mutations: {
    setApprovalSearchKey (state, data) {
      state.approvalSearchKey = data
    },
    setSelectItemData (state, data) {
      state.selectItemData = data
    }
  }
}
