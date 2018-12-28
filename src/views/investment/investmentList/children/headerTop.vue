<template>
  <div class="headerTop">
    <div class="city">
      <span>深圳</span>
      <i class="iconfont icon-zhankai"></i>
    </div>
    <div class="searchBtn">
      <div class="_wrap clearfix" @click.stop="toInvestmentSearch">
        <i class="iconfont icon-sousuo icon"></i>
        <span class="placeholder">请输入城市或项目</span>
      </div>
    </div>
    <i class="iconfont icon-dizhi changeBtn"></i>
  </div>
</template>
<script>
export default {
  name: 'headerTop',
  data () {
    return {}
  },
  methods: {
    toInvestmentSearch () {
      this.$router.push(`/investmentSearch`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .headerTop{
    display: flex;
    height: .98rem;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .city{
      width: 1.5rem;
      height: .98rem;
      font-size: .34rem;
      color: #333;
      line-height: .98rem;
      text-align: center;
    }
    .searchBtn{
      flex: 1;
      padding: .21rem 0;
      ._wrap{
        height: .56rem;
        background: #EFEFEF;
        border-radius: 3px;
        .icon{
          float: left;
          width: .56rem;
          height: .56rem;
          text-align: center;
          line-height: .56rem;
          font-size: .32rem;
          color: #999;
        }
        .placeholder{
          float: left;
          height: .56rem;
          line-height: .56rem;
          font-size: .28rem;
          color: #999;
        }
      }
    }
    .changeBtn{
      display: block;
      width: 1rem;
      height: .98rem;
      font-size: .34rem;
      color: #0DC88C;
      line-height: .98rem;
      text-align: center;
    }
  }
</style>
