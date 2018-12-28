<template>
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
      <div class="history" v-if="!dataList.length && historyList.length && !hasHttp">
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
        <li class="item clearfix" v-for="(item,index) in list" :key="index" @click.stop="toProjectDetail(item)">
          <img class="pic" src="http://pic25.nipic.com/20121110/10839717_103723525199_2.jpg">
          <div class="desc">
            <div class="title _lines">保利叶之林</div>
            <div class="name _lines">256171㎡/南山区/普通住宅</div>
            <div class="price _lines">100.36元㎡/天</div>
            <div class="time _lines">2018-12-12</div>
          </div>
        </li>
        <li class="tip">加载中···</li>
      </ul>
      <none-page title="暂无符合条件的数据~" height="70" v-if="!dataList.length&&hasHttp"></none-page>
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
import navTitle from '@/components/navTitle'
import dialogConfire from '@/components/dialogConfire.vue'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'investmentSearch',
  components: {navTitle, dialogConfire, nonePage},
  data () {
    return {
      searchKey: '',
      dataList: [],
      historyList: ['111', '222', '333', '111', '222', '333'],
      list: 20,
      dialogData: {
        type: 0,
        title: '',
        data: {}
      },
      hasHttp: false,
      page: 1,
      pageSize: 20
    }
  },
  methods: {
    // 到项目详情
    toProjectDetail (item) {
      this.$router.push(`/projectDetail/123`)
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
    search () {
      if (this.searchKey === '') {
        this.dataList = []
        return
      }
      this.hasHttp = true
      this.dataList = ['1']
      if (this.historyList.indexOf(this.searchKey) > -1) {
        this.historyList.splice(this.historyList.indexOf(this.searchKey), 1)
      }
      this.historyList.unshift(this.searchKey)
      this.historyList = this.historyList.slice(0, 12)
      localStorage.historyinvestmentList = this.historyList.join(',')
    },
    // 加载更多
    loadMore () {
      this.list += 20
    }
  },
  created () {
    this.historyList = localStorage.historyinvestmentList ? localStorage.historyinvestmentList.split(',') : []
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
        font-size: 0.4rem;
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
        padding: .3rem;
        background: #fff;
        border-bottom: 1px solid #ededed;
        &:last-child{
          border-bottom: none;
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
