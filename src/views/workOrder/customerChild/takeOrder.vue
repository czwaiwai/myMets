<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="接单">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
      <div class="weui-cells" style="margin:0;">
        <div class="weui-cell padding15 " href="javascript:;">
            <div class="weui-cell__bd">
              <p class="bold">选择责任人</p>
            </div>
        </div>
        <a class="weui-cell weui-cell_access" href="javascript:;">
            <div class="weui-cell__bd">
              <p>责任人</p>
            </div>
            <div class="weui-cell__ft">必选</div>
        </a>
        <a class="weui-cell weui-cell_access" href="javascript:;">
            <div class="weui-cell__bd">
              <p>辅助责任人</p>
            </div>
            <div class="weui-cell__ft">选填(可多选)</div>
        </a>
      </div>
      <div class="padding15">
        <button class="ins_submit_btn">接单</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'takeOrder',
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

<style lang="scss">

</style>
