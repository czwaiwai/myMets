<template>
  <div class="page page_bg">
    <nav-title title="房源信息"></nav-title>
    <div class="page_bd houseMsg">
      <ul class="c-list">
        <li class="c-items" v-for="(item,index) in dataList" :key="index">
          <div class="tip" :class="com_color(item.RentStatus)">{{com_tipName(item.RentStatus)}}</div>
          <div class="top clearfix">
            <div class="_left">
              <p class="title">{{item.ResCode}}</p>
              <p class="desc"><span v-if="item.RentalArea">{{com_point(item.RentalArea)}}㎡/</span><span v-show="item.FloorNum">{{item.FloorNum}}层/</span><span v-show="item.ResType">{{item.ResType}}</span></p>
              <p class="name">{{item.GrpName}}{{item.BudName}}<span v-show="item.UnitNO">{{item.UnitNO}}单元</span><span v-show="item.ResNO">{{item.ResNO}}号</span></p>
              <p class="orgName"><span v-show="item.OrgName">{{item.OrgName}}项目</span></p>
            </div>
          </div>
        </li>
      </ul>
      <!-- <div class="none" v-if="dataList.length==0 && hasHttp">
        <img src="../../../styles/images/none.png">
        <p class="tip">暂无房源信息~</p>
      </div> -->
      <none-page title="暂无房源信息~" v-show="dataList.length==0 && hasHttp"></none-page>
    </div>
  </div>
</template>
<script>
import comPoint from '@/mixins/comPoint'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
import navTitle from '@/components/navTitle'
export default {
  name: 'houseMsg',
  mixins: [comPoint],
  components: {nonePage, navTitle},
  data () {
    return {
      dataList: [],
      hasHttp: false
    }
  },
  methods: {
    com_color (status) {
      if (status === 'Lease_CanRent') {
        return 'color0'
      } else if (status === 'Lease_Reserve') {
        return 'color1'
      } else if (status === 'Lease_Decide') {
        return 'color2'
      } else if (status === 'Lease_NTray') {
        return 'color3'
      } else if (status === 'Lease_AlrRent') {
        return 'color4'
      } else if (status === 'Lease_Pprocess') {
        return 'color5'
      }
    },
    com_tipName (status) {
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
    async getDataList () {
      // let obj = {
      //   p0: 'UserCS_GetCstHouseInfo',
      //   p7: {
      //     'CstID': this.$route.params.id
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetCstHouseInfo', {
        'CstID': this.$route.params.id
      })
      console.log('dataList:', res)
      this.dataList = res.data
      this.hasHttp = true
      // this.$vux.loading.hide()
    }
  },
  created () {
    this.getDataList()
  }
}
</script>
<style lang="scss" scoped>
  .houseMsg{
    .c-list{
      .c-items{
        position: relative;
        margin-bottom: .2rem;
        background: #fff;
        &:last-child{
          margin-bottom: 0;
        }
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
            .desc,.name, .orgName{
              margin-top: .1rem;
              font-size: .28rem;
              color: #999;
              line-height: 1.2;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .none{
      img{
        display: block;
        width: 1.6rem;
        height: 1.5rem;
        margin: 2.5rem auto .5rem;
      }
      .tip{
        font-size: .28rem;
        color: #999;
        line-height: 1.2;
        text-align: center;
      }
    }
  }
</style>
