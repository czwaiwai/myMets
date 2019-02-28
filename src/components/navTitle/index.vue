<template>
  <div class="headerTitle">
    <div class="_content">
      <p class="btn clearfix" @click.stop="goBack" v-show="hasBtn">
        <i class="iconfont icon-fanhui11 icon"></i>
        <span class="name">返回</span>
      </p>
      <p class="title">
        <span>{{title}}</span>
      </p>
      <div class="to-debug" @click="covertDeveloper"></div>
    </div>
  </div>
</template>
<script>
import toDebug from '@/utils/toDebug'
let showConsole = 0
let isConsole = false
export default {
  name: 'navTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    hasBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    covertDeveloper () {
      if (isConsole) {
        return this.$toast('调试工具已经打开')
      }
      clearTimeout(this.timer)
      if (showConsole === 10) {
        this.$toast('调试工具已经打开')
        isConsole = true
        return toDebug()
      } else if (showConsole > 5) {
        this.$toast(`还要${10 - showConsole}歩开启调试工具`)
      }
      showConsole++
      this.timer = setTimeout(() => {
        showConsole = 0
      }, 1500)
    },
    goBack () {
      console.log('this.$route.name', this.$route.name)
      if (this.$route.name === 'meterSearch' && this.$route.query.quick) {
        this.$router.go(-2)
      } else {
        this.$router.go(-1)
      }

      // if (['meeting', 'investmentIndex', 'monitorInspection'].indexOf(this.$route.name) > -1) {
      //   this.$app.back()
      // } else {
      //   this.$router.go(-1)
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
  .to-debug {
    position: absolute;
    width:40px;
    height:40px;
    top:0;
    right:15px;
  }
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
      .btn{
        position: absolute;
        left: .3rem;
        top: 0;
        display: block;
        height: .88rem;
        .icon{
          float: left;
          width: .3rem;
          height: .88rem;
          line-height: .88rem;
          color: #fff;
          text-align: left;
          font-size: .3rem;
        }
        .name{
          float: left;
          font-size: .28rem;
          line-height: .88rem;
          color: #fff;
        }
      }
      .title{
        width: 100vw;
        height: .88rem;
        font-size: .32rem;
        line-height: .88rem;
        text-align: center;
        color: #fff;
        span{
          display: inline-block;
          height: .88rem;
          line-height: .88rem;
          max-width: 60vw;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
