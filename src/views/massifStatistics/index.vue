<template>
  <div class="page massif">
    <nav-title title="地块统计"></nav-title>
    <div class="weui-flex">
      <div class="weui-flex__item search">
        <search v-model="search" url="UserCS_GetRectificationGrpInfo" placeholder="搜索地块" searchName="GrpName" :noFocus="true" @searchData="toSearch" @searchCancel="searchCancel" @searchConfirm="searchRes"></search>
      </div>
      <!-- <div @click="filterVisible = true" class="padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div> -->
    </div>
    <div class="page_bd">
        <!-- <div class="weui-flex__item">
            <div class="btn" :class="{'deepColor':search!==''}"  @click.stop="toSearch">查询</div>
        </div> -->
        <div class="weui-flex__item history-list" v-if="searchHistory.length">
          <div class="header">
            <span>历史搜索</span>
            <p class="clear" @click.stop="clearHistoryList">全部清除</p>
          </div>
          <ul class="list clearfix">
            <li class="item" v-for="(item,index) in searchHistory" :key="index" @click="selectHistoryItem(item)">
              <span>{{item.GrpName+'-'+item.OrgName}}</span>
              <i class="iconfont icon-quxiao1" @click.stop="clearitem(item,index)"></i>
            </li>
          </ul>
        </div>
      </div>
      <dialog-confire
        :title="dialogData.title"
        ref="dialog"
        @clickLeftBtn="clickLeftBtn"
        @clickRightBtn="clickRightBtn"
      ></dialog-confire>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import Search from '@/components/searchV2'
import dialogConfire from '@/components/dialogConfire.vue'
import mapReady from '@/utils/getEchars'
// import qs from 'qs'
export default {
  name: 'massifStatics',
  components: {Search, dialogConfire},
  data () {
    return {
      search: '',
      filterVisible: false,
      currentItem: {},
      searchHistory: [],
      dialogData: {
        type: 0,
        title: '',
        data: {}
      }
    }
  },
  created () {
    // localStorage.searchHistory = []
    if (localStorage.searchHistory) {
      console.log('tag', JSON.parse(localStorage.searchHistory))
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
      if (this.currentItem && this.currentItem.ID) {
        if (this.searchHistory.indexOf(this.currentItem) < 0) {
          this.searchHistory.push(this.currentItem)
          localStorage.searchHistory = JSON.stringify(this.searchHistory)
        }
        localStorage.AreaSelectGrpItem = JSON.stringify(this.currentItem)
        this.$router.push({path: '/massifStatisticsReport'})
      }
    },
    selectHistoryItem (item) {
      this.currentItem = item
      this.search = item.OrgName + '-' + item.GrpName
    },
    clearHistoryList () {
      this.dialogData = {
        type: 2,
        title: '请确认是否删除所有历史记录？',
        data: {}
      }
      this.$refs.dialog.show()
    },
    clearitem (item, index) {
      this.searchHistory.splice(index, 1)
      if (this.searchHistory.length) {
        localStorage.searchHistory = this.searchHistory.join(',')
      } else {
        localStorage.removeItem('searchHistory')
      }
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      if (this.dialogData.type === 2) {
        this.searchHistory = []
        localStorage.removeItem('searchHistory')
      }
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
  .search{
    height: 2.22rem;
    background-color: #2A5EB3;
    background-image: url('../../assets/img/report/indexV2_bg.png')
  }
  .history-key{
    margin: 10px 10px;
    font-size: 12px;
  }
  .history-list{
    position: relative;
      z-index: 10;
      padding: 0 0 .3rem .3rem;
      .header{
        position: relative;
        height: .88rem;
        line-height: .88rem;
        font-size: .28rem;
        span{
          color: #333;
        }
        .clear{
          position: absolute;
          right: .3rem;
          top: 0;
          height: .88rem;
          line-height: .88rem;
          font-size: .28rem;
          color: #1B9BFE;
        }
      }
      .list{
        .item{
          position: relative;
          float: left;
          // width: 1.5rem;
          padding: 0 .08rem;
          height: .56rem;
          background: #fff;
          border-radius: .1rem;
          margin-right: .2rem;
          margin-top: .3rem;
          span{
            display: block;
            width: 3rem;
            height: .56rem;
            font-size: .3rem;
            color: #333;
            line-height: .56rem;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:nth-child(4n){
            margin-right: 0;
          }
          .icon-quxiao1{
            position: absolute;
            right: -.15rem;
            top: -.15rem;
            width: .4rem;
            height: .4rem;
            display: block;
            font-size: .34rem;
            color: #999;
            text-align: center;
            line-height: .4rem;
          }
        }
      }
    }
    .tip-name{
      position: absolute;
      top: 4.5rem;
      left: 0;
      z-index: 9;
      width: 100vw;
      img{
        display: block;
        width: 1.6rem;
        height: 1.5rem;
        margin: 0 auto .5rem;
      }
      p{
        color: #4a4a4a;
        font-size: .3rem;
        text-align: center;
        line-height: 1.2;
      }
    }
}
</style>
