<template>
  <div class="page report">
    <div class="page_hd">
      <mt-header   :title="$route.meta && $route.meta.title"></mt-header>
    </div>
    <div v-if="!singleMode" class="page_sub_hd" style="height:50px;line-height:50px;">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1"><span style="font-size:16px;"><i class="iconfont icon-loudong" style="margin-top: -2px;display: inline-block;font-size:32px;vertical-align: middle;"></i><span style="vertical-align: middle;">集团统计</span></span></mt-tab-item>
        <mt-tab-item id="2"><span style="font-size:16px;"><i class="iconfont icon-loudong01" style="font-size:32px;vertical-align: middle;"></i><span style="vertical-align: middle;">单个项目统计</span></span></mt-tab-item>
      </mt-navbar>
    </div>
    <div class="page_bd">
      <div v-if="singleMode">
        <div class="relative">
          <img src="../assets/img/report/index_bg.png" style="width:100%;" >
          <div class="weui-flex padding15" style="width:100%;position:absolute;bottom:0;color:#FFF;">
            <div class="weui-flex__item fs16">{{nav.orgName}}</div>
            <div class="fs16">{{(new Date()).format('yyyy-MM')}}</div>
          </div>
        </div>
        <div class="padding15">
          <div v-show="item.show" @click="routeTo(item)" v-for="(item, index) in rightList" :key="index" class="weui-flex flex_center padding15 margin-bottom" style="border-radius:5px;height:80px;background:#FFF;">
            <div class="weui-flex__item item_center">
              <p>
                <span class="icon_wrap" :style="'background:'+ item.color"><i class="iconfont" :class="item.icon"></i></span>
                <span class="padding-left main_text">{{item.name}}</span>
              </p>
            </div>
            <div v-for="(sub,subIndex) in item.value" :key="subIndex" class="right_text_item flex_center item_center " >
              <p class="num_text text-center"><span :style="sub.color?'color:'+sub.color:''">{{sub.value}}</span><span v-html="sub.unit"></span></p>
              <p class="sub_text text-center">{{sub.name}}</p>
            </div>
          </div>
        </div>
      </div>
      <mt-tab-container v-if="!singleMode" v-model="selected">
        <mt-tab-container-item id="1">
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
        <mt-tab-container-item id="2">
          <div class="padding15">
            <div v-show="item.show" @click="routeTo(item)" v-for="(item, index) in rightList" :key="index" class="weui-flex flex_center padding15 margin-bottom" style="border-radius:5px;height:80px;background:#FFF;">
              <div class="weui-flex__item item_center">
                <p>
                  <span class="icon_wrap" :style="'background:'+ item.color"><i class="iconfont" :class="item.icon"></i></span>
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
// http://localhost:8080/mets/report/docs/index.html?UserId=test30&PositionId=11091316310300010000&projectID=11091315263400010000&memberId=30&projectName=测试项目&Report=APP_Report&ReportWork=APP_ReportWork&ReportEquip=APP_ReportEquip&ReportCollection=APP_ReportCollection#page=0
import {mapGetters} from 'Vuex'
import qs from 'qs'
export default {
  name: 'tabReport',
  data () {
    return {
      selected: '2',
      currRand: 0,
      singleMode: true,
      leftList: [],
      rightList: []
    }
  },
  created () {
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.nav = {
      orgId: searchObj.projectID || this.user.OrgID,
      orgName: searchObj.projectName,
      userId: searchObj.UserId || this.user.UserID,
      positionId: searchObj.PositionId || this.user.PositionID
    }
    this.getPageData()
  },
  activated () {
    console.log(this.user, 'user')
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      this.getPageData && this.getPageData()
      this.currRand = this.rand
    } else {
      this.currRand = this.rand
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'rand': 'rand'
    })
  },
  methods: {
    async getPageData () {
      let res = await this.getReportAuth()
      if (!res) {
        // 显示空
        return
      }
      let arr = await Promise.all([this.rightInfo(), this.leftTopInfo(), this.leftbottomInfo()])
      // arr[0]
      this.rightList.forEach((item, index) => {
        item.value = arr[0][index]
      })
      let leftValues = arr[1].concat(arr[2])
      this.leftList.forEach((item, index) => {
        item.value = leftValues[index]
      })
      console.log(this.rightList, this.leftList, 'wo qu')
      // this.leftList.forEach((item, index) => {
      // })
    },
    routeTo (item) {
      this.$router.forward({name: item.urlName})
    },
    // 获取报表权限
    async getReportAuth () {
      let p7 = {
        UserId: this.user.UserID,
        PositionId: this.user.PositionID
      }
      console.log(p7)
      let res = await this.$xml('UserSL_ReportRight', p7)
      console.log(res)
      if (!res.data) return
      let resData = res.data.ReportRight
      let leftArr = [
        {name: '建筑面积', urlName: 'report_building', color: '#41BFE9', icon: 'icon-jianzhu', auth: 'SL_APP_ReportBudArea', value: []},
        {name: '收入分析', urlName: 'report_income', color: '#FA7466', icon: 'icon-shouru', auth: 'SL_APP_ReportFee', value: []},
        {name: '租赁分析', urlName: 'report_rent', color: '#0DC8BD', icon: 'icon-zulinhetong-', auth: 'SL_APP_ReportRent', value: []},
        {name: '特色园分析', urlName: 'report_features', color: '#FCB546', icon: 'icon-fenxi', auth: 'SL_APP_ReportTSY', value: []},
        {name: '租金', urlName: 'report_rentCash', color: '#41BFE9', icon: 'icon-shoukuan', auth: 'JLT_APP_ReportRentReprises', value: []},
        {name: '出租率', urlName: 'report_rentRate', color: '#FA7466', icon: 'icon-chuzu', auth: 'JLT_APP_ReportRentRentalRate', value: []},
        {name: '合同统计', urlName: 'report_agreement', color: '#46A9FC', icon: 'icon-tubiaozhizuomoban_fuzhi', auth: 'DQ_APP_ContractStatistics', value: []},
        {name: '租赁统计', urlName: 'report_countLease', color: '#FA8A2C', icon: 'icon-zu', auth: 'DQ_APP_LeasingStatistics', value: []},
        {name: '权证统计', urlName: 'report_warrant', color: '#0DC88C', icon: 'icon-hetong', auth: 'DQ_APP_WarrantStatistics', value: []}
      ]
      let rightArr = [
        {name: '客服服务', urlName: 'report_customer', color: '#46A9FC', icon: 'icon-kehufuwu', auth: 'APP_ReportWork', value: []},
        {name: '设备管理', urlName: 'report_device', color: '#FA8A2C', icon: 'icon-shebeiguanli', auth: 'APP_ReportEquip', value: []},
        {name: '项目收款', urlName: 'report_cash', color: '#0DC88C', icon: 'icon-shoukuan', auth: 'APP_ReportCollection', value: []},
        {name: '项目出租', urlName: 'report_lease', color: '#FCBA46', icon: 'icon-chuzu', auth: 'APP_ReportRent', value: []}
      ]
      leftArr.forEach(item => {
        item.show = resData.some(sub => sub.Content === item.auth)
      })
      rightArr.forEach(item => {
        item.show = resData.some(sub => sub.Content === item.auth)
      })
      if (leftArr.length === 0) {
        this.singleMode = true
      } else {
        this.singleMode = false
      }
      this.leftList = leftArr
      this.rightList = rightArr
      console.log('权限结果', this.rightList, this.leftList)
      return true
    },
    // 右侧的内容
    async rightInfo () {
      let res = await this.$xml('UserCS_ReportGlobalReport', {
        orgID: this.user.OrgID,
        financeDate: (new Date()).format('yyyy-MM')
      })
      let arr = res.data
      let values = [
        [{name: '满意度', value: this.formatInt(arr[0].VisitRate), color: '#FA4E2C', unit: '<span class="unit_text">分</span>'}, {name: '关闭率', value: this.formatInt(arr[0].CloseRate), unit: '%'}],
        [{name: '设备完好率', value: this.formatNum(arr[1].EquiRate), unit: '%'}],
        [{name: '本月帐期已收', value: this.formatNum((arr[2].PaidMoney)), color: '#FA4E2C', unit: '<span class="unit_text">万元</span>'}, {name: '收缴率', value: this.formatInt(arr[2].PaidRate), unit: '%'}],
        [{name: '出租数量', value: arr[4].HouseCount, color: '#FA4E2C', unit: '<span class="unit_text">套</span>'}, {name: '出租率', value: this.formatInt(arr[4].CZRate), unit: '%'}]
      ]
      return values
    },
    // 左侧上方的内容
    async leftTopInfo () {
      let res = await this.$xml('UserSL_Summery', {})
      console.log(res, '----')
      let resData = res.data.Summery[0]
      console.log(resData, 'Summery')
      let values = [
        [{name: '管理面积', value: this.formatNum(resData['BudArea']), unit: '<span class="unit_text">㎡</span>'}],
        [{name: '当月应收', value: this.formatNum(resData['PriPaid']), color: '#FA4E2C', unit: ''}],
        [{name: '已出租面积', value: this.formatNum(resData['RentArea']), unit: '<span class="unit_text">㎡</span>'}],
        [{name: '平均租金', value: this.formatNum(resData['AvgPaid']), color: '#FA4E2C', unit: ''}]
      ]
      return values
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
        OrgID: this.user.OrgID,
        Etime: (new Date()).format('yyyy-MM-dd')
      }), this.$xml('UserCS_ReportGrpStatistics', {
        Etime: (new Date()).format('yyyy-MM')
      })])
      // let res = await this.$xml('UserCS_ReportLeaseSituation', {
      //   OrgID: this.user.OrgID,
      //   Etime: (new Date()).format('yyyy-MM-dd')
      // })
      let res = resArr[0]
      let obj = resArr[1].data[0]
      let data = res.data.pop()
      let values = [
        [{name: '实际租金', value: this.formatNum(data.ZJmoney)}, {name: '目标租金', value: this.formatNum(data.MSR)}],
        [{name: '实际出租率', color: '#FA4E2C', value: this.formatNum(data.CZL), unit: '%'}, {name: '目标出租率', color: '#FA4E2C', value: this.formatNum(data.MCZL), unit: '%'}],
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
</style>
