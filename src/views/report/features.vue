<template>
  <div class="page">
    <!-- <mt-header  title="特色园分析">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="特色园分析"></nav-title>
    <div class="page_bd report_wrap">
      <div @click="openPicker" class="date_choose">
        <span>{{chooseDate | dateChina}}<i class="iconfont icon-xiala" ></i></span>
      </div>
     <div class="outter">
      <div class="total-top">
        <div class="total-area">
          <p>{{FeatureSummery.BudArea ? FeatureSummery.BudArea : '0.00'}}㎡</p>
          <p>总建筑面积</p>
        </div>
        <div class="contract-num">
          <p>￥{{FeatureSummery.AvgPaid ? FeatureSummery.AvgPaid : '0.00'}}元</p>
          <p>当月平均租金</p>
        </div>
      </div>
      <div class="rental-area-statistics">
        <div class="rent-title">建筑面积统计</div>
        <div class="rent-body" v-if="rentBody">
           <div class="pieChart" ref="ring"></div>
          <div class="percentage">
            <div class="percentage-child1">
              <div v-for="(item,index) in FeatureFnRevs" :key="index" :style="{background:item.background}" ></div>
            </div>
            <div class="percentage-child2">
              <div v-for="(item,index) in FeatureFnRevs" :key="index">{{item.FloorNum+'层('+item.BudArea+')'}}</div>

                  </div>
                  <div class="percentage-child3">
                    <div v-for="(item,index) in FeatureFnRevs" :key="index">{{item.BudRate}}%</div>
                  </div>

                </div>
              </div>
              <!-- <div class="noData" v-if="!rentBody">
                <img src="../../../assets/noData.png"/>
                <p>暂无数据</p>
              </div> -->
              <div v-if="!rentBody" class="text-center padding-top">
                <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
                <p>暂无数据</p>
              </div>
            </div>
        <div class="month-rent">
          <div class="current-rent">当月平均租金</div>
          <div class="statistical-table"  ref="bars" v-if="statistical"></div>
          <!-- <div class="noData" v-if="!statistical">
            <img src="../../../assets/noData.png"/>
            <p>暂无数据</p>
          </div> -->
          <div v-if="!statistical" class="text-center padding-top" style="margin-top:-35px">
            <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
            <p>暂无数据</p>
          </div>
          <div class="current-summary">
            <span></span>
            <span>当月平均租金</span>
          </div>
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
// import { Toast, Datetime, Popup } from 'vux'
import navTitle from '@/components/navTitle'
export default {
  name: 'features',
  components: {navTitle},
  data () {
    return {
      searchForm: {
        startDate: ''
      },
      chooseDate: '',
      pickerVisible: new Date(),
      isActive: true,
      FeatureSummery: {},
      FeatureFnRevs: [],
      rentBody: true,
      statistical: true
    }
  },
  created () {
    let dates = new Date()
    this.chooseDate = dates.format('yyyy-MM')
    this.searchForm.startDate = dates.getFullYear() + '-' + (dates.getMonth() + 1 < 10 ? '0' + (dates.getMonth() + 1) : (dates.getMonth() + 1))
    ready().then(echarts => {
      this.$nextTick(() => {
        this.ring = echarts.init(this.$refs.ring)
        this.bars = echarts.init(this.$refs.bars)
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
      history.back()
      // window.location.href = 'javascript:window.history.back()'
    },
    change () {
      this.getPageData()
    },
    generateColor () {
      if (this.FeatureFnRevs.length > 0) {
        let UiColor = ['#5ed982', '#fb9365', '#aea1fc', '#acdf82', '#eaa674', '#f2637b', '#36cbcb', '#fbd437', '#5cd5fe', '#dc81d2', '#60acf2', '#fa4919', '#82dfbe', '#fda0e2']
        if (this.FeatureFnRevs.length < 14) {
          for (let i = 0; i < this.FeatureFnRevs.length; i++) {
            this.$set(this.FeatureFnRevs[i], 'background', UiColor[i])
          }
        } else {
          let str = '0123456789abcdef'
          for (let i = 0; i < this.FeatureFnRevs.length - 14; i++) {
            let colorString = '#'
            for (let j = 0; j < 6; j++) {
              colorString += str[Math.floor(Math.random() * 16)]
            }
            UiColor.push(colorString)
          }
          for (let i = 0; i < this.FeatureFnRevs.length; i++) {
            this.$set(this.FeatureFnRevs[i], 'background', UiColor[i])
          }
        }
      }
    },
    async getPageData () {
      // let obj = {
      //   p0: 'UserSL_FeatureAnalyze',
      //   p7: {
      //     RepYears: this.searchForm.startDate
      //   }
      // }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      // this.$vux.loading.hide()
      let data = await this.$xml('UserSL_FeatureAnalyze', {
        RepYears: '2018-12'
      })
      let res = data.data
      this.FeatureSummery = res.FeatureSummery[0]
      this.FeatureFnRevs = res.FeatureFnRevs
      this.generateColor()
      if (res.FeatureFnRevs.length === 1) {
        if (res.FeatureFnRevs[0].BudRate) {
          this.setRingChart(this.ring)
          this.rentBody = true
        } else {
          this.rentBody = false
        }

        if (res.FeatureFnRevs[0].FloorNum && res.FeatureFnRevs[0].PriPaid) {
          this.setBarsChart(this.bars)
          this.statistical = true
        } else {
          this.bars.clear()
          this.statistical = false
        }
      }

      if (res.FeatureFnRevs.length > 1) {
        this.setRingChart(this.ring)
        this.rentBody = true
        for (let i = 0; i < this.FeatureFnRevs.length; i++) {
          if (this.FeatureFnRevs[i].FloorNum && this.FeatureFnRevs[i].AvgPaid) {
            this.setBarsChart(this.bars)
            this.statistical = true
          } else {
            this.bars.clear()
            this.statistical = false
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
      if (this.FeatureFnRevs.length === 1) {
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
                color: '#3395ff'
              }
            },
            {
              value: 10,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }
          ]
        }
        obj.data[0].value = this.FeatureFnRevs[0].BudRate
        obj.data[1].value = 100 - this.FeatureFnRevs[0].BudRate
        obj.data[0].name = this.FeatureFnRevs[0].FloorNum
        obj.data[0].itemStyle.color = this.FeatureFnRevs[0].background
        mySeries.push(obj)
      }
      if (this.FeatureFnRevs.length > 1) {
        let x1 = 40
        let x2 = 45
        let myRadius = []
        for (let i = 0; i < this.FeatureFnRevs.length; i++) {
          if (i === 0) {
            myRadius = [40, 45]
          } else {
            x1 = x1 - 10
            x2 = x2 - 10
            myRadius = [x1, x2]
          }
          let obj = {
            name: this.FeatureFnRevs[i].FloorNum,
            type: 'pie',
            clockWise: false,
            radius: myRadius,
            hoverAnimation: false,
            itemStyle: dataStyle,
            data: [
              {
                value: this.FeatureFnRevs[i].BudRate,
                name: '',
                itemStyle: {
                  color: this.FeatureFnRevs[i].background
                }
              },
              {
                value: 100 - this.FeatureFnRevs[i].BudRate,
                name: 'invisible',
                itemStyle: placeHolderStyle
              }
            ]
          }

          mySeries.push(obj)
        }
      }
      let option = {
        series: mySeries
      }

      rentChart.setOption(option)
    },
    setBarsChart (renderChart) {
      let xData = []
      let Num1 = []
      for (let i = 0; i < this.FeatureFnRevs.length; i++) {
        xData.push(this.FeatureFnRevs[i].FloorNum + '层')
        Num1.push(this.FeatureFnRevs[i].AvgPaid)
      }
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '12.8125%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          splitLine: {show: true},
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
          axisLine: {
            lineStyle: {
              color: ['rgb(204,204,204)']
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
          axisLabel: {
            show: true,
            textStyle: {
              color: '#333333'
            }
          },
          axisLine: {
            lineStyle: {
              color: ['rgb(204,204,204)']
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
            data: Num1,
            itemStyle: {
              color: '#FB9365'
            },
            barWidth: 20,
            barGap: '15%'
          }
        ]
      }
      renderChart.setOption(option, true)
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
   .total-top{
      height: 1.9rem;
      margin-top: 0.22rem;
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
        margin-left: 0.22rem;
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
            margin-top: 0.08rem;

          }
        }
      }
    }

  .slide-top-enter, .slide-top-leave-to {
    opacity: 0;
    transform:translate3d(0,100%,0);
  }
  .slide-top-enter-active, .slide-top-leave-active {
    transition: all .3s ease;
  }
  .slide-top-enter-to, .slide-top-leave {
    opacity: 1;
    transform:translate3d(0,0,0);
  }

  .slide-bottom-enter, .slide-bottom-leave-to {
    opacity: 0;
    transform:translate3d(0,-100%,0);
  }
  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: all .3s ease;
  }
  .slide-bottom-enter-to, .slide-bottom-leave {
    opacity: 1;
    transform:translate3d(0,0,0);
  }
  /*.fade-enter-active, .fade-leave-active {*/
  /*transition: opacity .5s*/
  /*}*/
  /*.fade-enter, .fade-leave-active {*/
  /*opacity: 0*/
  /*}*/
  .slide-next {
    height: 18px;
    overflow: hidden;
    text-align: center;
  }
  .icon_sort {
    position: relative;
    padding-right: 5px;
    &:before{
      content: "";
      border-style: solid;
      border-color: #333 transparent;
      border-width: 5px 5px 0 5px;
      position: absolute;
      bottom: 13px;
      right: 5px;
    }
    &:after{
      content: "";
      border-style: solid;
      border-color: #333 transparent;
      border-width: 0px 5px 5px 5px;
      position: absolute;
      top: 13px;
      right: 5px;
    }
  }
  .icon_sort.top {
    &:before {
      border-color: #ff4e00 transparent;
    }
  }
  .icon_sort.bottom {
    &:after {
      border-color: #ff4e00 transparent;
    }
  }
  .re_page {
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction: column;
  }
  .re_page_bd {
    flex:1;
    overflow:hidden;
  }
  .modal {
    position: absolute;
    top: 1.76rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow:hidden;
    background:#FFF;
    /*height:100%;*/
    /*width:100%;*/
  }
  .modal .re_page {
    height:100%;
  }
  .back{
    color:#FFF;
    position:absolute;
    left:0.2rem;
  }
  .back .vux-x-icon {
    fill: #FFF;
    vertical-align: middle;
    margin-top: -0.05rem;
  }
  .re_header {
    height: 0.88rem;
    background-color: #303642;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
    font-size: 0.34rem;
    color: #fff;
    line-height: 0.88rem;
    box-sizing: border-box;
    position:relative;
    width: 100%;
    top: 0;
    z-index: 510;
  }

  .text-center{
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
  .fs17 {
    font-size:17px;
  }
  .fs15 {
    font-size:15px;
  }
  .dark_99 {
    color:#999999;
  }

  .report_wrap{
    .outter{
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

        .rental-area-statistics{
          width: 100%;
          padding-bottom: 0.44rem;
          background: white;
          margin-top: 0.22rem;
          border:0.01rem solid rgba(233, 233, 233, 1);
          .rent-title{
            width: 96.1333%;
            height: 0.96rem;
            line-height: 0.96rem;
            color: #333333;
            font-size: 0.34rem;
            border-bottom: 0.01rem solid #ECECEC;
            margin-left: 0.29rem;
          }

          .rent-body{
            width: 100%;
            height: 2.89rem;
            overflow-y: auto;
            .pieChart{
              width: 2.06rem;
              height: 2.06rem;
              margin-top: 0.31rem;
              margin-left: 0.89rem;
              float: left;
            }

            .percentage{
              float: right;
              margin-right:0.79rem;
              margin-top: 0.31rem;
              .percentage-child1{
                float: left;
                div{
                  width:0.28rem;
                  height:0.14rem;
                  border-radius:0.05rem;

                  &:nth-child(n+2){
                    margin-top: 0.33rem;
                  }

                }
              }

              .percentage-child2{
                float: left;
                margin-left: 0.08rem;
                line-height: 0.12rem;
                div{
                  color: #333333;
                  font-size: 0.24rem;
                  height: 0.23rem;
                  &:nth-child(n+2){
                    margin-top: 0.24rem;
                  }

                }
              }

              .percentage-child3{
                margin-left: 0.34rem;
                float: left;
                line-height: 0.19rem;
                div{
                  color: #999999;
                  font-size: 0.22rem;
                  &:nth-child(n+2){
                    margin-top: 0.29rem;
                  }

                }
              }

            }

          }

          .noData{
            width: 100%;
            height: 2.89rem;
            position: relative;
            img{
              width: 2.83rem;
              height: 1.51rem;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
            }
            p{
              position: absolute;
              top: 80%;
              left: 50%;
              transform: translateX(-50%);
            }

          }

        }
        .month-rent{
          width: 100%;
          height: 5.73rem;
          background: white;
          margin-top: 0.22rem;

          .current-rent{
            width: 96.1333%;
            height: 0.96rem;
            line-height: 0.96rem;
            margin-left: 0.29rem;
            font-size: 0.34rem;
            border-bottom: 0.01rem solid #ECECEC;
          }

          .statistical-table{
            width: 6.84rem;
            height: 3.20rem;
            margin-top: 0.41rem;
            ul{
              float: left;
              height: 3.2rem;
              margin-left: 0.22rem;
              margin-top: 0.41rem;
              line-height: 0.2rem;
              li{
                &:nth-child(1){

                }
                &:nth-child(2){
                  margin-top: 0.42rem;
                }
                &:nth-child(3){
                  margin-top: 0.42rem;
                }
                &:nth-child(4){
                  margin-top: 0.42rem;
                }
                &:nth-child(5){
                  margin-top: 0.42rem;
                }
                &:nth-child(6){
                  margin-top: 0.42rem;
                }
              }
            }

            .form-container{

              width: 6.17rem;
              height: 3.15rem;
              // background: url("../../../assets/form.png");
              background-size: 100% 100%;
              float: left;
              margin-top: 0.51rem;
              margin-left: 0.2rem;
            }

            .texts{
              clear: both;
              margin-top: 0.18rem;
              span{
                color: #333333;
                font-size: 0.28rem;
                &:nth-child(1){
                  margin-left: 1.6rem;
                }

                &:nth-child(2){
                  margin-left:0.7rem;
                }

                &:nth-child(3){
                  margin-left:0.7rem;
                }

                &:nth-child(4){
                  margin-left:0.7rem;
                }

              }
            }

          }
          .noData{
            width: 100%;
            height: 2.89rem;
            position: relative;
            img{
              width: 2.83rem;
              height: 1.51rem;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
            }
            p{
              position: absolute;
              top: 80%;
              left: 50%;
              transform: translateX(-50%);
            }
          }
          .current-summary{
            margin-top: 0.15rem;
            span{
              &:nth-child(1){
                display: inline-block;
                width:0.28rem;
                height:0.14rem;
                background:rgba(251,147,101,1);
                border-radius:0.05rem;
                margin-left: 0.35rem;
              }

              &:nth-child(2){
                font-size:0.24rem;
                color: #333333;
                margin-left: 0.09rem;
              }

            }
          }
        }

    }

  }

  .header{
    position: relative;
    height: 0.88rem;
    padding: 0 .3rem;
    font-size: .3rem;
    line-height: 0.88rem;
    color: #333;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .icon-gengduo1{
      position: absolute;
      top: .2rem;
      right: .3rem;
      display: block;
      width: .4rem;
      height: .4rem;
      line-height: .4rem;
      font-size: 0.4rem;
      color: #999;
      text-align: right;
    }
  }
  .re_title {
    position:relative;
    overflow: hidden;
    height:0.96rem;
    font-size:17px;
    line-height:0.96rem;
    padding:0 15px;
  }
  .re_title:after {
    content:"";
    bottom:0;
    position:absolute;
    left:15px;
    width: 100%;
    border-bottom: 1px solid #e3e3e3;
  }
  .re_content {
    padding:0 0.3rem;
  }
  .re_bl_warp {
    padding:15px;
    .re_bl_item {
      text-align:center;
      background:#FFF;
      border-radius:5px;
      height:1.9rem;
    }
    .re_bl_item dl {
      padding-top:0.4rem;
    }
    .re_bl_item dt{
      font-size:24px;
      padding-bottom:5px;
    }
    .re_bl_item dd {
      font-size:17px;
    }
    .re_bl_item + .re_bl_item {
      margin-left:15px;
    }
  }
  .re_section {
    background:#FFF;
    margin-bottom:0.2rem;
  }
  .re_item_info {

    background:#F8F8F8;
    padding:0.2rem 0.3rem;
    margin:0 -0.3rem;
    text-align:center;
    & dt {
      padding-bottom: 0.1rem;
    }
  }
  .re_table_detail {
    background:#FFF;
    padding-bottom:0.3rem;
    overflow: hidden;
    & .hd {
      color:#999999;
      font-size:0.3rem;
    }
    & li .re_detail_item{
      text-align:center;
      font-size:0.3rem;
      height:0.80rem;
      line-height:0.80rem;
      position: relative;
      z-index: 1;
      background: #FFF;
      .bf {
        color:#0095FD;
        overflow:hidden;
      }

    }
  }
  .search-date-popup {
    background:#FFF;
    padding:0.2rem 0.3rem;
    .form_item {
      height:0.8rem;
      line-height:0.8rem;
      display:flex;
      margin-bottom:0.3rem;
    }
    .form_item label {
      font-size:0.3rem;
      margin-right:0.2rem;
    }
    .form_item > div  {
      flex:1;
      position:relative;
      border:1px solid #e3e3e3;
    }
    .form_item  input {
      padding-left:0.3rem;
      height:0.76rem;
      line-height:0.76rem;
      font-size:0.3rem;
      width:100%;
    }
    .form_item i {
      position:absolute;
      font-size: 0.4rem;
      right:0.1rem;
      color:#666;
    }
    .btn_wrap {
      text-align:center;
      .btn_reset {
        width:2.5rem;
        border:1px solid #3395ff;
        color:#3395ff;
        border-radius:0.2rem;
        height:0.66rem;
      }
      .btn_sure{
        margin-left:20px;
        width:2.5rem;
        background:#3395ff;
        border:1px solid #3395ff;
        color:#FFF;
        border-radius:0.2rem;
        height:0.66rem;
      }
    }
  }
</style>
