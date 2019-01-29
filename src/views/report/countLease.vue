<template>
  <div class="page">
    <mt-header title="租赁统计">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <!-- <search v-model="search"></search> -->
        <search v-model="search" url="UserCS_GetRectificationGrpInfo"  searchName="GrpName" :noFocus="true" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <div @click="filterVisible = true" class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
    </div>
    <filter-modal :form.sync='filterForm' v-model="filterVisible" @submit="filterSubmit">
      <filter-date-end name="date" v-model="filterForm.date">租赁时间</filter-date-end>
    </filter-modal>
    <page-list ref="pageList" :params="pageConfig.params" ulClass="table_line light_bg"  :config="this.pageConfig" @listDone="listDone">
      <div slot="header" >
        <div  class="weui-form-preview  margin-bottom" >
            <div class="weui-form-preview__hd">
              <div class="weui-form-preview__item">
                  <label class="weui-form-preview__label">地块数量</label>
                  <label class="weui-form-preview__value">{{totalNum}}</label>
              </div>
            </div>
            <div ref="mapWrap"  class="weui-form-preview__bd">
              <div v-show="mapShow" class="map_bl" ref="map1"></div>
              <div v-show="!mapShow" class="text-center">
                <img style="max-width: 140px;" src="../../assets/img/report/noData.png" >
                <p>暂无数据</p>
              </div>
            </div>
        </div>
        <div class="light_bg">
          <ul class="table_line">
            <li class="table_line_hd">
              <div  class="weui-flex table_item">
                <div class="col fs12 text-center weui-flex__item"  >地块名称</div>
                <div class="col fs12 text-center" style="width:1.8rem;">已租面积㎡</div>
                <div class="col fs12 text-center" style="width: 1.8rem;">空置面积㎡</div>
                <div class="col fs12 text-center" style="width: 2rem;">最长租赁时间</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <template slot-scope="scope" >
          <div  class="weui-flex table_item">
            <div class="col fs14 text-center weui-flex__item dot_line"  >{{scope.item.grpName}}</div>
            <div class="col fs14 text-center" style="width:1.8rem;">{{scope.item.yCZBudArea | float2}}</div>
            <div class="col fs14 text-center" style="width: 1.8rem;">{{scope.item.kZBudArea  | float2}}</div>
            <div class="col fs14 text-center" style="width: 2rem;">{{scope.item.maxTime}}</div>
          </div>
          <div  class="table_item_info border-top-half">
            <div class="padding15-h padding5-v ">
              <p class="text-left">所属项目:{{scope.item.orgName}}</p>
            </div>
          </div>
      </template>
    </page-list>

  </div>
</template>
<script>
import Search from '@/components/search'
import mapReady from '@/utils/getEchars'
import PageList from '@/components/pageList'
import FilterModal from '@/components/filterModal'
import FilterDateEnd from '@/components/filter/dateEnd'
export default {
  name: 'repairDetail',
  components: {Search, PageList, FilterModal, FilterDateEnd},
  data () {
    return {
      mapShow: true,
      search: '',
      totalNum: '',
      currDate: '',
      filterVisible: false,
      filterForm: {
        date: '2012-01-01,2019-01-31'
      },
      pageConfig: {}
    }
  },
  created () {
    this.mapReady = mapReady()
    // new Date()
    this.filterForm.date = ''
    this.mapNeedInit = true
    this.pageConfig = this.pageListConfig({pageSize: 20})
  },
  methods: {
    searchRes (item) {
      console.log(item, 'searchRes')
      this.pageConfig.params.GrpID = item.ID
      this.mapNeedInit = true
      this.$refs.pageList.refresh()
    },
    searchCancel () {
      this.mapNeedInit = true
      this.pageConfig.params.GrpID = ''
      this.$refs.pageList.refresh()
    },
    filterSubmit (form) {
      this.mapNeedInit = true
      let arr = form.date.split(',')
      this.pageConfig.params.Stime = arr[0]
      this.pageConfig.params.Etime = arr[1]
      this.$refs.pageList.refresh()
    },
    async mapInit (data) {
      let echarts = await this.mapReady
      let width = (parseInt(window.getComputedStyle(this.$refs.mapWrap).width) - 30) + 'px'
      this.$refs.map1.style.width = width
      this.map1 = echarts.init(this.$refs.map1)
      this.setCharOption(data)
    },
    listDone (list) {
      this.mapShow = true
      if (this.mapNeedInit && list[0]) {
        this.mapNeedInit = false
        let data = this.formatMapData(list[0])
        this.mapInit(data)
      }
      if (!list[0]) {
        this.mapShow = false
      }
    },
    pageListConfig (params) {
      var that = this
      return {
        name: 'countLease',
        xml: true,
        url: 'UserCS_ReportPropertyLeasing',
        params: {
          'GrpID': '',
          'Stime': '2012-01-01',
          'Etime': '2019-01-31',
          ...params
        },
        format: function (data) {
          // console.log(data, '---------------------------------')
          // console.log(data, 'what---???')

          return that.$toLower(data)
        }
      }
    },
    formatMapData (data) {
      // Architecture 建筑面积（总面积）
      // RentAlready 已租面积
      // Vacant 空置面积
      this.totalNum = data.grpCount
      let fen = (data.rentAlready - 0) + (data.vacant - 0) + (data.architecture - 0)
      let rateRent = parseFloat(data.rentAlready / fen * 100).toFixed(1)
      let rateVa = parseFloat(data.vacant / fen * 100).toFixed(1)
      let rateArch = parseFloat(data.architecture / fen * 100).toFixed(1)
      let arr = [
        {name: `已租面积(${data.rentAlready}㎡) ${rateRent}%`, value: data.rentAlready},
        {name: `空置面积(${data.vacant}㎡) ${rateVa}%`, value: data.vacant},
        {name: `总建筑面积(${data.architecture}㎡) ${rateArch}%`, value: data.architecture}
      ]
      return {
        title: `总建筑面积(${data.architecture}㎡)`,
        data: arr
      }
    },
    setCharOption (obj) {
      let option = {
        // title: {
        //   text: obj.title,
        //   x: 'left',
        //   textStyle: {
        //     fontSize: 14,
        //     color: '#333',
        //     fontWeight: 500
        //   }
        // },
        color: ['#46A9FC', '#ACDF82', '#A5D6FF', '#EAA674', '#FBD437', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '0%',
          top: 40,
          bottom: 20,
          itemGap: 5,
          itemWidth: 18,
          itemHeight: 10,
          data: obj.data,
          // formatter: function (name) {
          //   return name
          //   // return '{a|' + obj.name + '}' + ' {b|出租率' + obj.czl + '%}'
          // },
          textStyle: {
            color: '#333',
            rich: {
              a: {
                color: '#333'
              },
              b: {
                color: '#999',
                fontSize: 11
              }
            }
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '65%',
            center: ['20%', '50%'],
            data: obj.data,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%\n{b}'
              },
              emphasis: {
                show: false,
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
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }
        ]
      }
      this.map1.setOption(option)
      return option
    }
  }
}
</script>

<style lang="scss">
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
.table_line {
  & .table_line_hd {
    font-weight:bold;
    background:#ECECEC;
  }
  background:#FFF;
  & li {
    border-bottom:1px solid #ECECEC;
  }
  & .table_item_info {
    background:#F5FAFF;
    text-align: center;
  }
  & .table_item {
    height:42px;
    line-height: 42px;
    padding: 0 5px;
    & .col {
      padding:0  5px;
    }
    & .col  + .col{
      border-left:1px solid #ECECEC;
    }
  }
}
</style>
