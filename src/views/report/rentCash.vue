<template>
  <div class="page">
    <mt-header title="租金">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-flex fs16 padding5-v padding-h light_bg">
      <div class="weui-flex__item">截止：{{chooseDate | dateChina}}</div>
      <div class="padding5-h" @click="$refs.picker.open()"><i class="iconfont icon-calendar fs18"  style="font-size:18px;" ></i></div>
      <div class="padding5-h"><i class="iconfont icon-shaixuan fs18" style="font-size:18px;" @click="slideShow=true"></i></div>
    </div>
    <div class="page_bd report_wrap">
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
    <mt-datetime-picker
      v-model="pickerVisible"
      type="date"
      ref="picker"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm" >
     </mt-datetime-picker>
     <div v-show="slideShow">
      <div class="slide_mask" @click="slideShow=false">
        <div class="slide_panel" @click.stop>
          <div class="page">
            <div class="page_bd">
              <div class="weui-cells weui-cells_checkbox" style="margin-top:0;">
                <label class="weui-cell weui-check__label" for="sall">
                    <div class="weui-cell__bd">
                        <p>请选择项目（多选）</p>
                    </div>
                    <div class="weui-cell__ft">
                        <input type="checkbox" class="weui-check" @change="selectAllChange" v-model="selectAll" value="true" name="checkbox1" id="sall">
                        <i class="iconfont weui-icon-checked"></i>
                    </div>
                </label>
                <label v-for="(item,index) in listData " :key="index" class="weui-cell weui-check__label" :for="'s'+index">
                    <div class="weui-cell__bd">
                        <p>{{item.projectName}}</p>
                    </div>
                    <div class="weui-cell__ft">
                        <input v-model="projectIds" type="checkbox" :value="item.projectId" name="checkbox" class="weui-check" :id="'s'+index">
                        <i class="iconfont weui-icon-checked"></i>
                    </div>
                </label>
              </div>
            </div>
            <div class="page_ft text-center" style="padding-top:5px;">
              <button class="reset_btn" @click="resetClick">重置</button>
              <button class="main_btn" @click="projectConfirm">确定</button>
            </div>
          </div>
        </div>
      </div>
     </div>
  </div>
</template>
<script>
import ready from '@/utils/getEchars'
import {mapGetters} from 'Vuex'
import qs from 'qs'
export default {
  name: 'rentCash',
  // components: {Toast, Datetime, Popup},
  data () {
    return {
      slideShow: false,
      chooseDate: '',
      pickerVisible: '',
      searchForm: {
        endDate: ''
      },
      selectAll: false,
      slideActive: false,
      iconIsactive: false,
      selectIndex: [],
      targetRent: '0.0',
      actualRent: '0.0',
      tableList: [],
      listData: [],
      projectIds: [],
      resource: '',
      Resource: '',
      isRate: false,
      isFirst: true
    }
  },
  created () {
    // this.resource = this.$route.query.resource === 'zujin' ? '租金统计' : '出租率统计'
    // this.Resource = this.$route.query.resource
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.orgId = searchObj.projectID || this.user.OrgID
    this.orgName = searchObj.projectName || this.user.OrgName
    this.positionId = searchObj.PositionId || this.user.PositionID
    this.projectIds = [this.orgId]
    this.resource = '租金统计'
    this.Resource = 'zujin'
    this.isRate = false // 出租率
    let dates = new Date()
    this.pickerVisible = new Date()
    this.chooseDate = (new Date()).format('yyyy-MM-dd')
    this.searchForm.endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1 < 10 ? '0' + (dates.getMonth() + 1) : (dates.getMonth() + 1)) + '-' + (dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate())
    ready().then(echarts => {
      this.$nextTick(() => {
        this.myBar = echarts.init(this.$refs.myBar)
        this.getPageData()
      })
    })
    this.getSlideData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    projectIdsStr () {
      return this.projectIds.join(',')
    }
  },
  methods: {
    projectConfirm () {
      this.getPageData()
      this.slideShow = false
    },
    handleConfirm (date) {
      this.chooseDate = date.format('yyyy-MM-dd')
      this.getPageData()
    },
    resetClick () {
      this.selectAll = false
      this.projectIds = [this.orgId]
    },
    selectAllChange () {
      if (this.selectAll) {
        this.projectIds = this.listData.map(item => item.projectId)
      } else {
        this.projectIds = [this.orgId]
      }
    },
    async getSlideData () {
      let res = await this.$xml('User_GetOrgIDListNew', {}, {
        p1: this.positionId
      })
      this.listData = res.data
    },
    async getPageData () {
      let res = await this.$xml('UserCS_ReportLeaseSituation', {
        OrgID: this.projectIdsStr,
        Etime: this.chooseDate
      })
      let data = res.data
      if (this.isRate) {
        this.targetRent = data[data.length - 1].MCZL || '0.00'
        this.actualRent = data[data.length - 1].CZL || '0.00'
      } else {
        this.targetRent = data[data.length - 1].MSR || '0.00'
        this.actualRent = data[data.length - 1].ZJmoney || '0.00'
      }
      this.tableList = data
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
  .slide_mask {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:10;
    background: rgba(51, 51, 51, 0.35);
  }
  .slide_panel {
    position:relative;
    width:60%;
    height:100%;
    float:right;
    background:#fff;
  }
  .weui-cells_checkbox .weui-icon-checked:before {
    content: '\E630';
    color:#c9c9c9;
  }
  .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before {
    content: '\E631';
    color: #0DC88C;
  }
  .reset_btn {
    width: 44%;
    height: 36px;
    color: #0DC88C;
    background: #FFF;
    border:1px solid  #0DC88C;
    border-radius: 5px;
  }
  .main_btn{
    width: 44%;
    height: 36px;
    color: #FFF;
    background: #0DC88C;
    border:1px solid#0DC88C;
    border-radius: 5px;
  }
</style>
