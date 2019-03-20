<template>
  <div class="page">
    <nav-title title="建筑面积"></nav-title>
    <div class="page_bd report_wrap">
      <div class="setScroll">
        <div class="total-top margin-bottom">
            <div class="total-area">
              <p>{{BuildSummery.BudArea}}㎡</p>
              <p>总建筑面积</p>
            </div>
            <div class="contract-num">
              <p>{{BuildSummery.Num1}}</p>
              <p>建筑面积大于500合同数</p>
            </div>
        </div>
        <div class="weui-form-preview margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">建筑面积分析</label>
                <!-- <label class="weui-form-preview__value">{{currentRate}}分</label> -->
            </div>
          </div>
          <div  class="weui-form-preview__bd">
            <div class="map_bl"  ref="pie"></div>
          </div>
          <div  class="weui-form-preview__bd border-top-half" >
            <div class="map_bl"  ref="circle"></div>
          </div>
        </div>
        <div class="weui-form-preview margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">建筑面积与合同分析</label>
                <!-- <label class="weui-form-preview__value">{{currentRate}}分</label> -->
            </div>
          </div>
          <div  class="weui-form-preview__bd">
            <div class="map_bl"  style="height:170px;" ref="bars"></div>
          </div>
        </div>
    </div>
    </div>
  </div>
