<template>
  <div class="modulMatch">
    <div class="baseMsg msgBox mt20">
      <h3 class="boxTitle">基本配套</h3>
      <div class="msg">
        <div class="showItem clearfix noneBb">
          <span class="name">电梯数量：</span>
          <span class="value" v-if="moreData.LiftNum">{{moreData.LiftNum}}台</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">电梯品牌：</span>
          <span class="value" v-if="moreData.LiftBrand">{{moreData.LiftBrand}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">车位数量：</span>
          <span class="value" v-if="moreData.ParkiLotNum">{{moreData.ParkiLotNum}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">空调系统：</span>
          <span class="value" v-if="moreData.ACSys">{{moreData.ACSys}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">空调开放：</span>
          <span class="value" v-if="moreData.ACOpenTime">{{moreData.ACOpenTime}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">电信系统：</span>
          <span class="value" v-if="moreData.TeleSys">{{moreData.TeleSys}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">地板：</span>
          <span class="value" v-if="moreData.Floor">{{moreData.Floor}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">其它材料：</span>
          <span class="value" v-if="moreData.OtherMaterial">{{moreData.OtherMaterial}}</span>
          <span class="value" v-else>暂无</span>
        </div>
        <div class="showItem clearfix noneBb">
          <span class="name">吊顶：</span>
          <span class="value" v-if="moreData.Ceil">{{moreData.Ceil}}</span>
          <span class="value" v-else>暂无</span>
        </div>
      </div>
    </div>
    <div class="arcMsg msgBox mt20">
      <h3 class="boxTitle">交通配套</h3>
      <div class="msg" v-if="moreData.TrafficMat" v-html="com_change(moreData.TrafficMat)">
        <!-- <p class="iline">
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
        </p> -->
      </div>
      <div class="tip" v-else>暂无</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulMatch',
  props: {
    moreData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    com_change (str) {
      let text = str.replace(/\n/g, '<br>')
      console.log(text)
      return text
    }
  },
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
        font-size: .3rem;
        line-height: 1.5;
        color: #333;
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
  .tip{
    height: .88rem;
    padding-left: .3rem;
    line-height: .88rem;
    font-size: .3rem;
    color: #333;
  }
</style>
