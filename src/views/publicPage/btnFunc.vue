<template>
  <div class="page">
    <!-- <mt-header title="请选择功能">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="请选择功能"></nav-title>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:0;">
        <div @click="toCustomerService('baoshi')" class="weui-cell">
          <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">
            <img src="../../assets/img/btnFunc/ic_customer.png" style="width: 50px;display: block">
          </div>
          <div class="weui-cell__bd">
            <p>客服报事</p>
          </div>
        </div>
        <div @click="toCustomerService('baoxiu')" class="weui-cell">
          <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">
            <img src="../../assets/img/btnFunc/ic_maintain_pool.png"  style="width: 50px;display: block">
          </div>
          <div class="weui-cell__bd">
            <p>设备维修</p>
            <!--<p style="font-size: 13px;color: #888888;">系统管理员</p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'btnFunc',
  components: {navTitle},
  data () {
    return {}
  },
  created () {},
  methods: {
    toCustomerService (type) {
      this.$router.push({
        name: 'customerService',
        query: {
          type: type,
          quick: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
