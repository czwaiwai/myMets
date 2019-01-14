<template>
  <div class="mapBox">
    <baidu-map ref="baiduMap" class="pics baidu_map" :center="center" :zoom="zoom" ak='D9b45bc6f98deafc489e9ac1bc7f7612'>
      <bm-label
        @click="clickItem(item)"
        v-for="(item,index) in mapList" :key="index"
        :position="{lng: item.Longitude, lat: item.Latitude}"
        :content="item.CountyName+'/'+item.CountyNum+'套'"
      />
      <i class="iconfont icon-jujiao icon" @click.stop="reset"></i>
    </baidu-map>
    <transition name="mapList">
      <div class="mapList" v-show="showMapList" @touchmove.prevent>
        <div class="mark" @click.stop="showMapList=false"></div>
        <div class="_content">
          <h4 class="title">
            <span>{{mapItem.CountyName}}({{mapItem.CountyNum}}套)</span>
            <i class="iconfont icons" :class="showMapList?'icon-zhankai':'icon-zhankai1'" @click.stop="showMapList=false"></i>
          </h4>
          <div class="list"  @touchmove.stop>
            <div class="items" v-for="(item,index) in mapItem.CountyData" :key="index" @click.stop="toInvestmentDetail(item)">
              <div class="name">{{item.ProjName}}</div>
              <div class="location">{{item.ProjAddr}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
import BmLabel from 'vue-baidu-map/components/overlays/Label.vue'
export default {
  name: 'mapBox',
  components: {BaiduMap, BmLabel},
  data () {
    return {
      center: '',
      zoom: 11,
      isAdd: false,
      showMapList: false,
      mapList: [],
      mapItem: {
      }
    }
  },
  methods: {
    // 地图复位
    reset () {
      // this.$refs.baiduMap.reset()
      if (this.isAdd) {
        this.isAdd = false
        this.center = this.$parent.cityData.LevelCityName
      } else {
        this.isAdd = true
        this.center = this.$parent.delectLastWord(this.$parent.cityData.LevelCityName)
      }
    },
    // 点击
    clickItem (item) {
      if (this.showMapList) {
        this.showMapList = false
        setTimeout(() => {
          this.mapItem = item
          this.showMapList = true
        }, 300)
      } else {
        this.mapItem = item
        this.showMapList = true
      }
    },
    toInvestmentDetail (item) {
      this.$router.push({
        name: `investmentDetail`,
        params: {
          id: item.ID
        }
      })
    },
    // 获取地图数据
    async getMapData () {
      let res = await this.$xml('UserCS_InvestmentGlobalMap', {
        'CityID': this.$parent.cityData.ID,
        'County': this.$parent.selectData.County,
        'ProjStatus': this.$route.query.type,
        'TradeType': this.$parent.selectData.TradeType,
        'RentAvgMin': this.$parent.selectData.RentAvgMax !== '' ? (this.$parent.selectData.RentAvgMin || 0) : (this.$parent.selectData.RentAvgMin || ''),
        'RentAvgMax': this.$parent.selectData.RentAvgMin !== '' ? (this.$parent.selectData.RentAvgMax || 99999999999) : (this.$parent.selectData.RentAvgMax || ''),
        'AreaTotalMin': this.$parent.selectData.AreaTotalMax !== '' ? (this.$parent.selectData.AreaTotalMin || 0) : (this.$parent.selectData.AreaTotalMin || ''),
        'AreaTotalMax': this.$parent.selectData.AreaTotalMin !== '' ? (this.$parent.selectData.AreaTotalMax || 99999999999) : (this.$parent.selectData.AreaTotalMax || '')
      })
      if (res.data.length) {
        this.mapList = res.data
      } else {
        this.mapList = []
      }
      console.log('getMapData', this.mapList)
    },
    getCenter () {
      this.mapList = []
      this.center = this.$parent.cityData.LevelCityName
      this.isAdd = false
      this.showMapList = false
      this.mapItem = {}
      this.getMapData()
    }
  },
  created () {
    this.getCenter()
  }
}
</script>
<style lang="scss" scoped>
  .mapBox{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    background: #fff;
    .pics{
      display: block;
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
  .sample {
    position: absolute;
  }
  .content {
    position: absolute;
    top: -18px;
    width: 2rem;
    padding: .1rem;
    line-height: 1.5;
    background: #0DC88C;
    font-size: .24rem;
    text-align: center;
    color: #fff;
    border-radius: 3px;
    &::after{
      position: absolute;
      bottom: 0;
      left: 1rem;
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-top: 5px solid #0DC88C;
      border-right: 5px solid #0DC88C;
    }

  }
  .mapList-enter,
  .mapList-leave-to {
    transform: translate3d(0, 100%, 0);
  }
  .mapList{
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
    transition: all .5s ease;
    width: 100vw;
    height: calc(100vh - 2.74rem);
    // height: 100%;
    .mark{
      position: absolute;
      width: 100%;
      // height: 100%;
      height: calc(100vh - 2.74rem);
      z-index: 9;
    }
    ._content{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: auto;
      background: #fff;
      z-index: 10;
      .title{
        position: relative;
        height: .88rem;
        line-height: .88rem;
        padding: 0 .3rem;
        background: #FCFAFA;
        font-size: .3rem;
        color: #0DC88C;
        border-bottom: 1px solid #ededed;
        .icons{
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
      .list{
        width: 100vw;
        max-height: 40vh;
        overflow-x: hidden;
        overflow-y: auto;
        .items{
          padding: .1rem .3rem;
          border-bottom: 1px solid #ededed;
          &:last-child{
            border-bottom: none;
          }
          .name{
            line-height: .4rem;
            font-size: .28rem;
            color: #333;
          }
          .location{
            line-height: .3rem;
            font-size: .24rem;
            color: #7B7A7A;
          }
        }
      }
    }
  }
</style>
