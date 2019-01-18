<template>
  <div class="page page_bg">
    <nav-title title="匹配意向"></nav-title>
    <div class="page_bd matchOrder">
      <div class="searchBox clearfix">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="请输入资源号或楼层" type="search" v-model="searchKey" @keydown.13="searchList">
            <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
        </form>
        <span class="searachBtn" v-if="searchKey.length" @click.stop="searchList">搜索</span>
        <span class="searachBtn" v-else @click.stop="$router.go(-1)">取消</span>
      </div>
      <div class="content">
        <load-view ref="list">
          <!-- <div class="none" v-show="listData.list.length==0&&hasHttp">
            <img src="../../../styles/images/none.png">
            <p>暂无数据~</p>
          </div> -->
          <none-page title="暂无数据~" v-show="listData.list.length==0&&hasHttp"></none-page>
          <div class="list" v-for="(item,index) in listData.list" :key="index" @click.stop="selectItem(item)">
            <div class="header clearfix">
              <i class="iconfont icon-loufang icon"></i>
              <span class="code">{{item.ResCode}}</span>
              <span class="status">{{com_status(item.RentStatus)}}</span>
            </div>
            <div class="msg">
              <div class="title clearfix">
                <i class="iconfont icon-icon- icon"></i>
                <span class="code">{{item.ResName}}</span>
                <span class="use">{{item.ResType}}</span>
              </div>
              <div class="desc clearfix">
                <i class="iconfont icon-fangwu icon"></i>
                <span class="name">
                  <span>{{item.BudName}}</span><span v-show="item.FloorNum">{{item.FloorNum}}层</span>
                </span>
                <i class="iconfont icon-haofangtuo400iconfontzhaoxiang icon ml65" v-show="item.Toward"></i>
                <span class="name">{{item.Toward}}</span>
              </div>
              <div class="area">
                <span>建筑面积：</span>
                <span>{{item.BudArea}}</span>
              </div>
              <div class="area">
                <span>使用面积：</span>
                <span>{{item.UseArea}}</span>
              </div>
              <i class="iconfont icon-xuanze selectIcon" v-show="item.isSelect"></i>
            </div>
          </div>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor':listData.isSelect}" @click.stop="toSelectTime">下一步</div>
      </div>
    </div>
  </div>
