<template>
  <div class="page_modal">
    <div class="page meetingSummary">
      <nav-title title="会议纪要"></nav-title>
      <div class="page_bd _content">
        <div class="msg" v-if="sumaryList.length">
          <div class="textCode clearfix">
            <span class="name">会议名称：</span>
            <span class="value">{{sumaryList[index].MinutesMeetName}}</span>
          </div>
          <div class="textCode clearfix">
            <span class="name">会议日期：</span>
            <span class="value">{{$parent.com_setDate(sumaryList[index].MinutesMeetTime)}}</span>
          </div>
          <div class="textCode clearfix">
            <span class="name">记录人：</span>
            <span class="value">{{sumaryList[index].MinutesMeetPeople}}</span>
          </div>
          <div class="textList _mgt-5">
            <p class="name">会议要点：</p>
            <p class="value">
              {{sumaryList[index].MinutesMeetPoint}}
            </p>
          </div>
          <div class="textList">
            <p class="name">会议内容：</p>
            <p class="value">
              {{sumaryList[index].MinutesMeetContent}}
            </p>
          </div>
        </div>
        <none-page title="没有会议纪要哦！" v-else></none-page>
      </div>
      <div class="_footer-btn clearfix" v-show="sumaryList.length && sumaryList.length>1">
        <div class="last" @click.stop="last">
          <span :class="{'grad':index==0}">前一页</span>
        </div>
        <div class="next" @click.stop="next">
          <span :class="{'grad':index==sumaryList.length-1}">后一页</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import nonePage from '../components/nonePage/index.vue'
export default {
  name: 'meetingSummary',
  components: {navTitle, nonePage},
  data () {
    return {
      sumaryList: [],
      index: 0
    }
  },
  methods: {
    // 上一页
    last () {
      if (this.index === 0) {
        return
      }
      this.index--
    },
    // 下一页
    next () {
      if (this.index === this.sumaryList.length - 1) {
        return
      }
      this.index++
    }
  },
  created () {
    this.sumaryList = this.$parent.detailData.Minutes
  }
}
</script>
<style lang="scss" scoped>
  .meetingSummary{
    ._content{
      .msg{
        padding: .2rem .3rem;
        background: #fff;
        .textCode{
          margin-top: .1rem;
          .name{
            float: left;
            width: 1.5rem;
            height: .44rem;
            line-height: .44rem;
            font-size: .3rem;
            color: #999;
          }
          .value{
            float: left;
            width: 5.4rem;
            min-height: .44rem;
            line-height: .44rem;
            font-size: .3rem;
            color: #333;
          }
        }
        .textList{
          margin-top: .3rem;
          &._mgt-5{
            margin-top: .5rem;
          }
          .name{
            height: .44rem;
            line-height: .44rem;
            font-size: .3rem;
            color: #999;
          }
          .value{
            padding: .1rem 0;
            line-height: .44rem;
            font-size: .3rem;
            color: #333;
          }
        }
      }
    }
    ._footer-btn{
      height: .88rem;
      width: 100vw;
      background: #fff;
      border-top: 1px solid #ededed;
      overflow: hidden;
      .last,.next{
        float: left;
        padding: .2rem 0;
        span{
          display: block;
          width: 50vw;
          height: .48rem;
          line-height: .48rem;
          text-align: center;
          font-size: .34rem;
          color: #3395ff;
          &.grad{
            color: #999;
          }
        }
      }
      .next {
        span{
          border-left: 1px solid #DDDEE3;
        }
      }
    }
  }
</style>
