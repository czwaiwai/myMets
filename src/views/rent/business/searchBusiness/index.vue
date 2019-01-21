<template>
  <div class="page page_bg">
    <nav-title title="搜索商机"></nav-title>
    <div class="page_bd searchBusiness">
      <div class="searchBox clearfix">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="客源名称、电话、跟进人名称" type="search" v-model="searchKey" @keydown.13="searchList">
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
          <ul class="c-list" v-show="dataList.length">
            <li class="c-items clearfix" v-for="(item,index) in dataList" :key="index" @click.stop="toBusinessDetail(item,index)">
              <div class="title clearfix">
                <i class="iconfont icon-renwu icon"></i>
                <span>{{item.CstName}}</span>
                <p class="status">{{com_status(item.OpportType)}}</p>
              </div>
              <div class="msg">
                <div class="phone clearfix">
                  <i class="iconfont icon-dianhua icon"></i>
                  <span>{{item.ContactManner}}</span>
                </div>
                <div class="desc clearfix">
                  <i class="iconfont icon-weibiaoti105 icon"></i>
                  <span class="steps" :class="com_degree_color(item.UrgentDegree)">{{com_degree(item.UrgentDegree)}}</span>
                  <span class="odds">概率：</span>
                  <span class="val">{{item.TradChance||0}}%</span>
                  <span class="expect">预计：</span>
                  <span class="val">￥{{item.TradMoney||'0.00'}}</span>
                </div>
                <div class="time clearfix">
                  <i class="iconfont icon-calendar icon"></i>
                  <p><span>{{item.STime}}</span> 至 <span>{{item.ETime}}</span></p>
                </div>
                <div class="num" v-show="item.ApplyCode||item.OpUser||item.CttCode">
                  <span v-show="item.OpportType=='2'">报价单  {{item.ApplyCode}}</span>
                  <span v-show="item.OpportType=='1'">合同编号  {{item.CttCode}}</span>
                  <p class="name">{{item.OpUser}}</p>
                </div>
              </div>
            </li>
          </ul>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
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
import { mapGetters } from 'vuex'
import loadView from '@/components/ref/ref.vue'
import dialogConfire from '@/components/dialogConfire.vue'
import changeDate from '@/mixins/changeDate/index.js'
import businessCom from '@/mixins/businessCom/index.js'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'searchBusiness',
  components: {loadView, dialogConfire, navTitle, nonePage},
  mixins: [changeDate, businessCom],
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
    com_status (status) {
      let name = ''
      switch (status) {
        case '1': name = '已签约'; break
        case '2': name = '报价中'; break
        case '3': name = '无效'; break
        case '4': name = '跟进中'; break
      }
      return name
    },
    // 跳详情
    toBusinessDetail (item, index) {
      this.$store.commit('updateBusinessDetailType', {type: 0})
      this.$store.commit('updateBusiness', {hasDetail: true, detail: item, msg: {}})
      this.$router.push(`/businessDetail/${item.Id}`)
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
        localStorage.removeItem('historyBusinessList')
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
      //   p0: 'UserCS_OpportSearchInfo',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'EmployeeID': this.locationData.employeeData.employeeId,
      //     'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
      //     'CstName': this.searchKey,
      //     'BusinessName': 'AllOpt',
      //     'Page': this.page,
      //     'PageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportSearchInfo', {
        'OrgId': this.locationData.orgData.orgId,
        'EmployeeID': this.locationData.employeeData.employeeId,
        'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
        'CstName': this.searchKey,
        'BusinessName': 'AllOpt',
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      res.data.forEach(arr => {
        arr.STime = this.com_Date(arr.STime)
        arr.ETime = this.com_Date(arr.ETime)
        arr.TradChance = arr.TradChance - 0
      })
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
      this.historyList = this.historyList.slice(0, 8)
      localStorage.historyBusinessList = this.historyList.join(',')
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
        localStorage.historyBusinessList = this.historyList.join(',')
      } else {
        localStorage.removeItem('historyBusinessList')
      }
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.historyList = localStorage.historyBusinessList ? localStorage.historyBusinessList.split(',') : []
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
  .searchBusiness{
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
          padding-left: .3rem;
          padding-bottom: .1rem;
          margin-bottom: .2rem;
          background: #fff;
          &:last-child{
            margin-bottom: 0;
          }
          .title{
            position: relative;
            height: .8rem;
            font-size: .34rem;
            color: #333;
            line-height: .8rem;
            border-bottom: 1px solid #DDDEE3;
            .icon{
              float: left;
              width: .4rem;
              height: .8rem;
              font-size: .42rem;
              color: #3395FF;
              line-height: .8rem;
              text-align: left;
              margin-right: .1rem;
            }
            span{
              float: left;
              width: 5.2rem;
              line-height: .8rem;
              font-size: .32rem;
              color: #333;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .status{
              position: absolute;
              right: .3rem;
              top: 0;
              height: .8rem;
              font-size: .3rem;
              color: #FF804A;
              line-height: .8rem;
            }
          }
          .msg{
            padding-top: .1rem;
            .phone{
              .icon{
                float: left;
                width: .5rem;
                height: .6rem;
                font-size: .38rem;
                line-height: .6rem;
                color: #3395FF;
              }
              span{
                float: left;
                height: .6rem;
                line-height: .6rem;
                font-size: .32rem;
                color: #333;
              }
            }
            .desc{
              .icon{
                float: left;
                height: .6rem;
                width: .5rem;
                font-size: .38rem;
                line-height: .6rem;
                color: #FF804A;
                text-align: left;
              }
              .steps{
                float: left;
                height: .6rem;
                line-height: .6rem;
                color: #FF6262;
                font-size: .32rem;
                &.blue{
                  color: #57A7FE;
                }
                &.yellow{
                  color: #EDC905;
                }
                &.degreeRed{
                  color: #FF6262;
                }
                &.grad{
                  color: #999;
                }
              }
              .odds,.expect{
                float: left;
                height: .6rem;
                line-height: .6rem;
                margin-left: .2rem;
                font-size: .28rem;
                color: #777E8C;
              }
              .val{
                float: left;
                height: .6rem;
                line-height: .6rem;
                color: #333;
                font-size: .32rem;
              }
            }
            .time{
              .icon{
                float: left;
                height: .6rem;
                width: .5rem;
                line-height: .6rem;
                font-size: .34rem;
                color: #777E8C;
                text-align: left;
              }
              p{
                float: left;
                height: .6rem;
                line-height: .6rem;
                font-size: .28rem;
                color: #777E8C;
              }
            }
            .num{
              position: relative;
              height: .6rem;
              line-height: .6rem;
              font-size: .28rem;
              color: #777E8C;
              .name{
                position: absolute;
                top: 0;
                right: .3rem;
                height: .6rem;
                line-height: .6rem;
                font-size: .3rem;
                color: #333;
              }
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
