<template>
  <div class="page page_bg">
    <nav-title title="搜索客源"></nav-title>
    <div class="page_bd searchGuest">
      <div class="searchBox clearfix">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="请输入客源名称、电话搜索" type="search" v-model="searchKey" @keydown.13="searchList">
            <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
        </form>
        <span class="searachBtn" v-if="searchKey.length" @click.stop="searchList">搜索</span>
        <span class="searachBtn" v-else @click.stop="$router.go(-1)">取消</span>
      </div>
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
      <!-- <div class="tip-name" v-if="!dataList.length && hasSearch">
        <img src="../../../styles/images/none.png">
        <p>暂无满足条件的客源~</p>
      </div> -->
      <none-page title="暂无满足条件的客源~" height="50" v-show="!dataList.length && hasSearch"></none-page>
      <div class="content" v-show="dataList.length">
        <load-view ref="list">
          <ul class="c-list">
            <li class="c-items clearfix" v-for="(item,index) in dataList" :key="index" @click.stop="toGuestDetail(item,index)">
              <p class="title">
                <i class="iconfont icon-renwu icon"></i>
                <span class="tn">{{item.CstName}}</span>
                <span class="tip" :class="item.CstLevel==='VIP'?'orange':'blue'" v-show="item.CstLevel">{{item.CstLevelCH}}</span>
              </p>
              <p class="desc clearfix" v-show="item.FirstPhone">
                <i class="iconfont icon-dianhua icon"></i>
                <span>{{item.FirstPhone}}</span>
              </p>
              <p class="name" v-show="item.NextFollowTime">
                <!-- <i class="iconfont icon-shijian icon"></i> -->
                <span>{{com_status(item)}}</span>
              </p>
            </li>
          </ul>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
      </div>
    </div>
    <dialog-confire
      title="请确认是否删除所有历史记录？"
      ref="dialog"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
    ></dialog-confire>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import loadView from '@/components/ref/ref.vue'
