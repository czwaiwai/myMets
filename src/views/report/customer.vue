<template>
  <div class="page report_customer">
    <mt-header  title="客服报表">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-cells" style="margin:0;">
      <a class="weui-cell weui-cell_access" @click="$router.push({name: 'report_changeProject'})" href="javascript:;">
          <div class="weui-cell__bd">
              <p>{{orgName}}</p>
          </div>
          <div class="weui-cell__ft"></div>
      </a>
    </div>
    <div class="page_bd">
      <div>
        <div class="weui-cells margin-bottom" style="margin-top:-1px;" >
          <a class="weui-cell"  href="javascript:;">
              <div class="weui-cell__bd dark_99">
                  <p>{{currentMonth | dateChina}}</p>
              </div>
              <div @click="dateShow = true" class="weui-cell__ft">
                <i class="iconfont icon-calendar"></i>
              </div>
          </a>
        </div>
        <div v-show="dateShow">
          <div class="date_mask" @click="dateShow=!dateShow"></div>
          <div class="date_list_choose">
            <ul >
              <li @click="dateClick(item, index)" v-for="(item,index) in dateList" :key="index" >{{item.date | dateChina}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="weui-form-preview margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">满意度 <a @click="map1show=!map1show"><i class="iconfont" :class="map1show? 'icon-kaiguanguan1':'icon-kaiguanguan'"></i></a></label>
                <label class="weui-form-preview__value">{{currentRate}}分</label>
            </div>
          </div>
          <div ref="mapWrap" class="weui-form-preview__bd">
            <div v-show="isData1">
              <div v-show="map1show" class="map_bl"  ref="map1"></div>
              <div v-show="!map1show" class="map_bl" style="200px"  ref="map2"></div>
            </div>
            <div v-show="!isData1" class="text-center">
              <img style="max-width: 140px;" src="../../assets/img/report/noData.png">
              <p>暂无数据</p>
            </div>
          </div>
      </div>
      <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">本月工单</label>
                <label v-if="dataReady" class="weui-form-preview__value">{{list[1].TotalCount  | int}}</label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div v-show="isData3" class="weui-flex">
              <div class="map_bl" style="width:140px;height:140px;" ref="map3"></div>
              <div class="weui-flex__item">
                <ul v-if="dataReady" class="map3_ul">
                  <li>
                    <dl>
                      <dt>{{list[1].WaitingList | int}}</dt>
                      <dd>待接单</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].StayCompletion | int}}</dt>
                      <dd>待完工</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].StayReturnVisit | int}}</dt>
                      <dd>待回访</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].StayClose | int}}</dt>
                      <dd>待关闭</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].Closed | int}}</dt>
                      <dd>已关闭</dd>
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
            <div v-show="!isData3"  class="text-center">
              <img style="max-width: 140px;" src="../../assets/img/report/noData.png">
              <p>暂无数据</p>
            </div>
          </div>
      </div>
      <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">类型占比</label>
                <label class="weui-form-preview__value">%</label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div v-show="isData4" class="map_bl" ref="map4"></div>
            <div v-show="!isData4"  class="text-center">
              <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
              <p>暂无数据</p>
            </div>
          </div>
      </div>
      <div class="weui-form-preview  margin-bottom ">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">客服效率</label>
                <label class="weui-form-preview__value"></label>
            </div>
          </div>
          <div v-if="dataReady" class="weui-form-preview__bd section4">
            <div v-if="list[3]" class="weui-flex">
              <div class="weui-flex__item padding-right5">
                <span class="span_key dark_999">平均接单时长</span>
                <span class="span_value">{{list[3].PeopleDate | int}}分钟</span>
              </div>
              <div class="weui-flex__item padding-left5">
                <span class="span_key">平均完工时长</span>
                <span class="span_value">{{list[3].FinishleDate | int}}分钟</span>
              </div>
            </div>
            <div  v-if="list[3]" class="weui-flex">
              <div class="weui-flex__item padding-right5">
                <span class="span_key">回访率</span>
                <span class="span_value">{{list[3].FinishleRate | float2}}%</span>
              </div>
              <div class="weui-flex__item padding-left5">
                <span class="span_key">投诉率</span>
                <span class="span_value">{{list[3].ComplaintRate | float2}}%</span>
              </div>
            </div>
            <div v-show="!list[3]" class="text-center">
              <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
              <p>暂无数据</p>
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
import {mapGetters} from 'Vuex'
import mapReady from '@/utils/getEchars'
// import sleep from '@/utils/sleep'
import {option1, option2, option3, option4} from './child/customerMap'
import qs from 'qs'
export default {
  name: 'customer',
  data () {
    return {
      dateShow: false,
      orgName: '',
      map1show: true,
      dataReady: false,
      isData1: true,
      isData2: true,
      isData3: true,
      isData4: true,
      currentRate: '',
      currentMonth: '',
      dateList: [],
      list: []
    }
  },
  created () {
    console.log(this.user, 'user--')
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.orgId = searchObj.projectID || this.user.OrgID
    this.orgName = searchObj.projectName || this.user.OrgName
    this.financeDate = (new Date()).format('yyyy-MM')
    this.getMap()
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
      let indexNew = this.dateList.length - 1 - index
      this.map1Init(this.list[0], indexNew)
      this.map2Init(this.list[0], indexNew)
      this.dateShow = false
    },
    async getPageData () {
      let urlArr = []
      for (let i = 0; i < 4; i++) {
        urlArr.push(this['getData' + (i + 1)]())
      }
      this.$indicator.open({spinnerType: 'fading-circle'})
      let dataArr = await Promise.all(urlArr)
      this.$indicator.close()
      this.list = dataArr
      if (this.isDataExist(this.list[0])) {
        this.dateList = this.list[0].map(item => {
          return {
            date: item.ReturnVisitDate
          }
        }).reverse()
        this.map1Init(this.list[0], this.list[0].length - 1)
        this.map2Init(this.list[0], this.list[0].length - 1)
        this.isData1 = true
        this.isData2 = true
      } else {
        this.isData1 = false
        this.isData2 = false
      }
      if (this.isDataExist(this.list[1])) {
        this.map3Init(this.list[1])
        this.isData3 = true
      } else {
        this.isData3 = false
      }
      if (this.isDataExist(this.list[2])) {
        this.isData4 = true
        this.map4Init(this.list[2])
      } else {
        this.isData4 = false
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
    // 请求客服满意度统计报表
    async getData1 () {
      let res = await this.$xml('UserCS_ReportWorkOrdSatisfied', {
        orgID: this.orgId,
        financeDate: this.financeDate
      }, true)
      return res.data
    },
    // 请求客服工单量统计报表
    async getData2 () {
      let res = await this.$xml('UserCS_ReportWorkOrdSort', {
        orgID: this.orgId,
        financeDate: this.financeDate
      }, true)
      return res.data[0]
    },
    // 请求客服工单规则大类分析报表
    async getData3 () {
      let res = await this.$xml('UserCS_ReportWorkOrdWONoBasicName', {
        orgID: this.orgId,
        financeDate: this.financeDate
      }, true)
      return res.data
    },
    // 请求客服工单处理效率报表
    async getData4 () {
      let res = await this.$xml('UserCS_ReportWorkOrdEfficiency', {
        orgID: this.orgId,
        financeDate: this.financeDate
      }, true)
      return res.data[0]
    },
    //
    async getMap () {
      let echarts = await mapReady()
      this.$nextTick(() => {
        let width = (parseInt(window.getComputedStyle(this.$refs.mapWrap).width) - 30) + 'px'
        this.$refs.map1.style.width = width
        this.$refs.map2.style.width = width
        this.$refs.map4.style.width = width
        this.map1 = echarts.init(this.$refs.map1)
        this.map2 = echarts.init(this.$refs.map2)
        this.map3 = echarts.init(this.$refs.map3)
        this.map4 = echarts.init(this.$refs.map4)
      })
    },
    async map1Init (data, index = 0) {
      await mapReady()
      let temp1 = []
      let temp2 = []
      let temp3 = []
      for (var i = 0; i < data.length; i++) {
        var visitRate = data[i].VisitRate
        var visitDate = data[i].ReturnVisitDate
        var rate = Math.floor(visitRate * 1000) / 1000
        var month = visitDate.slice(-2) + '月'
        temp1.push(rate)
        temp2.push(month)
        temp3.push(visitDate)
      }
      this.currentMonth = temp3[index]
      this.currentRate = temp1[index]
      option1.xAxis.data = temp2
      option1.series[0].data = temp1
      this.map1.setOption(option1)
    },
    async map2Init (arr, index = 0) {
      await mapReady()
      let temp1 = []
      let temp2 = []
      var s1 = '很满意' + ' ' + arr[index].VerySatisfied + '单'
      var r1 = Math.floor(arr[index].VerySatisfiedRate * 1000) / 1000
      var s2 = '满意' + ' ' + arr[index].Satisfied + '单'
      var r2 = Math.floor(arr[index].SatisfiedRate * 1000) / 1000
      var s3 = '基本满意' + ' ' + arr[index].BasicSatisfaction + '单'
      var r3 = Math.floor(arr[index].BasicSatisfactionRate * 1000) / 1000
      var s4 = '不满意' + ' ' + arr[index].Dissatisfied + '单'
      var r4 = Math.floor(arr[index].DissatisfiedRate * 1000) / 1000
      var s5 = '很不满意' + ' ' + arr[index].VeryDissatisfied + '单'
      var r5 = Math.floor(arr[index].VeryDissatisfiedRate * 1000) / 1000
      temp1 = [s1, s2, s3, s4, s5]
      temp2 = [r1, r2, r3, r4, r5]
      option2.yAxis.data = temp1
      option2.series[0].data = temp2
      this.map2.setOption(option2)
    },
    async map3Init (data) {
      await mapReady()
      var temp = [
        {
          value: data.WaitingList || 0,
          name: '待接单'
        },
        {
          value: data.StayCompletion || 0,
          name: '待完工'
        },
        {
          value: data.StayReturnVisit || 0,
          name: '待回访'
        },
        {
          value: data.StayClose || 0,
          name: '待关闭'
        },
        {
          value: data.Closed || 0,
          name: '已关闭'
        }
      ]
      option3.series[0].data = temp
      this.map3.setOption(option3)
    },
    async map4Init (data) {
      await mapReady()
      let temp1 = []
      let temp2 = []
      console.log(this.map4, 'this.map4')
      for (var i = 0; i < data.length; i++) {
        var name = data[i].WONoBasicName
        var rate = data[i].WONoBasicRate
        var formatRate = Math.floor(rate * 100) / 100
        temp1.push(name)
        temp2.push({
          name: name,
          value: formatRate
        })
      }
      option4.legend.data = temp1
      option4.series[0].data = temp2
      this.map4.setOption(option4)
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
    right: 10px;
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
.report_customer {
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
  .map_bl {
    height:170px;
  }
  .section4 .span_key{
    font-size: 15px;
    float: left;
    text-align: left;
  }
  .section4 .span_value {
    font-size:15px;
    color:#333;
  }

  .map3_ul {
    & li {
      float:left;
      width:68px;
      text-align:center;
      & dt {
        font-size:16px;
        color: #333;
      }
      & dd {
        font-size:15px;
        color:#999;
      }
    }
  }
}
</style>
