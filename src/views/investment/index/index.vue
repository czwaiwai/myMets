<template>
  <div class="page page_bg">
    <nav-title title="投资物业"></nav-title>
    <div class="page_bd investment">
      <div class="banner">
        <img src="../../../assets/img/investment/banner.png">
      </div>
      <div class="content">
        <div class="destine items clearfix" @click.stop="toInvestmentList(15)">
          <i class="iconfont pics icon-fangyuan1"></i>
          <span>已投项目</span>
        </div>
        <div class="myDestine items clearfix" @click.stop="toInvestmentList(10)">
          <i class="iconfont pics icon-weilai"></i>
          <span>未来可投</span>
        </div>
        <div class="myMeeting items clearfix" @click.stop="toInvestmentList(20)">
          <i class="iconfont pics icon-prohibit"></i>
          <span>暂不考虑</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'investmentIndex',
  components: {navTitle},
  data () {
    return {
    }
  },
  methods: {
    toInvestmentList (type) {
      this.$router.push({
        name: 'investmentList',
        query: {
          type: type
        }
      })
    }
  },
  created () {
    console.log('index....')
  }
}
</script>
<style lang="scss" scoped>
  .investment{
    .banner{
      width: 100vw;
      height: 3.2rem;
      img{
        width: 100%;
        height: 100%;
        margin-top: -1px;
      }
    }
    .content{
      padding: 0 .3rem;
      .items{
        margin-top: .22rem;
        height: 1.68rem;
        font-size: .34rem;
        line-height: 1.68rem;
        color: #333;
        background: #fff;
        border-radius: .1rem;
        .pics{
          float: left;
          width: 1rem;
          height: 1rem;
          margin: .34rem .3rem;
          color: #fff;
          text-align: center;
          border-radius: .5rem;
        }
      }
    }
    .destine .pics{
      font-size: .5rem;
      line-height: 1rem;
      background: #0DC88C;
    }
    .myDestine .pics{
      font-size: .6rem;
      line-height: 1rem;
      background: #FA8A2C;
    }
    .myMeeting .pics{
      font-size: .8rem;
      line-height: 1.08rem;
      background: #2CB4FA;
    }
  }
</style>
