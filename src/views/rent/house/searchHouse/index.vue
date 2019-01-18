<template>
  <div class="page page_bg">
    <nav-title title="搜索房源"></nav-title>
    <div class="page_bd searchHouse">
      <div class="searchBox clearfix">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="请输入资源编码" type="search" v-model="searchKey" @keydown.13="searchList">
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
      <none-page title="暂无满足条件的客源~" height="70" v-if="!dataList.length && hasSearch"></none-page>
      <div class="content" v-show="dataList.length">
        <load-view ref="list">
          <ul class="c-list" v-show="dataList.length">
              <li class="c-items" v-for="(item,index) in dataList" :key="index" @click.stop="toHouseDetail(item,index)">
                <div class="tip" :class="com_color(item)">{{com_tipName(item)}}</div>
                <div class="top clearfix">
                  <div class="_left">
                    <p class="title">{{item.ResCode}}</p>
                    <p class="desc"><span v-if="item.RentalArea">{{com_point(item.RentalArea)}}㎡/</span><span v-show="item.FloorNum">{{item.FloorNum}}层/</span><span v-show="item.ResType">{{item.ResType}}</span></p>
                    <p class="name">{{item.GrpName}}{{item.BudName}}<span v-show="item.UnitNO">{{item.UnitNO}}单元</span><span v-show="item.ResNO">{{item.ResNO}}号</span></p>
                  </div>
                  <!-- <div class="_right"></div> -->
                </div>
                <div class="bottom bt" v-show="!(item.RentStatus=='Lease_AlrRent'||item.RentStatus=='Lease_Pprocess')">
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_CanRent'">
                    <div class="btn b_right green" @click.stop="toSaveRes(item,1)">预定</div>
                    <div class="btn b_right green" @click.stop="toSaveRes(item,0)">保留</div>
                    <div class="btn b_right orange" @click.stop="cancelMsg(item)">取消放盘</div>
                  </div>
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_Reserve'">
                    <div class="btn b_right green" @click.stop="toClearRes(item,0)">取消保留</div>
                  </div>
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_Decide'">
                    <div class="btn b_right green" @click.stop="toClearRes(item,1)">取消预定</div>
                  </div>
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_NTray'">
                    <div class="btn b_right green" @click.stop="confireMsg(item)">放盘</div>
                  </div>
                  <div class="times bt red" v-show="item.RentStatus=='Lease_AlrRent'">2019-01-01 到期</div>
                </div>
              </li>
            </ul>
            <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
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
import { mapGetters } from 'vuex'
import loadView from '@/components/ref/ref.vue'
import dialogConfire from '@/components/dialogConfire.vue'
import comPoint from '@/mixins/comPoint'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'searchHouse',
  components: {loadView, dialogConfire, navTitle, nonePage},
  mixins: [comPoint],
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
      isLoading: true,
      dialogData: {
        type: 0,
        title: '',
        data: {}
      }
    }
  },
  computed: {
    ...mapGetters({
      getKey: 'getRentSearchKey'
    })
  },
  methods: {
    com_color (item) {
      if (item.RentStatus === 'Lease_CanRent') {
        return 'color0'
      } else if (item.RentStatus === 'Lease_Reserve') {
        return 'color1'
      } else if (item.RentStatus === 'Lease_Decide') {
        return 'color2'
      } else if (item.RentStatus === 'Lease_NTray') {
        return 'color3'
      } else if (item.RentStatus === 'Lease_AlrRent') {
        return 'color4'
      } else if (item.RentStatus === 'Lease_Pprocess') {
        return 'color5'
      }
    },
    com_tipName (item) {
      if (item.RentStatus === 'Lease_CanRent') {
        return '可出租'
      } else if (item.RentStatus === 'Lease_Reserve') {
        return '已保留'
      } else if (item.RentStatus === 'Lease_Decide') {
        return '已预定'
      } else if (item.RentStatus === 'Lease_NTray') {
        return '未放盘'
      } else if (item.RentStatus === 'Lease_AlrRent') {
        return '已出租'
      } else if (item.RentStatus === 'Lease_Pprocess') {
        return '办理中'
      }
    },
    // 跳详情
    toHouseDetail (item, index) {
      this.$router.push(`/houseDetail/${item.Id}`)
    },
    // 保留或预定
    toSaveRes (item, type) {
      this.$store.commit('updateHouseDetail', item)
      this.$router.push({
        name: 'saveRes',
        params: {
          id: item.Id
        },
        query: {
          type: type
        }
      })
    },
    // 取消保留或预定
    toClearRes (item, type) {
      this.$store.commit('updateHouseDetail', item)
      this.$router.push({
        name: 'clearRes',
        params: {
          id: item.Id
        },
        query: {
          type: type
        }
      })
    },
    // 取消放盘
    cancelMsg (item) {
      this.dialogData = {
        type: 0,
        title: '确认取消放盘？取消后该资源将变为未放盘状态。',
        data: item
      }
      this.$refs.dialog.show()
    },
    // 放盘
    confireMsg (item) {
      this.dialogData = {
        type: 1,
        title: '确认将该资源放盘？放盘后该资源将变为可出租状态。',
        data: item
      }
      this.$refs.dialog.show()
    },
    com_status (item) {
      if (item.NextFollowTime) {
        let date = item.NextFollowTime.split(' ')[0].replace(/\//g, '.')
        return '最近 ' + date + ' 跟进'
      } else {
        return ''
      }
    },
    async submitMsg () {
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserAppHouse_UpdateHouseStatus',
      //   p7: {
      //     'HouseID': this.dialogData.data.Id,
      //     'StatusKey': this.dialogData.type === 0 ? '-3' : '3',
      //     'Stime': '',
      //     'Etime': '',
      //     'Memo': '',
      //     'EmployeeID': this.locationData.employeeData.employeeId
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserAppHouse_UpdateHouseStatus', {
        'HouseID': this.dialogData.data.Id,
        'StatusKey': this.dialogData.type === 0 ? '-3' : '3',
        'Stime': '',
        'Etime': '',
        'Memo': '',
        'EmployeeID': this.locationData.employeeData.employeeId
      })
      // this.$vux.loading.hide()
      console.log('res', res)
      this.$toast(res.msg || '')
      if (res.status === 200 || res.status === '200') {
        console.log(this.dialogData.data)
        if (this.dialogData.data.RentStatus === 'Lease_NTray') {
          this.dialogData.data.RentStatus = 'Lease_CanRent'
        } else if (this.dialogData.data.RentStatus === 'Lease_CanRent') {
          this.dialogData.data.RentStatus = 'Lease_NTray'
        }
      }
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      if (this.dialogData.type < 2) {
        this.submitMsg()
      } else if (this.dialogData.type === 2) {
        this.historyList = []
        localStorage.removeItem('historyHouseList')
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
      //   p0: 'UserCS_GetHouse',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'BudId': this.locationData.budItem ? this.locationData.budItem.Id : '',
      //     'RentStatus': '',
      //     'ResCode': this.searchKey,
      //     'ResName': '',
      //     'RentalAreaStart': '',
      //     'RentalAreaEnd': '',
      //     'FloorNumStart': '',
      //     'FloorNumEnd': '',
      //     'Page': this.page,
      //     'PageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetHouse', {
        'OrgId': this.locationData.orgData.orgId,
        'BudId': this.locationData.budItem ? this.locationData.budItem.Id : '',
        'RentStatus': '',
        'ResCode': this.searchKey,
        'ResName': '',
        'RentalAreaStart': '',
        'RentalAreaEnd': '',
        'FloorNumStart': '',
        'FloorNumEnd': '',
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
      localStorage.historyHouseList = this.historyList.join(',')
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
      this.dialogData = {
        type: 2,
        title: '请确认是否删除所有历史记录？',
        data: {}
      }
      this.$refs.dialog.show()
    },
    clearitem (item, index) {
      this.historyList.splice(index, 1)
      if (this.historyList.length) {
        localStorage.historyHouseList = this.historyList.join(',')
      } else {
        localStorage.removeItem('historyHouseList')
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
    this.historyList = localStorage.historyHouseList ? localStorage.historyHouseList.split(',') : []
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
  .searchHouse{
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
        .c-items{
          position: relative;
          margin-bottom: .2rem;
          background: #fff;
          &:last-child{
            margin-bottom: 0;
          }
          // border-bottom: 1px solid #ededed;
          .tip{
            position: absolute;
            top: 0;
            right: .3rem;
            height: .46rem;
            width: 1.15rem;
            font-size: .28rem;
            color: #fff;
            text-align: center;
            line-height: .46rem;
            border-bottom-right-radius: .2rem;
            &.color0{
              background: #FD4254;
            }
            &.color1{
              background: #FD8815;
            }
            &.color2{
              background: #3395FF;
            }
            &.color3{
              background: #F3C113;
            }
            &.color4{
              background: #5789FC;
            }
            &.color5{
              background: #AD70F9;
            }
          }
          .top{
            padding: .2rem .3rem;
            ._left{
              float: left;
              // height: 2rem;
              width: 5.6rem;
              .title{
                width: 5.6rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: .34rem;
                color: #333;
                line-height: 1.5;
              }
              .desc,.name{
                margin-top: .1rem;
                font-size: .28rem;
                color: #999;
                line-height: 1.2;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            // ._right{
            //   float: right;
            //   width: 1.9rem;
            //   height: 2rem;
            // }
          }
          .bottom{
            height: .88rem;
            padding: 0 .3rem;
            &.bt{
              border-top: 1px solid #ededed;
            }
            .btns{
              padding: .16rem 0;
              .btn{
                height: .56rem;
                min-width: 1.25rem;
                padding: 0 .2rem;
                line-height: .523rem;
                text-align: center;
                margin-left: .2rem;
                border-radius: 3px;
                font-size: .28rem;
                border-radius: 3px;
              }
            }
            .b_right{
              float: right;
            }
            .orange{
              color: #FB8A2C;
              border: 1px solid #FB8A2C;
            }
            .green{
              color: #3395FF;
              border: 1px solid #3395FF;
            }
            .red{
              color: #F00017;
              font-size: .28rem;
              line-height: .88rem;
              text-align: right;
            }
          }
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
