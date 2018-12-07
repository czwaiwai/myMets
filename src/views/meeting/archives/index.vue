<template>
  <div class="page">
    <nav-title :title="title"></nav-title>
    <div class="page_bd _content">
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
            <span class="tip" @click.stop="toPicDetail">平面位置图</span>
          </div>
        </div>
        <div class="list clearfix">
          <span class="items" v-for="(item,index) in 10" :key="index">八爪鱼</span>
        </div>
        <div class="selectItem clearfix noneBb">
          <span class="name">责任人</span>
          <span class="value textLeft">321</span>
        </div>
      </div>
      <div class="more">
        <div class="title" @click.stop="showMore=!showMore">
          <p :class="{'noneBb':!showMore}">
            <span>更多</span>
          </p>
          <i class="iconfont icon" :class="showMore?'icon-zhankai1':'icon-zhankai'"></i>
        </div>
        <transition name="slide-bottom">
          <div class="more-msg" v-show="showMore">
            <div class="msg1">
              <div class="selectItem clearfix">
                <span class="name">会议室编号</span>
                <span class="value textLeft">1651651</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">参与座位数</span>
                <span class="value textLeft">3</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">主席台座位</span>
                <span class="value textLeft">21</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">需提前天数</span>
                <span class="value textLeft">21</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">所属部门</span>
                <span class="value textLeft">21</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">单价</span>
                <span class="value textLeft">21</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">计费方式</span>
                <span class="value textLeft">安场次</span>
              </div>
            </div>
            <div class="remark">
              <div class="textShowItem clearfix noneBb">
                <span class="name">备注</span>
                <span class="value">会议内容会议内容会议内容会议内容</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import { Swipe, SwipeItem } from 'mint-ui'
export default {
  name: 'archives',
  components: {navTitle, Swipe, SwipeItem},
  data () {
    return {
      title: '',
      showMore: false
    }
  },
  methods: {
    toPicDetail () {
      this.$router.push('/picDetail/132')
    }
  },
  created () {
    this.title = this.$route.query.title
  }
}
</script>
<style lang="scss" scoped>
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
      .list{
        padding: 0 .3rem .2rem 0;
        border-bottom: 1px solid #ededed;
        .items{
          float: left;
          margin-right: .7rem;
          margin-top: .2rem;
          height: .44rem;
          line-height: .44rem;
          font-size: .3rem;
          color: #333;
        }
      }
    }
    .more{
      margin-top: .2rem;
      .title{
        padding-left: .3rem;
        background: #fff;
        position: relative;
        p{
          height: .88rem;
          line-height: .88rem;
          font-size: .32rem;
          color: #333;
          border-bottom: 1px solid #ededed;
        }
        .icon{
          position: absolute;
          right: .2rem;
          top: 0;
          display: block;
          width: .4rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .4rem;
          color: #999;
        }
      }
      .more-msg{
        .msg1{
          padding-left: .3rem;
          background: #fff;
        }
        .remark{
          margin-top: .2rem;
          padding-left: .3rem;
          background: #fff;
        }
      }
    }
  }
  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .slide-bottom-enter, .slide-bottom-leave-active {
    opacity: 0
  }
</style>
