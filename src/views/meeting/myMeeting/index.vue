<template>
  <div class="myMeeting page">
    <nav-title title="我的会议"></nav-title>
    <div class="page_bd _content">
      <div class="dates">
        <div class="lastMonth" @click.stop="lastMonth"></div>
        <div class="nextMonth" @click.stop="nextMonth"></div>
        <span class="today" @click.stop="toInitDay">今天</span>
        <Calendar
          ref="Calendar"
          v-on:choseDay="clickDay"
          v-on:changeMonth="changeDate"
          v-on:isToday="clickToday"
          :markDateMore="pointList"
          :sundayStart="false"
          :textTop="calendarList"
        ></Calendar>
      </div>
      <div class="title" v-if="dataList.length">以下是您{{com_setMD (dayTime)}} 要参加的会议：{{dataList.length}}次</div>
      <div class="title" v-else>您在{{com_setMD (dayTime)}}  没有要参加的会议</div>
      <div class="list-wrap" v-if="dataList.length">
        <ul class="list">
          <li class="items" :class="{'opcity':item.BookStatus=='QR'}" @click.stop="toMeetingDetail(item)" v-for="(item,index) in dataList" :key="index">
            <div class="point" :class="'bg_'+item.BookStatus"></div>
            <div class="times">
              <span class="time">{{item.STime}} — {{item.ETime}}</span>
              <span class="status" :class="'color_'+item.BookStatus">{{item.BookStatusName}}</span>
            </div>
            <div class="room">
              <span class="locat">{{item.Meet}}</span>
              <span class="people">{{item.Capacity}}人</span>
            </div>
            <div class="location">
              <span class="locat">{{item.Location}}</span>
              <span class="steps">{{item.Floor}}楼</span>
            </div>
            <p class="say">{{item.MeetName}}</p>
            <div class="location clearfix">
              <i class="iconfont icon-yonghu icon"></i>
              <span class="name">{{item.BookName}}</span>
              <span class="steps">{{item.BookPhone}}</span>
            </div>
          </li>
        </ul>
      </div>
      <none-page title="暂无会议！" height="50" v-else></none-page>
    </div>
    <transition name="_dialog">
      <div class="_dialog" v-if="dialogShow">
        <div class="mark" @click.stop="dialogShow=false"></div>
        <div class="main">
          <p class="title">你确定要取消本次预订？</p>
          <textarea class="textContent" placeholder="请输入取消原因"></textarea>
          <div class="btns clearfix">
            <div class="btn _left">取消预订</div>
            <div class="btn _right" @click.stop="dialogShow=false">不取消</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import dateChange from '@/mixins/dateChange'
