<template>
  <div class="page report">
    <div class="page_hd">
      <nav-title :title="$route.meta && $route.meta.title"></nav-title>
    </div>
    <div class="page_bd">
      <div class="report-area"><div class="iconarea"></div><span>{{currentItem.GrpName}}</span></div>
      <mt-tab-container>
        <mt-tab-container-item>
         <div class="padding15">
            <div  v-show="item.show" @click="routeTo(item)" v-for="(item, index) in leftList" :key="index" class="weui-flex flex_center padding15 margin-bottom" style="border-radius:5px;height:80px;background:#FFF;">
              <div class="weui-flex__item item_center">
                <p>
                  <span class="icon_wrap"  :style="'background:'+ item.color"><i class="iconfont" :class="item.icon"></i></span>
                  <span class="padding-left main_text">{{item.name}}</span>
                </p>
              </div>
              <div v-for="(sub,subIndex) in item.value" :key="subIndex" class="right_text_item flex_center item_center " >
                <p class="num_text text-center"><span :style="sub.color?'color:'+sub.color:''">{{sub.value}}</span><span v-html="sub.unit"></span></p>
                <p class="sub_text text-center">{{sub.name}}</p>
              </div>
            </div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import qs from 'qs'
import navTitle from '@/components/navTitle'
import {Navbar, TabItem, TabContainer, TabContainerItem} from 'mint-ui'
export default {
  name: 'tabReport',
  components: {navTitle, MtNavbar: Navbar, MtTabItem: TabItem, MtTabContainer: TabContainer, MtTabContainerItem: TabContainerItem},
  data () {
    return {
      hasBtn: false,
      currRand: 0,
      currentItem: {},
      leftList: []
    }
  },
  created () {
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.nav = {
      orgId: searchObj.projectID || this.user.OrgID,
      orgName: searchObj.projectName || this.user.OrgName,
      userId: searchObj.UserId || this.user.UserID,
      positionId: searchObj.PositionId || this.user.PositionID
    }
    if (localStorage.AreaSelectGrpItem) {
      this.currentItem = JSON.parse(localStorage.AreaSelectGrpItem)
    }
    this.getPageData()
  },
  activated () {
    console.log(this.user, 'user')
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      this.nav = {
        orgId: this.user.OrgID,
        orgName: this.user.OrgName,
        userId: this.user.UserID,
        positionId: this.user.PositionID
      }
      this.getPageData && this.getPageData()
      this.currRand = this.rand
    } else {
      this.currRand = this.rand
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'rand': 'rand',
      'auth': 'auth'
    })
  },
  methods: {
    async getPageData () {
      try {
        let res = await this.getReportAuth()
        if (!res) {
          return
        }
        let arr = await this.leftbottomInfo()// await Promise.all([this.rightInfo(), this.leftTopInfo(), this.leftbottomInfo()])
        console.log(arr, 'getPageData')
        let leftValues = arr
        this.leftList.forEach((item, index) => {
          item.value = leftValues[index]
        })
        localStorage.leftList = JSON.stringify(this.leftList)
      } catch (err) {
        this.leftList = localStorage.leftList ? JSON.parse(localStorage.leftList) : []
      }
    },
    routeTo (item) {
      this.$router.forward({name: item.urlName})
    },
    // 获取报表权限
    async getReportAuth () {
      let p7 = {
        UserId: this.nav.userId || this.user.UserID,
        PositionId: this.nav.positionId || this.user.PositionID
      }
      console.log(p7)
      let res = await this.$xml('UserSL_ReportRight', p7)
      console.log(res, 'getReportAuth')
      if (!res.data) return
      let resData = res.data.ReportRight
      let leftArr = [
        // {name: '建筑面积', urlName: 'report_building', color: '#41BFE9', icon: 'icon-jianzhu', auth: 'SL_APP_ReportBudArea', value: []},
        // {name: '收入分析', urlName: 'report_income', color: '#FA7466', icon: 'icon-shouru', auth: 'SL_APP_ReportFee', value: []},
        // {name: '租赁分析', urlName: 'report_rent', color: '#0DC8BD', icon: 'icon-zulinhetong-', auth: 'SL_APP_ReportRent', value: []},
        // {name: '特色园分析', urlName: 'report_features', color: '#FCB546', icon: 'icon-fenxi', auth: 'SL_APP_ReportTSY', value: []},
        // {name: '租金', urlName: 'report_rentCash', color: '#41BFE9', icon: 'icon-shoukuan', auth: 'JLT_APP_ReportRentReprises', value: []},
        // {name: '出租率', urlName: 'report_rentRate', color: '#FA7466', icon: 'icon-chuzu', auth: 'JLT_APP_ReportRentRentalRate', value: []},
        {name: '合同统计', urlName: 'report_agreement', color: '#46A9FC', icon: 'icon-tubiaozhizuomoban_fuzhi', auth: 'DQ_APP_ContractStatistics', value: []},
        {name: '租赁统计', urlName: 'report_countLease', color: '#FA8A2C', icon: 'icon-zu', auth: 'DQ_APP_LeasingStatistics', value: []},
        {name: '权证统计', urlName: 'report_warrant', color: '#3395ff', icon: 'icon-hetong', auth: 'DQ_APP_WarrantStatistics', value: []}
      ]
      leftArr.forEach(item => {
        item.show = resData.some(sub => sub.Content === item.auth)
      })
      if (this.auth['APP_Rectification']) {
        leftArr.push({name: '整改比对', urlName: 'compared_comparedBuild', color: '#FC7676', icon: 'icon-copy', auth: '', show: true, value: []})
      }
      // console.log(leftArr, '-------------------')
      if (leftArr.some(item => item.show)) {
        this.leftList = leftArr
      } else {
        this.leftList = []
      }
      return true
    },
    formatInt (numStr) {
      if (numStr) {
        return parseInt(numStr)
      } else {
        return '0'
      }
    },
    formatNum (numStr) {
      if (numStr) {
        return (numStr - 0).toFixed(2)
      } else {
        return '0.00'
      }
    },
    // 左侧下方的内容
    async leftbottomInfo () {
      let resArr = await Promise.all([this.$xml('UserCS_ReportLeaseSituation', {
        OrgID: this.nav.orgId || this.user.OrgID,
        Etime: (new Date()).format('yyyy-MM-dd')
      }), this.$xml('UserCS_ReportGrpStatistics', {
        Etime: (new Date()).format('yyyy-MM')
      })])
      // let res = resArr[0]
      let obj = resArr[1].data[0]
      // let data = res.data.pop()
      let values = [
        // [{name: '实际租金', value: this.formatNum(data.ZJmoney)}, {name: '目标租金', value: this.formatNum(data.MSR)}],
        // [{name: '实际出租率', color: '#FA4E2C', value: this.formatNum(data.CZL), unit: '%'}, {name: '目标出租率', color: '#FA4E2C', value: this.formatNum(data.MCZL), unit: '%'}],
        [{name: '合同数量', value: obj.ContractCount, color: '#FA4E2C', unit: '<span class="unit_text">份</span>'}],
        [{name: '已租面积', value: this.formatNum(obj.LeasingCount), unit: '<span class="unit_text">㎡</span>'}],
        [{name: '权证数量', value: obj.TotalCount, color: '#FA4E2C', unit: '<span class="unit_text">个</span>'}]
      ]
      return values
    }
  }
}
</script>
<style lang="scss">
.unit_text {
  font-size:.28rem;
  color:#999;
}
.report .mint-navbar .mint-tab-item {
  padding:0;
}
.report .mint-navbar .mint-tab-item-label {
  height:50px;
  line-height:50px;
}
</style>
<style lang="scss" scoped>
.mint-navbar .mint-tab-item.is-selected{
  border-bottom:none;
}
.sub_text {
  color: #999;
  font-size: 0.3rem;
}
.main_text {
  color:#333;
  font-size:.34rem;
}
.num_text {
  color:#FA8A2C;
  font-size: 0.34rem;
}
.icon_wrap {
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  display: inline-block;
  text-align: center;
  color: #FFF;
  font-size: 0.5rem;
  border-radius: 100%;
  & i {
    font-size:.5rem;
  }
}
.right_text_item + .right_text_item {
  padding-left:10px
}
.report-area{
    // margin-left: 10px;
    padding-left: 10px;
    padding-top: 10px;
    width: 100%;
    >div{
      float: left;
      width:8px;
      margin-top: 3px;
      margin-left: 5px;
    }
    .iconarea::before{
      content: " ";
      display: inline-block;
      height: 15px;
      width: 3px;
      //border: 2px;
      //border-color: #C8C8CD;
      // border-style: solid;
      background-color: #46A9FC;
      /* top: 50%; */
      margin-top: 1px;
      right: 2px;
      position: absolute;
      left: 15px;
    }
    >span{
      // width:120px;
      color: #000000;
      font-size: 15px;
    }
}
</style>
