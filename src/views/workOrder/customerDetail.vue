<template>
  <div class="page_modal">
    <div class="page">
        <mt-header title="巡检详情">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">

          <div @click="routeTracking" class="light_bg padding-v padding15-h margin-bottom">
            <p><span class="dark_99">工 单 号：</span><span>{{work.WorkOrdNo}}</span></p>
            <p><span class="dark_99">开始日期：</span><span>{{work.PlanStartTime}}</span></p>
            <p><span class="dark_99">负 责 人：</span><span>{{work.Principal}}</span></p>
          </div>
          <div class="light_bg">
            <ul>
              <li v-for="(item, index) in list" :key="index">
                <div class="weui-flex padding15-h padding-v">
                  <div class="weui-flex__item">
                    <p>{{item.EquiName}}</p>
                    <p class="dark_99 fs13"><i class="iconfont icon-weizhi-tianchong"></i>{{item.InstallationSite}}</p>
                  </div>
                  <div>
                    <button @click="toPhoto">拍照</button>
                  </div>
                  <div class="ft">
                    <i class="iconfont  icon-shouqi"></i>
                  </div>
                </div>
                <div></div>
              </li>
            </ul>
          </div>

        </div>
        <transition name="page">
          <router-view/>
        </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'inspectionDetail',
  data () {
    return {
      work: {},
      list: []
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let res = await this.$http.post('/ets/table/list/equipBaseGetInspectionEquipmentH5', {
        projId: this.nav.orgId,
        workID: this.work.WorkID,
        caseID: this.work.CaseID,
        isCase: this.work.IsCase
      })
      this.list = res.data
      console.log(res)
    },
    routeTracking () {
      this.$router.push({path: this.$route.path + '/customerTracking'})
    }
  }
}
</script>

<style lang="scss">

</style>
