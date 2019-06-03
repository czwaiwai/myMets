<template>
  <div class="page">
    <nav-title title="项目收款"></nav-title>
    <div class="weui-cells" style="margin:0;">
      <a class="weui-cell weui-cell_access" @click="$router.push({name: 'report_cash_change'})" href="javascript:;">
          <div class="weui-cell__bd">
              <p>{{orgName}}</p>
          </div>
          <div class="weui-cell__ft"></div>
      </a>
    </div>
    <div class="page_bd">
      <div class="weui-form-preview margin-bottom" style="margin-top:-1px;">
        <div class="weui-form-preview__hd text-center">
            <div>
              <a @click="dateShow=true" class="text-center" href="javascript:;">
                  <div class="weui-cell__bd dark_99">
                      <p>{{currentMonth | dateChina}}<i class="iconfont icon-xiala"></i></p>
                  </div>
              </a>
            <div v-show="dateShow">
              <div class="date_mask" @click="dateShow=!dateShow"></div>
              <div class="date_list_choose">
                <ul >
                  <li @click="dateClick(item, index)" v-for="(item,index) in dateList" :key="index" >{{item  | dateChina}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div ref="mapWrap" class="weui-form-preview__bd" style="background: #3395FF;">
          <div v-show="isData1" class="map_bl" ref="map1"></div>
          <div v-show="!isData1" class="text-center">
              <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
              <p>暂无数据</p>
            </div>
        </div>
        <div v-show="isData1" class="weui-form-preview__ft">
            <div class="weui-form-preview__btn weui-form-preview__btn_default" >应收: {{rateData.PriRevMoney | float2}}</div>
            <div class="weui-form-preview__btn weui-form-preview__btn_default" >实收: {{rateData.PaidMoney | float2}}</div>
        </div>
      </div>

      <div class="weui-form-preview  margin-bottom" >
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">实收分布</label>
                <label v-if="dataReady" class="weui-form-preview__value"></label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div v-show="isData2" class="map_bl"  ref="map2"></div>
            <div v-show="!isData2" class="text-center">
              <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
              <p>暂无数据</p>
            </div>
          </div>
      </div>
      <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">分项实收情况</label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div v-if="dataReady" class="fs14">
              <div v-show="isData3" class="weui-flex">
                <div class="bold weui-flex__item text-center">费项</div>
                <div class="bold weui-flex__item text-center">应收</div>
                <div class="bold weui-flex__item text-center">实收</div>
                <div class="bold weui-flex__item text-center">收缴率</div>
              </div>
              <div v-show="isData3" class="weui-flex" v-for="(item,index) in list3" :key="index">
                <div class="weui-flex__item text-center dark_33 overhidden">{{item.IPItemName}}</div>
                <div class="weui-flex__item text-center dark_33">{{item.PriRevMoney | float2}}</div>
                <div class="weui-flex__item text-center dark_33">{{item.PaidMoney | float2}}</div>
                <div class="weui-flex__item text-center dark_33">{{item.TradingRate | float2 }}%</div>
              </div>
              <div v-show="!isData3" class="text-center">
                <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
                <p>暂无数据</p>
              </div>
            </div>
          </div>
      </div>

    </div>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import mapReady from '@/utils/getEchars'
import {option1, option2} from './child/cashMap'
import qs from 'qs'
export default {
  name: 'cash',
  components: {},
  data () {
    return {
      orgName: '',
      list3: [],
      currentMonth: '',
      dateShow: false,
      rateData: {},
      dateList: [],
      isInit: false,
      dataReady: false,
      isData1: true,
      isData2: true,
      isData3: true
    }
  },
  created () {
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.orgId = searchObj.projectID || this.user.OrgID
    this.orgName = searchObj.projectName || this.user.OrgName
    this.currentMonth = (new Date()).format('yyyy-MM')
    this.dateList = this.lastMonth(this.currentMonth)
    this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    projectChange (item) {
      this.orgId = item.projectId
      this.orgName = item.projectName
      this.getPageData()
    },
    dateClick (item, index) {
      console.log(item)
      // let indexNew = this.dateList.length - 1 - index
      // this.map1Init(this.list[0], indexNew)
      // this.map2Init(this.list[0], indexNew)
      this.currentMonth = item
      this.getPageData()
      this.dateShow = false
    },
    // 计算前6个月的月份
    lastMonth: function (now) {
      var d = new Date(now.replace(/[^\d]/g, '/') + '/1')
      var result = [now]
      for (var i = 0; i < 5; i++) {
        d.setMonth(d.getMonth() - 1)
        var m = d.getMonth() + 1
        m = m < 10 ? '0' + m : m
        result.push(d.getFullYear() + '-' + m)
      }
      return result
    },
    async getPageData () {
      let arr = await Promise.all([this.getData1(), this.getData2(), this.getData3(), mapReady()])
      let echarts = arr[3]
      if (!this.isInit) {
        let width = (parseInt(window.getComputedStyle(this.$refs.mapWrap).width) - 30) + 'px'
        this.$refs.map1.style.width = width
        this.$refs.map2.style.width = width
        this.map1 = echarts.init(this.$refs.map1)
        this.map2 = echarts.init(this.$refs.map2)
        this.isInit = true
      }
      if (this.isDataExist(arr[2])) {
        this.list3 = arr[2].sort((a, b) => {
          return (b.PriRevMoney - 0) - (a.PriRevMoney - 0)
        })
        this.isData3 = true
      } else {
        this.isData3 = false
      }
      if (this.isDataExist(arr[0]) && arr[0][0].status !== '0') {
        this.dataMap1(arr[0])
        this.isData1 = true
      } else {
        this.isData1 = false
      }
      if (this.isDataExist(arr[1]) && arr[1][0].status !== '0') {
        this.dataMap2(arr[1])
        this.isData2 = true
      } else {
        this.isData2 = false
      }
      this.dataReady = true
    },
    isDataExist (data) {
      if (!data) return false
      if (data.Syswin && data.Syswin[0].status === '0') {
        return false
      }
      return true
    },
    // 财务收缴率报表
    async getData1 () {
      let p0 = 'UserCS_ReportConfiscateRate'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        financeDate: this.currentMonth
      })
      return res.data
    },
    // 财务实收分布报表
    async getData2 () {
      let p0 = 'UserCS_ReportFnPaidTrading'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        financeDate: this.currentMonth
      })
      return res.data
    },
    // 财务分项实收情况报表
    async getData3 () {
      let p0 = 'UserCS_ReportFnPaidSituation'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        financeDate: this.currentMonth
      })
      return res.data
    },
    dataMap1 (data) {
      this.rateData = data[0]
      let white = '#FFF'
      let num = data[0].TradingRate
      option1.series[0].axisLine.lineStyle.color = [[0, white], [(num / 100), white], [1, 'rgba(251, 212, 55, 0.3)']]
      option1.series[0].data = [{value: num, name: '收缴率'}]
      this.map1.setOption(option1)
    },
    dataMap2 (data) {
      let temp1 = []
      let temp2 = []
      for (var i = 0; i < data.length; i++) {
        var name = data[i].IPItemName
        var rate = data[i].IPItemNameRate
        var formatRate = Math.floor(rate * 100) / 100
        temp1.push(name)
        temp2.push({
          name: name,
          value: formatRate
        })
      }
      if (temp1.length > 0) {
        option2.legend.data = temp1
        option2.series[0].data = temp2
      } else {
        option2.legend.data = ['无实收']
        option2.series[0].data = [
          {
            value: 0,
            name: '无实收'
          }
        ]
      }
      this.map2.setOption(option2)
    }
  }
}
</script>
<style lang="scss" scoped>
.date_mask{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8;
}
.date_list_choose {
    position: absolute;
    width: 100px;
    top: 36px;
    left: 50%;
    margin-left: -50px;
    z-index:9;
    background: #FFF;
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    padding:5px 10px;
    color:#333;
    box-shadow: 0px 0px 2px rgba(51, 51, 51, 0.3);
    & li {
      height:36px;
      line-height:36px;
    }
    & li + li {
      border-top:1px solid #e5e5e5;
    }
}
.page_bd {
  .map_bl {
    height:170px;
  }
  .weui-form-preview {
    .weui-form-preview__hd {
      padding: 5px 15px;
    }
    .weui-form-preview__label {
      font-size:16px;
      color:#333;
    }
    .weui-form-preview__value {
      font-size:16px;
    }
  }
}
</style>
