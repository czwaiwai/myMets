<template>
  <div class="page page_bg">
    <nav-title title="资源合同"></nav-title>
    <div class="page_bd contractMsg">
      <div class="header">
        <p class="title">{{houseDetail.ResCode}}</p>
        <p class="name">{{houseDetail.GrpName}}{{houseDetail.BudName}}<span v-show="houseDetail.UnitNO">{{houseDetail.UnitNO}}单元</span><span v-show="houseDetail.ResNO">{{houseDetail.ResNO}}号</span></p>
      </div>
      <!-- <div class="none" v-show="dataList.length==0"> -->
        <!-- <img src="../../../styles/images/none.png"> -->
      <!-- </div> -->
      <none-page title="" height="70" v-show="dataList.length==0"></none-page>
      <div class="msgList" v-show="dataList.length">
        <load-view ref="list">
          <!-- <h3 class="title"><span>最近1个合同</span></h3> -->
          <div class="desc" :class="{'last':index==dataList.length-1}" v-for="(item,index) in dataList" :key="index">
            <div class="top">
              <span>{{item.CstName}}</span>
              <span class="tip" :class="com_color(item)">{{com_name(item)}}</span>
            </div>
            <p class="date">起止日期：<span>{{com_time(item)}}</span></p>
            <p class="type">合同类型：<span>{{item.TypeName}}</span></p>
            <p class="msg">合同信息：<span>{{item.CombInfo}}</span></p>
          </div>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import loadView from '@/components/ref/ref.vue'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'contractMsg',
  components: {loadView, navTitle, nonePage},
  data () {
    return {
      dataList: [],
      showLoadTip: false,
      isLoading: true,
      page: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters({
      houseDetail: 'getHouseDetail'
    })
  },
  methods: {
    com_color (item) {
      if (item.Status === 'NorC') {
        return 'green'
      } else if (item.Status === 'HisC') {
        return 'orange'
      } else if (item.Status === 'InvC') {
        return 'red'
      }
    },
    com_name (item) {
      if (item.Status === 'NorC') {
        return '正常'
      } else if (item.Status === 'HisC') {
        return '历史'
      } else if (item.Status === 'InvC') {
        return '作废'
      } else {
        return ''
      }
    },
    com_msg (item) {
      if (item.Status === 'NorC') {
        return '【正常租户】' + item.CttName + '【' + this.houseDetail.ResCode + '】'
      } else {
        return '【历史租户】' + item.CttName + '【' + this.houseDetail.ResCode + '】'
      }
    },
    com_time (item) {
      let st = ' '
      let et = ' '
      if (item.STime) {
        st = item.STime.split(' ')[0].replace(/\//g, '.')
      }
      if (item.ETime) {
        et = item.ETime.split(' ')[0].replace(/\//g, '.')
      }
      return st + ' - ' + et
    },
    async getData () {
      // let obj = {
      //   p0: 'UserAppHouse_SearchCttByHouse',
      //   p7: {
      //     'ResID': this.$route.params.id,
      //     'Page': this.page,
      //     'PageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserAppHouse_SearchCttByHouse', {
        'ResID': this.$route.params.id,
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      this.dataList = this.dataList.concat(res.data)
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      // if (res.Syswin[0].status === 1 || res.Syswin[0].status === '1') {
      //   this.dataList = this.dataList.concat(res.Syswin[0].Data)
      //   if (res.Syswin[0].Data.length === this.pageSize) {
      //     this.showLoadTip = true
      //   } else {
      //     this.showLoadTip = false
      //   }
      // } else {
      //   // // this.$vux.toast.text(res.Syswin[0].msg)
      //   this.showLoadTip = false
      // }
      this.isLoading = false
      setTimeout(() => {
        // this.$vux.loading.hide()
      }, 200)
      // // this.$vux.loading.hide()
    }
  },
  created () {
    console.log(this.houseDetail)
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
  .contractMsg{
    // position: relative;
    // flex: 1;
    // overflow: hidden;
    .none{
      img{
        display: block;
        width: 1.6rem;
        height: 1.5rem;
        margin: 2.5rem auto;
      }
    }
    .load-tip{
      height: .68rem;
      width: 100vw;
      font-size: .3rem;
      text-align: center;
      line-height: .68rem;
      color: #999;
    }
    .header{
      position: relative;
      height: 1.34rem;
      padding: .2rem .3rem 0;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .title{
        line-height: 1.5;
        font-size: .34rem;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .name{
        margin-top: .1rem;
        line-height: 1.2;
        font-size: .28rem;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .msgList{
      position: absolute;
      top: 1.34rem;
      left: 0;
      right: 0;
      bottom: 0;
      // padding-bottom: .2rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .desc{
        width: 6.9rem;
        padding-bottom: .2rem;
        margin: .2rem auto 0;
        background: #fff;
        border-radius: .08rem;
        overflow: hidden;
        &.last{
          margin-bottom: .2rem;
        }
        .top{
          position: relative;
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          color: #333;
          padding-left: .3rem;
          border-bottom: 1px solid #E9E9E8;
          .tip{
            position: absolute;
            top: 0;
            right: .3rem;
            color: #3395FF;
            font-size: .28rem;
            &.grren{
              color: #3395FF;
            }
            &.orange{
              color: #FD8815;
            }
            &.red{
              color: #F00017;
            }
          }
        }
        .date,.type,.msg{
          padding: .2rem .3rem 0;
          font-size: .3rem;
          color: #999;
          line-height: 1.2;
          span{
            color: #333;
          }
        }
      }
    }
  }
</style>
