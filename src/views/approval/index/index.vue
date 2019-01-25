<template>
  <div class="page pgae_bg">
    <nav-title title="审批"></nav-title>
    <search-box @isShow="showSelect" @setSelectType="setSelectType"></search-box>
    <select-type ref="selectType" @setTimeStatus="setTimeStatus" @setStatus="setStatus"></select-type>
    <div class="page_bd">
      <list-box ref="list"></list-box>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import searchBox from './children/searchBox.vue'
import selectType from './children/selectType.vue'
import listBox from './children/listBox.vue'
export default {
  name: 'approvalIndex',
  components: {navTitle, searchBox, selectType, listBox},
  data () {
    return {
      orgId: '11091315263400010000',
      orgName: '银河世纪花园',
      employeeJobId: '11091316310300010000',
      employeeId: '20',
      timeType: 2,
      statusName: 'Executing',
      typesData: {
        WorkflowTypeId: '',
        AskTimeS: '',
        AskTimeE: ''
      }
    }
  },
  methods: {
    // 设置筛选类型时间
    async setSelectType (typesData) {
      console.log('typesData', typesData)
      this.typesData = {
        WorkflowTypeId: typesData.typesData.Id || '',
        AskTimeS: typesData.timesData.startTime || '',
        AskTimeE: typesData.timesData.endTime || ''
      }
      await this.$refs.selectType.getSelectList()
      await this.$refs.list.getInitList()
    },
    // 隐藏选择器
    showSelect () {
      this.$refs.selectType.hideBox()
    },
    // 设置列表类型
    setStatus (type) {
      this.statusName = type
      this.$refs.list.getInitList()
    },
    // 设置时间状态
    setTimeStatus (type) {
      this.timeType = type
      this.$refs.list.getInitList()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
