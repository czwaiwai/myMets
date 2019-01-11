<template>
  <div class="modulSurvey">
    <div class="baseMsg msgBox mt20">
      <h3 class="boxTitle">基本信息</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">项目名称：</span>
          <span class="value" v-if="moreData.ProjName">{{moreData.ProjName}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">所在区县：</span>
          <span class="value" v-if="moreData.County">{{moreData.County}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">项目地址：</span>
          <span class="value" v-if="moreData.ProjAddr">{{moreData.ProjAddr}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">业态类型：</span>
          <span class="value" v-if="moreData.TradeType">{{moreData.TradeType}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">物业公司：</span>
          <span class="value" v-if="moreData.PropertyComp">{{moreData.PropertyComp}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">项目负责人：</span>
          <a class="value phone clearfix" v-if="moreData.Tel&&moreData.ProjLeader" :href="'tel:'+moreData.Tel">
            <span class="people">{{moreData.ProjLeader}}</span>
            <span class="tel">{{moreData.Tel}}</span>
            <i class="iconfont icon-dianhua pic"></i>
          </a>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">国内/ 国外：</span>
          <span class="value" v-if="moreData.DomesticOrAbroad">{{moreData.DomesticOrAbroad=='Domestic'?"国内":'国外'}}</span>
          <span class="value" v-else>暂无</span>
        </div>
      </div>
    </div>
    <div class="arcMsg msgBox mt20">
      <h3 class="boxTitle">建筑信息</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">总建筑面积：</span>
          <span class="value" v-if="moreData.AreaTotal">{{moreData.AreaTotal}}㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">地面建筑面积：</span>
          <span class="value" v-if="moreData.AreaGround">{{moreData.AreaGround}}㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">分割面积：</span>
          <span class="value" v-if="moreData.AreaSegm">{{moreData.AreaSegm}}㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">楼层面积：</span>
          <span class="value" v-if="moreData.AreaFloor">{{moreData.AreaFloor}}㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">楼层数：</span>
          <span class="value" v-if="moreData.FloorNum">{{moreData.FloorNum}}层</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">楼层高度：</span>
          <span class="value" v-if="moreData.FloorHeight">{{moreData.FloorHeight}}㎡</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">开发商：</span>
          <span class="value" v-if="moreData.Developer">{{moreData.Developer}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">竣工日期：</span>
          <span class="value" v-if="moreData.FinishDate">{{moreData.FinishDate}}</span>
          <span class="value" v-else>暂无</span>
        </div>
      </div>
    </div>
    <div class="goodMsg msgBox mt20">
      <h3 class="boxTitle">项目亮点</h3>
      <div class="msg">
        <p class="value" v-if="moreData.ProjMerits">{{moreData.ProjMerits}}</p>
        <p class="value" v-else>暂无</p>
      </div>
    </div>
    <div class="badMsg msgBox mt20">
      <h3 class="boxTitle">项目缺点</h3>
      <div class="msg">
        <p class="value" v-if="moreData.ProjDefect">{{moreData.ProjDefect}}</p>
        <p class="value" v-else>暂无</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulSurvey',
  props: {
    moreData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
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
        padding: .2rem .3rem;
        .value{
          font-size: .3rem;
          color: #333;
          line-height: 1.5;
        }
      }
      .goodMsg,.badMsg{
        padding: .2rem .3rem;
        .value{
          font-size: .3rem;
          color: #333;
          line-height: 1.5;
        }
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
