<template>
  <div class="page">
    <mt-header title="出租率">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd report_wrap">
      <!-- <div class="time-selector">
        <div class="limit-time">
           <span>截止:</span>
          <span v-text="searchForm.endDate"></span>
        </div>

          <div class="icon-container">
            <datetime class="form_item"  v-model="searchForm.endDate" format="YYYY-MM-DD" :max-year=3000 :min-year=1900 @on-change="change">
              <div class="calendar"><i class="iconfont icon-calendar" ></i></div>
            </datetime>
            <div class="filters">
              <i class="iconfont icon-shaixuan" @click="slide"></i>
            </div>
          </div>
        <div class="vux-popup-mask" style="margin-top:0.88rem;" ></div>
      </div> -->

      <!-- <div class="slide-panel" :class="{'slide-mode':slideActive,'no-slide':!slideActive}">
        <ul>
          <li>
            <span>请选择项目（多选）</span>
            <i class="iconfont" :class="{'icon-Ellipse':!iconIsactive,'icon-select-copy':iconIsactive}" @click="allSelect"></i>
          </li>
          <li v-for="(item,index) in listData " :key="index">
            <span>{{item.projectName}}</span>
            <i class="iconfont" :class="[selectIndex[index].isSelect?'icon-select-copy':'icon-Ellipse']" @click="singleSelect(index,item.projectId)" ></i>
          </li>

        </ul>
        <div class="btn-container">
            <div @click="reset">重置</div>
            <div @click="slideOut">确定</div>
        </div>
      </div>
      <div @click="slideActive =!slideActive" class="shade" v-show="slideActive"></div> -->

      <div class="total-top margin-bottom">
        <div class="total-area">
          <p>{{isRate?'': '￥'}}{{targetRent}} {{isRate?'%': '元'}}</p>
          <p>{{isRate?'目标出租率':'目标租金' }}</p>
        </div>
        <div class="contract-num">
          <p>{{isRate?'': '￥'}}{{actualRent}} {{isRate?'%': '元'}}</p>
          <p>{{isRate?'实际出租率':'实际租金'}}</p>
        </div>
      </div>

      <div class="weui-form-preview margin-bottom">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
              <label class="weui-form-preview__label">{{Resource==='zujin'?'运营项目租金':'出租率'}}</label>
              <!-- <label class="weui-form-preview__value">{{currentRate}}分</label> -->
          </div>
        </div>
        <div  class="weui-form-preview__bd">
          <div class="map_bl"  ref="myBar"></div>
        </div>
      </div>
      <div class="rent-list fs15">
        <div class="flex" style="color:#999;">
          <div class="flex_item">业态</div>
          <div class="text-center" style="width:25%">目标{{!isRate?'租金':'出租率'}}</div>
          <div class="text-center" style="width:25%">实际{{!isRate?'租金':'出租率'}}</div>
        </div>
        <template v-if="!isRate">
          <div v-for="(item, index) in tableList" :key="index"  class="flex item_tr">
            <div class="flex_item dot" >{{item.ResType}}</div>
            <div class="text-center" style="width:25%">{{item.MSR || '0.00'}}</div>
            <div class="text-center" style="width:25%">{{item.ZJmoney || '0.00'}}</div>
          </div>
        </template>
        <template v-if="isRate">
          <div  v-for="(item, index) in tableList" :key="index" class="flex item_tr">
            <div class="flex_item dot"  style="width:50%">{{item.ResType}}</div>
            <div class="text-center" style="width:25%">{{item.MCZL || '0.00'}}%</div>
            <div class="text-center" style="width:25%">{{item.CZL || '0.00'}}%</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import ready from '@/utils/getEchars'
