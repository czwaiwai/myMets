<template>
  <div>
    <div class="date clearfix">
      <div class="month" @click.stop="clickMonth">
        <span>{{monthDate.month}}月</span>
        <i class="iconfont icon-xiala icon"></i>
      </div>
      <div class="day-wrap">
        <div class="days">
          <div class="items" :class="{'isSelect':item.isSelect}" @click.stop="selectDate(item,index)" v-for="(item,index) in dateList" :key="index">
            <span class="name">{{item.name}}</span>
            <span class="value">{{item.value}}</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="dateLog">
        <div class="_datelog" v-show="showMonth">
          <div class="mark" @click.stop="showMonth=false"></div>
          <div class="dateLog">
            <div class="items" :class="{'isSelect':item.isSelect}" @click.stop="selectMonth(item,index)" v-for="(item,index) in monthList" :key="index">{{item.year}}年{{item.month}}月</div>
          </div>
        </div>
    </transition>
  </div>
</template>
<script>
import dateChange from '@/mixins/dateChange'
export default {
  name: 'lineDate',
  mixins: [dateChange],
  props: {
    date: String
  },
  data () {
    return {
      showMonth: false,
      monthDate: {year: '', month: '', day: ''},
      dateList: []
    }
  },
  created () {
    if (this.dateDate.day) {
      this.monthDate = {year: this.dateDate.year, month: this.dateDate.month, day: this.dateDate.day}
      let init = this.getDateNum()
      if (init.month === this.dateDate.month) {
        this.getDateList()
      } else {
        this.setDateList()
      }
    } else {
      this.getDateList()
    }
    this.getMonthList()
  },
  computed: {
    dateDate () {
      let arr = this.date.split('-')
      return {
        year: arr[0],
        month: parseInt(arr[1]),
        day: parseInt(arr[2])
      }
    },
    dateStr () {
      let year = this.monthDate.year
      let month = this.monthDate.month < 10 ? '0' + this.monthDate.month : this.monthDate.month
      let day = this.monthDate.day < 10 ? '0' + this.monthDate.day : this.monthDate.day
      return '' + year + '-' + month + '-' + day
    }
  },
  methods: {
    // 点击月份选中
    clickMonth () {
      this.showMonth = !this.showMonth
    },
    // 点击选中日期
    selectDate (item, index) {
      if (!item.isSelect) {
        this.dateList.forEach(arr => {
          if (arr.value === item.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      }
      this.monthDate.day = item.value
      console.log(this.dateStr)
      this.$emit('change', this.dateStr)
    },
    // 选择月份
    selectMonth (item, index) {
      if (!item.isSelect) {
        this.monthList.forEach(arr => {
          arr.isSelect = false
        })
        item.isSelect = true
        this.monthDate = {
          year: item.year,
          month: item.month,
          day: 1
        }
        let init = this.getDateNum()
        let month = init.month
        if (month - 0 === item.month - 0) {
          this.monthDate.day = init.day
          console.log(this.monthDate)
          this.getDateList()
        } else {
          this.setDateList()
        }
        this.$el.querySelector('.days').scrollLeft = 0
        console.log(this.dateStr)
        this.$emit('change', this.dateStr)
      }
      this.showMonth = false
    },
    // 获取月份下拉列表
    getMonthList () {
      let monthList = []
      let init = this.getDateNum()
      let index = 0
      let month = init.month - 0
      let year = init.year - 0
      while (index < 6) {
        index++
        let obj = {
          year: year,
          month: month,
          isSelect: false
        }
        if (this.monthDate.month) {
          if (month === this.monthDate.month) {
            obj.isSelect = true
          }
        } else if (month === init.month) {
          obj.isSelect = true
        }
        monthList.push(obj)
        if (month === 12 || month === '12') {
          month = 1
          year += 1
        } else {
          month += 1
        }
      }
      this.monthList = monthList
    },
    // 除了本月，其他月份日期列表
    setDateList () {
      let dateList = []
      let weekWorks = ['日', '一', '二', '三', '四', '五', '六']
      let init = this.getDateNum(this.monthDate.year + '/' + this.monthDate.month + '/1')
      let dayNum = init.day
      let index = init.week
      let maxDay = this.getLastDay(this.monthDate.year, this.monthDate.month)
      while (dayNum < maxDay + 1) {
        if (index > 6) {
          index = 0
        }
        let obj = {
          name: weekWorks[index],
          value: dayNum,
          isSelect: false
        }
        if (this.dateDate.day) {
          if (dayNum - 0 === this.monthDate.day - 0) {
            obj.isSelect = true
            this.monthDate.day = dayNum
            // setTimeout(() => {
            //   this.$el.querySelector('.days').scrollLeft = (this.monthDate.day - 1) * 32
            // }, 500)
            this.$nextTick(() => {
              this.$el.querySelector('.days').scrollLeft = (this.monthDate.day - 1) * 32
            })
          }
        } else if (dayNum === init.day) {
          obj.isSelect = true
          this.monthDate.day = dayNum
        }
        dayNum++
        index++
        dateList.push(obj)
      }
      this.dateList = dateList
    },
    // 本月日期列表
    getDateList () {
      let dateList = []
      let weekWorks = ['日', '一', '二', '三', '四', '五', '六']
      let init = this.getDateNum()
      let dayNum = init.day
      let index = init.week
      let maxDay = this.getLastDay(init.year, init.month)
      while (dayNum < maxDay + 1) {
        if (index > 6) {
          index = 0
        }
        let obj = {
          name: weekWorks[index],
          value: dayNum,
          isSelect: false
        }
        if (dayNum === init.day) {
          obj.name = '今'
        }
        if (this.monthDate.day) {
          if (dayNum - 0 === this.monthDate.day - 0) {
            obj.isSelect = true
            // setTimeout(() => {
            //   console.log(this.monthDate.day)
            //   this.$el.querySelector('.days').scrollLeft = (this.monthDate.day - init.day) * 30
            // }, 500)
            this.$nextTick(() => {
              console.log(this.monthDate.day)
              this.$el.querySelector('.days').scrollLeft = (this.monthDate.day - init.day) * 30
            })
          }
        } else if (dayNum - 0 === init.day - 0) {
          obj.isSelect = true
          this.monthDate = {year: init.year, month: init.month, day: dayNum}
        }
        dayNum++
        index++
        dateList.push(obj)
      }
      this.dateList = dateList
    }
  }
}
</script>
<style scoped lang="scss">
  .date {
    position: relative;
    width: 100vw;
    height: 1.06rem;
    border-bottom: 1px solid #ededed;
    padding-left: .3rem;
    .month{
      float: left;
      width: .8rem;
      height: 1.06rem;
      span{
        display: block;
        width: .8rem;
        height: .6rem;
        line-height: .8rem;
        text-align: center;
        color: #333;
        font-size: .3rem;
      }
      .icon{
        display: block;
        width: .8rem;
        height: .46rem;
        line-height: .36rem;
        text-align: center;
        color: #333;
        font-size: .3rem;
      }
    }
    .day-wrap{
      float: left;
      width: 6.14rem;
      overflow: hidden;
      .days{
        width: auto;
        height: 1.06rem;
        padding: .09rem 0;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        .items{
          display: inline-block;
          width: .8rem;
          height: .88rem;
          color: #333;
          &.isSelect{
            color: #fff;
            background: #3395ff;
            border-radius: .44rem;
          }
          .name{
            display: block;
            width: .8rem;
            height: .46rem;
            line-height: .5rem;
            text-align: center;
            // color: #333;
            font-size: .3rem;
          }
          .value{
            display: block;
            width: .8rem;
            height: .34rem;
            line-height: .34rem;
            text-align: center;
            // color: #333;
            font-size: .3rem;
          }
        }
      }
    }
  }
    ._datelog{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 9999;
    .mark{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #fff;
      opacity: 0;
      z-index: 9;
    }
    .dateLog{
      position: absolute;
      top: 2.82rem;
      left: 0;
      z-index: 10;
      width: 2.8rem;
      background: #fff;
      box-shadow: 2px 0px 2px #888888;
      .items{
        width: 2.8rem;
        height: .88rem;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
        text-align: center;
        border-bottom: 1px solid #ededed;
        &:last-child{
          border-bottom: none;
        }
        &.isSelect{
          color: #3395ff;
        }
      }
    }
  }
  ._d-box-enter-active, ._d-box-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  ._d-box-enter, ._d-box-leave-active {
    opacity: 0
  }
  .dateLog-enter-active, .dateLog-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .dateLog-enter, .dateLog-leave-active {
    opacity: 0
  }
</style>
