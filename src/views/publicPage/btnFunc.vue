<template>
    <div class="page">
        <mt-header title="请选择功能">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-cells" style="margin-top:0;">
            <div class="weui-cell">
              <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">
                <img src="../../assets/img/btnFunc/ic_customer.png" style="width: 50px;display: block">
              </div>
              <div class="weui-cell__bd">
                <p>客服报事</p>
              </div>
            </div>
            <div class="weui-cell">
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
export default {
  name: 'btnFunc',
  data () {
    return {}
  },
  created () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
