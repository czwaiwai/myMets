<template>
  <div class="page_modal">
    <div class="page page_bg">
      <!-- <nav-title title="项目详情"></nav-title> -->
      <div class="headerTitle">
        <i class="iconfont icon-fanhui1 icon" @click.stop="goBack"></i>
        <p class="title">
          <span>项目详情</span>
        </p>
      </div>
      <div class="page_bd investmentDetail">
        <div class="_swipe-wrap">
          <swipe :auto="4000" v-if="detailData.ImageList.length > 0">
            <swipe-item v-for="(item,index) in detailData.ImageList" :key="index">
              <img preview :src="item.Url" :onerror="defaultImg" class="pics">
            </swipe-item>
          </swipe>
          <swipe v-else  :auto="4000">
            <swipe-item >
              <img preview src="../../../assets/img/investment/banner.png" class="pics">
            </swipe-item>
          </swipe>
        </div>
        <div class="headerData">
          <div class="title clearfix">
            <span class="name">{{detailData.ProjName}}</span>
            <span class="type" v-show="detailData.TradeType">{{detailData.TradeType}}</span>
            <!-- <span class="floor">小高层</span> -->
          </div>
          <div class="areaPrice">
            <span class="area" v-if="detailData.AreaFloor">{{detailData.AreaFloor}}㎡</span>
            <span class="area" v-else>暂无</span>
            <span class="price" v-if="detailData.RentAvg">{{detailData.RentAvg}}元/㎡</span>
            <span class="price" v-else>暂无</span>
          </div>
          <p class="location" v-if="detailData.ProjAddr">地址：{{detailData.ProjAddr}}</p>
          <p class="location" v-else>暂无</p>
        </div>
        <div class="baseMsg msgBox mt10">
          <h3 class="boxTitle">基本信息</h3>
          <div class="msg">
            <div class="showItem clearfix noneBb">
              <span class="name">楼层面积：</span>
              <span class="value" v-if="detailData.AreaFloor">{{detailData.AreaFloor}}㎡</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">地面建筑面积：</span>
              <span class="value" v-if="detailData.AreaGround">{{detailData.AreaGround}}㎡</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">物业公司：</span>
              <span class="value" v-if="detailData.PropertyComp">{{detailData.PropertyComp}}</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">项目开发商：</span>
              <span class="value" v-if="detailData.Developer">{{detailData.Developer}}</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">竣工日期：</span>
              <span class="value" v-if="detailData.FinishDate">{{com_setDate(detailData.FinishDate)}}</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">录入人：</span>
              <span class="value" v-if="detailData.InPutUser">{{detailData.InPutUser}}</span>
              <span class="value" v-else>暂无</span>
            </div>
          </div>
        </div>
        <div class="locations msgBox mt10">
          <h3 class="boxTitle">位置及周边</h3>
          <div class="mapContent">
            <div class="mapMark" @click.stop="showMap=true"></div>
            <baidu-map  v-if="hasHttp" class="pics baidu_map" :center="center" :zoom="zoom" ak='D9b45bc6f98deafc489e9ac1bc7f7612'>
              <bm-marker :position="center" :dragging="false">
              </bm-marker>
            </baidu-map>
          </div>
        </div>
        <div class="followMsg msgBox mt10">
          <h3 class="boxTitle">最新跟进情况</h3>
          <div class="msg">
            <div class="showItem clearfix noneBb">
              <span class="name">跟进人：</span>
              <span class="value" v-if="projPlan.CreateUser">{{projPlan.CreateUser}}</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">跟进时间：</span>
              <span class="value" v-if="projPlan.CreateTime">{{com_setAllDate(projPlan.CreateTime)}}</span>
              <span class="value" v-else>暂无</span>
            </div>
            <div class="showItem clearfix noneBb">
              <span class="name">说明：</span>
              <span class="value" v-if="projPlan.ProjPlan">{{projPlan.ProjPlan}}</span>
              <span class="value" v-else>暂无</span>
            </div>
          </div>
        </div>
        <div class="moreBtn mt10" @click.stop="toInvestmentMoreMsg">查看更多</div>
      </div>
      <transition name="mapBox">
        <div class="mapBox" v-if="showMap">
          <baidu-map class="mapBig baidu_map" :center="center" :zoom="zoom" ak='D9b45bc6f98deafc489e9ac1bc7f7612'>
            <bm-marker :position="center" :dragging="false">
            </bm-marker>
            <i class="iconfont icon-jujiao icon" @click.stop="reset"></i>
          </baidu-map>
        </div>
      </transition>
      <div class="connet">
        <span class="name">{{detailData.ProjLeader}}</span>
        <a class="phone clearfix" v-show="detailData.Tel" :href="'tel:'+detailData.Tel">
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
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'
import BmMarker from 'vue-baidu-map/components/overlays/marker.vue'
export default {
  name: 'investmentDetail',
  components: {navTitle, Swipe, SwipeItem, BaiduMap, BmGeolocation, BmMarker},
  mixins: [dateChange],
  data () {
    return {
      defaultImg: 'this.src="' + require('../../../assets/img/investment/banner.png') + '"',
      detailData: {
        ImageList: []
      },
      projPlan: {},
      showMap: false,
      center: {
        lng: 121.04,
        lat: 31.11
      },
      zoom: 16,
      hasHttp: false,
      isAdd: false
    }
  },
  methods: {
    // 返回
    goBack () {
      if (this.showMap) {
        this.showMap = false
      } else {
        this.$router.go(-1)
      }
    },
    reset () {
      console.log('reset')
      if (this.isAdd) {
        this.isAdd = false
        this.center.lng -= 0.00000000001
      } else {
        this.isAdd = true
        this.center.lng += 0.00000000001
      }
    },
    // 到更多信息
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
        this.center = {
          lng: (res.data[0].Longitude || 0) - 0,
          lat: (res.data[0].Latitude || 0) - 0
        }
        if (res.data[0].ProjPlan.length) {
          this.projPlan = res.data[0].ProjPlan[0]
        }
      }
      this.hasHttp = true
    }
  },
  created () {
    this.getDetailData()
  }
}
</script>
<style lang="scss" scoped>
  .headerTitle{
    position: relative;
    height: .88rem;
    width: 100vw;
    background: #303642;
    .icon{
      position: absolute;
      left: .3rem;
      top: 0;
      display: block;
      width: .4rem;
      height: .88rem;
      line-height: .88rem;
      color: #fff;
      text-align: left;
      font-size: .34rem;
    }
    .title{
      width: 100vw;
      height: .88rem;
      font-size: .34rem;
      line-height: .88rem;
      text-align: center;
      color: #fff;
      span{
        display: inline-block;
        height: .88rem;
        line-height: .88rem;
        max-width: 80vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
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
        margin-top: -1px;
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
        min-height: .4rem;
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
      .mapContent{
        position: relative;
        width: 100vw;
        height: 2.88rem;
        .mapMark{
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 2.88rem;
          z-index: 9;
        }
        .pics{
          display: block;
          width: 100vw;
          height: 2.88rem;
        }
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
  .mapBox-enter,
  .mapBox-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .mapBox{
    position: absolute;
    top: .88rem;
    left: 0;
    right: 0;
    bottom: .8rem;
    background: #05A3FD;
    z-index: 999;
    transition: all .5s ease;
    .mapBig{
      position: absolute;
      width: 100%;
      height: 100%;
      .icon{
        position: absolute;
        bottom: .3rem;
        left: .3rem;
        z-index: 9;
        display: block;
        width: .8rem;
        height: .8rem;
        font-size: .68rem;
        line-height: .8rem;
        color: #333;
        text-align: left;
        border-radius: 50%;
      }
    }
  }
</style>
