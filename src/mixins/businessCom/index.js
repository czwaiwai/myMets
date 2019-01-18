export default({
  methods: {
    com_degree_color (str) {
      if (!str) {
        return 'grad'
      } else if (str.indexOf('Height') > -1) {
        return 'degreeRed'
      } else if (str.indexOf('Middle') > -1) {
        return 'yellow'
      } else if (str.indexOf('Lower') > -1) {
        return 'blue'
      } else {
        return ''
      }
    },
    com_degree (str) {
      if (!str) {
        return '暂无'
      } else if (str.indexOf('Height') > -1) {
        return '!!! 高'
      } else if (str.indexOf('Middle') > -1) {
        return '!! 中'
      } else if (str.indexOf('Lower') > -1) {
        return '! 低'
      } else {
        return '暂无'
      }
    }
  }
})
