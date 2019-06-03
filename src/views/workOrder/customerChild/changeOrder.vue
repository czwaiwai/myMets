<template>
<div class="page_modal">
  <div class="page">
    <nav-title title="转单"></nav-title>
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
        <button @click="submit" class="ins_submit_btn">转单</button>
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
import navTitle from '@/components/navTitle'
import customerMixin from '../customerMixin'
export default {
  name: 'changeOrder',
  components: {navTitle},
  mixins: [customerMixin],
  data () {
    return {
      title: '转单',
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
    // this.title = this.$route.query.title || '转单'

    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.formObj.userName = ''
    this.formObj.workOrdId = this.work.WorkOrdID
    this.formObj.idea = this.work.QuesDeti
    this.formObj.orders = ''
    this.formObj.ordersDepart = ''
    this.formObj.ordersPositionId = ''
    this.formObj.ordersId = ''
    this.formObj.UserId = ''
    this.formObj.plusEmployeeName = this.work.PlusEmployeeName
    console.log('personMulti', 'personMulti')
    this.$root.$on('personMulti', list => {
      let arr = list.map(item => item.EmployeeName)
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
      this.$router.push({path: this.$route.path + '/changeOrderPersonSelector'})
    },
    chooseOther () {
      this.$router.push({path: this.$route.path + '/changeOrderPersonSelectorMulti'})
    },
    setPerson (item) {
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
        PositionName: this.formObj.ordersPositionName,
        OrdersID: this.formObj.ordersId,
        Orders: this.formObj.orders,
        OrdersDepart: this.formObj.ordersDepart,
        PlusEmployeeName: this.formObj.plusEmployeeName
      }
      // console.log('tag', params)
      let p0 = 'UserService_SingleBill'
      let res = await this.$xml(p0, params)
      console.log(res)
      try {
        await this.sendMsg(this.work, this.formObj)
        this.$toast('转单成功并推送消息')
      } catch (error) {
        console.log('error', error)
        this.$toast('转单成功但消息推送失败')
      } finally {
        this.$store.commit('setHomeRand', Date.now())
        if (!this.isDetail) {
          this.$root.back()
          this.$parent.refresh()
        } else {
          this.$parent.$parent && this.$parent.$parent.refresh && this.$parent.$parent.refresh()
          this.$router.go(-2)
        }
      }
    }
  },
  destroyed () {
    this.$root.$off('personMulti')
  }
}
</script>

<style lang="scss">

</style>
