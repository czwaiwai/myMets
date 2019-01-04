<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <header-top v-model="isMap"></header-top>
    <select-types @selectData="setSelectData"></select-types>
    <div class="page_bd investmentList">
      <transition name="slide-bottom">
        <items v-if="!isMap"></items>
        <baidu-map v-else></baidu-map>
      </transition>
      <!-- <transition name="slide-bottom">

      </transition> -->
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
      isMap: false
    }
  },
  methods: {
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
    }
  },
  created () {
    this.setTitle(this.$route.query.type - 0)
  }
}
</script>
<style lang="scss" scoped>
  .investmentList{}
  .slide-top-enter, .slide-top-leave-to {
    opacity: 0;
    transform:translate3d(0,100%,0);
  }
  .slide-top-enter-active, .slide-top-leave-active {
    transition: all .3s ease;
  }
  .slide-top-enter-to, .slide-top-leave {
    opacity: 1;
    transform:translate3d(0,0,0);
  }

  .slide-bottom-enter, .slide-bottom-leave-to {
    opacity: 0;
    transform:translate3d(0,-100%,0);
  }
  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: all .3s ease;
  }
  .slide-bottom-enter-to, .slide-bottom-leave {
    opacity: 1;
    transform:translate3d(0,0,0);
  }
</style>
