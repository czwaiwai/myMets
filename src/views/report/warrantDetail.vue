<template>
<div class="page_modal">
  <div class="page">
    <nav-title :title="title"></nav-title>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <search v-model="search" url="UserCS_GetRectificationGrpInfo" placeholder="请输入地块名称" searchName="GrpName" :noFocus="true" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <div @click="filterVisible=true" class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
    </div>
    <filter-modal :form.sync='filterForm' v-model="filterVisible" @submit="filterSubmit">
      <filter-date name="date" v-model="filterForm.date">截止时间</filter-date>
    </filter-modal>
    <div class="page_bd">
           <ul class="table_line">
            <li v-for="(item,index) in list" :key="index">
              <div @click="showDetail(index)" class="weui-flex table_item">
                <div class="col dot_line" style="width:1.8rem;">{{item.rightnumber}}</div>
                <div class="col weui-flex__item dot_line">{{item.name}}</div>
                <div class="col dot_line" style="width: 1.3rem;">{{item.warrantstateName}}</div>
                <div class="padding-right">
                  <div class="item_center direct_icon " :class="activeShow === index?'weui_icon_download':''" >
                    <i class="iconfont   icon-shouqi " ></i>
                  </div>
                </div>
              </div>
              <div v-show="activeShow === index"  class="table_item_info border-top-half">
                  <div class="weui-flex padding-v">
                    <dl class="weui-flex__item">
                      <dt class="fs13">{{item.warrant}}</dt>
                      <dd class="dark_99  fs12">权利人</dd>
                    </dl>
                    <dl class="weui-flex__item border-left-half">
                      <dt class="fs13">{{item.landareasquaremetre | float2}}</dt>
                      <dd class="dark_99  fs12">土地面积㎡</dd>
                    </dl>
                    <dl class="weui-flex__item border-left-half">
                      <dt class="fs13">{{item.sourceoName || ''}}&nbsp;</dt>
                      <dd class="dark_99  fs12">使用权来源</dd>
                    </dl>
                    <dl class="weui-flex__item border-left-half">
                      <dt class="fs13">{{item.nameofblock}}</dt>
                      <dd class="dark_99  fs12">所属地块</dd>
                    </dl>
                  </div>
                </div>
            </li>
          </ul>
    </div>
  </div>
</div>
</template>
<script>
import Search from '@/components/search'
import FilterModal from '@/components/filterModal'
import FilterDate from '@/components/filter/date'
import navTitle from '@/components/navTitle'
export default {
  name: 'warrantDetail',
  components: {navTitle, Search, FilterModal, FilterDate},
  data () {
    return {
      title: '权证统计详情',
      activeShow: '',
      search: '',
      currDate: '',
      filterVisible: false,
      filterForm: {
        date: ''
      },
      list: []
    }
  },
  created () {
    this.title = this.$route.query.name
    this.search = this.$parent.search || ''
    this.currDate = this.$parent.currDate
    this.filterForm.date = this.currDate
    this.typeId = this.$route.params.id
    this.getPageData()
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
      this.currDate = form.date
      this.getPageData()
    },
    async getPageData () {
      let p0 = 'UserCS_ReportPropertyRightCardDet'
      let res = await this.$xml(p0, {
        PropertyRightCardTypeId: this.typeId,
        GrpID: this.grpId || '',
        FinanceDate: this.currDate
      })
      if (res.data && res.data[0]) {
        this.list = this.$toLower(res.data).map(item => {
          item.show = false
          return item
        })
      }
      console.log(res)
    },
    showDetail (index) {
      if (this.activeShow === index) {
        this.activeShow = ''
      } else {
        this.activeShow = index
      }
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
