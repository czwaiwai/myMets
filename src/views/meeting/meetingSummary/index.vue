<template>
  <div class="page page_bg meetingSummary">
    <nav-title title="会议纪要"></nav-title>
    <div class="page_bd _content">
      <div class="msg" v-if="hasData">
        <div class="textCode clearfix">
          <span class="name">会议名称：</span>
          <span class="value">会议室预订系统APP产品预上线动员会</span>
        </div>
        <div class="textCode clearfix">
          <span class="name">会议日期：</span>
          <span class="value">2018-10-15</span>
        </div>
        <div class="textCode clearfix">
          <span class="name">记录人：</span>
          <span class="value">黎明</span>
        </div>
        <div class="textList _mgt-5">
          <p class="name">会议要点：</p>
          <p class="value" v-for="(item,index) in 3" :key="index">
            会议室预订系统APP产品预上线动员会会议室预订系统APP产品预上线动员会
          </p>
        </div>
        <div class="textList">
          <p class="name">会议内容：</p>
          <p class="value" v-for="(item,index) in 3" :key="index">
            会议室预订系统APP产品预上线动员会
          </p>
        </div>
      </div>
      <none-page title="没有会议纪要哦！" v-else></none-page>
    </div>
    <div class="_footer-btn clearfix" v-show="hasData">
      <div class="last">
        <span>前一页</span>
      </div>
      <div class="next">
        <span>后一页</span>
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
      hasData: false
    }
  },
  methods: {
  },
  created () {
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
          color: #0DC88C;
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
