<template>
  <div class="page_modal">
    <div class="page page_bg">
      <nav-title title="详情"></nav-title>
      <div class="page_bd">
        <base-msg :listMsg="detailData.Fields"></base-msg>
        <other-msg :listMsg="detailData.SubForms" v-if="detailData.SubForms.length"></other-msg>
        <enclosure-list :enclosureList="detailData.Attachments" v-if="detailData.Attachments.length"></enclosure-list>
        <tech-process :techProcessList="techProcessList"></tech-process>
      </div>
      <div class="_btns" v-if="itemData.WorkflowStatus=='Executing'">
        <div class="btn" @click.stop="toAction(2)">打回</div>
        <div class="btn" @click.stop="toAction(0)">否决</div>
        <div class="btn" @click.stop="toAction(1)">同意</div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import baseMsg from './children/baseMsg.vue'
import otherMsg from './children/otherMsg.vue'
import techProcess from './children/techProcess.vue'
import enclosureList from './children/enclosureList.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'approvalDetail',
  components: {navTitle, baseMsg, otherMsg, techProcess, enclosureList},
  data () {
    return {
      detailData: {
        Fields: [],
        SubForms: [],
        Attachments: []
      },
      techProcessList: []
    }
  },
  computed: {
    ...mapGetters({
      itemData: 'getSelectItemData'
    })
  },
  methods: {
    // 获取详情数据
    async getData () {
      let res = await this.$xml('UserAudit_GetAuditTaskDetail', {
        'AuditTaskId': this.$route.params.id
      })
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        res.data[0].SubForms.forEach(arr => {
          arr.DataFormFields.forEach(a => {
            a.show = false
          })
        })
        this.detailData = res.data[0]
        this.setTechProcessList()
      }
      console.log(this.detailData)
    },
    // 拼接审批流程列表
    setTechProcessList () {
      let firstObj = {
        ExecuteTime: this.itemData.AskTime || '',
        EmployeeName: this.itemData.AskerName || '',
        JobName: this.itemData.AskerJobName || '',
        Idea: this.itemData.Subject || '',
        Result: 'first'
      }
      this.techProcessList.push(firstObj)
      this.detailData.TaskResults.forEach(arr => {
        this.techProcessList.push(arr)
      })
      let list = []
      this.detailData.NextHandler.forEach(arr => {
        let item = {
          ExecuteTime: '',
          EmployeeName: arr.EmployeeName || '',
          JobName: this.itemData.AskerJobName || '',
          Idea: arr.Idea || '',
          Result: 'none',
          ActivityText: arr.ActivityText
        }
        list.unshift(item)
      })
      this.techProcessList = this.techProcessList.concat(list)
    },
    // 详情动作
    toAction (type) {
      this.$router.push({
        name: 'approvalAction',
        params: {
          id: this.$route.params.id
        },
        query: {
          type: type,
          appointNext: this.detailData.IsAppointNext
        }
      })
    }
  },
  created () {
    this.getData()
    console.log('itemData', this.itemData)
  }
}
</script>
<style lang="scss" scoped>
  ._btns{
    display: flex;
    height: .8rem;
    padding: .2rem 0;
    border-top: 1px solid #ededed;
    background: #fff;
    .btn{
      flex: 1;
      height: .4rem;
      text-align: center;
      line-height: .4rem;
      font-size: .3rem;
      color: #3395FF;
      border-right: 1px solid #ededed;
      &:last-child{
        border-right: 0;
      }
    }
  }
</style>
