<template>
  <div class="page">
    <mt-header  title="收入分析">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd report_wrap">
      <div @click="openPicker" class="date_choose">
        <span>{{chooseDate}}<i class="iconfont icon-xiala" ></i></span>
      </div>
      <!-- <div class="time-selector">
        <datetime class="form_item"  v-model="searchForm.startDate" format="YYYY-MM" :max-year=3000 :min-year=1900 @on-change="change">
          <span v-text="searchForm.startDate">2018年10月</span>
          <i class="iconfont icon-xiala" ></i>
        </datetime>
        <div class="vux-popup-mask" style="margin-top:0.88rem;" ></div>
      </div> -->
      <div class="total-top margin-bottom">
        <div class="total-area">
          <p>￥{{FnRevSummery.PriPaid}}元</p>
          <p>当月应收</p>
        </div>
        <div class="contract-num">
          <p>￥{{FnRevSummery.CvsM ? FnRevSummery.CvsM : '0'}}元</p>
          <p>当月已收</p>
        </div>
      </div>

      <div class="weui-form-preview margin-bottom">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
              <label class="weui-form-preview__label">当月应收分析</label>
          </div>
        </div>
        <div  class="weui-form-preview__bd">
          <div class="map_bl"  ref="rings"></div>
        </div>
        <div  class="weui-form-preview__bd border-top-half" >
          <div class="map_bl"  ref="pie"></div>
        </div>
      </div>
      <div class="weui-form-preview margin-bottom">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
              <label class="weui-form-preview__label">资源来源与当月收入</label>
          </div>
        </div>
        <div  class="weui-form-preview__bd">
          <div class="map_bl" style="height:200px;"  ref="barline"></div>
        </div>
      </div>

    </div>
    <mt-datetime-picker class="year_month"
      v-model="pickerVisible"
      type="date"
      ref="picker"
      year-format="{value} 年"
      month-format="{value} 月"
      @confirm="handleConfirm" >
    </mt-datetime-picker>
  </div>
