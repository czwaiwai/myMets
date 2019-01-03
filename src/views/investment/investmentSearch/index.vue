<template>
  <div class="page_modal">
    <div class="page page_bg">
      <nav-title title="搜索"></nav-title>
      <div class="searchBox">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="请输入项目名称" type="search" v-model="searchKey" @keydown.13="searchList">
            <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
        </form>
        <span class="searachBtn" v-if="searchKey.length" @click.stop="searchList">搜索</span>
        <span class="searachBtn" v-else @click.stop="$router.go(-1)">取消</span>
      </div>
      <div class="page_bd investmentSearch">
        <div class="history" v-if="!dataList.length && historyList.length">
          <div class="header">
            <span>历史搜索</span>
            <p class="clear" @click.stop="clearHistoryList">全部清除</p>
          </div>
          <ul class="list clearfix">
            <li class="item" v-for="(item,index) in historyList" :key="index" @click.stop="clickItem(item)">
              <span>{{item}}</span>
              <i class="iconfont icon-quxiao1" @click.stop="clearitem(item,index)"></i>
            </li>
          </ul>
        </div>
        <ul class="content-list" v-else-if="dataList.length"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
          <li class="item clearfix" v-for="(item,index) in dataList" :key="index" @click.stop="toProjectDetail(item)">
            <div class="status" :class="com_color(index)">{{com_status(index)}}</div>
            <img class="pic" :src="item.Url">
            <div class="desc">
              <div class="title _lines">{{item.ProjName}}</div>
              <div class="name _lines">{{item.AreaTotal}}㎡/{{item.County}}/{{item.TradeType}}</div>
              <div class="price _lines">{{item.RentAvg}}元㎡/天</div>
              <div class="time _lines">{{com_setDate(item.RegDate)}}</div>
            </div>
          </li>
          <li class="tip" v-show="showTip">加载中···</li>
        </ul>
        <none-page title="暂无符合条件的数据~" v-if="!dataList.length&&hasHttp" :height="historyList.length?'40':'100'"></none-page>
      </div>
      <dialog-confire
        :title="dialogData.title"
        ref="dialog"
        @clickLeftBtn="clickLeftBtn"
        @clickRightBtn="clickRightBtn"
      ></dialog-confire>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import dialogConfire from '@/components/dialogConfire.vue'
