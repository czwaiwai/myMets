<template>
  <div class="nonePage" :style="'height:'+height+'%;'">
    <div class="_content">
      <!-- <img class="pic" src="../../../../assets/img/meeting/meeting-wu.png"> -->
      <p class="pic">
        <i class="iconfont icon-zanwushuju icon"></i>
      </p>
      <p class="title">{{title}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'nonePage',
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '100'
    }
  }
}
</script>
<style lang="scss" scoped>
  .nonePage{
    position: relative;
    width: 100%;
    overflow: hidden;
    ._content{
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 11;
      white-space:nowrap;
      transform: translate(-50%,-60%);
      .pic{
        width: 4rem;
        height: 2.2rem;
        margin: 0 auto;
        .icon{
          display: block;
          width: 4rem;
          height: 2.2rem;
          margin: 0 auto;
          font-size: 1.6rem;
          text-align: center;
          color: #999;
          line-height: 2.2rem;
        }
      }
      .title{
        line-height: 1.5;
        font-size: .3rem;
        color: #999;
        text-align: center;
      }
    }
  }
</style>
