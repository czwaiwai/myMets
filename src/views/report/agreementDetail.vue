<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header :title="title">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title :title="title"></nav-title>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <search v-model="search" url="UserCS_GetRectificationGrpInfo"  placeholder="请输入客户名称"  searchName="GrpName" :noFocus="true" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <div @click="filterVisible = true"   class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
    </div>
    <filter-modal :form.sync='filterForm' v-model="filterVisible" @submit="filterSubmit">
        <filter-radio name="status" v-model="filterForm.status" :data-list="radioList">合同状态</filter-radio>
        <filter-date-end name="date" v-model="filterForm.date" >截止时间</filter-date-end>
    </filter-modal>
    <page-list ref="pageList" :params="pageConfig.params" ulClass="table_line light_bg"  :config="this.pageConfig" @listDone="listDone">
      <template slot-scope="scope" >
        <div  @click="showDetailHandle(scope.item, scope.$index)" class="weui-flex table_item ">
          <div class="col " style="width:1.8rem;">
            <p class="dot_line">{{scope.item.cstName}}</p></div>
          <div class="col weui-flex__item text-center">{{scope.item.stime | dateMonth}} ~ {{scope.item.etime | dateMonth}}</div>
          <div class="col " style="width: 1.3rem;">{{scope.item.status}}</div>
          <div   class="padding-right">
            <div class="item_center direct_icon " :class="scope.item.show?'weui_icon_download':''" >
              <i class="iconfont   icon-shouqi " ></i>
            </div>
          </div>
        </div>
        <div class="border-top-half">
          <div v-if="scope.item.show"  class="table_item_info">
            <div class="weui-flex padding-v">
              <dl class="weui-flex__item">
                <dt class="fs15">{{scope.item.budArea}}㎡</dt>
                <dd class="dark_99  fs12">租赁建筑面积</dd>
              </dl>
              <dl class="weui-flex__item border-left-half">
                <dt class="fs15">{{scope.item.yearsRent | float2}}<small>元</small></dt>
                <dd class="dark_99  fs12">合同年租金</dd>
              </dl>
              <dl class="weui-flex__item border-left-half">
                <dt class="fs15">{{scope.item.rentUse | float2}}<small>元</small></dt>
                <dd class="dark_99  fs12">平均单价</dd>
              </dl>
            </div>
          </div>
        </div>
      </template>
    </page-list>
  </div>
</div>
</template>
<script>
import FilterModal from '@/components/filterModal'
import FilterDateEnd from '@/components/filter/dateEnd'
import FilterRadio from '@/components/filter/radio'
import Search from '@/components/search'
import PageList from '@/components/pageList'
import navTitle from '@/components/navTitle'
export default {
  name: 'agreementDetail',
  components: {Search, PageList, FilterModal, FilterDateEnd, FilterRadio, navTitle},
  data () {
    return {
      title: '合同统计详情',
      search: '',
      filterForm: {
        date: '',
        status: ''
      },
      currDate: '',
      radioList: [{name: '正常', value: 'NorC'}, {name: '历史', value: 'HisC'}],
      total: 0,
      list: [],
      pageConfig: {},
      filterVisible: false
    }
  },
  created () {
    this.title = this.$route.query.name
    this.grpId = this.$route.params.id
    this.pageConfig = this.pageListConfig({pageSize: 20})
  },
  methods: {
    listDone (list) {
      if (list && list[0]) {
        this.total = list[0].contractCount
      }
    },
    searchRes (item) {
      console.log(item, 'searchRes')
      this.pageConfig.params['GrpID'] = item.ID
      this.$refs.pageList.refresh()
    },
    searchCancel () {
      this.pageConfig.params['GrpID'] = this.grpId
      this.$refs.pageList.refresh()
    },
    filterSubmit (form) {
      console.log(form, '过滤的结果')
      // this.currDate = form.date
      this.pageConfig.params['Status'] = form.status
      this.currDate = form.date
      if (form.date) {
        let dateArr = form.date.split(',')
        this.pageConfig.params['Stime'] = dateArr[0]
        this.pageConfig.params['Etime'] = dateArr[1]
      } else {
        this.pageConfig.params['Stime'] = ''
        this.pageConfig.params['Etime'] = ''
      }
      this.$refs.pageList.refresh()
    },
    pageListConfig (params) {
      var that = this
      return {
        name: 'agreement',
        xml: true,
        url: 'UserCS_ReportContractDet',
        params: {
          'GrpID': this.grpId,
          'Stime': '',
          'Etime': '',
          CstName: '',
          'Status': '',
          ...params
        },
        format: function (data) {
          console.log(data)
          return that.$toLower(data).map(item => {
            item.show = false
            return item
          })
        }
      }
    },
    showDetailHandle (item, index) {
      console.log(item, 'showDetailHandle----')
      if (item.budArea) {
        item.show = !item.show
      } else {
        this.getDetail(item, index)
      }
    },
    async getDetail (item, index) {
      let dateArr = ['', '']
      if (this.currDate) {
        dateArr = this.currDate.split(',')
      }
      let res = await this.$xml('UserCS_ReportContractDetRent', {
        'CttID': item.iD,
        'Stime': dateArr[0],
        'Etime': dateArr[1]
      })
      if (res.data && res.data[0]) {
        // this.$set(item,)
        item.show = !item.show
        let data = this.$toLower(res.data[0])
        this.$refs.pageList.setItem({...item, ...data}, index)
      }
      console.log(res.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.table_line {
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
    & .col {
      padding:0  10px;
    }
    & .col  + .col{
      border-left:1px solid #ECECEC;
    }
  }
}
</style>
