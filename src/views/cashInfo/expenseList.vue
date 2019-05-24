<template>
  <div class="page_modal">
    <div class="page">
      <nav-title title="收款"></nav-title>
      <div class="page_sub_hd padding15-h light_bg weui-flex" style="background: #FFF;">
        <div class="weui-flex__item">
          <i class="iconfont icon-shouye-copy main_color padding-right"></i>{{roomName}}
        </div>
        <div @click="handleChangeMode" class="padding-left15"><i class="iconfont icon-xiangmu1"></i></div>
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
                  <i class="iconfont" style="color: #3395FF;" :class="item.isCheck?'icon-select-copy':'icon-Ellipse'"></i>
                  {{item.repYears || item.ipItemName}}
                </div>
                <div @click="showSubClick(item)">
                  <span style="color: #e40101;">￥{{item.moneyTotal}}</span>
                  <i class="iconfont direct_icon inline-block  icon-shouqi" :class="item.subShow?'icon_up':'icon_down'"></i>
                </div>
              </div>
              <div v-if="item.subShow" style="padding: 10px 15px 10px 30px;color:#999;">
                <ul>
                  <li class="sub_item weui-flex" @click="selectClickSub(sub, item)" :key="index"  v-for="(sub, index) in item.dateData" >
                    <i v-if="payMode===2" class="iconfont padding-right5" style="color: #3395FF;" :class="sub.isCheck?'icon-select-copy':'icon-Ellipse'"></i>
                    <div class="weui-flex__item ">{{sub.ipItemName || sub.repYears}}</div>
                    <div>￥{{sub.priFailures | formatNum}}</div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
      </div>
      <div class="weui-flex padding15-h padding-v light_bg">
        <div @click="isAllClick" class="weui-flex__item">
          <i class="iconfont padding-right5 " style="color: #3395FF;" :class="allCheck?'icon-select-copy':'icon-Ellipse'"></i>全选
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
import { Popup, Actionsheet } from 'mint-ui'
import navTitle from '@/components/navTitle'
import local from '@/utils/local'
export default {
  name: 'customerList',
  components: {
    Popup,
    Actionsheet,
    navTitle
  },
  data () {
    return {
      payMode: 2,
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
      isOrder: false, // false按账期排序, true按项目排序
      actions: []
    }
  },
  created () {
    this.btnTxt = '确定收款'
    this.orgId = this.$parent.orgId
    this.roomName = this.$parent.roomName
    this.personCash = this.$parent.choosePersonCash
    if (this.$route.query.orderBy === '0') {
      this.isOrder = true
    } else {
      this.isOrder = false
    }
    this.handleChangeMode()
    // let list = this.$parent.choosePersonCash.costData.map((item, index) => {
    //   this.$set(item, 'isCheck', true)
    //   this.$set(item, 'subShow', false)
    //   item.dateData.forEach(sub => {
    //     this.$set(sub, 'isCheck', true)
    //   })
    //   return item
    // })
    // if (list && list.length > 0) {
    //   list[0].subShow = true
    // }
    // this.list = list
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
        before += item.dateData.reduce((subBefore, sub) => {
          if (sub.isCheck) {
            subBefore += ((sub.priFailures - 0) + (sub.lfFailures - 0))
          }
          return subBefore
        }, 0)
        return before
      }, 0)
      return Math.round(parseFloat(money * 100)) / 100
    }
  },
  methods: {
    // 更换页面模式
    async handleChangeMode () {
      this.isOrder = !this.isOrder
      let p0 = 'UserAppFn_GetArrearsCost'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        resID: this.$route.params.roomId,
        OrderBy: this.isOrder ? '1' : '0'
      })
      if (res.data) {
        // this.$parent.orderBy = this.isOrder ? '1' : '0'
        local.set('cash_orderby', this.isOrder ? '1' : '0')
        let data = this.$toLower(res.data)
        this.noCash = false
        let arr = data.filter(item => item.cstID === this.$parent.choosePersonCash.cstID)
        if (arr) {
          let list = arr[0].costData.map((item, index) => {
            this.$set(item, 'isCheck', true)
            this.$set(item, 'subShow', false)
            item.dateData.forEach(sub => {
              this.$set(sub, 'isCheck', true)
            })
            return item
          })
          if (list && list.length > 0) {
            list[0].subShow = true
          }
          this.list = list
        }
        // this.userList = data
      } else {
        this.noCash = true
      }
    },
    // .net请求接口
    async getPageDataNet () {
      let p0 = 'UserAppFn_GetTradingWay'
      let res = await this.$xml(p0, {
        OrgID: this.orgId
      })
      this.actions = res.data.reduce((before, item) => {
        let that = this
        // [Pos机刷卡, Pos机扫码]
        let arr = this.$dev ? [] : ['1812031513470001002K', '1812031514190001002K']
        // console.log(item.id, item.name)
        item.method = function () {
          that['payChoose'](item.id, item.name)
        }
        if (!this.$isPos && arr.indexOf(item.id) > -1) {
          return before
        }
        before.push(item)
        return before
      }, [])
    },
    isAllClick () {
      if (this.allCheck) {
        this.list.forEach(item => {
          item.isCheck = false
          item.dateData.forEach(sub => {
            sub.isCheck = false
          })
        })
      } else {
        this.list.forEach(item => {
          item.isCheck = true
          item.dateData.forEach(sub => {
            sub.isCheck = true
          })
        })
      }
    },
    selectClick (item) {
      item.isCheck = !item.isCheck
      if (item.isCheck) {
        item.dateData.forEach(item => {
          item.isCheck = true
        })
      } else {
        item.dateData.forEach(item => {
          item.isCheck = false
        })
      }
    },
    selectClickSub (sub, item) {
      sub.isCheck = !sub.isCheck
      if (item.dateData.every(item => item.isCheck)) {
        item.isCheck = true
      } else {
        item.isCheck = false
      }
    },
    showSubClick (item) {
      item.subShow = !item.subShow
    },
    payUp () {
      if (this.actions.length === 0) {
        return this.$toast('支付方式正在获取中...,请稍后尝试')
      }
      if (this.totalMoney <= 0) {
        return this.$toast('收款金额不能为空')
      }
      this.sheetVisible = true
    },
    // 扫码 java用
    async scanPayByApp () {
      try {
        return await this.$app.scan()
      } catch (err) {
        this.$toast('扫码已取消')
      }
    },
    payChoose (id, name) {
      this.choosePayId = id
      this.choosePayType = name
      this.btnTxt = '确定收款'
      console.log('支付通道:', id, name)
      // 银联pos机扫码
      if (id === '1812031514190001002K') {
        return this.posScan(id, name)
      }
      // 银联pos机刷卡
      if (id === '1812031513470001002K') {
        return this.posCard(id, name)
      }
      // 银联app扫码
      if (id === '1812031506500001002K') {
        return this.appScan(id, name)
      }
      // App威富通扫码
      if (id === '17120409430400010034') {
        return this.appScan(id, name)
      }
      this.payConfirmVisible = true
    },
    getXmlParamList (id, name) {
      let list = []
      this.list.forEach(item => {
        // if (item.isCheck) {
        item.dateData.forEach(sub => {
          if (sub.isCheck) {
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
          }
        })
        // }
      })
      return list
    },
    async prePay (id, name, scan) {
      let params = {
        'Name': name,
        'Id': id,
        'FillPro': this.$parent.memberId,
        'FillProName': this.$parent.userId,
        'AuthCode': scan || '',
        'PrePaidId': '',
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
    async payFormXml (id, name, scan, preId) {
      let params = {
        'Name': name,
        'Id': id,
        'FillPro': this.$parent.memberId,
        'FillProName': this.$parent.userId,
        'AuthCode': scan || '',
        'PrePaidId': preId || '',
        'Syswin': this.getXmlParamList(id, name)
      }
      console.log(params, 'payFormXml提交的参数')
      try {
        this.btnTxt = '写入实收...'
        let p0 = 'UserAppFn_Pay'
        let res = await this.$xml(p0, params)
        let data = this.$toLower(res.data)
        if (data.revID) {
          this.$set(this.$parent.choosePersonCash, 'totalMoney', this.totalMoney)
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
    async payPOSFormXml (id, name, obj, preId) {
      let params = {
        'Name': name,
        'Id': id,
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
          this.$set(this.$parent.choosePersonCash, 'totalMoney', this.totalMoney)
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
        amt: Math.round(this.totalMoney * 100),
        isNeedPrintReceipt: false,
        tradeTyp: 'useScan',
        code: '',
        appId: 'db6ca9faacd34873b2acd5b5633de2b4',
        extOrderNo: '', // 选填）商户流水号
        extBillNo: prePayId // 选填）外部订单号
      }
      try {
        console.log('发送pos机的参数', params)
        let res = await this.$app.posPay(params)
        console.log('pos通刷卡返回的数据', res)
        let data = typeof res === 'string' ? {} : res
        if (typeof res === 'string') {
          data = JSON.parse(res.replace(/("(\{.*\})")/g, '$2'))
        }
        // console.log('pos通刷卡2', data)
        // console.log('is Object', typeof data)
        if (data.transData.resCode === '00' && data.transData.resDesc === '交易成功') {
          return data
        } else {
          if (data.transData) {
            throw new Error(data.transData.resDesc)
          } else {
            throw new Error(JSON.stringify(data))
          }
        }
      } catch (err) {
        // console.log(err, '??----------------------err')
        this.$toast(err.message)
        this.paying = false
        console.warn(err)
      }
    },
    async payYLScan (prePayId) {
      // appid db6ca9faacd34873b2acd5b5633de2b4
      let params = {
        AppName: 'POS 通',
        BizName: '扫一扫',
        amt: Math.round(this.totalMoney * 100),
        isNeedPrintReceipt: false,
        tradeTyp: 'useScan',
        code: '',
        appId: 'db6ca9faacd34873b2acd5b5633de2b4',
        extOrderNo: '', // 选填）商户流水号
        extBillNo: prePayId // 选填）外部订单号
      }
      try {
        console.log('发送pos机的参数', params)
        let res = await this.$app.posPay(params)
        // 如果扫一扫的结果解析不出来
        let data = typeof res === 'string' ? {} : res
        if (typeof res === 'string') {
          data = JSON.parse(res.replace(/("(\{.*\})")/g, '$2'))
        }
        if (data.transData.resCode === '00' && data.transData.resDesc === '交易成功') {
          return data
        } else {
          console.error(data, '交易错误')
          if (data.transData) {
            throw new Error(data.transData.resDesc)
          } else {
            throw new Error(JSON.stringify(data))
          }
        }
      } catch (err) {
        this.$toast(err.message)
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
    // 普通支付
    async normalPay () {
      console.log('普通支付')
      // 锁定下单
      if (this.paying) return
      this.paying = true
      let id = this.choosePayId
      let name = this.choosePayType
      // let prePayId = await this.prePay (id, name)
      // if (!prePayId) return
      // let res = await this.payFormXml (id, name, '', prePayId)
      let res = await this.payFormXml(id, name)
      if (!res) return
      console.log('普通支付 ----end', res)
      this.jumpSucc(res.paidID)
      // this.payForm(this.choosePayId, this.choosePayType, '')
    },
    // app 扫码支付 //通过name区分是支付方式
    async appScan (id, name) {
      // 获取app扫码结果
      let scanRes = await this.scanPayByApp()
      if (!scanRes) return
      console.log(scanRes, '扫描的值')
      // 锁定下单
      if (this.paying) return
      this.paying = true
      // 预下单
      // let prePayId = await this.prePay(id, name)
      // if (!prePayId) return
      // 获取预下单ID 直接发送请求给后台
      // let res = await this.payFormXml(id, name, scanRes, prePayId)
      let res = await this.payFormXml(id, name, scanRes)
      if (!res) return
      console.log('app扫码 ----end', res)
      this.jumpSucc(res.paidID)
    },
    // 银联刷卡流程
    async posCard (id, name) {
      // 锁定下单
      if (this.paying) return
      this.paying = true
      // 预下单
      let prePayId = await this.prePay(id, name)
      if (!prePayId) return
      // 获取域下单ID 调启银联ｐｏｓ机刷卡
      let cardObj = await this.payFlashCard(prePayId)
      console.log(cardObj, '??--')
      if (!cardObj) return
      // 获取刷卡陈工后的结果并通知后台 尝试3次
      let res = await this.updateBackendData(cardObj, prePayId)
      if (!res) return
      console.log('银联刷卡 ----end', res)
      this.jumpSucc(res.paidID)
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
      if (!posObj) return
      // 获取支付成功后的结果通知后台并且尝试3次
      let res = await this.updateBackendData(posObj, prePayId)
      if (!res) return
      console.log('银联扫码 ----end', res)
      this.jumpSucc(res.paidID)
    },
    jumpSucc (id) {
      this.$router.replace({name: 'cashPaySucc',
        params: {
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
  border: 1px solid #3395FF;
  border-radius: 20px;
  height: 36px;
  width: 100px;
  font-size: 16px;
  color: #3395ff;
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
