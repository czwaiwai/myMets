<template>
  <div class="page">
    <mt-header  title="设备管理">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-cells" style="margin:0;">
      <a class="weui-cell weui-cell_access" @click="$router.push({name: 'report_device_change'})" href="javascript:;">
          <div class="weui-cell__bd">
              <p>{{orgName}}</p>
          </div>
          <div class="weui-cell__ft"></div>
      </a>
    </div>
    <div class="page_bd">
     <div class="weui-cells" style="margin-top:-1px;" >
        <a class="weui-cell " @click="$router.push({name: 'report_changeProject'})" href="javascript:;">
            <div class="weui-cell__bd dark_99">
                <p>2018-12</p>
            </div>
            <div class="weui-cell__ft">
              <i class="iconfont icon-calendar"></i>
            </div>
        </a>
     </div>
      <div class="weui-cells  margin-bottom" style="margin-top:10px;">
        <a class="weui-cell weui-cell_access" @click="$router.push({name: 'report_device_rate'})" href="javascript:;">
            <div class="weui-cell__bd">
                <p>设备完好率</p>
            </div>
            <div class="weui-cell__ft"></div>
        </a>
      </div>
      <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">巡检</label>
                <label v-if="dataReady" class="weui-form-preview__value">计划{{list[0].TotalCount || 0}}单</label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div  class="weui-flex">
              <div class="map_bl" style="width:140px;height:140px;" ref="map1"></div>
              <div class="weui-flex__item">
                <ul v-if="dataReady" class="map3_ul">
                  <li>
                    <dl>
                      <dt>{{list[0].ToPerform || 0}}</dt>
                      <dd>待执行</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[0].TheExecution || 0}}</dt>
                      <dd>执行中</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[0].Closed || 0}}</dt>
                      <dd>已关闭</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[0].Abnormal || 0}}</dt>
                      <dd>发现异常</dd>
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
            <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">维修</label>
                <label v-if="dataReady" class="weui-form-preview__value">{{list[1].TotalCount}}单</label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div  class="weui-flex">
              <div class="map_bl" style="width:140px;height:140px;" ref="map2"></div>
              <div class="weui-flex__item">
                <ul v-if="dataReady" class="map3_ul">
                  <li>
                    <dl>
                      <dt>{{list[1].WaitingList || 0}}</dt>
                      <dd>待接单</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].StayCompletion || 0}}</dt>
                      <dd>待完工</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].StayReturnVisit || 0}}</dt>
                      <dd>待回访</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].StayClose || 0}}</dt>
                      <dd>待关闭</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[1].Closed || 0}}</dt>
                      <dd>已关闭</dd>
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
        <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">保养</label>
                <label v-if="dataReady" class="weui-form-preview__value">计划{{list[2].TotalCount}}单</label>
            </div>
          </div>
          <div class="weui-form-preview__bd">
            <div  class="weui-flex">
              <div class="map_bl" style="width:140px;height:140px;" ref="map3"></div>
              <div class="weui-flex__item">
                <ul v-if="dataReady" class="map3_ul">
                  <li>
                    <dl>
                      <dt>{{list[2].ToPerform || 0}}</dt>
                      <dd>待执行</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[2].TheExecution || 0}}</dt>
                      <dd>执行中</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[2].Closed || 0}}</dt>
                      <dd>已关闭</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>{{list[2].Abnormal || 0}}</dt>
                      <dd>发现异常</dd>
                    </dl>
                  </li>
                </ul>
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
import {mapGetters} from 'Vuex'
import mapReady from '@/utils/getEchars'
import {option1, option2, option3} from './child/deviceMap'
export default {
  name: 'device',
  data () {
    return {
      orgName: '',
      dataReady: false,
      list: []
    }
  },
  created () {
    console.log(this.user, 'user--')
    this.orgId = this.user.OrgID
    this.orgName = this.user.OrgName
    console.log(option1, option2, option3)
    this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    // async getMap () {
    //   let echarts = await mapReady()
    //   this.$nextTick(() => {
    //     this.map1 = echarts.init(this.$refs.map1)
    //     this.map2 = echarts.init(this.$refs.map2)
    //     this.map3 = echarts.init(this.$refs.map3)
    //     console.log(this.map4, 'map4-------')
    //   })
    // },
    async getPageData () {
      let res = await Promise.all([this.getData1(), this.getData2(), this.getData3(), mapReady()])
      let echarts = res.pop()
      console.log(res)
      this.$nextTick(() => {
        this.map1 = echarts.init(this.$refs.map1)
        this.map2 = echarts.init(this.$refs.map2)
        this.map3 = echarts.init(this.$refs.map3)
        this.list = res
        this.list.forEach((item, index) => this['setMap' + (index + 1)](item))
        this.dataReady = true
      })
    },
    // 巡检工单检测统计报表
    async getData1 () {
      let p0 = 'UserCS_ReportEquipmentInspection'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        financeDate: '2018-12'
      })
      return res.data[0]
    },
    // 维修工单报修统计报表
    async getData2 () {
      let p0 = 'UserCS_ReportEquipmentWorkOrd'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        financeDate: '2018-12'
      })
      return res.data[0]
    },
    // 保养工单运行情况报表
    async getData3 () {
      let p0 = 'UserCS_ReportEquipmentKeepFit'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        financeDate: '2018-12'
      })
      return res.data[0]
    },
    setMap1 (data) {
      var ToPerform = parseInt(data.ToPerform)
      var TheExecution = parseInt(data.TheExecution)
      var Closed = parseInt(data.Closed)

      var Abnormal = parseInt(data.Abnormal)
      // var closeRate = parseInt(data.CloseRate)
      option1.legend.data = ['待执行', '执行中', '已关闭', '发现异常']
      option1.series[0].data = [
        {
          value: ToPerform || '0',
          name: '待执行'
        },
        {
          value: TheExecution || '0',
          name: '执行中'
        },
        {
          value: Closed || '0',
          name: '已关闭'
        },
        {
          value: Abnormal || '0',
          name: '发现异常'
        }
      ]
      this.map1.setOption(option1)
    },
    setMap2 (data) {
      var WaitingList = parseInt(data.WaitingList)
      var StayCompletion = parseInt(data.StayCompletion)
      var StayReturnVisit = parseInt(data.StayReturnVisit)
      var StayClose = parseInt(data.StayClose)
      var Closed = parseInt(data.Closed)
      // var closeRate = parseInt(data.CloseRate)

      option2.legend.data = ['待接单', '待完工', '待回访', '待关闭', '已关闭']
      option2.series[0].data = [
        {
          value: WaitingList || '0',
          name: '待接单'
        },
        {
          value: StayCompletion || '0',
          name: '待完工'
        },
        {
          value: StayReturnVisit || '0',
          name: '待回访'
        },
        {
          value: StayClose || '0',
          name: '待关闭'
        },
        {
          value: Closed || '0',
          name: '已关闭'
        }
      ]
      this.map2.setOption(option2)
    },
    setMap3 (data) {
      var ToPerform = parseInt(data.ToPerform)
      var TheExecution = parseInt(data.TheExecution)
      var Closed = parseInt(data.Closed)
      var Abnormal = parseInt(data.Abnormal)
      // var closeRate = parseInt(data.CloseRate)
      option3.legend.data = ['待执行', '执行中', '已关闭', '发现异常']
      option3.series[0].data = [
        {
          value: ToPerform || '0',
          name: '待执行'
        },
        {
          value: TheExecution || '0',
          name: '执行中'
        },
        {
          value: Closed || '0',
          name: '已关闭'
        },
        {
          value: Abnormal || '0',
          name: '发现异常'
        }
      ]
      this.map3.setOption(option3)
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
