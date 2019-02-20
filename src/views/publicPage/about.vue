<template>
  <div class="page about">
    <!-- <mt-header title="关于">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="关于"></nav-title>
    <div class="page_bd about_wrap">
      <div @click="covertDeveloper" class="text-center" style="padding:20px 0 25px;">
        <img  class="small_logo" src="../../assets/img/publicPage/ic_about_logo.png" >
      </div>
      <div class="weui-form-preview">
        <div class="weui-form-preview__bd">
          <div class="selectItem clearfix noneBb">
            <span class="name">版本名称：</span>
            <span class="value textLeft">M-ETS</span>
          </div>
          <div class="selectItem clearfix noneBb">
            <span class="name">版本：</span>
            <span class="value textLeft">2.3.0</span>
          </div>
          <div class="selectItem clearfix noneBb">
            <span class="name">版权所有：</span>
            <span class="value textLeft">深圳市思源计算机软件股份有限公司</span>
          </div>
          <div class="selectItem clearfix noneBb">
            <span class="name">公司主页：</span>
            <span class="value textLeft">http://www.syswinsoft.com</span>
          </div>
          <div class="selectItem clearfix noneBb">
            <span class="name">服务热线：</span>
            <span class="value textLeft">400-8866-810</span>
          </div>
          <!-- <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">版本名称：</label>
            <span class="weui-form-preview__value">M-ETS</span>
          </div>
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">版本：</label>
            <span class="weui-form-preview__value">2.3.0</span>
          </div>
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">版权所有：</label>
            <span class="weui-form-preview__value">深圳市思源计算机软件股份有限公司</span>
          </div>
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">公司主页：</label>
            <span class="weui-form-preview__value">http://www.syswinsoft.com</span>
          </div>
          <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">服务热线：</label>
            <span class="weui-form-preview__value">400-8866-810</span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import toDebug from '@/utils/toDebug'
import navTitle from '@/components/navTitle'
let showConsole = 0
let isConsole = false
export default {
  name: 'about',
  components: {navTitle},
  data () {
    return {
      showConsole: 0,
      timer: 0
    }
  },
  created () {
  },
  methods: {
    covertDeveloper () {
      if (isConsole) {
        return this.$toast('调试工具已经打开')
      }
      clearTimeout(this.timer)
      if (showConsole === 6) {
        this.$toast('调试工具已经打开')
        isConsole = true
        return toDebug()
      } else if (showConsole > 2) {
        this.$toast(`还要${6 - showConsole}歩开启调试工具`)
      }
      showConsole++
      this.timer = setTimeout(() => {
        showConsole = 0
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.small_logo {
  height: 5vw;
}
.about_wrap .weui-form-preview__value{
  text-align: left;
  color:#131313;
}
.about{
  .selectItem{
    .name {
      width: 1.6rem;
    }
    .value{
      width: 5.2rem;
    }
  }
}
</style>
