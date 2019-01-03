<template>
  <div class="nonePage" :style="'height:'+height+'%;'">
    <div class="_content">
      <img class="pic" src="../../assets/img/meeting/meeting-wu.png">
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
        width: 2.77rem;
        height: 2.4rem;
        margin: 0 auto;
      }
      .title{
        margin-top: .4rem;
        line-height: 1.5;
        font-size: .3rem;
        color: #999;
        text-align: center;
      }
    }
  }
</style>
