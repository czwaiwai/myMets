<template>
  <div>
    <ul class="times">
        <li class="items clearfix" v-for="(item, index) in hourList" :key="index">
          <span class="name">{{item.name | hourMin}}</span>
          <div @click="subscribe(sub)" class="btns " :class="itemClass(sub)" :style='itemStyle(sub)' v-for="(sub) in item.value" :key="sub.index">
            <p class="time_p" v-if="sub.isStartDot && !sub.isEndDot">起始<br/>{{sub.startTime}}</p>
            <p class="time_p" v-if="sub.isEndDot && !sub.isStartDot">结束<br/>{{sub.endTime}}</p>
            <p class="time_p" v-if="sub.isStartDot && sub.isEndDot">开始-结束{{sub.startTime}}</p>
          </div>
        </li>
      </ul>
  </div>
</template>
<script>
export default {
  name: 'subscribe',
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          aMSTime: '',
          aMETime: '',
          pMSTime: '',
          pMETime: '',
          bookList: []
        }
      }
    },
    bookList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      subDate: { // 订阅的时间
        start: '',
        startVal: 0,
        end: '',
        endVal: 0
      },
      blockList: [],
      isSubscribe: false // 是否锁定订阅状态
    }
  },
  created () {
    console.log(this.bookList, this.item, 'hahah')
    this.reflesh()
  },
  computed: {
    hourList () {
      // let list = this.blockList
      let tmp = null
      return this.blockList.reduce((before, item) => {
        if (item.index === 0) {
          tmp = {
            name: item.hour,
            value: []
          }
        }
        tmp.value.push(item)
        if (item.index === 3) {
          before.push(tmp)
        }
        return before
      }, [])
    }
  },
  methods: {
    reflesh () {
      console.log(this.item, this.bookList, '我靠')
      let {aMSTime: amS, aMETime: amE, pMSTime: pmS, pMETime: pmE} = this.item
      // this.bookList = this.item['BookList']
      this.blockList = []
      this.isSubscribe = false
      this.dateTimeToList(amS, amE)
      this.dateTimeToList(pmS, pmE)
      this.flashValidList(amS, amE)
      this.flashValidList(pmS, pmE)
      this.setChoosedList()
      this.clearChoose()
    },
    // 设置背景颜色
    itemStyle (item) {
      let color = ''
      if (!item.isValid) return
      if (color) {
        return {
          background: color
        }
      } else {
        return ''
      }
    },
    itemClass (item) {
      let str = ''
      if (!item.isValid) return
      str = 'valid_item'
      if (item.type) {
        str += ' meet_bg_' + item.type
      }
      if (item.isValid && item.isSubscribe) {
        str += ' choose'
      }
      if (item.isStartDot && !item.isEndDot) {
        str += ' start_choose'
      }
      if (item.isEndDot && !item.isStartDot) {
        str += ' end_choose'
      }
      if (item.isStartDot && item.isEndDot) {
        str += ' start_end_choose'
      }
      return str
    },
    // 通过时间节点创建blockList
    dateTimeToList (start, end) {
      let startNum = this.getTimeWhole(start)
      let endNum = this.getTimeWhole(end)
      for (let i = startNum; i < endNum; i++) {
        for (let j = 0, n = 0; n < 4; j += 15, n++) {
          this.blockList.push({
            id: parseInt(i + '' + n),
            hour: i,
            index: n,
            isValid: false,
            type: 'RV',
            isStartDot: false, // 起始位置
            isEndDot: false, // 终止位置
            isSubscribe: false, // 是否被预定
            start: parseInt(i + '' + (j === 0 ? '00' : j)),
            end: parseInt(i + '' + (j + 15)),
            startTime: this.coverHour(i, j),
            endTime: this.coverHour(i, j + 15)
          })
        }
      }
    },
    // 涂鸦已选择区域
    setChoosedList () {
      // this.bookList = [
      //   {
      //     'ID': '1812111115090001000Y',
      //     'StartTime': '2018-12-11 14:16:00',
      //     'EndTime': '2018-12-11 17:01:00',
      //     'BookStatus': 'HB'
      //   }, {
      //     'ID': '1812111115090001000Y',
      //     'StartTime': '2018-12-11 11:16:00',
      //     'EndTime': '2018-12-11 12:01:00',
      //     'BookStatus': 'QR'
      //   }, {
      //     'ID': '1812111115090001000Y',
      //     'StartTime': '2018-12-11 12:01:00',
      //     'EndTime': '2018-12-11 12:18:00',
      //     'BookStatus': 'US'
      //   }
      // ]
      this.bookList.forEach(item => {
        this.flashValidList(this.date2Hour(item.startTime), this.date2Hour(item.endTime), item.bookStatus)
      })
    },
    // 设置有效区域 可预定 RV
    flashValidList (startTime, endTime, type = 'RV', isSubscribe) {
      let startNum = this.time2Num(startTime)
      let endNum = this.time2Num(endTime)
      let chooseList = []
      this.blockList.forEach(item => {
        // 全命中的
        if (startNum < item.start && item.end < endNum) {
          this.setBlockType(item, type, isSubscribe)
          chooseList.push(item)
        }
        // 边界头
        if (startNum >= item.start && startNum < item.end) {
          this.setBlockType(item, type, isSubscribe)
          chooseList.push(item)
        }
        // 边界尾
        if (endNum > item.start && endNum <= item.end) {
          this.setBlockType(item, type, isSubscribe)
          chooseList.push(item)
        }
      })
      return chooseList
    },
    // 颜色属性设置
    setBlockType (item, type, isSubscribe) {
      item.isValid = true
      if (isSubscribe) {
        item.isSubscribe = isSubscribe
      } else {
        item.type = type
      }
    },
    // 验证是否可选定义的区域
    validatorList (startTime, endTime) {
      let startNum = this.time2Num(startTime)
      let endNum = this.time2Num(endTime)
      let canChoose = true
      this.blockList.forEach(item => {
        // 全命中的
        if (startNum < item.start && item.end < endNum) {
          canChoose = this.validatorItem(item) && canChoose
        }
        // 边界头
        if (startNum >= item.start && startNum < item.end) {
          canChoose = this.validatorItem(item) && canChoose
        }
        // 边界尾
        if (endNum > item.start && endNum <= item.end) {
          canChoose = this.validatorItem(item) && canChoose
        }
      })
      return canChoose
    },
    // 单个item验证
    validatorItem (item) {
      // console.log(item.isValid, item.type)
      if (!item.isValid) return false
      if (item.type !== 'RV') return false
      return true
    },
    clearChoose () {
      this.subDate.start = ''
      this.subDate.end = ''
      this.subDate.startVal = 0
      this.subDate.endVal = 0
      this.blockList.forEach(item => {
        item.isSubscribe = false
        item.isStartDot = false
        item.isEndDot = false
      })
    },
    setChooseOne (item) {
      console.log('第一次点击')
      item.isSubscribe = true
      item.isStartDot = true
      this.subDate.start = item.startTime
      this.subDate.startVal = item.start
      this.isSubscribe = true
      this.$emit('sendRes', this.subDate)
    },
    setChooseTwo (item) {
      console.log('第二次点击')
      console.log('进来了', item.start, this.subDate.startVal)
      item.isSubscribe = true
      item.isEndDot = true
      this.subDate.end = item.endTime
      this.subDate.endVal = item.end
      this.isSubscribe = false
      this.$emit('sendRes', this.subDate)
      this.flashValidList(this.subDate.start, this.subDate.end, null, true)
    },
    // 去预定
    subscribe (item) {
      console.log(item, '---sub', this.subDate)
      if (!item.isValid) return
      if (item.type !== 'RV') return
      // 清楚掉之前的设置
      if (this.subDate.end) {
        this.clearChoose()
      }
      // 第一次点击
      if (!this.isSubscribe && !this.subDate.start) {
        return this.setChooseOne(item)
      }
      // 第二次点击
      if (this.isSubscribe && this.subDate.start) {
        if (item.start < this.subDate.startVal) { // 第二次小于第一次
          this.clearChoose()
          return this.setChooseOne(item)
        }
        if (!this.validatorList(this.subDate.start, item.endTime)) {
          return this.$toast('请不要跨越存在已预定的时间段', 3000)
        }
        this.setChooseTwo(item)
      }
    },
    // 将日期转换成时间 例如'09:00' 的形式
    date2Hour (dateStr = '2018-12-11 14:00:00') {
      return dateStr.substring(11, 16)
    },
    // 将日期转换成数字
    time2Num (time = '09:00') {
      return parseInt(time.replace(':', ''))
    },
    // 获取整点
    getTimeWhole (time = '09:00') {
      let str = time.replace(':', '.')
      return parseInt(parseInt(str))
    },
    // 数值转成 小时时间
    coverHour (hour, minute) {
      let tmpMinute = minute
      if (minute === 0) {
        tmpMinute = '00'
      }
      if (minute === 60) {
        tmpMinute = '00'
        hour++
      }
      let tmpHour = hour
      if (hour < 10) {
        tmpHour = '0' + hour
      }
      return tmpHour + ':' + tmpMinute
    }
  }
}
</script>
<style lang="scss" scoped>
.times{
  padding-top: .2rem;
  .items{
    padding-bottom: .3rem;
    .name{
      float: left;
      height: .6rem;
      width: 1rem;
      line-height: .6rem;
      font-size: .3rem;
      color: #333;
      text-align: left;
    }
    .btns{
      float: left;
      margin-right: .36rem;
      width: 1.15rem;
      height: .6rem;
    }

  }
}
.valid_item {

}
.valid_item.choose {
  background: #3395FF !important;
  position:relative;
}
.valid_item.choose:after {
  content: "";
  border-bottom: 1px solid #FFF;
  position: absolute;
  bottom: 3px;
  width: 100%;
}
.choose.end_choose:before, .choose.start_choose:before {
  content: "";
  position:absolute;
  width:5px;
  height:5px;
  background:#FFF;
  border-radius:100%;
  bottom:1px;
  margin-left:-2px;
  left:50%;
}
.choose.end_choose:after,.choose.start_choose:after {
    content: "";
    position: absolute;
    width: 50%;
    right: 0;
    border-bottom: 1px solid #FFF;
    bottom: 3px;
}
.choose.start_choose:after {
  right:0;
}
.choose.end_choose:after {
  left:0;
}
.choose.start_end_choose p:after {
  content: "";
  position: absolute;
  border-bottom: 1px solid #FFF;
  border-radius: 100%;
  bottom: 3px;
  width: 80%;
  left: 10%;
}
.choose.start_end_choose:before {
  content: "";
  position:absolute;
  width:5px;
  height:5px;
  background:#FFF;
  border-radius:100%;
  bottom:1px;
  left:10%;
}
.choose.start_end_choose:after {
  content: "";
  position:absolute;
  width:5px;
  height:5px;
  background:#FFF;
  border-radius:100%;
  bottom:1px;
  right:10%;
}

.time_p {
  color:#FFF;
  line-height:1;
  text-align: center;
  font-size:12px;
}
</style>
