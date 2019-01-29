<template>
  <div class="page">
    <mt-header title="权证统计">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <search v-model="search" url="UserCS_GetRectificationGrpInfo"  searchName="GrpName" :noFocus="true" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <div @click="filterVisible = true" class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
    </div>
    <filter-modal :form.sync='filterForm' v-model="filterVisible" @submit="filterSubmit">
        <filter-date name="date" v-model="filterForm.date">截止时间</filter-date>
        <!-- <filter-date-end name="date2" v-model="filterForm.date2" >合同期限</filter-date-end>
        <filter-radio name="group" v-model="filterForm.group">合同状态</filter-radio>
        <filter-checkbox name="group1" v-model="filterForm.group1">多选</filter-checkbox> -->
    </filter-modal>
    <div class="page_bd">
       <div class="weui-form-preview  margin-bottom" >
            <div class="weui-form-preview__hd">
              <div class="weui-form-preview__item">
                  <label class="weui-form-preview__label">权证类型</label>
                  <label class="weui-form-preview__value"></label>
              </div>
            </div>
            <div ref="mapWrap" class="weui-form-preview__bd">
              <div v-show="mapShow" class="map_bl"  ref="map1">
                统计图
              </div>
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
                <div class="col fs12 text-center weui-flex__item"  >权证类型</div>
                <div class="col fs12 text-center" style="width:1.6rem;">权证数量</div>
                <div class="col fs12 text-center" style="width: 1.1rem;">正常</div>
                <div class="col fs12 text-center" style="width: 1.1rem;">借出</div>
                <div class="col fs12 text-center" style="width: 1.1rem;">历史</div>
              </div>
            </li>
            <li v-for="(item,index) in list" :key="index">
              <div  class="weui-flex table_item">
                <div @click="routeDetail(item)" class="col fs14 text-center main_color weui-flex__item dot_line" >{{item.propertyRightCardTypeName}}</div>
                <div class="col fs14 text-center" style="width:1.6rem;">{{item.total}}</div>
                <div class="col fs14 text-center" style="width: 1.1rem;">{{item.normalCount}}</div>
                <div class="col fs14 text-center" style="width: 1.1rem;">{{item.lentCount}}</div>
                <div class="col fs14 text-center" style="width: 1.1rem;">{{item.historyCount}}</div>
              </div>
            </li>
          </ul>
        </div>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import Search from '@/components/search'
import mapReady from '@/utils/getEchars'
import FilterModal from '@/components/filterModal'
import FilterDate from '@/components/filter/date'
// import FilterRadio from '@/components/filter/radio'
// import FilterCheckbox from '@/components/filter/checkbox'
// import FilterDateEnd from '@/components/filter/dateEnd'
export default {
  name: 'warrant',
  components: {Search, FilterModal, FilterDate},
  data () {
    return {
      mapShow: true,
      filterForm: {
        date: ''
      },
      search: '',
      list: [],
      filterVisible: false
    }
  },
  created () {
    this.currDate = (new Date()).format('yyyy-MM-dd')
    this.filterForm.date = this.currDate
    this.grpId = ''
    this.getPageData()
  },
  computed: {
    mapData () {
      let total = this.list.reduce((before, item) => before + (item.total - 0), 0)
      let arr = this.list.reduce((before, item, index) => {
        if (index < 6) {
          before.push({
            name: item.propertyRightCardTypeName + '(' + item.total + ') ' + parseFloat((item.total / total) * 100).toFixed(1) + '%',
            value: item.total,
            rate: parseFloat((item.total / total) * 100).toFixed(1)
          })
        } else {
          let res = before[before.length - 1]
          res.value = (res.value - 0) + (item.total - 0)
          res.rate = parseFloat((res.value / total) * 100).toFixed(1)
          res.name = '其他' + '(' + item.value + ')' + ' ' + res.rate + '%'
        }
        return before
      }, [])
      return arr
    }
  },
  methods: {
    searchRes (item) {
      console.log(item, 'searchRes')
      this.grpId = item.ID
      this.getPageData()
    },
    searchCancel () {
      this.grpId = ''
      this.getPageData()
    },
    filterSubmit (form) {
      console.log(form, '过滤的结果')
      this.currDate = form.date
      this.getPageData()
    },
    async getPageData () {
      let p0 = 'UserCS_ReportPropertyRightCard'
      let arr = await Promise.all([this.$xml(p0, {
        FinanceDate: this.currDate,
        GrpID: this.grpId
      }), mapReady()])
      let res = arr[0]
      let echarts = arr[1]
      if (!this.map1) {
        let width = (parseInt(window.getComputedStyle(this.$refs.mapWrap).width) - 30) + 'px'
        this.$refs.map1.style.width = width
        this.map1 = echarts.init(this.$refs.map1)
      }
      if (res.data && res.data[0]) {
        this.mapShow = true
        this.list = this.$toLower(res.data).sort((a, b) => b - a)
        this.setCharOption()
      } else {
        this.list = []
        this.mapShow = false
        console.log('没有数据', res.data)
      }
      console.log(res.data)
    },
    routeDetail (item) {
      this.$router.push(this.$route.path + '/warrantDetail/' + item.propertyRightCardTypeId)
    },
    setCharOption (data) {
      let option = {
        color: ['#A5D6FF', '#ACDF82', '#EAA674', '#FBD437', '#46A9FC', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '0',
          top: 20,
          bottom: 20,
          itemGap: 5,
          itemWidth: 18,
          itemHeight: 10,
          data: this.mapData,
          // formatter: function (name) {
          //   console.log(name)
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
            data: this.mapData,
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
      // return option
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