</template>
<script>
import ready from '@/utils/getEchars'
export default {
  name: 'income',
  data () {
    return {
      searchForm: {
        startDate: ''
      },
      chooseDate: '',
      pickerVisible: '',
      isActive: true,
      FnRevSummery: {},
      FnRevs: [],
      FnRevSources: [],
      FnRevRess: [] // 资源类型统计
    }
  },
  created () {
    let dates = new Date()
    this.pickerVisible = dates
    this.chooseDate = dates.format('yyyy-MM')
    this.searchForm.startDate = dates.getFullYear() + '-' + (dates.getMonth() + 1 < 10 ? '0' + (dates.getMonth() + 1) : (dates.getMonth() + 1))
    ready().then(echarts => {
      this.$nextTick(() => {
        this.rings = echarts.init(this.$refs.rings)
        this.pie = echarts.init(this.$refs.pie)
        this.barline = echarts.init(this.$refs.barline)
        this.getPageData()
      })
    })
  },
  computed: {
  },
  methods: {
    openPicker () {
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      console.log(date)
      this.chooseDate = date.format('yyyy-MM')
      this.getPageData()
    },
    goBack () {
      if (window.webkit) {
        window.webkit.messageHandlers.Native_Js_tabbar.postMessage('true')
      }
      window.history.back()
    },
    changeTab (ev) {
      if (ev.target.dataset.type === '1') {
        this.isActive = true
      }
      if (ev.target.dataset.type === '2') {
        this.isActive = false
      }
    },
    change () {
      this.getPageData()
    },
    async getPageData () {
      // let obj = {
      //   p0: 'UserSL_FnRevAnalyze',
      //   p7: {
      //     RepYears: this.searchForm.startDate
      //   }
      // }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      // this.$vux.loading.hide()
      let res = await this.$xml('UserSL_FnRevAnalyze', {
        RepYears: this.chooseDate
      })
      res = res.data
      this.FnRevSummery = res.FnRevSummery[0]
      this.FnRevs = res.FnRevs
      this.FnRevRess = res.FnRevRess
      this.FnRevSources = res.FnRevSources
      this.generateColor()
      this.setRingChart(this.rings)
      this.setSmallPie(this.pie)
      this.setBarLine(this.barline)
      return res
    },
    generateColor () {
      if (this.FnRevs.length > 0) {
        let UiColor = [ '#DC81D2', '#FB9365', '#EAA674', '#FBD437', '#ACDF82', '#5CD5FE', '#60ACF2', '#FB9365', '#9C8CFD', '#DC81D2', '#F2637B', '#EAA674' ]
        if (this.FnRevs.length < 4) {
          let threeColor = ['#0DC88C', '#FB9365', '#3395FF']
          for (let i = 0; i < this.FnRevs.length; i++) {
            this.$set(this.FnRevs[i], 'background', threeColor[i])
          }
        } else if (this.FnRevs.length < 13) {
          for (let i = 0; i < this.FnRevs.length; i++) {
            this.$set(this.FnRevs[i], 'background', UiColor[i])
          }
        } else {
          let str = '0123456789abcdef'
          for (let i = 0; i < this.FnRevs.length - 14; i++) {
            let colorString = '#'
            for (let j = 0; j < 6; j++) {
              colorString += str[Math.floor(Math.random() * 16)]
            }
            UiColor.push(colorString)
          }
          for (let i = 0; i < this.FnRevs.length; i++) {
            this.$set(this.FnRevs[i], 'background', UiColor[i])
          }
        }
      }

      if (this.FnRevRess.length > 0) {
        let UiColor = [ '#DC81D2', '#FB9365', '#EAA674', '#FBD437', '#ACDF82', '#5CD5FE', '#60ACF2', '#FB9365', '#9C8CFD', '#DC81D2', '#F2637B', '#EAA674' ]
        if (this.FnRevRess.length < 13) {
          for (let i = 0; i < this.FnRevRess.length; i++) {
            this.$set(this.FnRevRess[i], 'background', UiColor[i])
          }
        } else {
          let str = '0123456789abcdef'
          for (let i = 0; i < this.FnRevRess.length - 14; i++) {
            let colorString = '#'
            for (let j = 0; j < 6; j++) {
              colorString += str[Math.floor(Math.random() * 16)]
            }
            UiColor.push(colorString)
          }
          for (let i = 0; i < this.FnRevRess.length; i++) {
            this.$set(this.FnRevRess[i], 'background', UiColor[i])
          }
        }
      }
    },
    setRingChart (rentChart) {
      var dataStyle = {
        normal: {
          label: {show: false},
          labelLine: {show: false}
        }
      }
      var placeHolderStyle = {
        normal: {
          color: 'rgba(0,0,0,0)',
          label: {show: false},
          labelLine: {show: false}
        },
        emphasis: {
          color: 'rgba(0,0,0,0)'
        }
      }
      let mySeries = []
      let nameArr = []
      let temp
      if (this.FnRevs.length === 1) {
        dataStyle.color = this.FnRevs[0].background
        mySeries = []
        let obj = {
          name: '1',
          type: 'pie',
          clockWise: false,
          radius: [40, 45],
          hoverAnimation: false,
          itemStyle: dataStyle,
          data: [
            {
              value: 90,
              name: '',
              itemStyle: {
                color: '#0DC88C'
              }
            },
            {
              value: 10,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }
          ]
        }
        obj.data[0].value = this.FnRevs[0].Rate
        obj.data[1].value = 100 - this.FnRevs[0].Rate
        obj.data[0].name = `${this.FnRevs[0].OrgName}(${this.FnRevs[0].PriPaid})`
        obj.data[0].itemStyle.normal.color = this.FnRevs[0].background
        nameArr.push({name: `${this.FnRevs[0].OrgName}(${this.FnRevs[0].PriPaid})`, rate: this.FnRevs[0].Rate})
        mySeries.push(obj)
      }
      if (this.FnRevs.length > 1) {
        for (let i = 0; i < this.FnRevs.length; i++) {
          for (let j = i + 1; j < this.FnRevs.length; j++) {
            if (this.FnRevs[j].Rate > this.FnRevs[i].Rate) {
              temp = this.FnRevs[j]
              this.FnRevs[j] = this.FnRevs[i]
              this.FnRevs[i] = temp
            }
          }
        }
        let x1 = 60
        let x2 = 65
        let myRadius = []
        for (let i = 0; i < this.FnRevs.length; i++) {
          if (i === 0) {
            myRadius = [60, 65]
          } else {
            x1 = x1 - 7
            x2 = x2 - 7
            myRadius = [x1, x2]
          }
          nameArr.push({name: `${this.FnRevs[i].OrgName}(${this.FnRevs[i].PriPaid})`, rate: this.FnRevs[i].Rate})
          let obj = {
            name: `${this.FnRevs[i].OrgName}(${this.FnRevs[i].PriPaid})`,
            type: 'pie',
            clockWise: false,
            radius: myRadius,
            center: ['20%', '50%'],
            hoverAnimation: false,

            itemStyle: {
              normal: {...dataStyle.normal, color: this.FnRevs[i].background}
            },
            data: [
              {
                value: this.FnRevs[i].Rate,
                name: '',
                itemStyle: {
                  color: this.FnRevs[i].background
                }
              },
              {
                value: 100 - this.FnRevs[i].Rate,
                name: 'invisible',
                itemStyle: placeHolderStyle
              }
            ]
          }
          mySeries.push(obj)
        }
      }
      let option = {
        legend: {
          type: 'scroll',
          orient: 'vertical',
          x: 'right',
          top: 'center',
          itemGap: 5,
          itemWidth: 18,
          itemHeight: 10,
          data: nameArr,
          textStyle: {
            color: '#999',
            rich: {
              a: {
                color: '#333'
              },
              b: {
                color: '#999',
                fontSize: 11
              }
            }
          },
          formatter: function (name) {
            let obj = nameArr.find(item => item.name === name)
            return '{a|' + obj.name + '}' + '   {b|' + obj.rate + '%}'
          }
        },
        series: mySeries
      }
      rentChart.setOption(option, true)
    },
    setSmallPie (renderChart) {
      let mydata = []
      let nameArr = []
      for (let i = 0; i < this.FnRevRess.length; i++) {
        nameArr.push({name: `${this.FnRevRess[i].ResName}(${this.FnRevRess[i].PriPaid})`, rate: this.FnRevRess[i].Rate})
        mydata.push({name: `${this.FnRevRess[i].ResName}(${this.FnRevRess[i].PriPaid})`, value: this.FnRevRess[i].PriPaid, itemStyle: { color: this.FnRevRess[i].background }})
      }
      let option = {
        legend: {
          type: 'scroll',
          orient: 'vertical',
          x: 'left',
          top: 'center',
          itemGap: 5,
          itemWidth: 18,
          itemHeight: 10,
          data: nameArr,
          textStyle: {
            color: '#999',
            rich: {
              a: {
                color: '#333'
              },
              b: {
                color: '#999',
                fontSize: 11
              }
            }
          },
          formatter: function (name) {
            let obj = nameArr.find(item => item.name === name)
            return '{a|' + obj.name + '}' + '   {b|' + obj.rate + '%}'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '80%',
            center: ['80%', '50%'],
            clickable: false,
            hoverAnimation: false,
            legend: {
              selectedMode: false
            },
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            selectedMode: false,
            data: mydata
          }
        ]
      }
      renderChart.setOption(option)
    },
    setBarLine (renderChart) {
      let xAxisData = []
      let yAxisArea = []
      let yAxisIncome = []
      for (let i = 0; i < this.FnRevSources.length; i++) {
        xAxisData.push(this.FnRevSources[i].ResName)
        yAxisArea.push(this.FnRevSources[i].BudArea)
        if (!this.FnRevSources[i].PriPaid) {
          this.FnRevSources[i].PriPaid = 100
        }
        yAxisIncome.push(this.FnRevSources[i].PriPaid)
      }
      let option = {
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          x: 'right',
          top: 'bottom',
          data: ['面积', '收入']
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          backgroundColor: 'transparent',
          show: true
        },
        xAxis: [
          {
            type: 'category',
            /* boundaryGap: [0, 0.01], */
            splitLine: {
              show: true
            }, // 网格线
            splitArea: {show: false}, // 网格区域
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
            data: xAxisData,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {show: false}, // 去除网格线
            splitArea: {show: false}, // 保留网格区域
            name: '面积',
            axisLine: {
              lineStyle: {
                color: ['rgb(204,204,204)']
              }
            },
            nameTextStyle: {
              color: '#333333'
            },
            /* min: 0,
               max: 250,
               interval: 50, */
            axisLabel: {
              show: true,
              textStyle: {
                color: '#333333'
              },
              formatter: '{value}'
            },
            axisTick: {
              show: false
            }
          },
          {
            type: 'value',
            splitLine: {show: true}, // 去除网格线
            splitArea: {show: false}, // 保留网格区域
            axisLine: {
              lineStyle: {
                color: ['rgb(204,204,204)']
              }
            },
            name: '收入',
            nameTextStyle: {
              color: '#333333'
            },
            axisLabel: {
              formatter: '{value}',
              show: true,
              textStyle: {
                color: '#333333'
              }
            },
            axisTick: {
              show: false// 关闭坐标轴刻度
            }
          }
        ],
        series: [
          {
            name: '面积',
            type: 'bar',
            data: yAxisArea,
            barWidth: 20,
            itemStyle: {
              color: '#FB9365'
            }
          },

          {
            name: '收入',
            type: 'line',
            yAxisIndex: 1,
            data: yAxisIncome,
            itemStyle: {
              color: '#0DC88C'
            }
          }
        ]
      }
      renderChart.setOption(option)
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
  .date_choose{
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #FFF;
  }

  .report_wrap{
      .time-selector{
        width: 100%;
        height: 0.88rem;
        line-height: 0.88rem;
        background: white;
        a{
          width: 2.16rem;
          margin-left: 2.89rem;

          i{
            margin-left: 0.14rem;
          }
        }

      }
      .total-top{
        height: 1.9rem;
        margin-top:10px;
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
  }
</style>
