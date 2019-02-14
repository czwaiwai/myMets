<template>
  <div class="page">
    <mt-header  title="我的收款">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
      <!-- <mt-button slot="left" @click="$app.close()" icon="back">返回</mt-button> -->
    </mt-header>
    <div class="page_bd">
      <div class="green_top">
        <p>今日收款</p>
        <p class="big_num">{{cashObj.totalMoney | formatMoney}}</p>
        <p>收款共{{cashObj.totalNumber}}笔</p>
        <a @click="$router.forward('/cashHistory')" class="link_btn float_right" href="javascript:">历史收款 ></a>
      </div>
      <div class="weui-cells " style="margin-top:0;" >
        <div @click="detailClick(item)" v-for="(item, index) in list" :key="index" class="weui-cell">
          <div class="weui-cell__bd">
            <p>{{item.cstName}}</p>
            <p style="font-size: 13px;color: #888888;">{{ item.fillDate | today }}</p>
          </div>
          <div class="weui-cell_ft">
            {{ item.moneyTot  | setPrice}}
          </div>
        </div>
      </div>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
// var oSendParam = {
//   orgID: '11091315263400010000',
//   fillpro: '20',
//   fillDate: '2018-01-19'
// }

// 查询组团楼栋单元资源信息接口
// var getGrpBudHouseInfo = '/ets/payment/grp/getGrpBudHouseInfo';
// 欠费查询接口
// var getArrearsCost = '/ets/payment/house/getArrearsCost';

import {mapGetters} from 'Vuex'
export default {
  name: 'cashInfo',
  data () {
    return {
      cashObj: {
        fillDate: Date.now(),
        totalMoney: 0,
        totalNumber: 0
      },
      payDetailData: null,
      list: []
    }
  },
  created () {
    this.orgId = this.user.OrgID
    this.fillpro = this.user.memberId
    this.today = (new Date()).format('yyyy-MM-dd')
    if (!this.$isPos) {
      this.$app.paymentData().then(res => {
        console.log('payMentData', res)
        this.orgId = res.projectID
        this.fillpro = res.memberID
        this.getPageDataNet()
      }).catch(err => {
        console.log(err)
        this.getPageDataNet()
      })
    } else { // pos机
      this.getPageDataNet()
    }
    // this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    async getPageData () {
      let url = '/ets/payment/fnpaid/getHistoryPay'
      let res = await this.$http.post(url, {
        orgID: this.orgId,
        fillpro: this.fillpro,
        fillDate: this.today
        // 'orgID': this.user.OrgID, // orgId
        // 'fillpro': this.user.memberId, // 员工id
        // 'fillDate': '2018-11-13' // 日期
      })
      let data = res.data
      this.list = data.customerData
      this.cashObj = {
        fillDate: data.fillDate,
        totalMoney: data.totalMoney,
        totalNumber: data.totalNumber
      }
    },
    async getPageDataNet () {
      let p0 = 'UserAppFn_GetHistoryPay'
      let res = await this.$xml(p0, {
        OrgID: this.orgId,
        Fillpro: this.fillpro,
        FillDate: this.today
      })
      let data = this.$toLower(res.data)
      if (data) {
        this.list = data.customerData
        this.cashObj = {
          fillDate: data.fillDate,
          totalMoney: data.totalMoney,
          totalNumber: data.totalNumber
        }
      }
    },
    detailClick (item) {
      this.payDetailData = item
      this.$router.forward({
        name: 'cashPayDetailProp'
      })
      console.log(item)
    }
  }
}
</script>

<style scoped>
  .green_top{
    background:#3395ff;
    color:#FFF;
    text-align:center;
    padding:30px 15px;
  }
  .float_right {
    float:right;
  }
  .link_btn {
    color:#FFF;
  }
  .big_num {
    font-size:32px;
    font-weight: bold;
  }
</style>
