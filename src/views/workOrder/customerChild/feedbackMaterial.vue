<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header title="材料申请详情">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="材料申请详情"></nav-title>
    <div class="page_bd">
      <div class="weui-panel">
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_small-appmsg">
            <div class="weui-cells">
              <div v-for="(sub,subIndex) in list" :key="subIndex" class="weui-cell " href="javascript:;">
                <div class="weui-cell__hd"></div>
                <div class="weui-cell__bd weui-cell_primary">
                  <p class="fs14">{{sub.materialName}}</p>
                  <p class="fs12 dark_99">
                    <span class="prop_bl">型号: {{sub.smodels}}</span>
                    <span  class="prop_bl">规格: {{sub.specification}}</span>
                  </p>
                </div>
                <div class="weui-cell__ft fs14">
                  <span class="error_color">￥{{sub.price | formatMoney}}</span>
                  <span  class="inline-block dark_33" style="width:50px;">X{{sub.actualNum}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page_ft weui-flex light_bg">
       <div class="padding-h" style="line-height:44px;">
         共{{list.length}}种,{{numAll}}件材料
       </div>
       <div class="weui-flex__item text-right padding-right15">
         <p class="dark_33 fs16" style="line-height:44px;">
           合计:<span class="error_color">￥{{totalPrice  | formatMoney}}</span>
         </p>
       </div>
    </div>
  </div>
</div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'repairDetail',
  components: {navTitle},
  data () {
    return {
      detail: {materialList: []},
      list: []
      // totalPrice: 0
    }
  },
  created () {
    this.work = this.$parent.work
    this.getPageData()
  },
  computed: {
    // 材料数
    numAll () {
      return this.list.reduce((before, item) => before + (item.actualNum - 0), 0)
    },
    // 总价
    totalPrice () {
      return this.list.reduce((before, item) => before + ((item.price - 0) * (item.actualNum - 0)), 0)
    }
  },
  methods: {
    async getPageData () {
      let p0 = 'UserCS_GetClaimsInfoH5'
      let params = {OrgID: this.work.OrgID, WordQuertionID: this.work.WorkQuestionID}
      let res = await this.$xml(p0, params)
      // let params = {orgID: this.work.OrgID, wordQuertionID: this.work.WorkQuestionID}
      // let url = '/ets/table/list/userCSGetClaimsInfoH5'
      // let res = await this.$http.post(url, params)
      if (res.data && res.data[0]) {
        this.list = this.$toLower(res.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.prop_bl {
  width:90px;
  display:inline-block;
}
</style>
