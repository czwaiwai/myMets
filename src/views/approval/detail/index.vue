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
      <!-- <div class="_btns" v-if="itemData.WorkflowStatus=='Executing'notify"> -->
      <div class="_btns" v-if="com_allBtn()==3">
        <div class="btn" @click.stop="toAction(2)">打回</div>
        <div class="btn" @click.stop="toAction(0)">否决</div>
        <div class="btn" @click.stop="toAction(1)">同意</div>
      </div>
      <div class="_btns" v-else-if="com_allBtn()==2">
        <div class="btn" @click.stop="toAction(0)">否决</div>
        <div class="btn" @click.stop="toAction(1)">同意</div>
      </div>
      <div class="_btns" v-else-if="com_allBtn()==1">
        <div class="btn" @click.stop="toAction(3)">确定</div>
      </div>
    </div>
    <dialog-confire
        title="确认了解该审批"
        ref="dialog"
        textAlign='center'
        @clickLeftBtn="clickLeftBtn"
        @clickRightBtn="clickRightBtn"
      ></dialog-confire>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import baseMsg from './children/baseMsg.vue'
import otherMsg from './children/otherMsg.vue'
import techProcess from './children/techProcess.vue'
import enclosureList from './children/enclosureList.vue'
import dialogConfire from '@/components/dialogConfire.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'approvalDetail',
  components: {navTitle, baseMsg, otherMsg, techProcess, enclosureList, dialogConfire},
  data () {
    return {
      detailData: {
        Fields: [],
        SubForms: [],
        Attachments: []
      },
      techProcessList: [],
      detailId: '',
      isHttp: false
    }
  },
  computed: {
    ...mapGetters({
      itemData: 'getSelectItemData',
      user: 'user'
    })
  },
  methods: {
    com_allBtn () {
      if (this.$route.name === 'approvalDetail') {
        if (this.itemData.WorkflowStatus === 'Executing') {
          if (this.detailData.ActivityName === 'check' && this.detailData.IsAllowBack === 1) {
            return 3
          } else if (this.detailData.ActivityName === 'check' && this.detailData.IsAllowBack === 0) {
            return 2
          } else if (this.detailData.ActivityName === 'notify') {
            return 1
          }
        }
      } else if (this.$route.name === 'approvalDetailQuick') {
        if (this.detailData.ActivityName === 'notify') {
          return 1
        } else {
          return 3
        }
      }
      // return this.detailData.ActivityName === 'Executing' || this.detailData.ActivityName === 'check'
    },
    // 获取详情数据
    async getData () {
      let res = await this.$xml('UserAudit_GetAuditTaskDetail', {
        'AuditTaskId': this.$route.params.id
      })
      // console.log(res)
      if (res.status === 200 || res.status === '200') {
        res.data[0].SubForms.forEach(arr => {
          arr.DataFormFields.forEach(a => {
            a.show = false
          })
        })
        let ip = this.$store.getters.ip
        res.data[0].Attachments.forEach((item) => {
          if (ip && item.FilePath) {
            item.FilePath = 'http://' + ip + item.FilePath
          }
          // item.FilePath = 'http://172.31.118.162:8081' + item.FilePath
        })
        this.detailData = res.data[0]
        this.setTechProcessList()
      }
      // console.log(this.detailData)
    },
    // 拼接审批流程列表
    setTechProcessList () {
      console.log('data:', this.detailData)
      let firstObj = {
        ExecuteTime: this.detailData.AskTime || '',
        EmployeeName: this.detailData.AskerName || '',
        JobName: this.detailData.AskerJobName || '',
        Idea: (this.$route.name === 'approvalDetail' ? (this.itemData.Subject || '') : ''),
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
          JobName: arr.PositionName || '',
          Idea: arr.Idea || '',
          Result: 'none',
          ActivityText: arr.ActivityText
        }
        // list.unshift(item)
        list.push(item)
      })
      this.techProcessList = this.techProcessList.concat(list)
    },
    // 详情动作
    toAction (type) {
      if (type === 3) {
        if (!this.isHttp) {
          this.$refs.dialog.show()
        }
        return
      }
      let name = 'approvalAction'
      if (this.$route.name === 'approvalDetailQuick') {
        name = 'approvalActionQuick'
      }
      this.$router.push({
        name: name,
        // params: {
        //   id: this.$route.params.id
        // },
        query: {
          type: type,
          appointNext: this.detailData.IsAppointNext
        }
      })
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.upData()
    },
    // 确定
    async upData () {
      let obj = {
        'EmployeeId': this.user.UserID,
        'TaskId': this.detailId,
        'Result': '4'
      }
      this.isHttp = true
      let res = await this.$xml('UserAudit_SubmitAuditTaskResult', obj)
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        if (res.data) {
          this.$toast(res.data[0].msg)
          this.isHttp = false
        } else {
          this.$toast(res.msg)
          this.$parent.getAllData()
          setTimeout(() => {
            this.isHttp = false
            this.$router.go(-1)
          }, 2000)
        }
      }
    }
  },
  created () {
    this.detailId = this.$route.params.id
    this.getData()
    // console.log('itemData', this.itemData)
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
