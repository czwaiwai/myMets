<template>
  <div class="modulResult">
    <div class="baseMsg msgBox mt20">
      <h3 class="boxTitle">交易信息</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">平均租金：</span>
          <span class="value textLeft">88.00元/㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">周边租金：</span>
          <span class="value textLeft">88.00元/㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">购置价格：</span>
          <span class="value textLeft">10000.00元</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">成交面价：</span>
          <span class="value textLeft">暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">出租率：</span>
          <span class="value textLeft">92%</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">得房率：</span>
          <span class="value textLeft">暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">车位率：</span>
          <span class="value textLeft">90%</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">收益率：</span>
          <span class="value textLeft">90%</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">车位费：</span>
          <span class="value textLeft">90元</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">租赁期限：</span>
          <span class="value textLeft">3年</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">资产价格：</span>
          <span class="value textLeft">90</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">业主报价：</span>
          <span class="value textLeft">90</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">中介联系方式：</span>
          <span class="value textLeft">15012345678</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">付款方式：</span>
          <span class="value textLeft">暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">涉外代表注册：</span>
          <span class="value textLeft">暂无</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulResult',
  data () {
    return {}
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
    .showItem .name {
      width: 2.3rem;
    }
  }
  .mt20{
    margin-top: .2rem;
  }
</style>
