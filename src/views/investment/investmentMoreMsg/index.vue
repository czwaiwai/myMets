<template>
  <div class="page page_bg">
    <nav-title title="更多信息"></nav-title>
    <ul class="typeList">
      <li class="items" v-for="(item,index) in typeList" :key="index" @click.stop="selectType(item)">
        <span class="name" :class="{'isSelect':item.isSelect}">{{item.name}}</span>
      </li>
    </ul>
    <div class="page_bd investmentMoreMsg">
      <modul-survey v-if="type===0"></modul-survey>
      <modul-match v-else-if="type===1"></modul-match>
      <modul-progress v-else-if="type===2"></modul-progress>
      <modul-result v-else-if="type===3"></modul-result>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import modulSurvey from './children/modulSurvey'
import modulMatch from './children/modulMatch'
import modulProgress from './children/modulProgress'
import modulResult from './children/modulResult'
export default {
  name: 'investmentMoreMsg',
  components: {navTitle, modulSurvey, modulMatch, modulProgress, modulResult},
  data () {
    return {
      typeList: [
        {name: '项目概况', isSelect: true, type: 0},
        {name: '项目配套', isSelect: false, type: 1},
        {name: '项目进展', isSelect: false, type: 2},
        {name: '交易结果', isSelect: false, type: 3}
      ],
      type: 0
    }
  },
  methods: {
    selectType (item) {
      if (item.isSelect) {
        return
      }
      this.type = item.type
      this.typeList.forEach(arr => {
        if (arr.type === item.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.$el.querySelector('.investmentMoreMsg').scrollTop = 1
    }
  }
}
</script>
<style lang="scss" scoped>
  .typeList{
    display: flex;
    height: .88rem;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .items{
      flex: 1;
      text-align: center;
      .name{
        display: inline-block;
        height: .88rem;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
        &.isSelect{
          color: #0DC88C;
          border-bottom: 3px solid #0DC88C;
        }
      }
    }
  }
  .investmentMoreMsg{
  }
</style>
