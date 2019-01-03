<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <header-top></header-top>
    <select-types></select-types>
    <div class="page_bd investmentList">
      <items></items>
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
import selectTypes from './children/selectTypes'
import headerTop from './children/headerTop'
import items from './children/items'
export default {
  name: 'investmentList',
  components: {navTitle, selectTypes, headerTop, items},
  data () {
    return {
      title: ''
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
    }
  },
  created () {
    this.setTitle(this.$route.query.type - 0)
  }
}
</script>
<style lang="scss" scoped>
  .investmentList{}
</style>