import Calendar from 'vue-calendar-component'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
import { Indicator } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'myMeeting',
  components: {navTitle, Calendar, nonePage, Indicator},
  mixins: [dateChange],
  data () {
    return {
      dialogShow: false,
      calendarList: ['一', '二', '三', '四', '五', '六', '日'],
      pointList: [],
      dayTime: '',
      calendarDate: {year: '', month: ''},
      dataList: []
    }
  },
  computed: {
    ...mapGetters({
      statusColor: 'getStatusColor',
      locationData: 'getMeetingLocation'
    })
  },
  methods: {
    // 上个月
    lastMonth () {
      this.$refs.Calendar.PreMonth('', false)
    },
    // 下个月
    nextMonth () {
      this.$refs.Calendar.NextMonth('', false)
    },
    // 点击日期
    clickDay (date) {
      this.dayTime = this.com_setDate(date)
      console.log(date)
      this.getDataList()
    },
    // 日期改变
    changeDate (date) {
      console.log('changeDate', date)
      let dateNum = this.getDateNum(date)
      if (dateNum.month !== this.calendarDate.month || dateNum.month - 0 !== this.calendarDate.month - 0) {
        console.log('change:', dateNum.year + '-' + dateNum.month + '-' + dateNum.day)
        this.calendarDate = {year: dateNum.year, month: dateNum.month}
        this.getPointList()
      }
    },
    clickToday (data) {
    },
    // 回到今天
    toInitDay () {
      this.dayTime = this.initToday()
      this.$refs.Calendar.ChoseMonth(this.initToday())
      this.getDataList()
    },
    // 状态上色
    com_color (status) {
      let color = ''
      this.statusColor.forEach(arr => {
        if (arr.StatusValue === status) {
          color = arr.Color
        }
      })
      return color
    },
    // 到预定详情
    toMeetingDetail (item) {
      this.$router.push(`/meetingDetail/${item.ID}`)
    },
    // 获取列表数据
    async getDataList () {
      Indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingBookedList', {
        'EmployeeID': this.locationData.employeeId,
        'MeetTime': this.dayTime
      })
      console.log('res:', res)
      this.isLoading = false
      if (res.data) {
        this.dataList = res.data || []
      }
      Indicator.close()
    },
    // 获取时间轴
    async getPointList () {
      let res = await this.$xml('UserCS_MeetingMyBookedTime', {
        'EmployeeID': this.locationData.employeeId,
        'MeetTime': this.calendarDate.year + '-' + (this.calendarDate.month > 9 ? this.calendarDate.month : ('0' + this.calendarDate.month)),
        'MeetType': '2'
      })
      console.log('getPointList', res)
      let pointList = []
      res.data.forEach(arr => {
        let obj = {
          date: this.com_setDate(arr.MeetTime)
        }
        if (arr.GoBeyond) {
          obj.className = 'mark1'
        } else {
          obj.className = 'mark2'
        }
        pointList.push(obj)
      })
      this.pointList = pointList
    }
  },
  mounted () {
    this.dayTime = this.initToday()
    this.getDataList()
    let dateNum = this.getDateNum(this.dayTime)
    this.calendarDate = {year: dateNum.year, month: dateNum.month}
    this.$refs.Calendar.ChoseMonth(this.initToday())
    this.getPointList()
  }
}
</script>
<style lang="scss" scoped>
  .myMeeting{
    ._content{
      .dates{
        position: relative;
        width: 100vw;
        background: #fff;
        .today{
          position: absolute;
          right: .3rem;
          top: 0;
          z-index: 9;
          display: block;
          height: 44px;
          line-height: 44px;
          font-size: 15px;
          color: #3395FF;
        }
      }
      .title{
        width: 100vw;
        height: .78rem;
        padding-left: .3rem;
        font-size: .3rem;
        color: #666;
        line-height: .78rem;
      }
      .list{
        padding-left: .3rem;
        background: #fff;
        .items{
          position: relative;
          padding: .2rem .3rem;
          border-bottom: 1px solid #ededed;
          &.opcity{
            // opacity: .4;
          }
          &:last-child{
            border-bottom: none;
          }
          .point{
            position: absolute;
            left: 0;
            top: .34rem;
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .times{
            position: relative;
            height: .44rem;
            font-size: .3rem;
            line-height: .44rem;
            .time{
              color: #3395ff;
            }
            .status{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .44rem;
              line-height: .44rem;
              font-size: .28rem;
            }
          }
          .room,.location{
            position: relative;
            height: .44rem;
            margin-top: .1rem;
            color: #7B7A7A;
            font-size: .3rem;
            line-height: .44rem;
            .locat{
              display: inline-block;
              max-width: 5rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .name{
              float: left;;
              height: .44rem;
              max-width: 4rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .icon{
              float: left;
              width: .4rem;
              height: .44rem;
              line-height: .44rem;
              text-align: left;
              font-size: .34rem;
              color: #3395ff;
            }
            .people,.steps{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .44rem;
              line-height: .44rem;
              font-size: .3rem;
              color: #7B7A7A;
            }
            .icon{
              color: #3395ff;
            }
          }
          .say{
            margin-top: .1rem;
            color: #7B7A7A;
            font-size: .3rem;
            line-height: .44rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
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
        width: 5.6rem;
        white-space:nowrap;
        transform: translate(-50%,-50%);
        background: #fff;
        overflow: hidden;
        border-radius: 3px;
        padding-top: .2rem;
        .title{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #333;
          text-align: center;
        }
        .textContent{
          display: block;
          width: 5.04rem;
          height: 1.9rem;
          padding: .1rem .2rem;
          border: 1px solid #D2D2D2;
          border-radius: 2px;
          margin: .2rem auto .3rem;
          line-height: 1.5;
          color: #333;
          &::placeholder{
            color: #999;
          }
        }
        .btns{
          height: .88rem;
          border-top: 1px solid #ededed;
          .btn{
            float: left;
            width: 2.8rem;
            height: .88rem;
            font-size: .32rem;
            text-align: center;
            line-height: .88rem;
            font-size: .34rem;
            &._left{
              border-right: 1px solid #ededed;
              color: #999;
            }
            &._right{
              color: #3395ff;
            }
          }
        }
      }
    }
  }
</style>
