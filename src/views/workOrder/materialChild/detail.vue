<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header title="材料申请详情">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="材料申请详情"></nav-title>
    <div class="page_bd">
      <div class="light_bg padding15">
        <p><span class="dark_99">单据编号：</span>{{detail.applyCode}}</p>
        <p><span class="dark_99">申 领 人：</span>{{detail.applyUser}}</p>
        <p><span class="dark_99">申领时间：</span>{{detail.applyTime}}</p>
      </div>
      <div class="weui-panel">
        <div class="weui-panel__hd">
          <p class="dark_33 fs15 padding-left" style="border-left:2px solid #3395FF;">材料清单</p>
        </div>
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_small-appmsg">
            <div class="weui-cells">
              <div v-for="(sub,subIndex) in detail.materialList" :key="subIndex" class="weui-cell " href="javascript:;">
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
                  <span  class="inline-block dark_33" style="width:50px;">X{{sub.planNum}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page_ft weui-flex light_bg">
       <div class="padding-h" style="line-height:44px;">
         共{{detail.materialList.length}}钟,{{detail.planAllNum}}件材料
       </div>
       <div class="weui-flex__item text-right padding-right15">
         <p class="dark_33 fs16" style="line-height:44px;">
           合计:<span class="error_color">￥{{detail.planAllPrice  | formatMoney}}</span>
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
      detail: {},
      totalPrice: 0
    }
  },
  created () {
    this.totalPrice = this.$parent.totalPrice
    this.detail = this.$parent.subItem
    console.log(this.detail, 'detail----')
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.prop_bl {
  width:90px;
  display:inline-block;
}
</style>
