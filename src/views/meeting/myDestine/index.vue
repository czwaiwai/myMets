<template>
  <div class="myDestine page">
    <nav-title title="我的预订"></nav-title>
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
      <div class="title">以下是您10月26日（周五）已预订的会议：5次</div>
      <ul class="list">
        <li class="items" :class="{'opcity':index % 5 === 3}" @click.stop="toReserveDetail(item)" v-for="(item,index) in 20" :key="index">
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
          <div class="btns clearfix">
            <div class="btn" @click.stop="cancel(item)">取消预订</div>
          </div>
        </li>
      </ul>
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
export default {
  name: 'myDestine',
  components: {navTitle, Calendar},
  mixins: [dateChange],
  data () {
    return {
      dialogShow: false,
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
    cancel (item) {
      this.dialogShow = true
    },
    toReserveDetail (item) {
      this.$router.push(`/reserveDetail/123`)
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
  .myDestine{
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
          .btns{
            margin-top: .1rem;
            .btn{
              float: right;
              width: 1.74rem;
              height: .6rem;
              line-height: .6rem;
              font-size: .28rem;
              color: #0DC88C;
              text-align: center;
              border: 1px solid #0DC88C;
              border-radius: 3px;
            }
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
              color: #0DC88C;
            }
          }
        }
      }
    }
  }
</style>
