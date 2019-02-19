<template>
  <div class="items-wrap">
    <ul class="list"
      v-if="listData.length"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li class="item clearfix" v-for="(item,index) in listData" :key="index" @click.stop="toInvestmentDetail(item)">
        <div class="status" :class="colorClass">{{status}}</div>
        <img class="pic" :src="item.Url" :onerror="defaultImg">
         <!-- :onerror="defaultImg" -->
        <div class="desc">
          <div class="title _lines">
            <span v-if="item.ProjName">{{item.ProjName}}</span>
            <span v-else>暂无</span>
          </div>
          <div class="name _lines">
            <span v-if="item.AreaTotal">{{item.AreaTotal}}㎡</span>
            <span v-else>暂无</span>
            <span v-if="item.County">/{{item.County}}</span>
            <span v-else>/暂无</span>
            <span v-if="item.TradeType">/{{item.TradeType}}</span>
            <span v-else>/暂无</span>
          </div>
          <div class="price _lines" v-if="item.RentAvg">{{item.RentAvg}}元㎡/天</div>
          <div class="price _lines" v-else>暂无</div>
          <div class="time _lines" v-if="item.RegDate">{{com_setDate(item.RegDate)}}</div>
          <div class="time _lines" v-else>暂无</div>
        </div>
      </li>
      <li class="tip" v-show="showTip">加载中···</li>
    </ul>
    <none-page title="暂无符合条件的数据~" v-else></none-page>
  </div>
</template>
<script>
import dateChange from '@/mixins/dateChange'
import nonePage from '@/components/nonePage/index.vue'
export default {
  name: 'items',
  mixins: [dateChange],
  components: {nonePage},
  data () {
    return {
      defaultImg: 'this.src="' + require('../../../../assets/img/investment/banner.png') + '"',
      listData: [],
      showTip: false,
      status: '',
      colorClass: '',
      imgUrl: '',
      page: 1,
      pageSize: 20
    }
  },
  methods: {
    // 状态名称
    com_status_color () {
      switch (this.$route.query.type - 0) {
        case 10:
          this.status = '未来可投'
          this.colorClass = 'statusColor1'
          break
        case 15:
          this.status = '已投'
          this.colorClass = 'statusColor0'
          break
        case 20:
          this.status = '不考虑'
          this.colorClass = 'statusColor2'
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
        'CityID': this.$parent.cityData.ID,
        'County': this.$parent.selectData.County,
        'ProjStatus': this.$route.query.type,
        'TradeType': this.$parent.selectData.TradeType,
        'RentAvgMin': this.$parent.selectData.RentAvgMax !== '' ? (this.$parent.selectData.RentAvgMin || 0) : (this.$parent.selectData.RentAvgMin || ''),
        'RentAvgMax': this.$parent.selectData.RentAvgMin !== '' ? (this.$parent.selectData.RentAvgMax || 99999999999) : (this.$parent.selectData.RentAvgMax || ''),
        'AreaTotalMin': this.$parent.selectData.AreaTotalMax !== '' ? (this.$parent.selectData.AreaTotalMin || 0) : (this.$parent.selectData.AreaTotalMin || ''),
        'AreaTotalMax': this.$parent.selectData.AreaTotalMin !== '' ? (this.$parent.selectData.AreaTotalMax || 99999999999) : (this.$parent.selectData.AreaTotalMax || ''),
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data) {
        let ip = this.$store.getters.ip
        res.data = res.data.map(item => {
          if (ip && item.Url) {
            item.Url = 'http://' + ip + item.Url
          }
          return item
        })
        if (this.page === 1) {
          this.listData = res.data
        } else {
          this.listData = this.listData.concat(res.data)
        }
      } else {
        this.listData = []
      }
      if (res.data.length < this.pageSize - 1) {
        this.showTip = false
      } else {
        this.showTip = true
      }
    },
    initGetData () {
      this.page = 1
      this.showTip = false
      this.getDataList()
    }
  },
  created () {
    this.com_status_color()
    this.getDataList()
    this.imgUrl = require('@/assets/img/investment/banner.png')
    console.log('inItmes....')
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
            background: #3395ff;
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