export default {
  name: 'rentCash',
  // components: {Toast, Datetime, Popup},
  data () {
    return {
      searchForm: {
        endDate: ''
      },
      slideActive: false,
      iconIsactive: false,
      selectIndex: [],
      targetRent: '0.0',
      actualRent: '0.0',
      tableList: [],
      listData: [],
      projectId: [],
      resource: '',
      Resource: '',
      isRate: false,
      isFirst: true
    }
  },
  created () {
    // this.resource = this.$route.query.resource === 'zujin' ? '租金统计' : '出租率统计'
    // this.Resource = this.$route.query.resource
    this.resource = '出租率统计'
    this.Resource = 'chuzulv'
    this.isRate = true // 出租率

    let dates = new Date()
    this.searchForm.endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1 < 10 ? '0' + (dates.getMonth() + 1) : (dates.getMonth() + 1)) + '-' + (dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate())
    ready().then(echarts => {
      this.$nextTick(() => {
        this.myBar = echarts.init(this.$refs.myBar)
        this.getPageData()
      })
    })
  },
  computed: {},
  methods: {
    getUrlParams (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return decodeURIComponent(r[2])
      }
      return null
    },
    slide () {
      this.slideActive = true
      if (this.isFirst) {
        this.projectSwitching()
        this.isFirst = false
      }
    },
    slideOut () {
      this.slideActive = false
      let orgID = ''
      console.log(JSON.stringify(this.selectIndex), '?????---selectIndex')
      for (let i = 0; i < this.selectIndex.length; i++) {
        if (this.selectIndex[i].isSelect) {
          orgID += this.selectIndex[i].projectId + ','
        }
      }
      orgID = orgID.replace(/,$/gi, '')
      if (orgID === '') {
        this.projectSwitching()
      }
      this.getPageData(orgID)
    },
    singleSelect (index, projectId) {
      this.selectIndex[index].isSelect = !this.selectIndex[index].isSelect
      if (this.selectIndex[index].isSelect) {
        this.selectIndex[index].projectId = projectId
      }
    },
    goBack () {
      if (window.webkit) {
        window.webkit.messageHandlers.Native_Js_tabbar.postMessage('true')
      }
      window.history.back()
    },
    // isIos () {
    //   let u = navigator.userAgent
    //   let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    //   if (isIOS && window.webkit) {
    //     window.webkit.messageHandlers.Native_Js_tabbar.postMessage('true')
    //   }
    // },
    changeTab (ev) {
      if (ev.target.dataset.type === '1') {
        this.isActive = true
      }
      if (ev.target.dataset.type === '2') {
        this.isActive = false
      }
    },
    change () {
      let orgID = ''
      for (let i = 0; i < this.selectIndex.length; i++) {
        if (this.selectIndex[i].isSelect) {
          orgID += this.selectIndex[i].projectId + ','
        }
      }
      orgID = orgID.replace(/,$/gi, '')
      if (orgID === '') {
        this.projectSwitching()
      }
      this.getPageData(orgID)
    },
    reset () {
      for (let i = 0; i < this.selectIndex.length; i++) {
        this.selectIndex[i].isSelect = false
        this.selectIndex[i].projectId = ''
      }
    },
    allSelect () {
      this.iconIsactive = !this.iconIsactive
      if (this.iconIsactive) {
        for (let i = 0; i < this.selectIndex.length; i++) {
          this.selectIndex[i].isSelect = true
          console.log(this.listData[i].projectId)
          this.selectIndex[i].projectId = this.listData[i].projectId
        }
      } else {
        for (let i = 0; i < this.selectIndex.length; i++) {
          this.selectIndex[i].isSelect = false
          this.selectIndex[i].projectId = ''
        }
      }
    },
    async projectSwitching () {
      // let positionId = this.getUrlParams('PositionId')
      // console.log(positionId, '-------------')
      // let obj = {
      //   p0: 'User_GetOrgIDListNew',
      //   p1: this.$route.query.PositionId || positionId,
      //   p7: {}
      // }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)

      // this.listData = res.Syswin[0].data
      // console.log(res)
      // this.$vux.loading.hide()

      let res = await this.$xml('User_GetOrgIDListNew', {}, {
        p1: '11091315263400010000'
      })
      this.listData = res.data

      if (this.selectIndex.length === 0) {
        for (let i = 0; i < res.Syswin[0].data.length; i++) {
          this.selectIndex.push({'isSelect': false, projectId: ''})
          this.$set(this.selectIndex, i, {'isSelect': false, projectId: ''})
        }
      }
      let index = this.listData.findIndex(item => {
        // console.log(item.projectId)
        console.log(item.projectId === this.getUrlParams('projectID'))
        if (item.projectId === this.getUrlParams('projectID')) {
          console.log(item.projectId, '??')
        }
        return item.projectId === this.getUrlParams('projectID')
      })
      console.log(index, '----111------------')
      this.selectIndex[index].isSelect = true
      this.selectIndex[index].projectId = this.getUrlParams('projectID')
    },
    async getPageData (orgID) {
      // let obj = {
      //   p0: 'UserCS_ReportLeaseSituation',
      //   p7: {
      //     OrgID: orgID || this.getUrlParams('projectID'),
      //     Etime: this.searchForm.endDate
      //   }
      // }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      // this.$vux.loading.hide()
      let res = await this.$xml('UserCS_ReportLeaseSituation', {
        OrgID: '11091315263400010000',
        Etime: '2018-12-26'
      })
      let data = res.data
      // res.Table
      //  targetRent: '',
      // actualRent: '',
      if (this.isRate) {
        this.targetRent = data[data.length - 1].MCZL || '0.00'
        this.actualRent = data[data.length - 1].CZL || '0.00'
      } else {
        this.targetRent = data[data.length - 1].MSR || '0.00'
        this.actualRent = data[data.length - 1].ZJmoney || '0.00'
      }
      this.tableList = data

      console.log(res)
      console.log(JSON.stringify(res))
      // this.setResTypeData()
      if (this.isRate) {
        this.setBarRate(this.tableList)
      } else {
        this.setBar(this.tableList)
      }
    },
    setBar (list) {
      let myList = list.concat()
      myList.pop()
      let xBar = myList.map(item => {
        if (item.ResType && item.ResType.length > 6) {
          return item.ResType.slice(0, 5) + '...'
        } else {
          return item.ResType
        }
      })
      let yBar1 = myList.map(item => item.ZJmoney ? item.ZJmoney : 0)
      let yBar2 = myList.map(item => item.MSR ? item.MSR : 0)
      let options = this.getOption({
        dataArr: ['目标租金', '实际租金'],
        xBar,
        yBar1,
        yBar2
      })
      this.myBar.setOption(options)
    },
    setBarRate (list) {
      let myList = list.concat()
      myList.pop()
      let xBar = myList.map(item => {
        if (item.ResType && item.ResType.length > 6) {
          return item.ResType.slice(0, 5) + '...'
        } else {
          return item.ResType
        }
      })
      let yBar1 = myList.map(item => item.MCZL ? item.MCZL : 0)
      let yBar2 = myList.map(item => item.CZL ? item.CZL : 0)
      let options = this.getOption({
        dataArr: ['目标出租率', '实际出租率'],
        xBar,
        yBar1,
        yBar2
      })
      this.myBar.setOption(options)
    },
    getOption (obj) {
      let option = {
        title: {
          text: this.isRate ? '出租率' : '租金',
          textStyle: {
            color: '#333333',
            fontSize: 14,
            fontWeight: 'normal',
            align: 'center'
          },
          top: 0
          // subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '10%',
          left: '0%',
          right: '0%',
          bottom: '10%',
          containLabel: true
        },
        legend: {
          textStyle: {
            color: '#333333'
          },
          type: 'scroll',
          orient: 'horizontal',
          x: 'center',
          top: 'bottom',
          data: obj.dataArr
          // align: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        dataZoom: [
          { // Y轴固定,让内容滚动
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            startValue: 0,
            endValue: 10, // 设置X轴刻度之间的间隔(根据数据量来调整)
            zoomLock: true // 锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 20,
            end: 20,
            zoomLock: true // 锁定区域禁止缩放
          }
        ],
        calculable: true,
        // xAxis: [
        //   {
        //     type: 'category',
        //     data: obj.xBar,
        //     axisLabel: {rotate: 50, interval: 0} // 文字放斜
        //   }
        // ],
        xAxis: {
          type: 'category',
          data: obj.xBar,
          splitLine: {
            show: true,
            interval: 'auto'
          },
          axisLine: {
            lineStyle: {
              color: ['rgb(204,204,204)']
            }
          },
          axisLabel: {
            show: true,
            rotate: 50,
            interval: 0,
            textStyle: {
              color: '#333333'
            }
          },
          axisTick: {
            show: false// 关闭坐标轴刻度
          }
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: obj.dataArr[0],
            type: 'bar',
            data: obj.yBar1,
            itemStyle: {
              color: '#FB9365'
            }
          },
          {
            name: obj.dataArr[1],
            type: 'bar',
            data: obj.yBar2,
            itemStyle: {
              color: '#3395FF'
            }
          }
        ]
      }
      return option
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
    height:240px;
  }

  .dot {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .text-center {
    text-align:center;
  }
  .flex {
    display:flex;
  }
  .flex_item {
    flex:1;
  }
  .item_center{
    align-self: center;
  }
  .float_right {
    float:right;
  }
  .rent-list{
    padding:15px;
    width: 100%;
    background: white;
    margin-top: 0.2rem;
  }
  .rent-list .item_tr{
    height:30px;
    line-height:30px;
    color: #333;
  }
 .total-top{
    height: 1.9rem;
    margin-top:0.22rem;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    >div{
      width:3.44rem;
      height:1.9rem;
      border-radius:0.1rem;
      background: white;
    }
    .total-area{
      margin-left: 0.2rem;
      text-align: center;
      p{
        &:nth-child(1){
          font-size: 0.38rem;
          color: #FF4E00;
          margin-top: 0.48rem;

        }
        &:nth-child(2){
          font-size: 0.28rem;
          color:#333333;
          margin-top: 0.08rem;
        }
      }
    }

    .contract-num{
      margin-left: 0.22rem;
      text-align: center;
      p{
        &:nth-child(1){
          font-size: 0.38rem;
          color:#0DC88C;
          margin-top: 0.48rem;

        }
        &:nth-child(2){
          font-size: 0.28rem;
          color:#333333;
          margin-top: 0.08rem;

        }
      }
    }
  }
</style>
