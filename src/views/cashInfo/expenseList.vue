<template>
  <div class="page_modal">
    <div class="page">
      <mt-header title="收款">
        <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
      </mt-header>
      <div class="page_sub_hd padding15-h light_bg" style="background: #FFF;">
        <i class="iconfont icon-shouye-copy main_color padding-right"></i>{{roomName}}
      </div>
      <div class="page_bd expense_list">
          <div class="weui-cells__title">
            <i class="iconfont icon-yonghu-copy"></i>
            {{personCash.cstName}}
          </div>
          <ul class="cash_list">
            <li v-for="(item, index) in list" :key="index" >
              <div class="title_line weui-flex">
                <div @click="selectClick(item)" class="weui-flex__item">
                  <i class="iconfont" style="color: #0dc88c;" :class="item.isCheck?'icon-select':'icon-Ellipse'"></i>
                  {{item.repYears}}
                </div>
                <div @click="showSubClick(item)">
                  <span style="color: #e40101;">￥{{item.moneyTotal}}</span>
                  <i class="iconfont direct_icon inline-block icon-xiala-copy" :class="item.subShow?'icon_up':'icon_down'"></i>
                </div>
              </div>
              <div v-if="item.subShow" style="padding: 10px 15px 10px 30px;color:#999;">
                <ul>
                  <li class="sub_item weui-flex"  v-for="(sub, index) in item.dateData" >
                    <div class="weui-flex__item">{{sub.ipItemName}}</div>
                    <div>￥{{sub.priFailures}}</div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
      </div>
      <div class="weui-flex padding15-h padding-v light_bg">
        <div @click="isAllClick" class="weui-flex__item">
          <i class="iconfont padding-right5 " style="color: #0dc88c;" :class="allCheck?'icon-select':'icon-Ellipse'"></i>全选
        </div>
        <div style="padding-right: 30px;">合计:<span style="color: #e40101;">￥{{totalMoney | formatMoney}}</span></div>
        <div class="pay_up_btn"  @click="payUp">收款</div>
      </div>
    </div>
    <actionsheet :actions="actions" v-model="sheetVisible"></actionsheet>
    <popup class="pay_confirm_modal" v-model="payConfirmVisible" position="bottom">
      <div class="padding15 ">
        <p class="dark_13 bold text-center padding15" style="font-size:30px;font-weight:bold;">￥{{totalMoney  | formatMoney}}</p>
        <div class="weui-flex">
          <div class="weui-flex__item">收款方式</div>
          <div>{{choosePayType}}</div>
        </div>
      </div>
      <div class="weui-btn-area">
        <button class="weui-btn weui-btn_primary" :disabled="paying" @click="normalPay" >{{btnTxt}}</button>
      </div>
    </popup>
  </div>
