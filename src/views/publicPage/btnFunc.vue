<template>
  <div class="page">
    <nav-title title="请选择功能"></nav-title>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:0;" v-if="status">
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
      <div class="weui-cells" style="margin-top:0;" v-else>
        <div @click.stop="toScanDetail" class="weui-cell">
          <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">
            <img src="../../assets/img/work/ic_work_wx.png" style="width: 50px;display: block">
          </div>
          <div class="weui-cell__bd">
            <p>设备详情</p>
          </div>
        </div>
        <div @click.stop="toMeterSearch" class="weui-cell">
          <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">
            <img src="../../assets/img/work/ic_work_cb.png"  style="width: 50px;display: block">
          </div>
          <div class="weui-cell__bd">
            <p>仪表抄表</p>
            <!--<p style="font-size: 13px;color: #888888;">系统管理员</p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'btnFunc',
  components: {},
  data () {
    return {
      status: true
    }
  },
  created () {
    if (this.$route.query.type) {
      this.status = false
    }
  },
  methods: {
    toCustomerService (type) {
      this.$router.push({
        name: 'customerService',
        query: {
          type: type,
          quick: true
        }
      })
    },
    toScanDetail () {
      this.$router.forward('/scan/ScanDetail/' + encodeURIComponent(this.$route.query.code))
    },
    toMeterSearch () {
      this.$router.push({
        name: 'meterSearch',
        query: {
          key: this.$route.query.code,
          quick: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
