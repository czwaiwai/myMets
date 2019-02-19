<template>
  <div class="page">
    <!-- <mt-header  title="历史收款">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="历史收款"></nav-title>
    <div class="page_bd">
      <div class="green_top">
        <div class="green_bl text-center">
          <div><button class="date_btn " @click="dateClick">
            <span class="padding-right5 ">{{yesterday}}</span>
            <span class="direct_bottom main_color"> > </span></button></div>
          <div v-show="!noData">
            <p class="big_num">{{cashObj.totalMoney | formatMoney}} <small>元</small></p>
            <p class="dark_99">共{{cashObj.totalNumber}}笔</p>
          </div>
          <div v-if="noData" class="padding-top15" style="height:30vw;">
            <img src="../../assets/img/publicPage/no-data_1.png" style="height: 80%;">
            <p>这一天无数据</p>
          </div>
        </div>
      </div>
      <div v-show="!noData" class="weui-cells " style="margin-top:0;    padding-top: 5vw;" >
        <div @click="detailClick(item)" v-for="(item,index) in list" :key="index" class="weui-cell">
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
    <datetime-picker ref="picker" type="date" v-model="date"
      @confirm="dateConfirm"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </datetime-picker>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import { DatetimePicker } from 'mint-ui'
import navTitle from '@/components/navTitle'
export default {
  name: 'cashHistory',
  components: {DatetimePicker, navTitle},
  data () {
    return {
      date: '',
      yesterday: '',
      noData: true,
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
    this.date = this.getYesterday()
    this.yesterday = this.getYesterday()
    if (!this.$isPos) {
      this.$app.paymentData().then(res => {
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
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    // async getPageData () {
    //   let url = '/ets/payment/fnpaid/getHistoryPay'
    //   let res = await this.$http.post(url, {
    //     orgID: this.orgId,
    //     fillpro: this.fillpro,
    //     fillDate: this.yesterday
    //     // 'orgID': this.user.OrgID, // orgId
    //     // 'fillpro': this.user.memberId, // 员工id
    //     // 'fillDate': '2018-11-13' // 日期
    //   })
    //   let data = res.data
    //   if (data) {
    //     this.list = data.customerData
    //     this.cashObj = {
    //       fillDate: data.fillDate,
    //       totalMoney: data.totalMoney,
    //       totalNumber: data.totalNumber
    //     }
    //     this.noData = false
    //   } else {
    //     this.noData = true
    //   }
    // },
    async getPageDataNet () {
      let p0 = 'UserAppFn_GetHistoryPay'
      let res = await this.$xml(p0, {
        OrgID: this.orgId,
        Fillpro: this.fillpro,
        FillDate: this.yesterday
      })
      let data = this.$toLower(res.data)
      if (data) {
        this.list = data.customerData
        this.cashObj = {
          fillDate: data.fillDate,
          totalMoney: data.totalMoney,
          totalNumber: data.totalNumber
        }
        this.noData = false
      } else {
        this.noData = true
      }
    },
    detailClick (item) {
      this.payDetailData = item
      this.$router.forward({
        name: 'cashPayDetailHis'
      })
    },
    dateClick () {
      this.$refs.picker.open()
    },
    dateConfirm (date) {
      console.log(date)
      this.yesterday = this.formatDate(date.valueOf())
      this.getPageDataNet()
    },
    getYesterday () {
      let date = new Date()
      date.setDate(date.getDate() - 1)
      return this.formatDate(date.valueOf())
    },
    formatDate (time) {
      time = new Date(parseInt(time))
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var day = time.getDate()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      time = year + '-' + month + '-' + day
      return time
    }
  }
}
</script>

<style lang="scss" scoped>
  .green_top{
    background:#3395ff;
    text-align:center;
    padding: 20px 15px;
    height: 30vw;
    & .green_bl {
      min-height: 100px;
      background: #FFF;
      border-radius: 10px;
      box-shadow: 0px 0px 6px rgba(51, 51, 51, 0.48);
      z-index: 4;
      position: relative;
      padding:10px;
      .big_num {
        font-size:24px;
        font-weight: bold;
      }
      .weui-cell_access {
        -webkit-tap-highlight-color: #FFF;
      }
      .date_btn {
        outline:none;
        border:none;
        background: transparent;
        color: #131313;
      }
      .direct_bottom{
        transform: rotateZ(90deg);
        display: inline-block;
        font-size: 18px;
        line-height: 20px;
        vertical-align: middle;
      }
    }
  }
</style>
