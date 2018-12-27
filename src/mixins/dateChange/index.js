/* eslint-disable*/
export default {
  methods: {
    // 当前时间 yyyy-MM-DD
    initToday () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let time = year + '-' + month + '-' + strDate
      return time
    },
    // 时间转换 yyyy-MM-DD
    com_setDate (time) {
      if (!time) {
        return
      }
      time += ''
      if (time.indexOf('-') > -1) {
        time = time.replace(/\-/g, '/')
      }
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return year + '-' + this.add0(month) + '-' + this.add0(day)
    },
    // 时间转换 yyyy-MM
    com_setYM (time) {
      if (!time) {
        return
      }
      time += ''
      if (time.indexOf('-') > -1) {
        time = time.replace(/\-/g, '/')
      }
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return year + '-' + this.add0(month)
    },
    // 时间转换 yyyy-MM-DD 星期X
    com_date (time) {
      if (!time) {
        return
      }
      time += ''
      if (time.indexOf('-') > -1) {
        time = time.replace(/\-/g, '/')
      }
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let date1 = date.getDate()
      let arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      let day = arr[date.getDay()]
      return year + '年' + this.add0(month) + '月' + this.add0(date1) + '日 ' + ' ' + day
    },
    add0 (num) {
      if (num > 9) {
        return num
      } else {
        return '0' + num
      }
    },
    // MM月DD日(周X)
    com_setMD (time) {
      if (!time) {
        return ''
      }
      time = time.replace(/\-/g, '/')
      let date = new Date(time)
      let month = date.getMonth() + 1
      let date1 = date.getDate()
      let arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let day = arr[date.getDay()]
      return this.add0(month) + '月' + this.add0(date1) + '日 ' + ' (' + day + ') '
    },
    // 当前时间 年、月、日、星期几
    getDateNum (times) {
      let date = ''
      if (times) {
        times = times.replace(/\-/g, '/')
        date = new Date(times)
      } else {
        date = new Date()
      }
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      // if (month >= 1 && month <= 9) {
      //   month = '0' + month
      // }
      // if (strDate >= 0 && strDate <= 9) {
      //   strDate = '0' + strDate
      // }
      let time = {
        year: year,
        month: month,
        day: strDate,
        week: date.getDay()
      }
      return time
    },
    // 获取某年某月的最后一天
    getLastDay (year, month) {   
      let new_year = year   
      let new_month = month++  
      if(month > 12)      //如果当前大于12月，则年份转到下一年   
      {   
        new_month -= 12  
        new_year++   
      }   
      let new_date = new Date(new_year, new_month, 1)   
      return (new Date(new_date.getTime() - (1000 * 60 * 60 * 24))).getDate()   
    }
  }
}
