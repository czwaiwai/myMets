<template>
  <div class="page">
    <nav-title title="监控中心"></nav-title>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:0;">
        <a v-show="auth['APP_KFWorkOrder']" @click="$router.forward('/monitor/monitorCustomer')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd">
            <!-- <img src="../../assets/img/tabHome/ic_service_pool.png" alt="" style="width:35px;margin-right:5px;display:block"> -->
            <div style="position: relative;margin-right: 10px; background-color: #2D93E9;width:35px;height:35px;border-radius: 100px;padding: 11% 0;color: #fff;text-align: center;">
              <i class="iconfont icon-kefuzhongxin" style="font-size: 19px;"></i>
            </div>
          </div>
          <div class="weui-cell__bd" >
              <p>客服工单</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a v-show="auth['APP_WXWorkOrder']" @click="$router.forward('/monitor/monitorRepair')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd">
            <!-- <img src="../../assets/img/tabHome/ic_maintain_pool.png" alt="" style="width:35px;margin-right:5px;display:block"> -->
            <div style="position: relative;margin-right: 10px; background-color: #F85A59;width:35px;height:35px;border-radius: 100px;padding: 11% 0;color: #fff;text-align: center;">
              <i class="iconfont icon-weixiu" style="font-size: 19px;"></i>
            </div>
          </div>
          <div class="weui-cell__bd">
            <p>维修工单</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a v-show="auth['APP_XBWorkOrder']" @click="$router.forward('/monitor/monitorInspection')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd">
            <!-- <img src="../../assets/img/tabHome/msg_list_icon_inspection.png" alt="" style="width:35px;margin-right:5px;display:block"> -->
            <div style="position: relative;margin-right: 10px; background-color: #02BD9B;width:35px;height:35px;border-radius: 100px;padding: 11% 0;color: #fff;text-align: center;">
              <i class="iconfont  icon-xunjian1" style="font-size: 19px;"></i>
            </div>
          </div>
          <div class="weui-cell__bd">
            <p>巡保工单</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
    </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'monitorCenter',
  components: {},
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      'auth': 'auth'
    })
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang="scss">

</style>
