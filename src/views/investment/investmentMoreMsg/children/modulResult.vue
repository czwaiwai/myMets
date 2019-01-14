<template>
  <div class="modulResult">
    <div class="baseMsg msgBox mt20">
      <h3 class="boxTitle">交易信息</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">平均租金：</span>
          <span class="value" v-if="moreData.RentAvg">{{moreData.RentAvg}}元/㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">周边租金：</span>
          <span class="value" v-if="moreData.RentDeal">{{moreData.RentDeal}}元/㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">购置价格：</span>
          <span class="value" v-if="moreData.BuyPrice">{{moreData.BuyPrice}}元</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">成交面价：</span>
          <span class="value" v-if="moreData.TradePrice">{{moreData.TradePrice}}元</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">出租率：</span>
          <span class="value" v-if="moreData.RentRate">{{moreData.RentRate}}%</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">得房率：</span>
          <span class="value" v-if="moreData.RoomRate">{{moreData.RoomRate}}%</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">收益率：</span>
          <span class="value" v-if="moreData.ProfitRate">{{moreData.ProfitRate}}%</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">车位费：</span>
          <span class="value" v-if="moreData.ParkiLotCost">{{moreData.ParkiLotCost}}元</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">租赁期限：</span>
          <span class="value" v-if="moreData.RentTerm">{{moreData.RentTerm}}年</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">资产价格：</span>
          <span class="value" v-if="moreData.AssetPrice">{{moreData.AssetPrice}}元</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">业主报价：</span>
          <span class="value" v-if="moreData.OwnerPrice">{{moreData.OwnerPrice}}元</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">中介联系方式：</span>
          <a class="value phone clearfix" v-if="moreData.MediumTel" :href="'tel:'+moreData.MediumTel">
            <span class="tel">{{moreData.MediumTel}}</span>
            <i class="iconfont icon-dianhua pic"></i>
          </a>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">付款方式：</span>
          <span class="value" v-if="moreData.PayType">{{moreData.PayType}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">涉外代表注册：</span>
          <span class="value" v-if="moreData.IsRegist">{{moreData.IsRegist=='True'?'是':'否'}}</span>
          <span class="value" v-else>暂无</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulResult',
  props: {
    moreData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .modulResult{
    .msgBox{
      margin-top: .2rem;
      background: #fff;
      .boxTitle{
        height: .82rem;
        padding: 0 .3rem;
        line-height: .82rem;
        font-size: .34rem;
        color: #333;
        border-bottom: 1px solid #ededed;
      }
      .msg{
        padding: .1rem .3rem;
      }
    }
    .showItem {
      .name {
        width: 2.3rem;
      }
      .value {
        width: 4.5rem;
      }
    }
  }
  .mt20{
    margin-top: .2rem;
  }
  .showItem{
    .phone{
      .people, .tel {
        float: left;
        height: .56rem;
        line-height: .56rem;
        margin-right: .1rem;
        color: #333;
      }
      .pic{
        float: left;
        width: .56rem;
        height: .56rem;
        font-size: .4rem;
        color: #0DC88C;
        text-align: center;
        line-height: .56rem;
      }
    }
  }
</style>
