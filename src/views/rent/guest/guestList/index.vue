<template>
  <div class="page page_bg">
    <nav-title title="租赁客源"></nav-title>
    <div class="page_bd guestList">
      <i class="iconfont icon-tianxie newObj" @click.stop="toNewGuest"></i>
      <div class="header clearfix">
        <div class="search clearfix" @click.stop="toSearchGuest">
          <i class="iconfont icon-sousuo"></i>
          <span>客源名称、电话</span>
        </div>
      </div>
      <div class="types" @click.stop="toScreenType">
        <span>{{guestStatus.CognitivBusinessName_zheWay}}</span>
        <i class="iconfont icon-gengduo1"></i>
      </div>
      <div class="content">
        <load-view ref="list">
          <!-- <div class="none" v-show="dataList.length==0&&hasHttp">
            <img src="../../../styles/images/none.png">
            <p>暂无数据~</p>
          </div> -->
          <none-page title="暂无数据~" height="70" v-show="dataList.length==0&&hasHttp"></none-page>
          <ul class="c-list">
            <li class="c-items clearfix" v-for="(item,index) in dataList" :key="index" @click.stop="toGuestDetail(item,index)">
              <p class="title">
                <i class="iconfont icon-renwu icon"></i>
                <span class="tn">{{item.CstName}}</span>
                <span class="tip" :class="item.CstLevel==='VIP'?'orange':'blue'" v-show="item.CstLevel">{{item.CstLevelCH}}</span>
              </p>
              <div class="desc clearfix">
                <a class="clearfix phone" :href="'tel:'+item.FirstPhone" v-if="item.FirstPhone" @click.stop="">
                  <i class="iconfont icon-dianhua icon"></i>
                  <span>{{item.FirstPhone}}</span>
                </a>
                <span v-else>
                  <i class="iconfont icon-dianhua icon"></i>
                  <span>暂无</span>
                </span>
              </div>
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
  </div>
</template>
<script>
import loadView from '@/components/ref/ref.vue'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
import navTitle from '@/components/navTitle'
import { mapGetters } from 'vuex'
export default {
  name: 'guestList',
  components: {loadView, nonePage, navTitle},
  data () {
    return {
      types: [
        {name: '全部客源', type: 0, isSelect: true},
        {name: '我的客源', type: 1, isSelect: false},
        {name: '公共客源', type: 2, isSelect: false}
      ],
      dataList: [],
      locationData: {},
      page: 1,
      pageSize: 20,
      isLoading: true,
      showLoadTip: false,
      hasHttp: false
    }
  },
  computed: {
    ...mapGetters({
      guestStatus: 'getGuestStatus'
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
    // 选择类型
    selectType (item, index) {
      if (item.isSelect) {
        return
      }
      this.types.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
    },
    // 搜索客源
    toSearchGuest () {
      this.$store.commit('updateRentSearchKey', {key: ''})
      this.$router.push(`/searchGuest`)
    },
    // 筛选类型
    toScreenType () {
      this.$router.push(`/screenType`)
    },
    // 新增客源
    toNewGuest () {
      this.$router.push(`/newGuest`)
    },
    // 到详情
    toGuestDetail (item, index) {
      this.$router.push(`/guestDetail/${item.Id}`)
    },
    async getData () {
      // let obj = {
      //   p0: 'UserCS_CustomerSearch',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'EmployeeID': this.locationData.employeeData.employeeId,
      //     'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
      //     'CstName': '',
      //     'BusinessName': this.guestStatus.BusinessKey,
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
        'CstName': '',
        'BusinessName': this.guestStatus.BusinessKey,
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
      this.hasHttp = true
      // this.$vux.loading.hide()
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.getData()
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
          this.getData()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .guestList{
    .newObj{
      position: absolute;
      right: .44rem;
      bottom: 1.32rem;
      z-index: 99999;
      display: block;
      width: 1rem;
      height: 1rem;
      background: #3395FF;
      border-radius: 1rem;
      font-size: .6rem;
      color: #fff;
      text-align: center;
      line-height: 1rem;
    }
    .header{
      position: relative;
      height: 1.06rem;
      padding: .2rem .3rem;
      // background: #fff;
      border-bottom: 1px solid #ededed;
      .search{
        height: 0.66rem;
        background: #fff;
        border-radius: 0.2rem;
        font-size: .3rem;
        line-height: 0.66rem;
        color: #999;
        text-align: center;
        .icon-sousuo{
          display: inline-block;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: 0.34rem;
          text-align: right;
          color: #999;
        }
      }
    }
    .types{
      position: relative;
      height: .88rem;
      padding: 0 .3rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      line-height: .88rem;
      font-size: .3rem;
      color: #3395FF;
      .icon-gengduo1{
        position: absolute;
        right: .3rem;
        top: 0;
        width: 1rem;
        height: .88rem;
        display: block;
        text-align: right;
        line-height: .88rem;
        font-size: .4rem;
        color: #999;
      }
    }
    .content{
      position: absolute;
      top: 1.94rem;
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
      .none{
        img{
          display: block;
          width: 1.6rem;
          height: 1.5rem;
          margin: 2.5rem auto .5rem;
        }
        p{
          text-align: center;
          line-height: 1.2;
          font-size: .3rem;
          color: #4A4A4A;
        }
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
  }
</style>
