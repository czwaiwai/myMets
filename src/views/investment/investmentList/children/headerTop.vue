<template>
  <div class="headerTop">
    <div class="city" @click.stop="selectCity">
      <span>{{$parent.delectLastWord($parent.cityData.LevelCityName)}}</span>
      <i class="iconfont" :class="showCity?'icon-zhankai1':'icon-zhankai'"></i>
    </div>
    <div class="searchBtn">
      <div class="_wrap clearfix" @click.stop="toInvestmentSearch">
        <i class="iconfont icon-sousuo icon"></i>
        <span class="placeholder">请输入城市或项目</span>
      </div>
    </div>
    <i class="iconfont changeBtn" :class="isList?'icon-ditu':'icon-fenlei'" @click.stop="changeContent"></i>
    <collapse-transition>
      <div class="selectList" v-show="showCity">
        <div class="mark" @click.stop="showCity=false"></div>
        <div class="_content">
          <div class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in citys" :key="index" @click.stop="selectItem(item)">
            <span class="name">{{$parent.delectLastWord(item.LevelCityName)}}</span>
          </div>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
export default {
  name: 'headerTop',
  components: {CollapseTransition},
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isList: true,
      showCity: false,
      cityData: {
        LevelCityName: ''
      },
      citys: []
    }
  },
  methods: {
    // 内容视图更改
    changeContent () {
      this.showCity = false
      this.isList = !this.isList
      this.$emit('input', !this.isList)
    },
    // 去搜索
    toInvestmentSearch () {
      this.$store.commit('setInvestmentSearchKey', '')
      this.$router.push({
        name: `investmentSearch`
      })
    },
    // 城市下拉
    selectCity () {
      this.showCity = !this.showCity
    },
    // 选择城市
    selectItem (item) {
      if (!item.isSelect) {
        this.citys.forEach(arr => {
          if (arr.LevelCityName === item.LevelCityName) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
        this.cityData = item
        this.$emit('changeCity', this.cityData)
      }
      this.showCity = false
    },
    // 获取城市列表
    async getCityList () {
      let res = await this.$xml('UserCS_InvestmentCityName', {})
      res.data.forEach(arr => {
        if (arr.LevelCityName === this.$parent.cityData.LevelCityName) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.citys = res.data
    }
  },
  created () {
    this.getCityList()
  }
}
</script>
<style lang="scss" scoped>
  .headerTop{
    position: relative;
    display: flex;
    height: .98rem;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .city{
      min-width: 1.5rem;
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
      font-size: .56rem;
      color: #0DC88C;
      line-height: .98rem;
      text-align: center;
      &.icon-ditu{
        font-size: .46rem;
      }
    }
    .selectList{
      position: absolute;
      top: 0.98rem;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      width: 100vw;
      height: calc(100vh - 1.86rem);
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .mark{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .5;
      }
      ._content{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background: #fff;
      }
      .items{
        height: .7rem;
        padding: 0 .3rem;
        font-size: .28rem;
        line-height: .7rem;
        color: #333;
        border-bottom: 1px solid #ededed;
        &.isSelect{
          color: #0DC88C;
        }
      }
      .auto{
        padding: .3rem;
        .name{
          float: left;
          height: .58rem;
          line-height: .58rem;
          font-size: .3rem;
          color: #333;
        }
        .inputBox {
          float: left;
          width: 1.62rem;
          height: .58rem;
          margin: 0 .1rem;
          font-size: .28rem;
          color: #333;
          border: 1px solid #DDDEE3;
          border-radius: 3px;
          text-align: center;
          &::placeholder{
            color: #999;
          }
        }
        .aline{
          float: left;
          height: .58rem;
          line-height: .58rem;
          font-size: .3rem;
          color: #333;
        }
        .btn{
          float: right;
          width: 1.6rem;
          height: .58rem;
          line-height: .58rem;
          text-align: center;
          background: #0DC88C;
          font-size: .32rem;
          color: #fff;
          border-radius: 3px;
        }
      }
    }
  }
</style>
