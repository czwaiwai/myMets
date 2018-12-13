<template>
  <div class="page destineDetail">
    <nav-title :title="title"></nav-title>
    <div class="_content page_bd">
      <div class="_swipe-wrap">
        <swipe :auto="4000">
          <swipe-item v-for="(item,index) in 5" :key="index">
            <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1543821465&di=e3ad1277bf7c91696edb3cd5bf3749e5&src=http://imgsrc.baidu.com/imgad/pic/item/0b55b319ebc4b745317003c2c5fc1e178b821579.jpg" class="pics">
          </swipe-item>
        </swipe>
      </div>
      <div class="msg">
        <div class="build-wrap">
          <div class="build clearfix">
            <i class="iconfont icon-dizhi icon"></i>
            <span class="name">吾悦科技之关大厦</span>
            <span class="steps">11楼</span>
          </div>
          <div class="people clearfix">
            <i class="iconfont icon-duorenyonghu icon"></i>
            <span class="num">20人</span>
            <span class="tip" @click.stop="routeTo('picDetail')">平面位置图</span>
          </div>
        </div>
        <div class="articles">
          <span v-for="(item, index) in 10" :key="index">八爪鱼</span>
        </div>
        <div class="selectItem">
          <span class="name">责任人</span>
          <span class="value textLeft">李中华  18923898333</span>
        </div>
        <div class="selectItem noneBb" @click.stop="routeTo('otherDetail')">
          <span class="name">其他详情</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
      </div>
      <div class="dates">
        <div class="selectItem" @click.stop="openPicker">
          <span class="name">日期</span>
          <span class="value textRight">{{com_date(dateTime)}}</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="tips">
          <p class="name">请选择预订时间</p>
          <span class="showTip" @click.stop="routeTo('hasReserve')">已预定情况</span>
        </div>
        <div class="status clearfix">
          <div class="items clearfix">
            <div class="bgColor1"></div>
            <p class="name">可预订</p>
          </div>
          <div class="items clearfix">
            <div class="bgColor2"></div>
            <p class="name">确认中</p>
          </div>
          <div class="items clearfix">
            <div class="bgColor3"></div>
            <p class="name">已预订</p>
          </div>
          <div class="items clearfix">
            <div class="bgColor4"></div>
            <p class="name">使用中</p>
          </div>
        </div>
        <ul class="times">
          <li class="items clearfix" v-for="(item, index) in hourList" :key="index">
            <span class="name">{{item.name | hourMin}}</span>
            <div @click="subscribe(sub)" class="btns" :class="itemClass(sub)" :style='itemStyle(sub)' v-for="(sub) in item.value" :key="sub.index">
              <p class="time_p" v-if="sub.isStartDot && !sub.isEndDot">起始<br/>{{sub.startTime}}</p>
              <p class="time_p" v-if="sub.isEndDot && !sub.isStartDot">结束<br/>{{sub.endTime}}</p>
              <!-- {{sub.type}} -->
              <p class="time_p" v-if="sub.isStartDot && sub.isEndDot">开始-结束{{sub.startTime}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="_footer">
      <div class="btn" @click.stop="clickBtn">立即预订</div>
    </div>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
    <datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      v-model="pickerValue">
    </datetime-picker>
    <transition name="_dialog">
      <div class="_dialog" v-if="dialogShow">
        <div class="mark" @click.stop="dialogShow=false"></div>
        <div class="main">
          <p class="title">请确定您所选择的会议时间</p>
          <p class="date">2018年10月18日  星期四</p>
          <p class="time">16:30 — 18:00</p>
          <div class="btns clearfix">
            <div class="btn _left" @click.stop="dialogShow=false">取消</div>
            <div class="btn _right" @click.stop="toReserve">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import { Swipe, SwipeItem, DatetimePicker } from 'mint-ui'
import dateChange from '@/mixins/dateChange'
export default {
  name: 'destineDetail',
  components: {navTitle, Swipe, SwipeItem, DatetimePicker},
  mixins: [dateChange],
  data () {
    return {
      title: '',
      dialogShow: false,
      pickerValue: '',
      dateTime: '',
      blockList: [],
      subDate: { // 订阅的时间
        start: '',
        startVal: 0,
        end: '',
        endVal: 0
      },
      isSubscribe: false // 是否锁定订阅状态
    }
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
    // 设置背景颜色
    itemStyle (item) {
      let color = ''
      if (!item.isValid) return '#FFF'
      switch (item.type) {
        case 'HB':color = '#ff80c0'; break
        case 'CL':color = '#c2c2c2'; break
        case 'US':color = '#80ff80'; break
        case 'ED':color = '#8080ff'; break
        case 'QR':color = '#ff80c0'; break
        case 'RV':color = '#E8E8E8'; break
      }
      if (color) {
        return {
          background: color
        }
      } else {
        return {}
      }
    },
    itemClass (item) {
      let str = ''
      if (item.isValid) {
        str = 'valid_item'
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
      console.log(startNum, '---')
      console.log(endNum, '---')
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
    // 设置有效区域 可预定 RV
    flashValidList (startTime, endTime, type = 'RV', isSubscribe) {
      let startNum = this.time2Num(startTime)
      let endNum = this.time2Num(endTime)
      let chooseList = []
      this.blockList.forEach(item => {
        // console.log(item.start, startNum, item.end, endNum)
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
      console.log(this.blockList, '--flashValidList')
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
      console.log('我过来了~哈哈')
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
    },
    setChooseTwo (item) {
      console.log('第二次点击')
      console.log('进来了', item.start, this.subDate.startVal)
      item.isSubscribe = true
      item.isEndDot = true
      this.subDate.end = item.endTime
      this.subDate.endVal = item.end
      this.isSubscribe = false
      this.flashValidList(this.subDate.start, this.subDate.end, null, true)
    },
    // 去预定
    subscribe (item) {
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
    // 涂鸦已选择区域
    setChoosedList () {
      let bookList = [{
        'ID': '1812111115090001000Y',
        'StartTime': '2018-12-11 14:16:00',
        'EndTime': '2018-12-11 17:01:00',
        'BookStatus': 'HB'
      }, {
        'ID': '1812111115090001000Y',
        'StartTime': '2018-12-11 11:16:00',
        'EndTime': '2018-12-11 12:01:00',
        'BookStatus': 'QR'
      }, {
        'ID': '1812111115090001000Y',
        'StartTime': '2018-12-11 12:01:00',
        'EndTime': '2018-12-11 12:18:00',
        'BookStatus': 'US'
      }]
      bookList.forEach(item => {
        this.flashValidList(this.date2Hour(item.StartTime), this.date2Hour(item.EndTime), item.BookStatus)
      })
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
    },
    routeTo (name) {
      this.$router.push({name})
    },
    toPicDetail () {
      this.$router.push('/picDetail/132')
    },
    toOtherDetail () {
      this.$router.push('otherDetail')
    },
    toHasReserve () {
      this.$router.push('/hasReserve/123')
    },
    com_name (index) {
      let num = index - 0 + 8
      if (num > 9) {
        return num + ':00'
      } else {
        return '0' + num + ':00'
      }
    },
    clickBtn () {
      this.dialogShow = true
    },
    toReserve () {
      this.$router.push(`/reserve/213`)
    },
    openPicker () {
      this.pickerValue = this.com_setDate(this.dateTime)
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      console.log(date)
      this.dateTime = date
    }
  },
  created () {
    this.title = this.$route.query.title
    this.pickerValue = this.initToday()
    this.dateTime = this.initToday()
    this.dateTimeToList('09:15', '12:00')
    this.dateTimeToList('12:00', '18:00')
    this.flashValidList('09:16', '12:00')
    this.flashValidList('13:00', '17:29')
    this.setChoosedList()
    console.log(this.hourList)
  }
}
</script>
<style lang="scss" scoped>
  .destineDetail{
    ._content{
      ._swipe-wrap{
        position: relative;
        width: 100vw;
        height: 3.2rem;
        overflow: hidden;
        .pics{
          display: block;
          width: 100vw;
          height: 3.2rem;
        }
      }
      .msg{
        padding-left: .3rem;
        background: #fff;
        .build-wrap{
          padding: .3rem .3rem .3rem 0;
          border-bottom: 1px solid #ededed;
          .build{
            position: relative;
            .icon{
              float: left;
              width: .54rem;
              height: .4rem;
              font-size: .34rem;
              color: #0DC88C;
              line-height: .4rem;
              text-align: left;
            }
            .name{
              float: left;
              max-width: 4rem;
              font-size: .3rem;
              color: #333;
              line-height: .4rem;
            }
            .steps{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .4rem;
              line-height: .4rem;
              font-size: .28rem;
              color: #999;
            }
          }
          .people{
            position: relative;
            margin-top: .26rem;
            .icon{
              float: left;
              width: .54rem;
              height: .4rem;
              font-size: .34rem;
              color: #0DC88C;
              line-height: .4rem;
              text-align: left;
            }
            .num{
              float: left;
              max-width: 4rem;
              font-size: .3rem;
              color: #333;
              line-height: .4rem;
            }
            .tip{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .4rem;
              line-height: .4rem;
              font-size: .3rem;
              color: #3395FF;
            }
          }
        }
        .articles{
          padding-bottom: .3rem;
          border-bottom: 1px solid #ededed;
          span{
            display: inline-block;
            font-size: .3rem;
            color: #333;
            margin: .3rem .7rem 0 0;
            line-height: 1.2;
          }
        }
      }
      .dates{
        padding-left: .3rem;
        margin-top: .2rem;
        background: #fff;
        .tips{
          position: relative;
          height: .88rem;
          .name{
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #999;
          }
          .showTip{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #3395FF;
          }
        }
        .status{
          padding: .1rem 0 .3rem;
          .items{
            float: left;
            margin-right: .38rem;
            .name{
              float: left;
              height: .4rem;
              line-height: .4rem;
              margin-left: .1rem;
              font-size: .3rem;
              color: #333;
            }
            .bgColor1{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #E8E8E8;
            }
            .bgColor2{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #FEBBBB;
            }
            .bgColor3{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #FC5A5A;
            }
            .bgColor4{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #0DC88C;
            }
          }
        }
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
      }
    }
    .valid_item {
      background: #E8E8E8;
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
    ._dialog-enter-active, ._dialog-leave-active {
      transition: opacity .5s;
      -webkit-transform: opacity .5s;
    }
    ._dialog-enter, ._dialog-leave-active {
      opacity: 0
    }
    ._dialog{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 999;
      .mark{
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: 9;
        background: #000;
        opacity: .5;
      }
      .main{
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 11;
        width: 80vw;
        white-space:nowrap;
        transform: translate(-50%,-50%);
        background: #fff;
        overflow: hidden;
        padding: .3rem;
        overflow: hidden;
        border-radius: 3px;
        .title{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #333;
          text-align: center;
        }
        .date{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #3395FF;
          text-align: center;
        }
        .time{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #3395FF;
          text-align: center;
        }
        .btns{
          padding: .3rem .8rem 0;
          .btn{
            width: 1.6rem;
            height: .68rem;
            font-size: .32rem;
            text-align: center;
            line-height: .68rem;
            &._left{
              float: left;
              color: #0DC88C;
              border: 1px solid #0DC88C;
              border-radius: 3px;
            }
            &._right{
              float: right;
              color: #fff;
              background: #0DC88C;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
</style>
