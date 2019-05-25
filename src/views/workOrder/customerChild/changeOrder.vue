<template>
<div class="page_modal">
  <div class="page">
    <nav-title :title="title"></nav-title>
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
      <div class="padding15">
        <button @click="submit" class="ins_submit_btn">{{title}}</button>
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
import navTitle from '@/components/navTitle'
export default {
  name: 'takeOrder',
  components: {navTitle},
  data () {
    return {
      title: '接单',
      sPickerValue: new Date(),
      ePickerValue: new Date(),
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
    this.title = this.$route.query.title || '转单'

    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.formObj.userName = this.nav.memberName
    this.formObj.workOrdId = this.work.WorkOrdID
    this.formObj.idea = this.work.QuesDeti
    this.formObj.orders = this.nav.memberName
    this.formObj.ordersDepart = this.nav.positionName
    this.formObj.ordersPositionId = this.nav.positionId
    this.formObj.ordersId = this.nav.memberId
    this.formObj.UserId = this.nav.userName
    this.$root.$on('personMulti', list => {
      let arr = list.map(item => item.EmployeeName)
      console.log(arr)
      console.log(this.formObj)
      this.formObj.plusEmployeeName = arr.join('、')
    })
  },
  computed: {
    isDetail () {
      let arr = this.$route.path.match(/\/customerService\/(Resource|Equipment)\/detail/)
      return arr || this.$route.path.indexOf('/customerNotice') > -1
    }
  },
  methods: {
    chooseMain () {
      this.$router.push({path: this.$route.path + '/personSelector'})
    },
    chooseOther () {
      this.$router.push({path: this.$route.path + '/personSelectorMulti'})
    },
    setPerson (item) {
      //  let params = {
      //   strWorkOrdID: this.workItem.WorkOrdID,
      //   PositionId: item.PositionID,
      //   PositionName: item.PositionName,
      //   OrdersID: item.EmployeeID,
      //   Orders: item.EmployeeName,
      //   OrdersDepart: item.DeptName,
      //   PlusEmployeeName: ''
      // }
      let userName = this.formObj.userName
      let workOrdId = this.formObj.workOrdId
      let nameStr = this.formObj.plusEmployeeName
      let idea = this.formObj.idea
      this.formObj = {
        userName: userName,
        workOrdId: workOrdId,
        idea: idea,
        ordersId: item.EmployeeID,
        orders: item.EmployeeName,
        ordersDepart: item.DeptName,
        ordersPositionId: item.PositionID,
        ordersPositionName: item.PositionName,
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
      let params = {
        strWorkOrdID: this.formObj.workOrdId,
        PositionId: this.formObj.ordersPositionId,
        PositionName: this.formObj.PositionName,
        // OrdersID: item.EmployeeID,
        // Orders: item.EmployeeName,
        // OrdersDepart: item.DeptName,
        PlusEmployeeName: ''
      }

      let p0 = 'UserService_SingleBill'
      let res = await this.$xml(p0, params)
      console.log(res)
      this.$parent.refresh && this.$parent.refresh()
      this.$root.back()
      this.$store.commit('setHomeRand', Date.now())
      try {
        // await this.sendMsg(this.workItem, item)
        this.$toast('转单成功并推送消息')
      } catch (error) {
        this.$toast('转单成功但消息推送失败')
      }

      // let res = await this.$xml(p0, {
      //   'Idea': this.formObj.idea,
      //   'Orders': this.formObj.orders,
      //   'OrdersDepart': this.formObj.ordersDepart,
      //   'OrdersID': this.formObj.ordersId,
      //   'OrdersPositionID': this.formObj.ordersPositionId,
      //   'PlusEmployeeName': this.formObj.plusEmployeeName,
      //   'WorkOrdID': this.formObj.workOrdId,
      //   'RStartTime': this.formObj.rStartTime,
      //   'EWholeTime': this.formObj.eWholeTime
      // }, {
      //   p1: this.nav.userName
      // })
      // console.log(res, 'res')
      // this.$toast(this.title + '成功')
      // this.$store.commit('setHomeRand', Date.now())
      // if (!this.isDetail) {
      //   this.$root.back()
      //   this.$parent.refresh()
      // } else {
      //   this.$parent.$parent && this.$parent.$parent.refresh && this.$parent.$parent.refresh()
      //   this.$router.go(-2)
      // }
    },
    async sendMsg (work, person) {
      let state = ''
      let title = this.nav.workPosFrom === 'Resource' ? '客服工单' : '维修工单'
      let type = 'CustomerService'
      switch (work.WorkOrdState) {
        case 'WOSta_Sub': state = '待接单'; break
        case 'WOSta_Proc': state = '待完工'; break
        case 'WOSta_Finish': state = '待回访'; break
        case 'WOSta_Visit': state = '待关闭'; break
      }
      let params = {
        'ID': work.WorkOrdID,
        'Type': type,
        'Title': title,
        'Content': this.nav.memberName + '给您转发一个新的' + state + '工单，请及时处理',
        'Tag': person.UserId,
        'Status': '1',
        'FromTag': ''
      }
      let p0 = 'AppWeChat_JGWorkPush'
      let res = await this.$xml(p0, params, {}, true)
      // this.$toast('消息推送成功')
      console.log(res)
    }
  },
  destroyed () {
    this.$root.$off('personMulti')
    // if (this.isDetail) {
    //   this.$parent.reload && this.$parent.reload() // 在详情页时reload
    //   this.$parent.$parent && this.$parent.$parent.refresh && this.$parent.$parent.refresh()
    // }
  }
}
</script>

<style lang="scss">

</style>
