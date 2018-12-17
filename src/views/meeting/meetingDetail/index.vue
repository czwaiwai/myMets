<template>
  <div class="page reserveDetail">
    <nav-title title="会议详情"></nav-title>
    <div class="page_bd _content">
      <div class="date">
        <div class="selectItem clearfix" @click.stop="toArchives">
          <span class="name">会议室</span>
          <span class="value textLeft textColor">{{detailData.Meet}}</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="selectItem clearfix">
          <span class="name">会议日期</span>
          <span class="value textLeft">{{com_date(detailData.MeetTime)}}</span>
        </div>
        <div class="selectItem clearfix">
          <span class="name">会议时段</span>
          <span class="value textLeft">{{detailData.STime}} — {{detailData.ETime}}</span>
        </div>
        <div class="selectItem clearfix" :class="{'noneBb': detailData.BookStatus=='CL'}">
          <span class="name">会议状态</span>
          <span class="value textLeft">{{detailData.BookStatusName}}</span>
        </div>
        <div class="textShowItem clearfix noneBb" v-show="detailData.BookStatus=='CL'">
          <span class="name">取消原因</span>
          <span class="value">取消原因取消原因取消原因取消原因取消原因取消原因</span>
        </div>
      </div>
      <div class="theme">
        <div class="selectItem clearfix">
          <span class="name">会议主题</span>
          <span class="value textLeft">{{detailData.MeetName}}</span>
        </div>
        <div class="textShowItem clearfix">
          <span class="name">会议内容</span>
          <span class="value"></span>
        </div>
        <div class="selectItem clearfix">
          <span class="name">预订人</span>
          <span class="value textLeft">{{detailData.BookName}}</span>
        </div>
        <div class="selectItem clearfix noneBb">
          <span class="name">预订人电话</span>
          <span class="value textLeft">{{detailData.BookPhone}}</span>
        </div>
      </div>
      <div class="attendee">
        <div class="btnItem">
          <p class="title">参会人（已选{{detailData.Participants.length}}人）</p>
          <p class="peopleList">
            <span v-for="(item,index) in detailData.Participants" :key="index">
              {{item.Names}}<span v-show="index!=detailData.Participants.length-1">、</span>
            </span>
          </p>
        </div>
        <div class="selectItem clearfix noneBb">
          <span class="name">其他参会人</span>
          <span class="value textLeft"></span>
        </div>
      </div>
      <div class="listBtn">
        <div class="textShowItem clearfix noneBb">
          <span class="name">配套设施</span>
          <span class="value" style="min-height:.44rem;">
            <span v-for="(item, index) in detailData.Facilities" :key="index">
              {{item.MaterialsnName}}<span v-show="index!=detailData.Facilities.length-1">、</span>
            </span>
          </span>
        </div>
      </div>
      <div class="listBtn">
        <div class="textShowItem clearfix noneBb">
          <span class="name">服务清单</span>
          <span class="value" style="min-height:.44rem;">
            <span v-for="(item,index) in detailData.Service" :key="index">
              {{item.ServiceDesc}}<span v-show="index!=detailData.Service.length-1">、</span>
            </span>
          </span>
        </div>
      </div>
      <div class="remark">
        <div class="textShowItem clearfix noneBb">
          <span class="name">预订备注</span>
          <span class="value"></span>
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
                <span class="value textLeft">{{detailData.MeetFormName}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">会议用途</span>
                <span class="value textLeft">{{detailData.MeetUseName}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">参会人数</span>
                <span class="value textLeft">{{detailData.MeetNumber}}</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">使用部门</span>
                <span class="value textLeft">{{detailData.UserDepartments}}</span>
              </div>
            </div>
            <div class="msg2">
              <div class="selectItem clearfix">
                <span class="name">会议联系人</span>
                <span class="value textLeft">{{detailData.MeetPerson}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">联系人电话</span>
                <span class="value textLeft">{{detailData.Phone}}</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">联系人邮箱</span>
                <span class="value textLeft">{{detailData.Email}}</span>
              </div>
            </div>
            <div class="msg3">
              <div class="selectItem clearfix">
                <span class="name">单价</span>
                <span class="value textLeft">{{detailData.UnitPrice}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">预收金额</span>
                <span class="value textLeft">{{detailData.AdvanceMoney}}</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">会议套餐</span>
                <span class="value textLeft">{{detailData.MeetPackage}}</span>
              </div>
            </div>
            <div class="summary">
              <div class="selectItem clearfix noneBb" @click.stop="toSummary">
                <span class="name">会议纪要</span>
                <span class="value textLeft">321</span>
                <i class="iconfont icon-tubiao- icon"></i>
              </div>
            </div>
            <div class="enclosure">
              <div class="title" @click.stop="showEnclosure=!showEnclosure">
                <p :class="{'noneBb':!showEnclosure}">
                  <span>附件</span>
                </p>
                <i class="iconfont icon" :class="showEnclosure?'icon-zhankai1':'icon-zhankai'"></i>
              </div>
              <transition name="closure">
                <div class="closure" v-show="showEnclosure">
                  <div class="items" v-for="(item,index) in 5" :key="index">
                    <i class="iconfont icon-zhankai1"></i>
                    <span>会议室预订系统APP端产品线框图.zip</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import dateChange from '@/mixins/dateChange'
export default {
  name: 'reserveDetail',
  components: {navTitle},
  mixins: [dateChange],
  data () {
    return {
      showMore: false,
      showEnclosure: false,
      detailData: {
        Participants: []
      }
    }
  },
  methods: {
    // 到会议室详情
    toArchives () {
      this.$router.push({
        name: 'archives',
        params: {
          id: this.detailData.MeetID
        },
        query: {
          title: this.detailData.Meet
        }
      })
    },
    // 获取预定详情数据
    async getData () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingMyBookedDetail', {
        'MeetID': this.$route.params.id
      })
      this.detailData = res.data[0]
      this.com_num('UnitPrice')
      this.com_num('AdvanceMoney')
      console.log('res:', this.detailData)
      this.$indicator.close()
    },
    // 多位小数处理
    com_num (name) {
      if (this.detailData[name].length) {
        this.detailData[name] = (this.detailData[name] - 0).toFixed(2)
      }
    },
    toSummary () {
      this.$router.push(`/meetingSummary/${this.detailData.MeetID}`)
    }
  },
  created () {
    this.getData()
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
        .msg2,.msg3,.summary{
          padding-left: .3rem;
          margin-top: .2rem;
          background: #fff;
        }
        .enclosure{
          margin-top: .2rem;
          background: #fff;
          .closure{
            padding: .3rem .3rem .1rem;
            .items{
              height: .44rem;
              margin-bottom: .2rem;
              font-size: .3rem;
              color: #1B9BFE;
              line-height: .44rem;
              span{
                text-decoration: underline;
              }
            }
          }
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
  .closure-enter-active, .closure-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .closure-enter, .closure-leave-active {
    opacity: 0
  }
</style>
