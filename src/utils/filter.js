export default function (Vue) {
  Vue.filter('int', function (value) {
    if (!value) return '0'
    return parseInt(value)
  })
  Vue.filter('float2', function (value) {
    if (!value) return '0.00'
    return parseFloat(value).toFixed(2)
  })
  Vue.filter('dateMonth', function (value) {
    if (!value) return ''
    return (new Date(value)).format('yyyy-MM')
  })
  Vue.filter('dateChina', function (value) {
    if (!value) return ''
    let arr = ['年', '月', '日']
    return value.split('-').map((item, index) => item + arr[index]).join('')
  })
  Vue.filter('setPrice', function (price) {
    if (price > 0) {
      return '+' + price
    }
    return price
  })
  Vue.filter('hourMin', function (time) {
    if (time > 9) {
      return time + ':00'
    } else {
      return '0' + time + ':00'
    }
  })
  Vue.filter('today', function (time) {
    if (time.indexOf('/') > -1 || time.indexOf('-') > -1) {
      time = new Date(time)
    } else {
      time = new Date(parseInt(time))
    }
    let hour = time.getHours()
    let minute = time.getMinutes()
    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute
    time = '今天' + ' ' + hour + ':' + minute
    return time
  })
  Vue.filter('formatDate', function (time) {
    if (time.indexOf('/') > -1 || time.indexOf('-') > -1) {
      time = new Date(time)
    } else {
      time = new Date(parseInt(time))
    }
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDate()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    time = year + '-' + month + '-' + day
    return time
  })

  Vue.filter('formatMoney', function (val) {
    if (val > 0) {
      val = val.toString().replace(/\$|,/g, '')
      if (isNaN(val)) {
        val = '0'
      }
      var sign = (val === (val = Math.abs(val)))
      val = Math.floor(val * 100 + 0.50000000001)
      var cents = val % 100
      val = Math.floor(val / 100).toString()
      if (cents < 10) {
        cents = '0' + cents
      }
      for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
        val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
      }
      return (((sign) ? '' : '') + val + '.' + cents)
    } else {
      var f = parseInt(parseFloat(val, 10) * 100, 10) / 100
      if (!f) {
        return '0.00'
      }
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    }
  })
}
