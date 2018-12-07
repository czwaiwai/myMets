<template>
  <div class="page reserveDetail">
    <nav-title title="预订详情"></nav-title>
    <div class="page_bd _content">
      <div class="date">
        <div class="selectItem clearfix" @click.stop="toArchives">
          <span class="name">会议室</span>
          <span class="value textLeft textColor">高效厅</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="selectItem clearfix">
          <span class="name">会议日期</span>
          <span class="value textLeft">2018年10月18日  星期四</span>
        </div>
        <div class="selectItem noneBb">
          <span class="name">预订时段</span>
          <span class="value textLeft">16:30 — 18:00</span>
        </div>
      </div>
      <div class="theme">
        <div class="selectItem clearfix">
          <span class="name">会议主题</span>
          <span class="value textLeft">会议主题</span>
        </div>
        <div class="textShowItem clearfix">
          <span class="name">会议内容</span>
          <span class="value">会议内容会议内容会议内容会议内容</span>
        </div>
        <div class="selectItem clearfix">
          <span class="name">预订人</span>
          <span class="value textLeft">预订人</span>
        </div>
        <div class="selectItem clearfix noneBb">
          <span class="name">预订人电话</span>
          <span class="value textLeft">15012345678</span>
        </div>
      </div>
      <div class="attendee">
        <div class="btnItem">
          <p class="title">参会人（已选2人）</p>
          <p class="peopleList">张小小、张大大、李秋平</p>
        </div>
        <div class="selectItem clearfix noneBb">
          <span class="name">其他参会人</span>
          <span class="value textLeft">15012345678</span>
        </div>
      </div>
      <div class="listBtn">
        <div class="textShowItem clearfix noneBb">
          <span class="name">配套设施</span>
          <span class="value" style="min-height:.44rem;">电脑、投影仪、会议系统、耳麦、激光笔、白纸、白板笔</span>
        </div>
      </div>
      <div class="listBtn">
        <div class="textShowItem clearfix noneBb">
          <span class="name">服务清单</span>
          <span class="value" style="min-height:.44rem;">会议内容、会议内容、会议内容、会议内容</span>
        </div>
      </div>
      <div class="remark">
        <div class="textShowItem clearfix noneBb">
          <span class="name">预订备注</span>
          <span class="value">会议内容会议内容会议内容会议内容</span>
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
                <span class="name">会议形式</span>
                <span class="value textLeft">会议形式</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">会议用途</span>
                <span class="value textLeft">会议用途</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">参会人数</span>
                <span class="value textLeft">21</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">使用部门</span>
                <span class="value textLeft">小卖部</span>
              </div>
            </div>
            <div class="msg2">
              <div class="selectItem clearfix">
                <span class="name">会议联系人</span>
                <span class="value textLeft">小卖部</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">联系人电话</span>
                <span class="value textLeft">15012345678</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">联系人邮箱</span>
                <span class="value textLeft">小卖部</span>
              </div>
            </div>
            <div class="msg3">
              <div class="selectItem clearfix">
                <span class="name">单价</span>
                <span class="value textLeft">213</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">预收金额</span>
                <span class="value textLeft">321</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">会议套餐</span>
                <span class="value textLeft">321</span>
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
export default {
  name: 'reserveDetail',
  components: {navTitle},
  data () {
    return {
      showMore: false
    }
  },
  methods: {
    toArchives () {
      this.$router.push({
        name: 'archives',
        params: {
          id: 123
        },
        query: {
          title: '高效厅'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ._content{
    .date{
      padding-left: .3rem;
      background: #fff;
    }
    .theme,.attendee,.listBtn,.remark{
      padding-left: .3rem;
      margin-top: .2rem;
      background: #fff;
    }
    .attendee{
      .btnItem{
        padding: .2rem .3rem .2rem 0;
        border-bottom: 1px solid #ededed;
        .title{
          height: .44rem;
          line-height: .44rem;
          font-size: .3rem;
          color: #999;
        }
        .peopleList{
          margin-top: .1rem;
          min-height: .44rem;
          line-height: .44rem;
          font-size: .3rem;
          color: #333;
          text-indent: .2rem;
        }
      }
    }
    .listBtn{
      padding-left: .2rem;
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
        .msg2,.msg3{
          padding-left: .3rem;
          margin-top: .2rem;
          background: #fff;
        }
      }
    }
  }
  .textColor{
    color: #3395FF !important;
  }
  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .slide-bottom-enter, .slide-bottom-leave-active {
    opacity: 0
  }
</style>
