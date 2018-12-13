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
        <subscribe @sendRes='setSubscribe'></subscribe>
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
          <p class="time">{{subDate.start}} — {{subDate.end}}</p>
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
import Subscribe from '@/views/meeting/components/subscribe'
export default {
  name: 'destineDetail',
  components: {navTitle, Swipe, SwipeItem, DatetimePicker, Subscribe},
  mixins: [dateChange],
  data () {
    return {
      title: '',
      dialogShow: false,
      pickerValue: '',
      dateTime: '',
      subDate: { // 订阅的时间
        start: '',
        startVal: 0,
        end: '',
        endVal: 0
      }
    }
  },
  methods: {
    // 设置预订结果
    setSubscribe (subDate) {
      this.subDate = subDate
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
      if (this.subDate.start && this.subDate.end) {
        this.dialogShow = true
      } else {
        this.$toast('请选择完整的时间段')
      }
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
