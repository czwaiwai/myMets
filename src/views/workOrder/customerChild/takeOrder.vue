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
      </div>
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
    console.log('parent:', this.$parent.nav)
    this.title = this.$route.query.title || '接单'

    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.formObj.userName = this.nav.memberName
    this.formObj.workOrdId = this.work.WorkOrdID

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
      let userName = this.formObj.userName
      let workOrdId = this.formObj.workOrdId
      let nameStr = this.formObj.plusEmployeeName
      this.formObj = {
        userName: userName,
        workOrdId: workOrdId,
        Idea: '',
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
      let p0
      if (this.title === '接单') {
        p0 = 'User_Service_WorkOrdAcceptAndroid'
      } else {
        p0 = 'UserCS_WorkOrdAccept'
      }

      let res = await this.$xml(p0, {
        'Idea': this.formObj.Idea,
        'Orders': this.formObj.orders,
        'OrdersDepart': this.formObj.ordersDepart,
        'OrdersID': this.formObj.ordersId,
        'OrdersPositionID': this.formObj.ordersPositionId,
        'PlusEmployeeName': this.formObj.plusEmployeeName,
        'WorkOrdID': this.formObj.workOrdId
      }, {
        p1: this.nav.userName
      })
      // let url = '/ets/syswin/smd/userServiceWorkOrdAccept'
      // let res = await this.$http.post(url, this.formObj)
      console.log(res, 'res')
      this.$toast(this.title + '成功')
      this.$store.commit('setHomeRand', Date.now())
      if (!this.isDetail) {
        this.$root.back()
        this.$parent.refresh()
      } else {
        this.$parent.$parent && this.$parent.$parent.refresh && this.$parent.$parent.refresh()
        this.$router.go(-2)
      }
      // this.$parent.refresh && this.$parent.refresh()
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