</template>
<script>
import loadView from '@/components/ref/ref.vue'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'matchOrder',
  components: {loadView, navTitle, nonePage},
  data () {
    return {
      locationData: {},
      searchKey: '',
      listData: {
        isSelect: false,
        list: []
      },
      resCode: '',
      page: 1,
      pageSize: 20,
      isLoading: true,
      showLoadTip: false,
      hasHttp: false
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness',
      getKey: 'getSearchKey'
    })
  },
  methods: {
    com_status (status) {
      if (status === 'Lease_CanRent') {
        return '可出租'
      } else if (status === 'Lease_Reserve') {
        return '已保留'
      } else if (status === 'Lease_Decide') {
        return '已预定'
      } else if (status === 'Lease_NTray') {
        return '未放盘'
      } else if (status === 'Lease_AlrRent') {
        return '已出租'
      } else if (status === 'Lease_Pprocess') {
        return '办理中'
      }
    },
    searchList () {
      this.$el.querySelector('.search-input').blur()
      this.$refs.list.setTop(1)
      this.seach()
    },
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
    },
    selectItem (item) {
      this.listData.isSelect = true
      if (!item.isSelect) {
        this.listData.list.forEach(arr => {
          arr.isSelect = false
        })
      }
      item.isSelect = true
      this.resCode = item.ResCode
    },
    toSelectTime () {
      if (this.listData.isSelect) {
        this.$store.commit('updateRentSearchKey', {key: this.searchKey})
        this.$router.push({
          name: 'selectTime',
          query: {
            resCode: this.resCode
          }
        })
      }
    },
    async seach () {
      let CstRequDeta = []
      this.business.msg.CstRequDeta.forEach(arr => {
        let temp = {
          'ColumnName': arr.ColumnName || '',
          'Connector': arr.Connector || '',
          'ValueStart': arr.ValueStart || ''
        }
        CstRequDeta.push(temp)
      })
      // let obj = {
      //   p0: 'UserCS_OpportRequpIntention',
      //   p7: {
      //     'OrgID': this.locationData.orgData.orgId,
      //     'ResCode': this.searchKey,
      //     'CstRequDeta': CstRequDeta,
      //     'page': this.page,
      //     'pageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportRequpIntention', {
        'OrgID': this.locationData.orgData.orgId,
        'ResCode': this.searchKey,
        'CstRequDeta': CstRequDeta,
        'page': this.page,
        'pageSize': this.pageSize
      })
      console.log(res)
      // this.$vux.loading.hide()
      this.hasHttp = true
      res.data.forEach(arr => {
        arr.isSelect = false
        if (arr.UseArea > 0) {
          arr.UseArea = (arr.UseArea - 0).toFixed(2)
        }
        if (arr.BudArea > 0) {
          arr.BudArea = (arr.BudArea - 0).toFixed(2)
        }
      })
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      this.isLoading = false
      if (this.page === 1) {
        this.listData.list = res.data
        this.listData.isSelect = false
      } else {
        this.listData.list = this.listData.list.concat(res.data)
      }
      // this.$vux.loading.hide()
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.searchKey = this.getKey.key || ''
    this.seach()
    console.log(this.business.msg)
  },
  mounted () {
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
          this.seach()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .matchOrder{
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
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .load-tip{
        height: .68rem;
        width: 100vw;
        font-size: .3rem;
        text-align: center;
        line-height: .68rem;
        color: #999;
      }
      .none{
        img{
          display: block;
          width: 1.6rem;
          height: 1.5rem;
          margin: 2.5rem auto .5rem;
        }
        p{
          color: #4a4a4a;
          font-size: .3rem;
          text-align: center;
          line-height: 1.2;
        }
      }
      .list{
        position: relative;
        padding-left: .3rem;
        background: #fff;
        margin-bottom: .2rem;
        .header{
          position: relative;
          height: .8rem;
          border-bottom: 1px solid #DDDEE3;
          .icon{
            float: left;
            width: .5rem;
            height: .8rem;
            line-height: .8rem;
            font-size: .4rem;
            color: #3395FF;
          }
          .code{
            float: left;
            height: .8rem;
            line-height: .8rem;
            font-size: .32rem;
            color: #333;
            width: 5.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .status{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            height: .8rem;
            line-height: .8rem;
            font-size: .3rem;
            color: #FF804A;
          }
        }
        .msg{
          position: relative;
          padding: .2rem 0;
          .title{
            position: relative;
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              color: #3395FF;
              font-size: .38rem;
            }
            .code{
              float: left;
              height: .6rem;
              line-height: .6rem;
              color: #333;
              font-size: .3rem;
              width: 5rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .use{
              position: absolute;
              top: 0;
              right: .3rem;
              height: .6rem;
              line-height: .6rem;
              color: #333;
              font-size: .3rem;
            }
          }
          .desc{
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              color: #3395FF;
              font-size: .38rem;
            }
            .name{
              float: left;
              height: .6rem;
              line-height: .6rem;
              color: #333;
              font-size: .3rem;
              max-width: 3rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .ml65{
              margin-left: .65rem;
            }
          }
          .area{
            height: .6rem;
            line-height: .6rem;
            font-size: .3rem;
            color: #777E8C;
          }
          .selectIcon{
            position: absolute;
            right: .3rem;
            top: 0;
            z-index: 11;
            width: .5rem;
            height: 2.8rem;
            font-size: .4rem;
            line-height: 2.8rem;
            text-align: right;
            color: #3395FF;
          }
        }
      }
    }
    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1.2rem;
      padding: .2rem .3rem;
      background: #fff;
      border-top: 1px solid #E9E9E9;
      .btn{
        height: .8rem;
        font-size: .3rem;
        line-height: .8rem;
        text-align: center;
        color: #fff;
        background:rgba(51,149,255,.5);
        border-radius: .1rem;
        &.deepColor{
          background: #3395FF;
        }
      }
    }
  }
</style>
