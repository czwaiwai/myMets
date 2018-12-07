<template>
  <div class="headerTitle">
    <div class="_content">
      <i class="iconfont icon-fanhui11 icon" @click.stop="$router.go(-1)"></i>
      <p class="title">{{title}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'headerTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .headerTitle{
    position: relative;
    height: .88rem;
    width: 100vw;
    background: #303642;
    ._content{
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
        font-size: .4rem;
      }
      .title{
        width: 100vw;
        height: .88rem;
        font-size: .34rem;
        line-height: .88rem;
        text-align: center;
        color: #fff;
      }
    }
  }
</style>
