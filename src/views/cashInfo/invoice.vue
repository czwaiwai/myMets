<template>
<div class="page_modal">
  <div class="page">
    <nav-title title="开票二维码预览"></nav-title>
    <div class="page_bd">
      <div class="text-center padding-top15">
        <div style="display:none;">
          <vue-qrcode  v-if="imgUrl" ref="qrcode" :value="imgUrl" :options="{ width: 200 }"></vue-qrcode>
        </div>
        <canvas ref="invoice" style="width:220px;height:350px;"></canvas>
      </div>
      <div v-if="isLoad && $isPos" class="weui-btn-area">
        <a @click="posPrint" class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">打印发票二维码</a>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
export default {
  name: 'invoice',
  data () {
    return {
      isLoad: false,
      imgUrl: ''
    }
  },
  components: {
    VueQrcode
  },
  created () {
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let PaidId = this.$route.params.id
      let orgId = this.$route.params.orgId
      let res = await this.$xml('UserAppFn_GetFeeSingle', {
        PaidId: PaidId
      })
      if (res.data && res.data[0]) {
        let resData = res.data[0]
        let params = {
          CstID: resData.CstID,
          InvoiceTotalMoney: Vue.filter('formatNum')(resData.Totalmoney),
          'Email': '',
          'Remark': '',
          List: []
        }
        resData.AccountData.forEach(item => {
          item.FeeData.forEach(sub => {
            params.List.push({
              'OrgID': orgId,
              'PaidID': PaidId,
              'PaidMoney': Vue.filter('formatNum')(sub.Cvsm)
            })
          })
        })
        // this.imgUrl = 'https://mobl-test.chinaums.com/fapiao-portal/pos_issue.do?id=20190518ae91b18c79cc463789786d1b9ab1fcc1&checkCode=544D80E4'
        // // this.imgUrl = inRes.data.Data.qrCode
        // this.setCanvas()
        let inRes = await this.$xml('UserCS_ReserveBuildBill', params)
        if (inRes.data) {
          this.isLoad = true
          console.log(inRes.data.Data.qrCode, '----------------------')
          this.imgUrl = inRes.data.Data.qrCode
          this.setCanvas()
        }
      }
    },
    setCanvas () {
      this.$nextTick(() => {
        let canvas = this.$refs.invoice
        canvas.setAttribute('width', 200)
        canvas.setAttribute('height', 350)
        console.log(canvas)
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, 300, 400)
        let y = 10
        let center = 200 / 2
        ctx.font = '12px serif'
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.fillText('电子发票', center, 30)
        ctx.textAlign = 'left'
        ctx.fillText('二维码有效期为一个月', 0, y + 50)
        ctx.fillText('使用微信或支付宝扫描以下二维码', 0, y + 70)
        ctx.drawImage(this.$refs.qrcode.$el, 0, y + 75, 200, 200)
        ctx.textAlign = 'center'
        ctx.fillText('收银小票是获取电子发票的唯一凭证', center, y + 285)
        ctx.fillText('请妥善保管', center, y + 305)
        ctx.fillText('开票时间:' + new Date().format('yyyy-MM-dd'), center, y + 325)
      })
    },
    convertImageToBase64 (canvas, imgType = 'png') {
      return canvas.toDataURL('image/' + imgType, 0.9)
    },
    posPrint () {
      let base64 = this.convertImageToBase64(this.$refs.invoice)
      this.$app.posPrint({
        img: base64,
        type: 'base64' // base64 | url
      }).then(res => {
        if (res.resultCode === 0) {
          this.$toast('打印成功!')
        } else {
          this.$toast('打印发票二维码失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
