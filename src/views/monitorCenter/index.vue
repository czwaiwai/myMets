<template>
  <div class="page">
    <nav-title title="监控中心"></nav-title>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:0;">
        <a v-show="auth['APP_KFWorkOrder']" @click="$router.forward('/monitor/monitorCustomer')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../../assets/img/tabHome/ic_service_pool.png" alt="" style="width:35px;margin-right:5px;display:block"></div>
          <div class="weui-cell__bd">
              <p>客服工单</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a v-show="auth['APP_WXWorkOrder']" @click="$router.forward('/monitor/monitorRepair')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../../assets/img/tabHome/ic_maintain_pool.png" alt="" style="width:35px;margin-right:5px;display:block"></div>
          <div class="weui-cell__bd">
            <p>维修工单</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a v-show="auth['APP_XBWorkOrder']" @click="$router.forward('/monitor/monitorInspection')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../../assets/img/tabHome/msg_list_icon_inspection.png" alt="" style="width:35px;margin-right:5px;display:block"></div>
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
