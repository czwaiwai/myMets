<template>
  <div class="items-wrap">
    <ul class="list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li class="item clearfix" v-for="(item,index) in listData" :key="index" @click.stop="toInvestmentDetail(item)">
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
  </div>
</template>
<script>
import dateChange from '@/mixins/dateChange'
export default {
  name: 'items',
  mixins: [dateChange],
  data () {
    return {
      listData: [],
      showTip: false,
      page: 1,
      pageSize: 20
    }
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
    toInvestmentDetail (item) {
      this.$router.push({
        name: `investmentDetail`,
        params: {
          id: item.ID
        }
      })
    },
    // 加载更多
    loadMore () {
      if (this.showTip) {
        this.page++
        this.getDataList()
      }
    },
    // 获取列表数据
    async getDataList () {
      let res = await this.$xml('UserCS_InvestmentPropertyList', {
        'County': '',
        'ProjStatus': this.$route.query.type,
        'TradeType': '',
        'RentAvgMin': '',
        'RentAvgMax': '',
        'AreaTotalMin': '',
        'AreaTotalMax': '',
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data) {
        if (this.page === 1) {
          this.listData = res.data
        } else {
          this.listData = this.listData.concat(res.data)
        }
      }
      if (res.data.length < this.pageSize - 1) {
        this.showTip = false
      } else {
        this.showTip = true
      }
    }
  },
  created () {
    this.getDataList()
  }
}
</script>
<style lang="scss" scoped>
  .items-wrap{
    width: 100%;
    height: 100%;
    .list{
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
