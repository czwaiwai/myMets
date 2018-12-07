<template>
  <div class="myMeeting page">
    <nav-title title="我的会议"></nav-title>
    <div class="page_bd _content">
      <div class="dates">
        <span class="today" @click.stop="toInitDay">今天</span>
        <Calendar
          ref="Calendar"
          v-on:choseDay="clickDay"
          v-on:changeMonth="changeDate"
          v-on:isToday="clickToday"
          :markDateMore="arr"
          :sundayStart="false"
        ></Calendar>
      </div>
      <div class="title">以下是您10月26日（周五）要参加的会议：5次</div>
      <ul class="list">
        <li class="items" :class="{'opcity':index % 5 === 3}" v-for="(item,index) in 20" :key="index" @click.stop="toMeetingDetail(item)">
          <div class="times">
            <span>09:30 — 11:00</span>
            <span class="status">{{com_status(index)}}</span>
          </div>
          <div class="room">
            <span>高效厅</span>
            <span class="people">20人</span>
          </div>
          <div class="location">
            <span>吾悦科技之光大厦</span>
            <span class="steps">11楼</span>
          </div>
          <p class="say">会议室预订系统APP产品预上线动员大会</p>
          <div class="location">
            <i class="iconfont icon-yonghu icon"></i>
            <span>五彩缤纷</span>
            <span class="steps">15012345678</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import Calendar from 'vue-calendar-component'
import dateChange from '@/mixins/dateChange'
import { setTimeout } from 'timers'
export default {
  name: 'myMeeting',
  components: {navTitle, Calendar},
  mixins: [dateChange],
  data () {
    return {
      arr: [{date: '2018/12/6', className: 'mark1'}, {date: '2018/12/10', className: 'mark1'}, {date: '2018/12/13', className: 'mark2'}]
    }
  },
  methods: {
    clickDay () {},
    changeDate () {},
    clickToday (data) {
    },
    toInitDay () {
      this.$refs.Calendar.ChoseMonth(this.initToday())
    },
    com_status (index) {
      if (index % 5 === 0) {
        return '已结束'
      } else if (index % 5 === 1) {
        return '使用中'
      } else if (index % 5 === 2) {
        return '已预订'
      } else if (index % 5 === 3) {
        return '确认中'
      } else if (index % 5 === 4) {
        return '已取消'
      }
    },
    toMeetingDetail (item) {
      this.$router.push(`/meetingDetail/123`)
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.Calendar.ChoseMonth(this.initToday())
    }, 100)
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
          font-size: .3rem;
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
          padding: .2rem .3rem;
          border-bottom: 1px solid #ededed;
          &.opcity{
            opacity: .4;
          }
          &:last-child{
            border-bottom: none;
          }
          .times{
            position: relative;
            height: .44rem;
            color: #0DC88C;
            font-size: .3rem;
            line-height: .44rem;
            &::before{
              position: absolute;
              left: -.3rem;
              top: .14rem;
              display: block;
              width: 8px;
              height: 8px;
              background: #CDCBCB;
              border-radius: 50%;
              content: '';
            }
            .status{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .44rem;
              line-height: .44rem;
              font-size: .28rem;
              color: #999;
            }
          }
          .room,.location{
            position: relative;
            height: .44rem;
            margin-top: .1rem;
            color: #7B7A7A;
            font-size: .3rem;
            line-height: .44rem;
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
              color: #0DC88C;
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
  }
</style>
