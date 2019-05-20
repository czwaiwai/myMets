<template>
  <div class="page">
    <nav-title title="开票二维码预览"></nav-title>
    <div class="page_bd">
      <div class="text-center padding-top15">
        <vue-qrcode  v-if="imgUrl" ref="qrcode" :value="imgUrl" :options="{ width: 200 }"></vue-qrcode>
      </div>
      <div v-if="isPos" class="weui-btn-area">
        <a @click="posPrint" class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">打印发票二维码</a>
      </div>
    </div>
  </div>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
export default {
  name: 'invoice',
  data () {
    return {
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
      console.log(res.data, '-----')
      if (res.data && res.data[0]) {
        // CstID: "Z63024306296271"
        // CstName: "惠寒香"
        // FillDate: "2019/5/20 15:01:46"
        // Location: "车位车位04-CW-001"
        // Pcode: "3f4541db7a2d4171b02f"
        // Totalmoney: 2000
        // Trading: "现金"
        let resData = res.data[0]
        let params = {
          CstID: resData.CstID,
          InvoiceTotalMoney: resData.Totalmoney,
          'Email': '',
          'Remark': '',
          List: []
        }
        resData.AccountData.forEach(item => {
          item.FeeData.forEach(sub => {
            params.List.push({
              'OrgID': orgId,
              'PaidID': PaidId,
              'PaidMoney': sub.Cvsm
            })
          })
        })
        let inRes = await this.$xml('UserCS_ReserveBuildBill', params)
        //         {
        // "UserCS_ReserveBuildBill":
        // [{
        // "status":1,"msg":"成功","Data":{"msgId":"2019052015483977402","resultCode":"SUCCESS","resultMsg":"生成开票二维码成功！","qrCode":"https://mobl-test.chinaums.com/fapiao-portal/pos_issue.do?id=201905202e535eaf04c546879a85825c7b851486&checkCode=8E4B4BF9","qrCodeId":"201905202e535eaf04c546879a85825c7b851486","shortQrCode":"https://mobl-test.chinaums.com/fapiao-portal/ekp/201905202e535eaf04c546879a85825c7b851486/8E4B4BF9","status":"PENDING"}
        // }]
        // }
        if (inRes.data) {
          console.log(inRes.data.Data.qrCode, '----------------------')
          this.imgUrl = inRes.data.Data.qrCode
        }
        console.log(inRes, 'inRes----')
      }
      // this.$xml('UserCS_ReserveBuildBill', {
      //   'CstID': '1306041648590003001J',
      //   'InvoiceTotalMoney': 50,
      //   'Email': '',
      //   'Remark': '',
      //   'List': [{
      //     'OrgID': '11091315263400010000',
      //     'PaidID': '133cba187ac64dcab21d',
      //     'PaidMoney': 50
      //   }]
      // })
    },
    convertImageToBase64 (canvas, imgType = 'png') {
      return canvas.toDataURL('image/' + imgType, 0.5)
    },
    posPrint () {
      let base64 = this.convertImageToBase64(this.$refs.qrcode.$el)
      this.$app.posPrint({
        img: base64,
        type: 'base64' // base64 | url
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
