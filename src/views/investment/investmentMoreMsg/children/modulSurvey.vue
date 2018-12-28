<template>
  <div class="modulSurvey">
    <div class="baseMsg msgBox mt20">
      <h3 class="boxTitle">基本信息</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">项目名称：</span>
          <span class="value textLeft">宝山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">所在区县：</span>
          <span class="value textLeft">南山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">项目地址：</span>
          <span class="value textLeft">南山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">业态类型：</span>
          <span class="value textLeft">南山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">物业公司：</span>
          <span class="value textLeft">南山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">项目负责人：</span>
          <span class="value textLeft">南山区</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">国内/ 国外：</span>
          <span class="value textLeft">国内</span>
        </div>
      </div>
    </div>
    <div class="arcMsg msgBox mt20">
      <h3 class="boxTitle">建筑信息</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">总建筑面积：</span>
          <span class="value textLeft">2563㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">地面建筑面积：</span>
          <span class="value textLeft">2563㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">分割面积：</span>
          <span class="value textLeft">2563㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">楼层面积：</span>
          <span class="value textLeft">2563㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">楼层数：</span>
          <span class="value textLeft">3层</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">楼层高度：</span>
          <span class="value textLeft">2563㎡</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">开发商：</span>
          <span class="value textLeft">国内</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">竣工日期：</span>
          <span class="value textLeft">2018-12-11</span>
        </div>
      </div>
    </div>
    <div class="goodMsg msgBox mt20">
      <h3 class="boxTitle">项目亮点</h3>
      <div class="msg">暂无
      </div>
    </div>
    <div class="badMsg msgBox mt20">
      <h3 class="boxTitle">项目缺点</h3>
      <div class="msg">暂无
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulSurvey',
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .modulSurvey{
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
  }
  .mt20{
    margin-top: .2rem;
  }
</style>
