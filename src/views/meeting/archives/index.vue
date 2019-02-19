<template>
  <div class="page">
    <nav-title :title="title"></nav-title>
    <div class="page_bd _content">
      <div class="_swipe-wrap">
        <swipe :auto="4000" v-if="imageList.length > 0">
          <swipe-item v-for="(item,index) in imageList" :key="index">
            <img preview :src="item.Path" class="pics">
          </swipe-item>
        </swipe>
        <swipe v-else  :auto="4000">
          <swipe-item >
            <img src="../../../assets/img/meeting/banner_detail.png">
          </swipe-item>
        </swipe>
      </div>
      <div class="msg">
        <div class="build-wrap">
          <div class="build clearfix">
            <i class="iconfont icon-dizhi icon"></i>
            <span class="name">{{detailData.Location}}</span>
            <span class="steps">{{detailData.Floor}}楼</span>
          </div>
          <div class="people clearfix">
            <i class="iconfont icon-duorenyonghu icon"></i>
            <span class="num">{{detailData.Capacity}}人</span>
            <span class="tip" @click.stop="routeTo('photo')">平面位置图</span>
          </div>
        </div>
        <div class="list clearfix" v-show="detailData.Facilities.length">
          <span class="items" v-for="(item,index) in detailData.Facilities" :key="index">{{item.MaterialsnName}}</span>
        </div>
        <div class="selectItem clearfix noneBb">
          <span class="name">责任人：</span>
          <span class="value textLeft">{{detailData.Responsible}} {{detailData.Phone}}</span>
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
                <span class="name">会议室编号：</span>
                <span class="value textLeft">{{detailData.MeetNumber}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">参与座位数：</span>
                <span class="value textLeft">{{detailData.InvolvSeats}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">主席台座位：</span>
                <span class="value textLeft">{{detailData.RostrumSeats}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">需提前天数：</span>
                <span class="value textLeft">{{detailData.AdvanceDay}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">所属部门：</span>
                <span class="value textLeft">{{detailData.Department}}</span>
              </div>
              <div class="selectItem clearfix">
                <span class="name">单价：</span>
                <span class="value textLeft">{{detailData.UnitPrice}}</span>
              </div>
              <div class="selectItem clearfix noneBb">
                <span class="name">计费方式：</span>
                <span class="value textLeft">{{detailData.BillingName}}</span>
              </div>
            </div>
            <div class="remark">
              <div class="textShowItem clearfix noneBb">
                <span class="name">备注：</span>
                <span class="value">{{detailData.Memo}}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
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
      showMore: false,
      imageList: [],
      detailData: {
        Facilities: ''
      }
    }
  },
  methods: {
    routeTo (name) {
      this.$router.push({name})
    },
    // 获取预定详情数据
    async getData () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetFileDetail', {
        'MeetID': this.$route.params.id
      })
      console.log('res:', res)
      if (res.data.length) {
        this.detailData = res.data[0]
      }
      this.$indicator.close()
    },
    // 获取轮播图列表
    async getPicList () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_GetMeettingRoomImageInfo', {
        'MeettingRoomID': this.$route.params.id,
        'TypeStr': 'Metting'
      })
      console.log('UserCS_GetMeettingRoomImageInfo:', res)
      this.$indicator.close()
      if (res.data.length && res.data[0].ImageList && res.data[0].ImageList.length) {
        // this.imageList = res.data[0].ImageList
        let ip = this.$store.getters.ip
        this.imageList = res.data[0].ImageList.map(item => {
          if (ip && item.Path) {
            item.Path = 'http://' + ip + item.Path
          }
          return item
        })
      }
    }
  },
  created () {
    this.title = this.$route.query.title
    this.getPicList()
    this.getData()
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
            color: #3395ff;
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
            color: #3395ff;
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
        padding-bottom: .2rem;
        border-bottom: 1px solid #ededed;
        .items{
          float: left;
          margin-right: .7rem;
          margin-top: .2rem;
          height: .44rem;
          line-height: .44rem;
          font-size: .3rem;
          color: #333;
          &:last-child{
            margin-right: 0;
          }
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
