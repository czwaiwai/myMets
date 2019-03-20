<template>
  <div class="page_modal">
    <div class="page page_bg">
      <nav-title title="更多信息"></nav-title>
      <ul class="typeList">
        <li class="items" v-for="(item,index) in typeList" :key="index" @click.stop="selectType(item)">
          <span class="name" :class="{'isSelect':item.isSelect}">{{item.name}}</span>
        </li>
      </ul>
      <div class="page_bd investmentMoreMsg">
        <mt-tab-container v-model="active" :swipeable="false">
          <mt-tab-container-item id="tab-container0">
            <modul-survey :moreData="moreData"></modul-survey>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-container1">
            <modul-match :moreData="moreData"></modul-match>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-container2">
            <modul-progress :progressList="progressList"></modul-progress>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-container3">
            <modul-result :moreData="moreData"></modul-result>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import modulSurvey from './children/modulSurvey'
import modulMatch from './children/modulMatch'
import modulProgress from './children/modulProgress'
import modulResult from './children/modulResult'
import { TabContainer, TabContainerItem } from 'mint-ui'
import dateChange from '@/mixins/dateChange'
export default {
  name: 'investmentMoreMsg',
  components: {navTitle, MtTabContainer: TabContainer, MtTabContainerItem: TabContainerItem, modulSurvey, modulMatch, modulProgress, modulResult},
  mixins: [dateChange],
  data () {
    return {
      typeList: [
        {name: '项目概况', isSelect: true, type: 0},
        {name: '项目配套', isSelect: false, type: 1},
        {name: '项目进展', isSelect: false, type: 2},
        {name: '交易结果', isSelect: false, type: 3}
      ],
      active: 'tab-container0',
      moreData: {},
      progressList: []
    }
  },
  methods: {
    // 选择展示类型
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
      this.active = 'tab-container' + item.type
      this.$el.querySelector('.investmentMoreMsg').scrollTop = 1
      if (item.type === 2) {
        this.getProgressList()
      }
    },
    async getProgressList () {
      let res = await this.$xml('UserCS_InvestmentPropertyFollow', {
        'ID': this.$route.params.id
      })
      console.log('getProgressList', res.data)
      if (res.data.length) {
        this.progressList = res.data
      }
    },
    // 获取详情数据
    async getMoreData () {
      let res = await this.$xml('UserCS_InvestmentPropertyMore', {
        'ID': this.$route.params.id
      })
      console.log(res.data)
      if (res.data.length) {
        let moreData = res.data[0]
        moreData.FinishDate = this.com_setDate(moreData.FinishDate)
        this.moreData = moreData
      }
    }
  },
  created () {
    this.getMoreData()
    console.log('in...moreMsg')
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
          color: #3395ff;
          border-bottom: 3px solid #3395ff;
        }
      }
    }
  }
  .investmentMoreMsg{
  }
</style>
