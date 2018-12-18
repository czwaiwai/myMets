<template>
<ul class="ul_bl bottom">
  <li class="item_bl" v-for="(item, index) in hourList" :key="index" >
    <span class="txt">{{item.name}}</span>
    <div  class="bl" :class="itemClass(sub)" :style='itemStyle(sub)' v-for="(sub) in item.value" :key="sub.index"></div>
  </li>
</ul>
</template>
<script>
export default {
  name: 'subscribe',
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          AMSTime: '',
          AMETime: '',
          PMSTime: '',
          PMETime: '',
          BookList: []
        }
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
    let {AMSTime: amS, AMETime: amE, PMSTime: pmS, PMETime: pmE} = this.item
    this.bookList = this.item['BookList']
    this.dateTimeToList(amS, amE)
    this.dateTimeToList(pmS, pmE)
    this.flashValidList(amS, amE)
    this.flashValidList(pmS, pmE)
    this.setChoosedList()
  },
  computed: {
    hourList () {
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
    // 设置背景颜色
    itemStyle (item) {
      let color = ''
      if (!item.isValid) return ''
      if (color) {
        return {
          background: color
        }
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
      this.bookList.forEach(item => {
        this.flashValidList(this.date2Hour(item.StartTime), this.date2Hour(item.EndTime), item.BookStatus)
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
.ul_bl {
  display:flex;
  height:40px;
}
.item_bl {
  flex:1;
  width: .5rem;
  height: .5rem;
  margin-right: .08rem;
  background: #E8E8E8;
  position:relative;
  color: #fff;
  text-align: center;
  line-height: .5rem;
  display: flex;
}
.item_bl .txt{
  position:absolute;
  width:100%;
  display:block;
  height:100%;
}
.item_bl .bl {
  flex:1;
}
</style>
