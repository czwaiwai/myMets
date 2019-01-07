<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <header-top v-model="isMap" @changeCity="changeCity"></header-top>
    <select-types ref="selectTypes" @selectData="setSelectData"></select-types>
    <div class="page_bd investmentList">
      <items ref="items"></items>
      <transition name="slide-right">
        <baidu-map ref="mapPage" v-if="isMap"></baidu-map>
      </transition>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import selectTypes from './children/selectTypes'
import headerTop from './children/headerTop'
import items from './children/items'
import baiduMap from './children/map'
export default {
  name: 'investmentList',
  components: {navTitle, selectTypes, headerTop, items, baiduMap},
  data () {
    return {
      title: '',
      isMap: false,
      cityData: {
        LevelCityName: '上海市'
      },
      selectData: {
        'County': '',
        'TradeType': '',
        'RentAvgMin': '',
        'RentAvgMax': '',
        'AreaTotalMin': '',
        'AreaTotalMax': ''
      },
      isChange: false
    }
  },
  watch: {
    isMap (newVal, oldVal) {
      if (!this.isMap && this.isChange) {
        this.isChange = false
        this.$refs.items.initGetData()
      }
    }
  },
  methods: {
    // 切换了城市
    changeCity (cityData) {
      console.log('cityData', cityData)
      this.cityData = cityData
      this.isChange = true
      this.$refs.selectTypes.setInitData()
      this.initSelectData()
      if (this.isMap) {
        this.$refs.mapPage.getCenter()
      } else {
        this.isChange = false
        this.$refs.items.initGetData()
      }
      localStorage.LevelCityName = cityData.LevelCityName
    },
    // 设置title
    setTitle (type) {
      switch (type) {
        case 15:
          this.title = '已投项目'
          break
        case 10:
          this.title = '未来可投'
          break
        case 20:
          this.title = '暂不考虑'
          break
      }
    },
    // 筛选条件
    setSelectData (data) {
      console.log(data)
      this.selectData = data
      if (this.isMap) {
        this.isChange = true
      } else {
        this.$refs.items.initGetData()
      }
    },
    // 筛选信息
    initSelectData () {
      this.selectData = {
        'County': '',
        'TradeType': '',
        'RentAvgMin': '',
        'RentAvgMax': '',
        'AreaTotalMin': '',
        'AreaTotalMax': ''
      }
    },
    // delect'市'字
    delectLastWord (name) {
      let city = name.replace('市', '')
      return city
    }
  },
  created () {
    this.setTitle(this.$route.query.type - 0)
    this.cityData.LevelCityName = localStorage.LevelCityName
  }
}
</script>
<style lang="scss" scoped>
  .slide-right-enter, .slide-right-leave-to {
    transform:translate3d(100%,0,0);
  }
  .slide-right-enter-active, .slide-right-leave-active {
    transition: all .3s ease;
  }
</style>
