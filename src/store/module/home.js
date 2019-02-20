export default {
  state: {
    photo: {},
    scan: {},
    voice: {}
  },
  getters: {
    getHomePhoto: state => state.photo,
    getHomeScan: state => state.scan,
    getHomeVoice: state => state.voice
  },
  mutations: {
    setHomePhoto (state, data) {
      state.photo = data
    },
    setHomeScan (state, data) {
      state.scan = data
    },
    setHomeVoice (state, data) {
      state.voice = data
    }
  }
}
