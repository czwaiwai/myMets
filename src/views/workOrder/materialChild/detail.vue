<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="材料申请详情">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
      <div class="light_bg padding15">
        <p><span class="dark_99">单据编号：</span>CS2019012118550263703</p>
        <p><span class="dark_99">申 领 人：</span>test1</p>
        <p><span class="dark_99">单据编号：</span>2019/1/21 18:55:02</p>
      </div>
      <div class="weui-panel">
            <div class="weui-panel__hd">
              <p class="dark_33 fs15 padding-left" style="border-left:2px solid #3395FF;">材料清单</p>
            </div>
            <div class="weui-panel__bd">
                <div class="weui-media-box weui-media-box_small-appmsg">
                    <div class="weui-cells">
                        <div class="weui-cell " href="javascript:;">
                            <div class="weui-cell__hd"></div>
                            <div class="weui-cell__bd weui-cell_primary">
                              <p class="fs14">快老夹</p>
                              <p class="fs12 dark_99">
                                <span  class="prop_bl">型号:</span>
                                <span  class="prop_bl">规格:</span>
                              </p>
                            </div>
                            <div class="weui-cell__ft">
                              <span>￥0.00</span>
                              <span>X1</span>
                            </div>
                        </div>
                        <div class="weui-cell " href="javascript:;">
                            <div class="weui-cell__hd"></div>
                            <div class="weui-cell__bd weui-cell_primary">
                              <p class="fs14">快老夹</p>
                              <p class="fs12 dark_99">
                                <span class="prop_bl">型号:</span>
                                <span  class="prop_bl">规格:</span>
                              </p>
                            </div>
                            <div class="weui-cell__ft">
                              <span class="error_color">￥0.00</span>
                              <span  class="inline-block dark_33" style="width:50px;">X1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="page_ft weui-flex light_bg">
       <div class="padding-h" style="line-height:44px;">
         共12钟,12件材料
       </div>
       <div class="weui-flex__item text-right padding-right15">
         <p class="dark_33 fs16" style="line-height:44px;">
           合计:<span class="error_color">￥186</span>
         </p>
       </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'repairDetail',
  data () {
    return {
    }
  },
  created () {
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
