<template>
  <div class="page">
    <nav-title title="地块统计"></nav-title>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <search v-model="search" url="UserCS_GetRectificationGrpInfo" placeholder="请输入地块名称" searchName="GrpName" :noFocus="true" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <!-- <div @click="filterVisible = true" class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div> -->
    </div>
    <div class="page_bd massif">
        <div class="weui-flex__item">
            <div class="btn" :class="{'deepColor':search!==''}"  @click.stop="toSearch">查询</div>
        </div>
        <div class="weui-flex__item">
          <div class="history-key">历史搜索</div>
          <div class="history-list">
            <ul>
              <li v-for="(item,index) in searchHistory" :key="index" @click="selectHistoryItem(item)">{{item.OrgName + '-' + item.GrpName}}</li>
            </ul>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import Search from '@/components/search'
import mapReady from '@/utils/getEchars'
// import qs from 'qs'
export default {
  name: 'massifStatics',
  components: {Search},
  data () {
    return {
      search: '',
      filterVisible: false,
      currentItem: {},
      searchHistory: []
    }
  },
  created () {
    if (localStorage.searchHistory) {
      console.log('tag', localStorage.searchHistory)
      this.searchHistory = JSON.parse(localStorage.searchHistory)
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    searchRes (item) {
      console.log(item, 'searchRes')
      this.currentItem = item
      this.search = item.OrgName + '-' + item.GrpName
    },
    searchCancel () {
      this.currentItem = {}
    },
    filterSubmit (form) {
      console.log(form, '过滤的结果')
      this.currDate = form.date
      this.getPageData()
    },
    toSearch () {
      if (this.searchHistory.indexOf(this.currentItem) < 0) {
        this.searchHistory.push(this.currentItem)
        localStorage.searchHistory = JSON.stringify(this.searchHistory)
      }
    },
    selectHistoryItem (item) {
      this.currentItem = item
      this.search = item.OrgName + '-' + item.GrpName
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
    }
  }
}
</script>

<style lang="scss" scoped >
.massif{
  .btn{
    border: 1px solid #3395FF;
    height: .8rem;
    font-size: .3rem;
    line-height: .8rem;
    text-align: center;
    color: rgba(51,149,255,.5);
    background:rgb(245, 241, 241);
    border-radius: .1rem;
    margin: 10px 10px;
    &.deepColor{
      color: #3395FF;
      background:#fff;
    }
  }
  .history-key{
    margin: 10px 10px;
    font-size: 12px;
  }
  .history-list{
    margin: 0px 10px;
    >ul>li{
      float: left;
      margin: 3px 5px;
      border: 1px solid #999;
    }
  }
}
</style>
