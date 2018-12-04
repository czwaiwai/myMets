<template>
    <div class="page">
        <mt-header title="cash">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell ">
              <div class="weui-cell__hd">
                <label class="weui-label">appName</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" v-model="formObj.AppName" type="text" placeholder="">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd"><label for="" class="weui-label">BizName</label></div>
              <div class="weui-cell__bd">
                <input class="weui-input" v-model="formObj.BizName"  type="text" value="">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd"><label for="" class="weui-label">amt</label></div>
              <div class="weui-cell__bd">
                <input class="weui-input" v-model="formObj.amt"  type="text"  placeholder="金额" value="">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd"><label for="" class="weui-label">isNeedPrintReceipt</label></div>
              <div class="weui-cell__bd">
                <input class="weui-input" v-model="formObj.isNeedPrintReceipt"  type="text"  placeholder="是否需要接收打印" value="">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd"><label for="" class="weui-label">tradeTyp</label></div>
              <div class="weui-cell__bd">
                <input class="weui-input" v-model="formObj.tradeTyp"  type="text"  placeholder="使用参数" value="">
              </div>
            </div>

          </div>
          <div class="weui-btn-area">
            <a class="weui-btn weui-btn_primary" @click="submit" href="javascript:" id="showTooltips">收款</a>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'cash',
  data () {
    return {
      formObj: {
        AppName: 'POS 通',
        BizName: '扫一扫',
        amt: 1,
        isNeedPrintReceipt: false,
        tradeTyp: 'useScan',
        code: ''
      }
    }
  },
  created () {},
  methods: {
    submit () {
      this.$app.posPay(this.formObj).then(res => {
        alert('打印的结果' + JSON.stringify(res))
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
