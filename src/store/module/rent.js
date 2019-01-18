export default {
  state: {
    // 房源页签状态
    pageStatus: {
      pageType: 0,
      listType: '',
      listTypeNum: 0
    },
    // 房源详情
    houseDetail: {},
    // 客源首页
    guestStatus: {
      initStatus: true,
      CognitivBusinessName_zheWay: '我的客户',
      BusinessKey: 'MyCst'
    },
    // 客源详情
    guestDetail: {},
    // 搜索key
    rentSearchKey: {key: ''},
    // 商机首页
    businessStatus: {
      initStatus: true,
      CognitivBusinessName_zheWay: '所有商机',
      BusinessKey: 'AllOpt'
    },
    // 商机详情类型
    businessDetailType: {type: 0},
    // 商机详情商机数据
    business: {
      hasDetail: false,
      detail: {},
      msg: {}
    }
  },
  getters: {
    getPageStatus: state => state.pageStatus,
    getHouseDetail: state => state.houseDetail,
    getGuestStatus: state => state.guestStatus,
    getGuestDetail: state => state.guestDetail,
    getRentSearchKey: state => state.rentSearchKey,
    getBusinessStatus: state => state.businessStatus,
    getBusinessDetailType: state => state.businessDetailType,
    getBusiness: state => state.business
  },
  mutations: {
    updatePageStatus (state, data) {
      state.pageStatus = data
    },
    updateHouseDetail (state, data) {
      state.houseDetail = data
    },
    updateGuestStatus (state, data) {
      state.guestStatus = data
    },
    updateGuestDetail (state, data) {
      state.guestDetail = data
    },
    updateRentSearchKey (state, data) {
      state.rentSearchKey = data
    },
    updateBusinessStatus (state, data) {
      state.businessStatus = data
    },
    updateBusinessDetailType (state, data) {
      state.businessDetailType = data
    },
    updateBusiness (state, data) {
      state.business = data
    }
  }
}
