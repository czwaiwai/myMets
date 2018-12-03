<template>
    <div class="page">
        <mt-header title="关于">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd about_wrap">
          <div class="text-center" style="padding:20px 0 25px;">
            <img  class="small_logo" src="../../assets/img/publicPage/ic_about_logo.png" >
          </div>
          <div class="weui-form-preview">
            <div class="weui-form-preview__bd">
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">版本名称</label>
                <span class="weui-form-preview__value">M-ETS</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">版本</label>
                <span class="weui-form-preview__value">2.3.0</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">版权所有</label>
                <span class="weui-form-preview__value">深圳市思源计算机软件股份有限公司</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">公司主页</label>
                <span class="weui-form-preview__value">http://www.syswinsoft.com</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">服务热线</label>
                <span class="weui-form-preview__value">400-8866-810</span>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'about',
  data () {
    return {}
  },
  created () {
  },
  methods: {}
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
</style>
