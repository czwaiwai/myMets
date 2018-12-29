<template>
  <div class="modulMatch">
    <div class="baseMsg msgBox mt20">
      <h3 class="boxTitle">基本配套</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">电梯数量：</span>
          <span class="value textLeft">2台</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">电梯品牌：</span>
          <span class="value textLeft">美的</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">车位数量：</span>
          <span class="value textLeft">1000</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">空调系统：</span>
          <span class="value textLeft">格力</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">空调开放：</span>
          <span class="value textLeft">8:00-10:00</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">电信系统：</span>
          <span class="value textLeft">南山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">地板：</span>
          <span class="value textLeft">国内</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">其它材料：</span>
          <span class="value textLeft">国内</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">吊顶：</span>
          <span class="value textLeft">国内</span>
        </div>
      </div>
    </div>
    <div class="arcMsg msgBox mt20">
      <h3 class="boxTitle">交通配套</h3>
      <div class="msg">
        <p class="iline">
          <span class="name">连社区卫生服务中心:&nbsp;&nbsp;</span>
          <span class="value">华山医院</span>
        </p>
        <p class="iline">
          <span class="name">周边学校:&nbsp;&nbsp;</span>
          <span class="value">华山医院、上大附中、华山医院、上大附中、华山医院、上大附中、华山医院、上大附中、华山医院、上大附中、华山医院、上大附中、华山医院、上大附中、华山医院、上大附中</span>
        </p>
        <p class="iline">
          <span class="name">轨道交通:&nbsp;&nbsp;</span>
          <span class="value">华山医院、上海大学站</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulMatch',
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .modulMatch{
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
        padding: .2rem .3rem;
        .iline{
          font-size: .3rem;
          line-height: 1.5;
          .name{
            color: #999;
          }
          .value{
            color: #333;
            text-indent: .3rem;
          }
        }
      }
    }
  }
  .mt20{
    margin-top: .2rem;
  }
</style>