</template>
<script>
import ready from '@/utils/getEchars'
export default {
  name: 'building',
  components: {},
  data () {
    return {
      BuildSummery: {},
      BuildAreaAnas: [],
      ResAreaAnas: [],
      ContractAnas: []
    }
  },
  created () {
    // ready().then(echarts => {
    //   this.$nextTick(() => {
    //     this.pie = echarts.init(this.$refs.pie)
    //     this.circle = echarts.init(this.$refs.circle)
    //     this.bars = echarts.init(this.$refs.bars)
    //     this.getPageData()
    //     console.log(this.$refs.analysis.offsetHeight)
    //   })
    // })
    Promise.all([this.getPageData(), ready()]).then(arr => {
      let res = arr[0]
      let echarts = arr[1]
      this.$nextTick(() => {
        console.log(this.$refs.pie)
        this.pie = echarts.init(this.$refs.pie)
        this.circle = echarts.init(this.$refs.circle)
        this.bars = echarts.init(this.$refs.bars)
        this.setData(res)
      })
    })
  },
  methods: {
    changeTab (ev) {
      if (ev.target.dataset.type === '1') {
        this.isActive = true
      }
      if (ev.target.dataset.type === '2') {
        this.isActive = false
      }
    },
    isIos () {
      let u = navigator.userAgent
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isIOS) {
        window.webkit.messageHandlers.Native_Js_tabbar.postMessage('false')
      }
    },
    goBack () {
      if (window.webkit) {
        window.webkit.messageHandlers.Native_Js_tabbar.postMessage('true')
      }
      window.history.back()
    },
    async getPageData () {
      // let obj = {
      //   p0: 'UserSL_BuildAreaAnalyze',
      //   p7: {}
      // }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      // this.$vux.loading.hide()
      let res = await this.$xml('UserSL_BuildAreaAnalyze', {})
      console.log(res)
      return res.data
    },
    setData (res) {
      this.BuildSummery = res.BuildSummery[0]
      this.BuildAreaAnas = res.BuildAreaAnas
      this.ResAreaAnas = res.ResAreaAnas
      this.ContractAnas = res.ContractAnas
      this.generateColor()
      this.setSmallPie(this.pie)
      this.setCircleChart(this.circle)
      this.setBarsChart(this.bars)
    },
    generateColor () {
      if (this.ResAreaAnas.length > 0) {
        let UiColor = ['#5ed982', '#fb9365', '#aea1fc', '#acdf82', '#eaa674', '#f2637b', '#36cbcb', '#fbd437', '#5cd5fe', '#dc81d2', '#60acf2', '#fa4919', '#82dfbe', '#fda0e2']
        if (this.ResAreaAnas.length < 14) {
          for (let i = 0; i < this.ResAreaAnas.length; i++) {
            this.$set(this.ResAreaAnas[i], 'background', UiColor[i])
          }
        } else {
          let str = '0123456789abcdef'
          for (let i = 0; i < this.ResAreaAnas.length - 14; i++) {
            let colorString = '#'
            for (let j = 0; j < 6; j++) {
              colorString += str[Math.floor(Math.random() * 16)]
            }
            UiColor.push(colorString)
          }
          for (let i = 0; i < this.ResAreaAnas.length; i++) {
            this.$set(this.ResAreaAnas[i], 'background', UiColor[i])
          }
        }
      }
      if (this.BuildAreaAnas.length > 0) {
        let UiColor = ['#5ed982', '#fb9365', '#aea1fc', '#acdf82', '#eaa674', '#f2637b', '#36cbcb', '#fbd437', '#5cd5fe', '#dc81d2', '#60acf2', '#fa4919', '#82dfbe', '#fda0e2']
        if (this.BuildAreaAnas.length < 14) {
          for (let i = 0; i < this.BuildAreaAnas.length; i++) {
            this.$set(this.BuildAreaAnas[i], 'background', UiColor[i])
          }
        } else {
          let str = '0123456789abcdef'
          for (let i = 0; i < this.BuildAreaAnas.length - 14; i++) {
            let colorString = '#'
            for (let j = 0; j < 6; j++) {
              colorString += str[Math.floor(Math.random() * 16)]
            }
            UiColor.push(colorString)
          }
          for (let i = 0; i < this.BuildAreaAnas.length; i++) {
            this.$set(this.BuildAreaAnas[i], 'background', UiColor[i])
          }
        }
      }
    },
    setSmallPie (renderChart) {
      let mydata = []
      let nameArr = []
      for (let i = 0; i < this.BuildAreaAnas.length; i++) {
        nameArr.push({name: `${this.BuildAreaAnas[i].OrgName}(${this.BuildAreaAnas[i].BudArea})`, ...this.BuildAreaAnas[i]})
        mydata.push({name: `${this.BuildAreaAnas[i].OrgName}(${this.BuildAreaAnas[i].BudArea})`, value: this.BuildAreaAnas[i].BudArea, itemStyle: { color: this.BuildAreaAnas[i].background }})
      }
      console.log(this.BuildAreaAnas)
      console.log(mydata, '---setSmallPie')
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
            return '{a|' + obj.name + '}' + '   {b|' + obj.Rate + '%}'
          }
        },
        series: [
          {
            type: 'pie',
            clickable: false,
            radius: ['35%', '45%'],
            center: ['80%', '50%'],
            hoverAnimation: false,
            legend: {
              selectedMode: false
            },
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%\n{b}'
              },
              emphasis: {
                show: true,
                textStyle: {
                // fontSize: '30',
                  fontWeight: 'bold'
                }
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
    setCircleChart (renderChart) {
      let mydata = []
      let nameArr = []
      for (let i = 0; i < this.ResAreaAnas.length; i++) {
        nameArr.push({name: this.ResAreaAnas[i].ResName, ...this.ResAreaAnas[i]})
        mydata.push({name: this.ResAreaAnas[i].ResName, value: this.ResAreaAnas[i].BudArea, itemStyle: { color: this.ResAreaAnas[i].background }})
      }
      let option = {
        /* tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          }, */
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
            return '{a|' + obj.name + '}' + '   {b|' + obj.Rate + '%}'
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%\n{b}'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: mydata
          }
        ]
      }

      renderChart.setOption(option)
    },
    setBarsChart (renderChart) {
      let xData = []
      let Num1 = []
      let Num2 = []
      for (let i = 0; i < this.ContractAnas.length; i++) {
        xData.push(this.ContractAnas[i].OrgName)
        Num1.push(this.ContractAnas[i].Num1)
        Num2.push(this.ContractAnas[i].Num2)
      }
      console.log(Num2)
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          x: 'center',
          top: 'bottom',
          data: ['进场公开招租数', '建筑面积大于500的合同数']
        },
        grid: {
          top: '5%',
          left: '0%',
          right: '3%',
          bottom: '15%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: ['rgb(204,204,204)']
            }
          },
          splitArea: {
            interval: 1,
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#333333'
            }
          },
          boundaryGap: [0, 0.01],
          axisTick: {
            show: false// 关闭坐标轴刻度
          }
        },
        xAxis: {
          type: 'category',
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
            textStyle: {
              color: '#333333'
            }
          },
          data: xData,
          axisTick: {
            show: false// 关闭坐标轴刻度
          }
        },
        series: [
          {
            name: '进场公开招租数',
            type: 'bar',
            data: Num2,
            itemStyle: {
              color: '#FB9365'
            },
            barWidth: 10,
            barGap: '15%'
          },
          {
            name: '建筑面积大于500的合同数',
            type: 'bar',
            data: Num1,
            itemStyle: {
              color: '#3395FF'
            },
            barWidth: 10,
            barGap: '15%'
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
    height:300px;
  }
  .report_wrap{
    .total-top{
      height: 1.9rem;
      margin-top: 15px;
      display: -webkit-flex;
      display: -webkit-box;
      display: flex;
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
        margin-left:0.22rem;
        text-align: center;
        p{
          &:nth-child(1){
            font-size: 0.38rem;
            color:#3395ff;
            margin-top: 0.48rem;

          }
          &:nth-child(2){
            font-size: 0.28rem;
            color:#333333;
            margin-top: 0.13rem;
          }
        }
      }
    }
  }
</style>
