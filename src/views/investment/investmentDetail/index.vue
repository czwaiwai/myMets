<template>
  <div class="page_modal">
    <div class="page page_bg">
      <nav-title title="项目详情"></nav-title>
      <div class="page_bd investmentDetail">
        <div class="_swipe-wrap">
          <swipe :auto="4000" v-if="detailData.ImageList.length > 0">
            <swipe-item v-for="(item,index) in detailData.ImageList" :key="index">
              <img preview :src="item.Url" class="pics">
            </swipe-item>
          </swipe>
          <swipe v-else  :auto="4000">
            <swipe-item >
              <img src="../../../assets/img/meeting/banner_detail.png">
            </swipe-item>
          </swipe>
        </div>
        <div class="headerData">
          <div class="title clearfix">
            <span class="name">{{detailData.ProjName}}</span>
            <span class="type">普通住宅</span>
            <span class="floor">小高层</span>
          </div>
          <div class="areaPrice">
            <span class="area">{{detailData.AreaFloor}}㎡</span>
            <span class="price">{{detailData.RentAvg}}元/㎡</span>
          </div>
          <p class="location">地址：{{detailData.ProjAddr}}</p>
        </div>
        <div class="baseMsg msgBox mt10">
          <h3 class="boxTitle">基本信息</h3>
          <div class="msg">
            <div class="showItem clearfix noneBb">
              <span class="name">楼层面积：</span>
              <span class="value">{{detailData.AreaFloor}}㎡</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">地面建筑面积：</span>
              <span class="value">{{detailData.AreaGround}}㎡</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">物业公司：</span>
              <span class="value">{{detailData.PropertyComp}}</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">项目开发商：</span>
              <span class="value">{{detailData.Developer}}</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">竣工日期：</span>
              <span class="value">{{com_setDate(detailData.FinishDate)}}</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">录入人：</span>
              <span class="value">{{detailData.InPutUser}}</span>
            </div>
          </div>
        </div>
        <div class="locations msgBox mt10">
          <h3 class="boxTitle">位置及周边</h3>
          <img class="pics" src="http://pic26.nipic.com/20121227/10193203_131357536000_2.jpg">
        </div>
        <div class="followMsg msgBox mt10">
          <h3 class="boxTitle">最新跟进情况</h3>
          <div class="msg">
            <div class="showItem clearfix noneBb">
              <span class="name">跟进人：</span>
              <span class="value">{{detailData.ProjPlan[0].CreateUser}}</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">跟进时间：</span>
              <span class="value">{{com_setAllDate(detailData.ProjPlan[0].CreateTime)}}</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">说明：</span>
              <span class="value">{{detailData.ProjPlan[0].ProjPlan}}</span>
            </div>
          </div>
        </div>
        <div class="moreBtn mt10" @click.stop="toInvestmentMoreMsg">查看更多</div>
      </div>
      <div class="connet">
        <span class="name">{{detailData.ProjLeader}}</span>
        <a class="phone clearfix" :href="'tel:'+detailData.Tel">
          <span class="tel">{{detailData.Tel}}</span>
          <i class="iconfont icon-dianhua icon"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import dateChange from '@/mixins/dateChange'
import { Swipe, SwipeItem } from 'mint-ui'
export default {
  name: 'investmentDetail',
  components: {navTitle, Swipe, SwipeItem},
  mixins: [dateChange],
  data () {
    return {
      detailData: {
        ImageList: [],
        ProjPlan: [
          {CreateTime: '', CreateUser: '', ProjPlan: ''}
        ]
      }
    }
  },
  methods: {
    toInvestmentMoreMsg () {
      this.$router.push({
        name: `investmentMoreMsg`,
        params: {
          id: this.$route.params.id
        }
      })
    },
    // 获取详情数据
    async getDetailData () {
      console.log('route', this.$route)
      let res = await this.$xml('UserCS_InvestmentPropertyDetail', {
        'ID': this.$route.params.id
      })
      console.log(res.data)
      if (res.data.length) {
        this.detailData = res.data[0]
      }
    }
  },
  activated () {
    this.getDetailData()
    console.log('in...detail')
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
  .investmentDetail {
    ._swipe-wrap{
      position: relative;
      width: 100vw;
      height: 3.12rem;
      overflow: hidden;
      .pics{
        display: block;
        width: 100vw;
        height: 3.12rem;
      }
    }
    .headerData{
      padding: .2rem .3rem;
      background: #fff;
      .title{
        .name{
          display: inline-block;
          height: .44rem;
          font-size: .34rem;
          color: #333;
          line-height: .44rem;
        }
        .type{
          display: inline-block;
          padding: 0 .1rem;
          height: .44rem;
          margin-left: .2rem;
          line-height: .44rem;
          background: #EDFAFF;
          color: #05A3FD;
          font-size: .28rem;
        }
        .floor{
          display: inline-block;
          padding: 0 .1rem;
          height: .44rem;
          margin-left: .2rem;
          line-height: .44rem;
          background: #FFF2ED;
          color: #FC6805;
          font-size: .28rem;
        }
      }
      .areaPrice{
        height: .4rem;
        margin-top: .1rem;
        line-height: .4rem;
        font-size: .28rem;
        .area{
          display: inline-block;
          color: #333;
        }
        .price{
          display: inline-block;
          margin-left: .4rem;
          color: #FC6805;
        }
      }
      .location{
        height: .4rem;
        margin-top: .1rem;
        font-size: .3rem;
        color: #333;
        line-height: .4rem;
      }
    }
    .msgBox{
      background: #fff;
      .boxTitle{
        height: .82rem;
        padding: 0 .3rem;
        line-height: .82rem;
        font-size: .34rem;
        color: #333;
        border-bottom: 1px solid #ededed;
      }
      .msg{
        padding: .1rem .3rem;
      }
      .showItem {
        .name {
          width: 2.3rem;
        }
        .value {
          width: 4.5rem;
        }
      }
    }
    .locations{
      .pics{
        display: block;
        width: 100vw;
        height: 2.88rem;
      }
    }
    .moreBtn{
      height: .8rem;
      width: 100vw;
      margin-bottom: .2rem;
      background: #fff;
      font-size: .34rem;
      color: #0DC88C;
      line-height: .8rem;
      text-align: center;
    }
  }
  .connet{
    position: relative;
    height: .8rem;
    width: 100vw;
    padding: 0 .3rem;
    background: #fff;
    line-height: .8rem;
    font-size: .34rem;
    color: #333;
    border-top: 1px solid #ededed;
    overflow: hidden;
    .phone{
      position: absolute;
      right: .3rem;
      top: 0;
      display: block;
      height: .8rem;
      line-height: .8rem;
      font-size: .34rem;
      color: #333;
      .tel{
        float: left;
      }
      .icon{
        float: left;
        width: .5rem;
        height: .8rem;
        color: #0DC88C;
        font-size: .46rem;
        text-align: center;
        line-height: .8rem;
        margin-left: .1rem;
      }
    }
  }
</style>
