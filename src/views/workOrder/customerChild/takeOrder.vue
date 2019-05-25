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
        <a @click="$refs.rStartTime.open()" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>预计开工时间</p>
          </div>
          <div class="weui-cell__ft " :class="formObj.rStartTime?'dark_33':''">
            {{formObj.rStartTime }}
          </div>
        </a>
        <mt-datetime-picker class="mydate"  @confirm="rStartTimeConfirm" ref="rStartTime" type="datetime" v-model="sPickerValue" year-format="{value}年"  month-format="{value}月"  date-format="{value}日" hour-format="{value}时" minute-format="{value}分" ></mt-datetime-picker>
        <a @click="$refs.eWholeTime.open()" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>期望完工时间</p>
          </div>
          <div class="weui-cell__ft " :class="formObj.eWholeTime?'dark_33':''">
            {{formObj.eWholeTime }}
          </div>
        </a>
        <mt-datetime-picker class="mydate"  @confirm="eWholeTimeConfirm" ref="eWholeTime" type="datetime" v-model="ePickerValue" year-format="{value}年"  month-format="{value}月"  date-format="{value}日" hour-format="{value}时" minute-format="{value}分" ></mt-datetime-picker>
        <!-- <a class="weui-cell weui-cell_access" href="javascript:;">
           <div class="weui-cell__hd">
            <label for="" class="weui-label">备注</label>
          </div>
          <div class="weui-cell__bd">
            <textarea v-model="formObj.idea" class="weui-textarea" maxlength="200" placeholder="" rows="3"></textarea>
            <div class="weui-textarea-counter"><span>{{formObj.idea.length}}</span>/200</div>
          </div>
        </a> -->
      </div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell weui-cell_switch">
          <div class="weui-cell__bd">备注</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea v-model="formObj.idea" class="weui-textarea" maxlength="200" placeholder="问题详情..." rows="3"></textarea>
            <div class="weui-textarea-counter"><span>{{formObj.idea.length}}</span>/200</div>
          </div>
        </div>
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
        plusEmployeeName: '',
        rStartTime: '',
        eWholeTime: ''
      }
    }
  },
  created () {
    console.log('parent:', this.$parent.nav)
    console.log('workItem:', this.$parent.workItem)
    this.title = this.$route.query.title || '接单'

    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.formObj.userName = this.nav.memberName
    this.formObj.workOrdId = this.work.WorkOrdID
    this.formObj.idea = this.work.QuesDeti
    this.formObj.rStartTime = this.work.RStartTime
    this.formObj.eWholeTime = this.work.EWholeTime
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
    if (this.formObj.rStartTime < '1901/1/1 0:00:00') {
      this.formObj.rStartTime = ''
    } else {
      this.formObj.rStartTime = new Date(this.formObj.rStartTime).format('yyyy-MM-dd hh:mm:ss')
    }
    if (this.formObj.eWholeTime < '1901/1/1 0:00:00') {
      this.formObj.eWholeTime = ''
    } else {
      this.formObj.eWholeTime = new Date(this.formObj.eWholeTime).format('yyyy-MM-dd hh:mm:ss')
    }
    this.sPickerValue = this.formObj.rStartTime !== '' ? this.formObj.rStartTime : (new Date())
    this.ePickerValue = this.formObj.eWholeTime !== '' ? this.formObj.eWholeTime : (new Date())
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
    rStartTimeConfirm (date) {
      this.formObj.rStartTime = date.format('yyyy-MM-dd hh:mm:ss')
    },
    eWholeTimeConfirm (date) {
      this.formObj.eWholeTime = date.format('yyyy-MM-dd hh:mm:ss')
    },
    setPerson (item) {
      let userName = this.formObj.userName
      let workOrdId = this.formObj.workOrdId
      let nameStr = this.formObj.plusEmployeeName
      let startTime = this.formObj.rStartTime
      let endTime = this.formObj.eWholeTime
      let idea = this.formObj.idea
      this.formObj = {
        userName: userName,
        workOrdId: workOrdId,
        idea: idea,
        ordersId: item.EmployeeID,
        orders: item.EmployeeName,
        ordersDepart: item.DeptName,
        ordersPositionId: item.PositionID,
        UserId: item.UserId,
        rStartTime: startTime,
        eWholeTime: endTime,
        plusEmployeeName: nameStr
      }
      console.log(item, 'setPerson')
    },
    validateForm () {
      if (!this.formObj.orders) {
        return '责任人不能为空'
      }
      if (this.formObj.rStartTime && this.formObj.eWholeTime) {
        if (Date.parse(this.formObj.rStartTime) >= Date.parse(this.formObj.eWholeTime)) {
          return '期望完工时间必须大于预计开工时间'
        }
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
        'Idea': this.formObj.idea,
        'Orders': this.formObj.orders,
        'OrdersDepart': this.formObj.ordersDepart,
        'OrdersID': this.formObj.ordersId,
        'OrdersPositionID': this.formObj.ordersPositionId,
        'PlusEmployeeName': this.formObj.plusEmployeeName,
        'WorkOrdID': this.formObj.workOrdId,
        'RStartTime': this.formObj.rStartTime,
        'EWholeTime': this.formObj.eWholeTime
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