</template>
<script>
import { Popup } from 'mint-ui';
import { Actionsheet } from 'mint-ui';
export default {
  name: 'customerList',
  data () {
    return {
      paying: false,
      payConfirmVisible: false,
      choosePayId: '',
      choosePayType: '',
      sheetVisible: false,
      orgId: '',
      roomName: '',
      noCash: '',
      personCash: {},
      btnTxt: '确定收款',
      list: [],
      actions: []
    }
  },
  components: {
    Popup,
    Actionsheet
  },
  created () {
    this.btnTxt = '确定收款'
    this.orgId = this.$parent.orgId
    this.roomName = this.$parent.roomName
    this.personCash =  this.$parent.choosePersonCash
    let list = this.$parent.choosePersonCash.costData.map((item, index) => {
      this.$set(item, 'isCheck', true)
      this.$set(item, 'subShow', false)
      return item
    })
    if (list && list.length > 0) {
      list[0].subShow = true
    }
    this.list = list
    // this.getPageData()
    this.getPageDataNet()
    // console.log(this.personCash, 'this.personCash')
    // this.getPageData()
  },
  computed: {
    allCheck () {
      let num = this.list.reduce((before, item) => {
        if (item.isCheck) {
          before += 1
        }
        return before
      }, 0)
      return num === this.list.length
    },
    totalMoney () {
      let money = this.list.reduce((before, item) => {
        if (item.isCheck) {
          before += item.moneyTotal - 0
        }
        return before
      }, 0)
      return Math.round(parseFloat(money * 100))/100
    }
  },
  methods: {
    // java请求接口
    async getPageData () {
      let url = '/ets/payment/trading/getTradingWay'
      let res = await this.$http.post(url, {
        orgID: this.orgId
      })
      console.log(res)
      this.actions = res.data.map((item, index) => {
        let that = this
        item.method = function () {
          that['payChoose'] (item.id, item.name)
        }
        return item
      })
    },
    // .net请求接口
    async getPageDataNet () {
      let p0 = 'UserAppFn_GetTradingWay'
      let res = await this.$xml(p0, {
        OrgID: this.orgId
      })
      this.actions = res.data.map((item, index) => {
        let that = this
        item.method = function () {
          that['payChoose'] (item.id, item.name)
        }
        return item
      })
      // console.log(data, '-data---||----')
    },
    isAllClick () {
      console.log(this.list)
      if (this.allCheck) {
        this.list.forEach(item => item.isCheck = false)
      } else {
        this.list.forEach(item => item.isCheck = true)
      }
    },
    selectClick (item) {
      item.isCheck = !item.isCheck
    },
    showSubClick (item) {
      item.subShow = !item.subShow
    },
    payUp () {
      if(this.actions.length === 0) {
        return this.$toast('支付方式正在获取中...,请稍后尝试')
      }
      this.sheetVisible = true
    },
    payChoose (id, name) {
      this.choosePayId = id
      this.choosePayType = name
      console.log('支付通道:', id, name)
      if (name === 'app银联扫码') {
        return this.posScan(id, name)
      }
      if (name === 'app刷卡') {
        return this.posCard(id, name)
      }
      if (name === 'app扫码') {
        return this.appScan(id, name)
      }
      this.payConfirmVisible = true
    },
    // 普通支付
    normalPay () {
      this.payFormXml (this.choosePayId, this.choosePayType, '')
      // this.payForm(this.choosePayId, this.choosePayType, '')
    },
    // 扫码支付
    async scanPay (id, name) {
      try {
        let res = await this.$app.scan()
        this.payForm(id, name, res)
      } catch (err) {
        this.$toast('扫码已取消')
      }
    },
    getPayList () {
      let list = []
      this.list.forEach(item => {
        if (item.isCheck) {
          item.dateData.forEach(sub => {
            if (sub.id) {
              list.push({id: sub.id, priFailures: sub.priFailures, lfFailures: sub.lfFailures})
            }
          })
        }
      })
      return list
    },
    // 扫码
    async scanPayByApp () {
      try {
        return await this.$app.scan()
      } catch (err) {
        this.$toast('扫码已取消')
      }
    },
    // 缴费支付
    async payForm (id, name, scan) {
      if (this.paying) return
      this.paying = true
      let params = {
        name: name,
        id: id,
        fillPro: this.$parent.memberId, // 支付用户的memberID
        fillProName: this.$parent.userId, //支付用户的userID
        auth_code: scan, //扫码的结果
        payList: this.getPayList()
      }
      let url = '/ets/payment/order/pay'
      try {
        this.btnTxt = '写入实收...'
        let res = await this.$http.post(url, JSON.stringify(params), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          transformRequest: [function (data) {
            return data
          }]
        })
        if (res.data.fnpaidId !== '') {
          this.$set(this.$parent.choosePersonCash,'totalMoney',this.totalMoney)
          this.paying = false
          this.$router.replace({name: 'cashPaySucc', params: {
              id: res.data.fnpaidId
            }
          })
        } else {
          this.paying = false
          this.btnTxt = '写入实收失败，请重试'
          this.$toast('支付失败')
        }
      } catch (err) {
        this.paying = false
        this.btnTxt = '写入实收失败，请重试'
        this.$toast('支付失败')
      }
    },
    getXmlParamList (id, name) {
      let list = []
      this.list.forEach(item => {
        item.dateData.forEach(sub => {
          list.push({
            RevID: sub.id,
            RevMoney: sub.priFailures,
            LFMoney: sub.lfFailures,
            TradingID: id,
            Trading: name,
            Filldate: sub.repYears,
            RBank: '',
            RAccount: '',
            OrgID: this.orgId
          })
        })
      })
    },
    async prePay (id, name, scan) {
      let params = {
        'Name': name,
        'Id' : id,
        'FillPro': this.$parent.memberId,
        'FillProName': this.$parent.userId,
        'AuthCode': scan,
        'PrePaidId':'',
        'Syswin': this.getXmlParamList(id, name)
      }
      try {
        let p0 = 'UserAppFn_PrePay'
        let res = await this.$xml(p0, params)
        return res.data['PrePayId']
      } catch (err) {
        this.paying = false
        this.$toast('发起支付失败')
      }
    },
    async payFormXml (id, name, scan) {
      if (this.paying) return
      this.paying = true
      let params = {
        'Name': name,
        'Id' : id,
        'FillPro': this.$parent.memberId,
        'FillProName': this.$parent.userId,
        'AuthCode': scan,
        'PrePaidId':'',
        'Syswin': this.getXmlParamList(id, name)
      }
      try {
        this.btnTxt = '写入实收...'
        let p0 = 'UserAppFn_Pay'
        let res = await this.$xml(p0, params)
        let data = this.$toLower(res.data)
        if (data.revID) {
          this.$set(this.$parent.choosePersonCash,'totalMoney',this.totalMoney)
          this.paying = false
          this.$router.replace({name: 'cashPaySucc', params: {
              id: data.revID
            }
          })
        } else {
          this.paying = false
          this.btnTxt = '写入实收失败，请重试'
          this.$toast('支付失败')
        }
      } catch (err) {
        this.paying = false
        this.btnTxt = '写入实收失败，请重试'
        this.$toast('支付失败')
      }
    },
    async payPOSFormXml (id, name, obj, preId) {
      let params = {
        'Name': name,
        'Id' : id,
        'FillPro': this.$parent.memberId,
        'FillProName': this.$parent.userId,
        'AuthCode': '', // pos机不需要扫码的值
        'PrePaidId': preId,
        'TraceNo': obj.traceNo,
        'RefNo': obj.refNo,
        'Syswin': this.getXmlParamList(id, name)
      }
      try {
        this.btnTxt = '写入实收...'
        let p0 = 'UserAppFn_Pay'
        let res = await this.$xml(p0, params)
        let data = this.$toLower(res.data)
        if (data.revID) {
          this.$set(this.$parent.choosePersonCash,'totalMoney',this.totalMoney)
          this.paying = false
          return data
        } else {
          this.paying = false
          this.btnTxt = '写入实收失败，请重试'
          this.$toast('支付失败')
        }
      } catch (err) {
        this.paying = false
        this.btnTxt = '写入实收失败，请重试'
        this.$toast('支付失败')
      }
    },
    async payFlashCard (prePayId) {
      let params = {
        AppName: '银行卡收款',
        BizName: '消费',
        amt: this.totalMoney * 100,
        isNeedPrintReceipt: false,
        tradeTyp: 'useScan',
        code:'',
        extOrderNo: prePayId,  // 选填）商户流水号
        extBillNo: prePayId // 选填）外部订单号
      }
      try {
        let res = await this.$app.posPay(params)
        console.log('pos通刷卡返回的数据', res)
        let data = res
        if (typeof res === 'string') {
          data = res.replace(/("(\{.*\})")/g,'$2')
        }
        console.log('pos通刷卡2', data)
        return data
      } catch (err) {
        this.paying = false
        console.warn(err)
      }
    },
    async payYLScan (prePayId) {
      let params = {
        AppName: 'POS 通',
        BizName: '扫一扫',
        amt: this.totalMoney * 100,
        isNeedPrintReceipt: false,
        tradeTyp: 'useScan',
        code:'',
        extOrderNo: prePayId,  // 选填）商户流水号
        extBillNo: prePayId // 选填）外部订单号
      }
      try {
        let res = await this.$app.posPay(params)
        // 如果扫一扫的结果解析不出来
        let data = res
        if (typeof res === 'string') {
          data = res.replace(/("(\{.*\})")/g,'$2')
        }
        console.log('pos扫一扫2', data)
        return data
      } catch (err) {
        this.paying = false
        console.warn(err)
      }
    },
    // 通知后台更新数据 失败后将重复请求三次
    async updateBackendData (data, prePayId) {
      for (let i = 0; i < 4; i++) {
        try {
          return await this.payPOSFormXml(this.choosePayId, this.choosePayType, data, prePayId)
        } catch (err) {
          console.log(err)
          continue
        }
      }
      this.paying = false
      this.$toast('支付已成功,写入结果异常,请与服务提供商联系')
    },
    // app 扫码支付 //通过name区分是支付方式
    async appScan (id, name) {
      // 获取app扫码结果
      let scanRes = await this.scanPayByApp()
      if (!scanRes) return
      let res = this.payFormXml(id, name, scanRes)
      if (!res) return
      this.jumpSucc(res.RevID)
    },
    // 银联刷卡流程
    async posCard (id, name) {
      // 锁定下单
      if (this.paying) return
      this.paying = true
      // 预下单
      let prePayId = await this.prePay(id, name)
      // 获取域下单ID 调启银联ｐｏｓ机刷卡
      if (!prePayId) return
      let cardObj = await this.payFlashCard(prePayId)
      // 获取刷卡陈工后的结果并通知后台 尝试3次
      let res = await this.updateBackendData(cardObj,prePayId)
      if (!res) return
      this.jumpSucc(res.RevID)
    },
    // 银联扫码流程
    async posScan (id, name) {
      // 锁定下单
      if (this.paying) return
      this.paying = true
      // 预下单
      let prePayId = await this.prePay(id, name)
      // 获取域下单ID 调启银联ｐｏｓ机扫一扫
      if (!prePayId) return
      let posObj = await this.payYLScan(prePayId)
      // 获取支付成功后的结果通知后台　并且尝试3次
      let res = await this.updateBackendData(posObj, prePayId)
      if (!res) return
      this.jumpSucc(res.RevID)
    },
    jumpSucc(id) {
      this.$router.replace({name: 'cashPaySucc', params: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.expense_list {
  .direct_icon {
    transform: rotateZ(0deg);
    transition: transform 0.2s linear;
    &.icon_down {
      transform: rotateZ(180deg);
    }
  }
  .cash_list > li {
    position: relative;
  }
  .cash_list > li:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .cash_list {
    .title_line {

      height:45px;
      line-height:45px;
      background:#FFF;
      padding:0 15px
    }
    .sub_item {
      height:30px;
      line-height:30px;
    }
  }

}
.pay_confirm_modal {
  width:100%;
  height: 202px;
}
.back_btn_plain {
  background: transparent;
  border: 1px solid #0dc88c;
  border-radius: 20px;
  height: 36px;
  width: 100px;
  font-size: 16px;
  color: #0dc88c;
  line-height: 34px;
  margin-top: 10px;
  outline: none;
}
.pay_up_btn{
  width: 70px;
  text-align: center;
  background: #e40101;
  margin: -10px -15px;
  padding: 10px 15px;
  color: #FFF;
}
</style>
