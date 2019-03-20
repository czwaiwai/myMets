<template>
  <div class="page">
    <nav-title title="租赁分析"></nav-title>
    <div class="page_bd">
      <div class="weui-flex  text-center padding-v padding15-h">
        <dl  class="weui-flex__item">
          <dt class="fs20" style="color: #FF4E00;">{{rentSummery.BudArea}}<small>㎡</small></dt>
          <dd class="fs14">已出租面积</dd>
        </dl>
        <dl class="weui-flex__item">
          <dt class="fs20" style="color: #3395ff;">{{rentSummery.Num}}<small>户</small></dt>
          <dd class="fs14">企业户数</dd>
        </dl>
      </div>
      <div class="weui-form-preview margin-bottom">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
              <label class="weui-form-preview__label">租赁状态分析</label>
          </div>
        </div>
        <div  class="weui-form-preview__bd">
          <div class="map_bl" style="height:180px;"  ref="myCirle"></div>
        </div>
      </div>
      <div class="weui-form-preview margin-bottom">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
              <label class="weui-form-preview__label">客户类型分析</label>
          </div>
        </div>
        <div  class="weui-form-preview__bd">
          <div class="weui-flex text-center">
            <div class="weui-flex__item">
              <i class="iconfont icon-loupan" style="font-size:36px;"></i>
              <dl>
                <dt class="fs23 line-height" style="color: #00B3F6;">{{company.Num}}</dt>
                <dd class="fs17 dark_33">{{company.CstType}}租户</dd>
              </dl>
            </div>
            <div class="weui-flex__item">
              <i class="iconfont icon-fangyuan" style="font-size:36px;"></i>
              <dl>
                <dt class="fs23 line-height" style="color: #F00017;">{{personal.Num}}</dt>
                <dd class="fs17 dark_33">{{personal.CstType}}租户</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ready from '@/utils/getEchars'
import navTitle from '@/components/navTitle'
export default {
  name: 'rent',
  components: {navTitle},
  data () {
    return {
      rentSummery: {},
      personal: {},
      rentAreaAna: [],
      company: {}
    }
  },
  created () {
    Promise.all([ready(), this.getPageData()]).then(arr => {
      let echarts = arr[0]
      let res = arr[1]
      console.log(res, '--------------')
      this.$nextTick(() => {
        this.myCirle = echarts.init(this.$refs.myCirle)
        this.rentSummery = res.RentSummery[0]
        this.rentAreaAna = res.RentAreaAna.filter(item => {
          return item.RentName
        })
        this.personal = res.RendContract[0]
        this.company = res.RendContract[1]
        this.setSmallPie(this.myCirle)
      })
    })
  },
  methods: {
    async getPageData () {
      let res = await this.$xml('UserSL_RentAnalyze', {})
      console.log(res)
      return res.data
    },
    setSmallPie (renderChart) {
      let mydata = []
      let nameArr = []
      for (let i = 0; i < this.rentAreaAna.length; i++) {
        nameArr.push({name: `${this.rentAreaAna[i].RentName}(${this.rentAreaAna[i].BudArea})`, ...this.rentAreaAna[i]})
        mydata.push({name: `${this.rentAreaAna[i].RentName}(${this.rentAreaAna[i].BudArea})`, value: this.rentAreaAna[i].BudArea, itemStyle: { color: this.rentAreaAna[i].background }})
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
            color: ['#F2637B', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', '#FB9365', '#9C8CFD', '#DC81D2', '#96BFFF'],
            clickable: false,
            radius: ['55%', '70%'],
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
    }
  }
}
</script>

<style scoped>
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
  dl.weui-flex__item+ dl.weui-flex__item {
    margin-left: 10px;
  }
  dl.weui-flex__item {
      height: 95px;
      background: #FFF;
      border-radius: 10px;
      padding-top: 25px;
  }
</style>