import dialogConfire from '@/components/dialogConfire.vue'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'searchGuest',
  components: {loadView, dialogConfire, navTitle, nonePage},
  data () {
    return {
      locationData: {},
      searchKey: '',
      hasSearch: false,
      historyList: [],
      dataList: [],
      page: 1,
      pageSize: 20,
      showLoadTip: false,
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      getKey: 'getRentSearchKey'
    })
  },
  methods: {
    com_status (item) {
      if (item.NextFollowTime) {
        let date = item.NextFollowTime.split(' ')[0].replace(/\//g, '.')
        return '最近 ' + date + ' 跟进'
      } else {
        return ''
      }
    },
    searchList () {
      this.page = 1
      this.$el.querySelector('.search-input').blur()
      if (this.$refs.list) {
        this.$refs.list.setTop(1)
      }
      this.search()
    },
    async search () {
      this.$store.commit('updateRentSearchKey', {key: this.searchKey})
      if (this.searchKey === '') {
        this.dataList = []
        return
      }
      // let obj = {
      //   p0: 'UserCS_CustomerSearch',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'EmployeeID': this.locationData.employeeData.employeeId,
      //     'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
      //     'CstName': this.searchKey,
      //     'BusinessName': 'AllCst',
      //     'Page': this.page,
      //     'PageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_CustomerSearch', {
        'OrgId': this.locationData.orgData.orgId,
        'EmployeeID': this.locationData.employeeData.employeeId,
        'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
        'CstName': this.searchKey,
        'BusinessName': 'AllCst',
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      this.isLoading = false
      if (this.page === 1) {
        this.dataList = res.data
      } else {
        this.dataList = this.dataList.concat(res.data)
      }
      // this.$vux.loading.hide()
      this.hasSearch = true
      if (this.historyList.indexOf(this.searchKey) > -1) {
        this.historyList.splice(this.historyList.indexOf(this.searchKey), 1)
      }
      this.historyList.unshift(this.searchKey)
      this.historyList = this.historyList.slice(0, 12)
      localStorage.historyGuestList = this.historyList.join(',')
    },
    clickItem (item) {
      this.searchKey = item
      this.search()
    },
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
    },
    clearHistoryList () {
      this.$refs.dialog.show()
    },
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    clickRightBtn () {
      this.historyList = []
      localStorage.removeItem('historyGuestList')
      this.$refs.dialog.hide()
    },
    clearitem (item, index) {
      this.historyList.splice(index, 1)
      if (this.historyList.length) {
        localStorage.historyGuestList = this.historyList.join(',')
      } else {
        localStorage.removeItem('historyGuestList')
      }
    },
    toGuestDetail (item, index) {
      this.$router.push(`/guestDetail/${item.Id}`)
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.historyList = localStorage.historyGuestList ? localStorage.historyGuestList.split(',') : []
    this.searchKey = this.getKey.key || ''
    this.search()
  },
  mounted () {
    if (!this.getKey.key) {
      this.$el.querySelector('.search-input').focus()
    }
    let _this = this
    // 上拉禁止
    this.$refs.list.items.ref = function () {
      _this.$refs.list.succ()
    }
    // 上拉加载更多
    this.$refs.list.IsLast(50, (direction, scrollTop, h) => {
      if (h) {
        if (!this.isLoading && this.showLoadTip) {
          // console.log('in.....')
          this.isLoading = true
          this.page++
          this.search()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .searchGuest{
    .searchBox {
      position: relative;
      top: 0;
      left: 0;
      z-index: 11;
      // height: 1.05rem;
      padding: 0.2rem 0.3rem;
      // background: #fff;
      border-bottom: 1px solid #e9e9e9;
      .searchWrap {
        float: left;
        width: 6.08rem;
        height: 0.68rem;
        background: #fff;
        border-radius: 0.2rem;
        line-height: 0.68rem;
        .icon-sousuo {
          float: left;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: 0.34rem;
          text-align: right;
          color: #999;
        }
        input {
          float: left;
          width: 4.4rem;
          height: 0.68rem;
          // line-height: 0.68rem;
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
          height: 0.68rem;
          margin-right: 0.2rem;
          line-height: 0.68rem;
          font-size: 0.4rem;
          text-align: right;
          color: #999;
        }
      }
      .searachBtn {
        float: left;
        width: 0.68rem;
        height: 0.68rem;
        margin-left: 0.14rem;
        font-size: 0.3rem;
        line-height: 0.68rem;
        text-align: right;
        color: #0091FF;
      }
    }
    .content{
      position: absolute;
      top: 1.08rem;
      bottom: 0;
      left: 0;
      right: 0;
      -webkit-overflow-scrolling: touch;
      .load-tip{
        height: .68rem;
        width: 100vw;
        font-size: .3rem;
        text-align: center;
        line-height: .68rem;
        color: #999;
      }
      .c-list{
        padding-left: .3rem;
        background: #fff;
        .c-items{
          position: relative;
          padding: .2rem .3rem .2rem 0;
          border-bottom: 1px solid #ededed;
          .title{
            position: relative;
            float: left;
            width: 6.9rem;
            height: .6rem;
            font-size: .34rem;
            color: #333;
            line-height: .6rem;
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              text-align: left;
              font-size: .38rem;
              color: #3395FF;
            }
            .tn{
              float: left;
              max-width: 4.8rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .tip{
              float: left;
              height: .4rem;
              margin-top: .1rem;
              margin-left: .1rem;
              padding: 0 3px;
              line-height: .38rem;
              display: block;
              font-size: .24rem;
              border-radius: 3px;
              &.orange{
                color: #FF7B33;
                border: 1px solid #FF7B33;
              }
              &.blue{
                color: #3395FF;
                border: 1px solid #3395FF;
              }
            }
          }
          .desc{
            float: left;
            height: .6rem;
            width: 6.9rem;
            font-size: .28rem;
            color: #999;
            line-height: .6rem;
            .phone{
              float: left;
            }
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              text-align: left;
              font-size: .34rem;
              color: #FF804A;
            }
            span{
              float: left;
              color: #3395FF;
            }
          }
          .name{
            position: absolute;
            bottom: .2rem;
            right: .3rem;
            height: .6rem;
            // width: 6.9rem;
            font-size: .28rem;
            color: #999;
            line-height: .6rem;
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              text-align: left;
              font-size: .34rem;
              color: #3395FF;
            }
            span{
              float: left;
            }
          }
        }
        .btn{
          position: absolute;
          top: .55rem;
          right: .3rem;
          height: .6rem;
          padding: 0 .1rem;
          line-height: .6rem;
          border: 1px solid #3395FF;
          border-radius: 3px;
          color: #3395FF;
          text-align: center;
        }
      }
    }
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
