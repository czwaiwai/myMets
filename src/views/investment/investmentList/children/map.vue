<template>
  <div class="mapBox">
    <baidu-map ref="baiduMap" class="pics baidu_map" :center="center" :zoom="zoom" ak='D9b45bc6f98deafc489e9ac1bc7f7612'>
      <bm-label
        @click="clickItem(item)"
        v-for="(item,index) in mapList" :key="index"
        :position="{lng: item.lng, lat: item.lat}"
        :content="item.name+'/'+item.num+'套'"
      />
      <i class="iconfont icon-jujiao icon" @click.stop="reset"></i>
      <transition name="mapList">
        <div class="mapList" v-if="showMapList">
          <div class="mark" @click.stop="showMapList=false"></div>
          <div class="_content">
            <h4 class="title">
              <span>{{mapItem.name}}({{mapItem.num}}套)</span>
              <i class="iconfont icons" :class="showMapList?'icon-zhankai':'icon-zhankai1'" @click.stop="showMapList=false"></i>
            </h4>
            <div class="list">
              <div class="items" v-for="(item,index) in mapItem.num" :key="index">
                <div class="name">长虹科技大厦</div>
                <div class="location">深圳市南山区深南大道1101</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </baidu-map>
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
      center: {
        lng: 113.963633,
        lat: 22.542932
      },
      zoom: 10,
      isAdd: false,
      showMapList: false,
      mapList: [
        {
          name: '龙岗区',
          num: 1,
          lng: '114.233002',
          lat: '22.726713'
        },
        {
          name: '龙华区',
          num: 2,
          lng: '114.051329',
          lat: '22.756577'
        },
        {
          name: '南山区',
          num: 3,
          lng: '113.939508',
          lat: '22.537774'
        },
        {
          name: '宝安区',
          num: 4,
          lng: '113.919098',
          lat: '22.560205'
        },
        {
          name: '罗湖区',
          num: 5,
          lng: '114.132967',
          lat: '22.553796'
        }
      ],
      mapItem: {
      }
    }
  },
  methods: {
    reset () {
      if (this.isAdd) {
        this.isAdd = false
        this.center.lng -= 0.00001
      } else {
        this.isAdd = true
        this.center.lng += 0.00001
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .mapBox{
    position: relative;
    width: 100%;
    height: 100%;
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
    height: 100%;
    .mark{
      position: absolute;
      width: 100%;
      height: 100%;
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
            height: .4rem;
            line-height: .4rem;
            font-size: .28rem;
            color: #333;
          }
          .location{
            height: .3rem;
            line-height: .3rem;
            font-size: .24rem;
            color: #7B7A7A;
          }
        }
      }
    }
  }
</style>
