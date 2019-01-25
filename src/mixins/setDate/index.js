/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
export default ({
  methods: {
    // 获得本周的开始日期
    getWeekStartDate () {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
      return this.formatDate(weekStartDate)
    },
    // 获得本周的结束日期
    getWeekEndDate () {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
      return this.formatDate(weekEndDate)
    },
    // 获得上周的开始日期
    getLastWeekStartDate () {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)
      return this.formatDate(weekStartDate)
    },
    // 获得上周的结束日期
    getLastWeekEndDate () {
      let now = new Date() // 当前日期
      let nowDayOfWeek = now.getDay() // 今天本周的第几天
      let nowDay = now.getDate() // 当前日
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1)
      return this.formatDate(weekEndDate)
    },
    // 获得本月的开始日期
    getMonthStartDate () {
      let now = new Date() // 当前日期
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      return this.formatDate(monthStartDate)
    },
    // 获得本月的结束日期
    getMonthEndDate () {
      let now = new Date() // 当前日期
      let nowMonth = now.getMonth() // 当前月
      let nowYear = now.getFullYear() // 当前年
      var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth))
      return this.formatDate(monthEndDate)
    },
    // 获得上月开始时间
    getLastMonthStartDate () {
      let now = new Date() // 当前日期
      let nowYear = now.getFullYear() // 当前年
      let lastMonthDate = new Date() // 上月日期
      lastMonthDate.setDate(1)
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
      let lastMonth = lastMonthDate.getMonth()
      let lastMonthStartDate = new Date(nowYear, lastMonth, 1)
      return this.formatDate(lastMonthStartDate)
    },
    // 获得上月结束时间
    getLastMonthEndDate () {
      let now = new Date() // 当前日期
      let nowYear = now.getFullYear() // 当前年
      let lastMonthDate = new Date() // 上月日期
      lastMonthDate.setDate(1)
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
      let lastMonth = lastMonthDate.getMonth()
      let lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth))
      return this.formatDate(lastMonthEndDate)
    },
    // 获得本季度的开始日期
    getQuarterStartDate () {
      let now = new Date() // 当前日期
      let nowYear = now.getFullYear() // 当前年
      let quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(), 1)
      return this.formatDate(quarterStartDate)
    },
    // 获取本季度的结束日期
    getQuarterEndDate () {
      let now = new Date() // 当前日期
      let nowYear = now.getFullYear() // 当前年
      let quarterEndMonth = this.getQuarterStartMonth() + 2
      let quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth))
      return this.formatDate(quarterStartDate)
    },
    // 获取本年开始时间
    getYearStartDate () {
      let now = new Date() // 当前日期
      let nowYear = now.getFullYear() // 当前年
      return nowYear + '-01-01'
    },
    // 获取本年结束时间
    getYearEndDate () {
      let now = new Date() // 当前日期
      let nowYear = now.getFullYear() // 当前年
      return nowYear + '-12-31'
    },
    // 补0
    add0 (num) {
      if (num > 9) {
        return num
      } else {
        return '0' + num
      }
    },
    // 获得本季度的开始月份
    getQuarterStartMonth () {
      let now = new Date()
      let nowMonth = now.getMonth()
      let quarterStartMonth = 0
      if (nowMonth < 3) {
        quarterStartMonth = 0
      }
      if (nowMonth > 2 && nowMonth < 6) {
        quarterStartMonth = 3
      }
      if (nowMonth > 5 && nowMonth < 9) {
        quarterStartMonth = 6
      }
      if (nowMonth > 8) {
        quarterStartMonth = 9
      }
      return quarterStartMonth
    },
    // 格式化日期：yyyy-MM-dd
    formatDate (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let weekday = date.getDate()
      return year + '-' + this.add0(month) + '-' + this.add0(weekday)
    },
    // 获得某月的天数
    getMonthDays (month) {
      let now = new Date()
      let nowYear = now.getFullYear() // 当前年
      let monthStartDate = new Date(nowYear, month, 1)
      let monthEndDate = new Date(nowYear, month + 1, 1)
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      return days
    }
  }
})
