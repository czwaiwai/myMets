<template>
  <div class="page_modal">
    <div class="page picDetail">
      <nav-title title="平面位置图"></nav-title>
      <div class="page_bd _content">
        <img v-if="true" src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1543821465&di=e3ad1277bf7c91696edb3cd5bf3749e5&src=http://imgsrc.baidu.com/imgad/pic/item/0b55b319ebc4b745317003c2c5fc1e178b821579.jpg" class="pic">
        <none-page title="暂无平面位置图~" v-else></none-page>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import nonePage from '../components/nonePage/index.vue'
export default {
  name: 'picDetail',
  components: {navTitle, nonePage}
}
</script>
<style lang="scss" scoped>
  .picDetail{
    ._content{
      .pic{
        display: inline-block;
        width: 100vw;
        height: auto;
      }
    }
  }
</style>
