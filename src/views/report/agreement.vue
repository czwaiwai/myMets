<template>
<!-- 合同统计 -->
  <div class="page">
    <mt-header title="合同统计">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-flex">
      <div class="weui-flex__item">
         <search v-model="search" url="UserCS_GetRectificationGrpInfo"  searchName="GrpName" :noFocus="true" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <div  @click="filterVisible = true"  class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
    </div>
    <filter-modal :form.sync='filterForm' v-model="filterVisible" @submit="filterSubmit">
        <filter-date name="date" v-model="filterForm.date">截止时间</filter-date>
        <!-- <filter-date-end name="date2" v-model="filterForm.date2" >合同期限</filter-date-end>
        <filter-radio name="group" v-model="filterForm.group">合同状态</filter-radio>
        <filter-checkbox name="group1" v-model="filterForm.group1">多选</filter-checkbox> -->
    </filter-modal>
    <page-list ref="pageList" :params="pageConfig.params" ulClass="table_line light_bg"  :config="this.pageConfig" @listDone="listDone">
      <div slot="header" >
        <div class="padding15-v padding-h">
          <div class="light_bg weui-flex padding15" style="border-radius:5px;height:90px">
            <div class="weui-flex__item item_center">
              <p class="fs18">合同数量</p>
            </div>
            <div class="weui-flex__item  item_center">
              <p class="fs24 vertical-bottom text-center"  style="color:rgb(255, 78, 0);">{{total}}<small>份</small></p>
            </div>
          </div>
        </div>
      </div>
      <template slot-scope="scope" >
          <div  class="weui-flex table_item ">
            <!-- <div class="flex_item bf"></div> -->
            <div @click="routeDetail(scope.item)" class="col main_color dot_line" style="width: 40%;" >{{scope.item.grpName}}</div>
            <div class="col weui-flex__item">正常合同数:{{scope.item.grpCount}}</div>
            <div @click="showDetailHandle(scope.item, scope.$index)"  class="padding-right">
              <div class="item_center direct_icon " :class="scope.item.show?'weui_icon_download':''" >
                <i class="iconfont   icon-shouqi " ></i>
              </div>
            </div>
          </div>
          <div class="border-top-half">
            <div v-if="scope.item.show"  class="table_item_info">
              <div class="weui-flex padding-v">
                <dl class="weui-flex__item">
                  <dt class="fs15">{{scope.item.beOverdue}}</dt>
                  <dd class="dark_99  fs12">9月前逾期合同</dd>
                </dl>
                <dl class="weui-flex__item border-left-half">
                  <dt class="fs15">{{scope.item.dueTime}}</dt>
                  <dd class="dark_99  fs12">10月-11月到期合同</dd>
                </dl>
                <dl class="weui-flex__item border-left-half">
                  <dt class="fs15">{{scope.item.dueTimeX}}</dt>
                  <dd class="dark_99  fs12">12月后到期合同</dd>
                </dl>
              </div>
              <div class="padding15-h padding5-v border-top-half">
                <p class="text-left">{{scope.item.orgName}}</p>
              </div>
            </div>
          </div>
      </template>
    </page-list>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import FilterModal from '@/components/filterModal'
import FilterDate from '@/components/filter/date'
import Search from '@/components/search'
import PageList from '@/components/pageList'
export default {
  name: 'agreement',
  components: {Search, PageList, FilterModal, FilterDate},
  data () {
    return {
      search: '',
      filterForm: {
        date: ''
      },
      currDate: '',
      total: 0,
      list: [],
      pageConfig: {},
      filterVisible: false
    }
  },
  created () {
    this.currDate = (new Date()).format('yyyy-MM-dd')
    this.pageConfig = this.pageListConfig({pageSize: 20, Etime: this.currDate})
  },
  methods: {
    listDone (list) {
      if (list && list[0]) {
        this.total = list[0].contractCount
      } else {
        this.total = 0
      }
    },
    searchRes (item) {
      console.log(item, 'searchRes')
      // this.grpId = item.ID
      this.pageConfig.params.GrpID = item.ID
      this.$refs.pageList.refresh()
    },
    searchCancel () {
      this.pageConfig.params.GrpID = ''
      this.$refs.pageList.refresh()
    },
    filterSubmit (form) {
      console.log(form, '过滤的结果')
      this.currDate = form.date
      this.$refs.pageList.refresh()
    },
    pageListConfig (params) {
      var that = this
      return {
        name: 'agreement',
        xml: true,
        url: 'UserCS_ReportContractStatistics',
        params: {
          'GrpID': '',
          'Etime': '2019-01-31',
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
      console.log(item, index, '----showDetailHandle')
      if (item.orgName) {
        item.show = !item.show
      } else {
        this.getDetail(item, index)
      }
    },
    async getDetail (item, index) {
      let res = await this.$xml('UserCS_ReportContractStatisticsDetailed', {
        GrpID: item.grpID,
        Etime: this.currDate
      })
      if (res.data && res.data[0]) {
        item.show = !item.show
        let data = this.$toLower(res.data[0])
        this.$refs.pageList.setItem({...item, ...data}, index)
      }
      console.log(res.data)
    },
    routeDetail (item) {
      this.$router.push(this.$route.path + '/agreementDetail/' + item.grpID)
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
      padding:0  15px;
    }
    & .col  + .col{
      border-left:1px solid #ECECEC;
    }
  }
}

</style>