import nonePage from '@/components/nonePage/index.vue'
import dateChange from '@/mixins/dateChange'
import { mapGetters } from 'vuex'
export default {
  name: 'investmentSearch',
  components: {navTitle, dialogConfire, nonePage},
  mixins: [dateChange],
  data () {
    return {
      searchKey: '',
      dataList: [],
      historyList: [],
      list: 20,
      dialogData: {
        type: 0,
        title: '',
        data: {}
      },
      hasHttp: false,
      showTip: false,
      page: 1,
      pageSize: 20
    }
  },
  computed: {
    ...mapGetters({
      key: 'getInvestmentSearchKey'
    })
  },
  methods: {
    // 状态便签颜色
    com_color (index) {
      let temp = index % 3
      return 'statusColor' + temp
    },
    // 状态名称
    com_status (index) {
      let temp = index % 3
      let status = ''
      switch (temp) {
        case 0:
          status = '已投'
          break
        case 1:
          status = '未来可投'
          break
        case 2:
          status = '不考虑'
          break
      }
      return status
    },
    // 到项目详情
    toProjectDetail (item) {
      this.$store.commit('setInvestmentSearchKey', this.searchKey)
      this.$router.push({
        name: `investmentDetail`,
        params: {
          id: item.ID
        }
      })
    },
    // 清除搜索条件
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
    },
    // 搜索列表
    searchList () {
      this.page = 1
      this.$el.querySelector('.search-input').blur()
      this.$el.querySelector('.investmentSearch').scrollTop = 1
      this.search()
    },
    // 全部清除
    clearHistoryList () {
      this.dialogData = {
        type: 2,
        title: '请确认是否删除所有历史记录？',
        data: {}
      }
      this.$refs.dialog.show()
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.historyList = []
      localStorage.removeItem('historyinvestmentList')
    },
    // 点击历史按钮
    clickItem (item) {
      this.searchKey = item
      this.search()
    },
    // 清除一项
    clearitem (item, index) {
      this.historyList.splice(index, 1)
      if (this.historyList.length) {
        localStorage.historyinvestmentList = this.historyList.join(',')
      } else {
        localStorage.removeItem('historyinvestmentList')
      }
    },
    // 获取搜索列表
    async search () {
      if (this.searchKey === '') {
        this.dataList = []
        return
      }
      if (this.historyList.indexOf(this.searchKey) > -1) {
        this.historyList.splice(this.historyList.indexOf(this.searchKey), 1)
      }
      this.historyList.unshift(this.searchKey)
      this.historyList = this.historyList.slice(0, 12)
      localStorage.historyinvestmentList = this.historyList.join(',')
      let res = await this.$xml('UserCS_InvestmentPropertyList', {
        'County': '',
        'ProjStatus': '10',
        'TradeType': '',
        'RentAvgMin': '',
        'RentAvgMax': '',
        'AreaTotalMin': '',
        'AreaTotalMax': '',
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data.length) {
        if (this.page === 1) {
          this.dataList = res.data
        } else {
          this.dataList = this.dataList.concat(res.data)
        }
      }
      this.hasHttp = true
      if (res.data.length < this.pageSize - 1) {
        this.showTip = false
      } else {
        this.showTip = true
      }
    },
    // 加载更多
    loadMore () {
      if (this.showTip) {
        this.page++
        this.search()
      }
    }
  },
  mounted () {
    if (this.key) {
      this.searchKey = this.key
      this.search()
    } else {
      this.$el.querySelector('.search-input').focus()
    }
  },
  created () {
    this.historyList = localStorage.historyinvestmentList ? localStorage.historyinvestmentList.split(',') : []
    console.log('in...search')
  }
}
</script>
<style lang="scss" scoped>
  .searchBox {
    display: flex;
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid #e9e9e9;
    background: #fff;
    .searchWrap {
      flex: 1;
      height: 0.56rem;
      background: #EFEFEF;
      line-height: 0.68rem;
      border-radius: 3px;
      .icon-sousuo {
        float: left;
        width: 0.56rem;
        height: 0.56rem;
        padding: 0 .1rem;
        line-height: 0.56rem;
        font-size: 0.32rem;
        text-align: right;
        color: #999;
      }
      input {
        float: left;
        width: 4.4rem;
        height: 0.56rem;
        color: #333;
        font-size: 0.28rem;
        &::-webkit-input-placeholder {
          color: #999;
        }
        &::-webkit-search-cancel-button {
          display: none;
        }
      }
      .icon-quxiao1 {
        float: right;
        width: 0.48rem;
        height: 0.56rem;
        margin-right: 0.2rem;
        line-height: 0.56rem;
        font-size: 0.34rem;
        text-align: right;
        color: #999;
      }
    }
    .searachBtn {
      width: .88rem;
      height: 0.56rem;
      font-size: 0.3rem;
      line-height: 0.56rem;
      text-align: right;
      color: #0DC88C;
    }
  }
  .investmentSearch {
    .history{
      position: relative;
      z-index: 10;
      padding: 0 0 .3rem .3rem;
      height: 3.76rem;
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
          color: #0DC88C;
        }
      }
      .list{
        .item{
          position: relative;
          float: left;
          padding: 0 .08rem;
          height: .56rem;
          background: #fff;
          border-radius: .1rem;
          margin-right: .2rem;
          margin-top: .3rem;
          span{
            display: block;
            width: 1.415rem;
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
    .content-list{
      background: #fff;
      .item{
        position: relative;
        padding: .3rem;
        background: #fff;
        border-bottom: 1px solid #ededed;
        &:last-child{
          border-bottom: none;
        }
        .status{
          position: absolute;
          padding: 0 .1rem;
          height: .34rem;
          color: #fff;
          font-size: .24rem;
          line-height: .34rem;
          text-align: center;
          border-bottom-right-radius: 3px;
          &.statusColor0 {
            background: #FA8A2C;
          }
          &.statusColor1 {
            background: #0DC88C;
          }
          &.statusColor2 {
            background: #2CB4FA;
          }
        }
        .pic{
          float: left;
          width: 2.35rem;
          height: 1.82rem;
        }
        .desc{
          float: left;
          width: 4.35rem;
          height: 1.82rem;
          margin-left: .2rem;
          ._lines{
            width: 4.35rem;
            height: .45rem;
            line-height: .45rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .title{
            height: .47rem;
            line-height: .47rem;
            font-size: .34rem;
            color: #333;
          }
          .name{
            font-size: .28rem;
            color: #7B7A7A;
          }
          .price{
            font-size: .28rem;
            color: #FC6805;
          }
          .time{
            font-size: .28rem;
            color: #7B7A7A;
          }
        }
      }
      .tip{
        height: .8rem;
        width: 100%;
        background: #fff;
        font-size: .3rem;
        color: #999;
        text-align: center;
        line-height: .8rem;
      }
    }
  }
</style>
