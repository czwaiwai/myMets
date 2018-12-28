<template>
  <div class="headerTitle">
    <div class="_content">
      <i class="iconfont icon-fanhui1 icon" @click.stop="goBack"></i>
      <p class="title">
        <span>{{title}}</span>
      </p>
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
  },
  methods: {
    goBack () {
      this.$router.go(-1)
      // if (this.$route.name === 'meeting') {
      //   this.$app.back()
      // } else {
      //   this.$router.go(-1)
      // }
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
  }
</style>
