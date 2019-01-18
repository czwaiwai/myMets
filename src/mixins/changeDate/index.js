export default ({
  methods: {
    com_Date (str) {
      if (str) {
        let time = str.split(' ')[0]
        let arr = time.split('/')
        let date = []
        arr.forEach((a, i) => {
          if (a - 0 < 10) {
            a = '0' + a
          }
          date.push(a)
        })
        return date.join('-')
      } else {
        return ''
      }
    }
  }
})
