<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="接单">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
      <div class="weui-cells" style="margin:0;">
        <div class="weui-cell padding15 " href="javascript:;">
            <div class="weui-cell__bd">
              <p class="bold">选择责任人</p>
            </div>
        </div>
        <a  @click="chooseMain" class="weui-cell weui-cell_access" href="javascript:;">
            <div class="weui-cell__bd">
              <p>责任人</p>
            </div>
            <div class="weui-cell__ft"  :class="formObj.orders?'dark_33':''">
              {{formObj.orders  || '必选'}}
              </div>
        </a>
        <a @click="chooseOther" class="weui-cell weui-cell_access" href="javascript:;">
            <div class="weui-cell__bd" style="min-width: 100px;">
              <p>辅助责任人</p>
            </div>
            <div class="weui-cell__ft " :class="formObj.plusEmployeeName?'dark_33':''">
              {{formObj.plusEmployeeName || '选填(可多选)' }}
            </div>
        </a>
      </div>
      <div class="padding15">
        <button @click="submit" class="ins_submit_btn">接单</button>
      </div>
    </div>
    <transition name="page">
      <!-- <keep-alive > -->
        <router-view/>
      <!-- </keep-alive> -->
    </transition>
  </div>
</div>
</template>
<script>
// // 客服工单接单
// var userServiceWorkOrdAccept = '/ets/syswin/smd/userServiceWorkOrdAccept'
// // 客服工单接单（抢单专用）
// var userCSWorkOrdAccept = '/ets/syswin/smd/userCSWorkOrdAccept'
// // 转单
// var userServiceSingleBill = '/ets/syswin/smd/userServiceSingleBill'
// // 消息推送
// var getMetsMessage = '/ets/message/getMessage'
export default {
  name: 'takeOrder',
  data () {
    return {
      formObj: {
        userName: '',
        workOrdId: '',
        ordersId: '',
        orders: '',
        idea: '',
        ordersDepart: '',
        ordersPositionId: '',
        UserId: '',
        noticeName: '',
        plusEmployeeName: ''
      }
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.formObj.userName = this.nav.userName
    this.formObj.workOrdId = this.work.WorkOrdID
    this.$root.$on('personMulti', list => {
      let arr = list.map(item => item.EmployeeName)
      console.log(arr)
      console.log(this.formObj)
      this.formObj.plusEmployeeName = arr.join('、')
    })
  },
  methods: {
    chooseMain () {
      this.$router.push({path: this.$route.path + '/personSelector'})
    },
    chooseOther () {
      this.$router.push({path: this.$route.path + '/personSelectorMulti'})
    },
    setPerson (item) {
      let userName = this.formObj.userName
      let workOrdId = this.formObj.workOrdId
      let nameStr = this.formObj.plusEmployeeName
      this.formObj = {
        userName: userName,
        workOrdId: workOrdId,
        ordersId: item.EmployeeID,
        orders: item.EmployeeName,
        ordersDepart: item.DeptName,
        ordersPositionId: item.PositionID,
        UserId: item.UserId,
        plusEmployeeName: nameStr
      }
      console.log(item, 'setPerson')
    },
    validateForm () {
      if (!this.formObj.orders) {
        return '责任人不能为空'
      }
    },
    async submit () {
      let err = this.validateForm()
      if (err) return this.$toast(err)
      let url = '/ets/syswin/smd/userServiceWorkOrdAccept'
      let res = await this.$http.post(url, this.formObj)
      console.log(res, 'res')
      this.$toast('接单成功')
      this.$root.back()
      this.$parent.refresh && this.$parent.refresh()
    }
  },
  destroyed () {
    this.$root.$off('personMulti')
  }
}
</script>

<style lang="scss">

</style>
