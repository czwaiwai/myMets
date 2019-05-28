<template>
<div class="page_modal">
  <div class="page">
    <nav-title title="工单反馈"></nav-title>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:0;">
        <div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label for="" class="weui-label">处理结果</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" v-model="formObj.workState"  dir="rtl" name="select2">
              <option v-for="item in options" :key="item.id" :value="item.value">{{item.showText}}</option>
            </select>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" v-model="formObj.processDetaile" maxlength="300" placeholder="处理详情..." rows="2"></textarea>
            <!-- <div class="weui-textarea-counter"><span>0</span>/200</div> -->
            <div class=" padding-top">
              <ins-img-list :imgs.sync="imgs" :max="3">
                <p class="dark_99 padding-top5">
                  <voice @mp3Voice="putVoice" @delVoice="delVoice"></voice>
                </p>
              </ins-img-list>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-cells" style="margin-top:10px;">
        <a @click="beginStartTime" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>开工时间</p>
          </div>
          <div class="weui-cell__ft">
            {{formObj.startTime}}
          </div>
        </a>
        <a @click="endDateOpen" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>完工时间</p>
          </div>
          <div class="weui-cell__ft">
            {{formObj.endTime}}
          </div>
        </a>
        <div class="weui-cell ">
          <div class="weui-cell__hd"><label class="weui-label">人工费</label></div>
          <div class="weui-cell__bd">
            <money-input  maxlength="8"  v-model="formObj.labourCost" type="number"  class="weui-input text-right"  placeholder="请输入金额"></money-input>
            <!-- <input v-model="formObj.labourCost"   class="weui-input text-right" type="number"  placeholder=""> -->
          </div>
        </div>
        <div class="weui-cell ">
          <div class="weui-cell__hd"><label class="weui-label">材料费</label></div>
          <div class="weui-cell__bd">
              <money-input  maxlength="8"  v-model="formObj.materialCostSum" type="number"  class="weui-input text-right"  placeholder="请输入金额"></money-input>
              <!-- <input v-model="formObj.materialCostSum" class="weui-input text-right" type="number" placeholder=""> -->
          </div>
        </div>
      </div>
      <div class="weui-cells__title text-right dark_33 fs16">合计: ￥ {{allPrice | formatMoney}}</div>
      <div class="weui-cells weui-cells_form" style="margin-bottom:15px;">
        <a @click="routeMaterial" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>材料清单</p>
          </div>
          <div class="weui-cell__ft">
          </div>
        </a>
      </div>
      <div v-if="canActionBtn" style="text-align: center;padding-bottom:15px;">
        <div @click="workAction" class="cir_quan" :style="btnStatus===1?'padding-top:20px':''">
          <span v-if="btnStatus===0">开工</span>
          <span v-if="btnStatus===1">
            {{showTime}}<br/>
            点击完工
          </span>
          <span v-if="btnStatus===2">已完成</span>
        </div>
      </div>
    </div>
    <div class="page_ft text-center light_bg padding-top5 padding15-h">
      <button @click="submitHandle" class="ins_submit_btn">提交反馈</button>
    </div>
    <mt-datetime-picker class="mydate"  @confirm="startDateConfirm" ref="picker1" type="datetime" :start-date="startReportTime" :end-date="new Date()" v-model="pickerValue1" year-format="{value}年"  month-format="{value}月"  date-format="{value}日" hour-format="{value}时" minute-format="{value}分" ></mt-datetime-picker>
    <mt-datetime-picker class="mydate"  @confirm="endDateConfirm" ref="picker2" type="datetime" :start-date="endStartTime" :end-date="new Date()" v-model="pickerValue2" year-format="{value}年"  month-format="{value}月"  date-format="{value}日" hour-format="{value}时" minute-format="{value}分" ></mt-datetime-picker>
    <transition name="page">
    <!-- <keep-alive > -->
    <router-view/>
    <!-- </keep-alive> -->
    </transition>
  </div>
</div>
</template>
<script>
import InsImgList from '../child/insImgList'
import Voice from '../child/voice'
import MoneyInput from '../child/moneyInput'
import navTitle from '@/components/navTitle'
export default {
  name: 'feedback',
  components: {
    navTitle,
    InsImgList,
    MoneyInput,
    Voice
  },
  data () {
    return {
      canActionBtn: true, // 是否启用按钮
      btnStatus: 0, // 按钮状态 0 为开工, 1为待完成 , 2为已完成
      showTime: '00:00:00',
      pickerValue1: new Date(),
      pickerValue2: new Date(),
      endStartTime: new Date(),
      startReportTime: new Date(),
      roundStartTime: 0,
      roundEndTime: 0,
      roundTime: 0,
      formObj: {
        workState: 'Complate',
        processDetaile: '',
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        labourCost: '0.00', // 人工费
        materialCostSum: '0.00' // 材料费
      },
      mp3: {},
      subItem: {},
      nav: {},
      work: {},
      options: [],
      imgs: []
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    console.log(this.work, 'work')
    if (this.work && this.work.RSDate) {
      this.startReportTime = new Date(this.work.RSDate.replace(/-/g, '/'))
    }
    this.canActionBtn = !!parseInt(this.work.strBillStatus)
    this.getPageData()
    this.getMaterialCost()
    // 开工时间设置默认值
    if (!this.canActionBtn) {
      this.formObj.startTime = (new Date()).format('yyyy-MM-dd hh:mm')
    } else {
      this.workActionInit()
    }
  },
  computed: {
    allPrice () {
      let a = (this.formObj.labourCost || 0) - 0
      let b = (this.formObj.materialCostSum || 0) - 0
      return Math.round((a + b) * 100) / 100
    },
    isDetail () {
      let arr = this.$route.path.match(/\/customerService\/(Resource|Equipment)\/detail/)
      return arr || this.$route.path.indexOf('/customerNotice') > -1
    }
  },
  methods: {
    // 客服工单反馈状态
    async getPageData () {
      let p0 = 'UserRent_GetOptionList'
      let res = await this.$xml(p0, {
        TypeName: 'HandleResult'
      })
      // let url = '/ets/table/list/userRentGetOptionList'
      // let res = await this.$http.post(url, {typeName: 'HandleResult'})
      if (res.data && res.data[0]) {
        // console.log(res.data)
        this.options = res.data.filter(item => item.value !== 'Add')
      }
    },
    async getMaterialCost () {
      let p0 = 'UserCS_GetClaimsInfoH5'
      let params = {OrgID: this.work.OrgID, WordQuertionID: this.work.WorkQuestionID}
      let res = await this.$xml(p0, params)
      let total = 0.00
      if (res.data && res.data[0]) {
        total = this.$toLower(res.data).reduce((before, item) => before + ((item.price - 0) * (item.actualNum - 0)), 0)
        this.formObj.materialCostSum = total.toString(10)
      }
    },
    routeMaterial () {
      this.$router.forward(this.$route.path + '/materialDetail')
    //   this.$router.forward(this.$route.path + '/materialDetail')
    },
    // 添加语音处理
    putVoice (mp3) {
      this.mp3 = mp3
    },
    // 删除语音处理
    delVoice () {
      this.mp3 = {}
    },
    workActionInit () {
      this.formObj.startTime = ''
      this.formObj.endTime = ''
      // 清空roundTime
      if (this.roundTime) {
        clearTimeout(this.roundTime)
      }
      this.btnStatus = 0
      // 存在开始时间 启动定时器
      var startDate = localStorage.getItem('action_' + this.work.WorkOrdID)
      console.log(startDate, 'startDate')
      if (startDate) {
        this.roundStartTime = parseInt(startDate)
        this.formObj.startTime = (new Date(this.roundStartTime)).format('yyyy-MM-dd hh:mm')
        this.btnStatus = 1
        this.countTime()
      }
      // 如果存在结束时间
      var startAndEnd = localStorage.getItem('startAndEnd_' + this.work.WorkOrdID)
      console.log(startAndEnd, 'startAndEnd')
      if (startAndEnd) {
        var arr = startAndEnd.split('|')
        this.btnStatus = 2
        this.roundStartTime = parseInt(arr[0])
        this.roundEndTime = parseInt(arr[1])
        this.formObj.startTime = (new Date(this.roundStartTime)).format('yyyy-MM-dd hh:mm')
        this.formObj.endTime = (new Date(this.roundEndTime)).format('yyyy-MM-dd hh:mm')
      }
    },
    async workAction () {
      if (this.btnStatus === 0) {
        await this.$message.confirm('确定填写开工时间?')
        this.roundStartTime = (new Date()).valueOf()
        localStorage.setItem('action_' + this.work.WorkOrdID, this.roundStartTime)
        this.btnStatus = 1
        this.formObj.startTime = (new Date(this.roundStartTime)).format('yyyy-MM-dd hh:mm')
        return this.countTime()
      }
      if (this.btnStatus === 1) {
        await this.$message.confirm('确定填写完工时间?')
        this.btnStatus = 2
        localStorage.removeItem('action_' + this.work.WorkOrdID)
        this.roundEndTime = (new Date()).valueOf()
        this.formObj.endTime = (new Date(this.roundEndTime)).format('yyyy-MM-dd hh:mm')
        localStorage.setItem('startAndEnd_' + this.work.WorkOrdID, this.roundStartTime + '|' + this.roundEndTime)
        return clearTimeout(this.roundTime)
      }
    },
    countTime: function () {
      // 获取当前时间
      var date = new Date()
      // var str="2018/11/19 18:00:00";
      var startDate = this.roundStartTime
      var now = date.getTime()

      // 时间差
      var leftTime = now - startDate
      // 定义变量 d,h,m,s保存倒计时的时间
      var h, m, s
      if (leftTime >= 0) {
        h = Math.floor(leftTime / 1000 / 60 / 60)
        m = Math.floor(leftTime / 1000 / 60 % 60)
        s = Math.floor(leftTime / 1000 % 60)
      }
      // 将倒计时赋值到div中
      this.showTime = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
      // 递归每秒调用countTime方法，显示动态时间效果
      //   console.log(this.showTime)
      this.roundTime = setTimeout(this.countTime, 1000)
    },
    // 开始时间选择器打开
    beginStartTime () {
      if (this.canActionBtn) {
        return this.$toast('请点击下方开工按钮,自动填入开工时间')
      }
      this.$refs.picker1.open()
    },

    // 完工时间选择器打开
    endDateOpen () {
      if (this.canActionBtn) {
        return this.$toast('请点击下方开工按钮,自动填入开工时间')
      }
      if (this.formObj.startTime === '') {
        return this.$toast('请先选择开工时间')
      }

      this.$refs.picker2.open()
    },
    // 时间处理
    startDateConfirm (date) {
      this.endStartTime = date
      this.formObj.startTime = date.format('yyyy-MM-dd hh:mm')
    },
    // 完工时间处理
    endDateConfirm (date) {
      this.formObj.endTime = date.format('yyyy-MM-dd hh:mm')
    },
    validateForm () {
      if (this.imgs.length === 0 && this.formObj.processDetaile === '') {
        return '处理详情及图片必填1项'
      }
      if (this.formObj.startTime === '') {
        return '开工时间不能为空'
      }
      if (this.canActionBtn && this.btnStatus !== 2) {
        return '点击完工后，才能提交反馈'
      }
    },
    async submitHandle  () {
      let error = this.validateForm()
      if (error) return this.$toast(error)
      let p0 = 'User_Service_SaveWorkOrdFeedbackMerge'
      let params = {
        userName: this.nav.userName, // ???
        WorkOrdID: this.work.WorkOrdID,
        WOQuestionID: this.work.WorkQuestionID,
        OrgID: this.work.OrgID,
        OrgName: this.work.OrgName,
        VQuesType: this.work.QuesTypeID,
        VQuesTypeName: this.work.QuesTypeName,
        StartTime: this.formObj.startTime + ':00',
        EndTime: this.formObj.endTime + ':00',
        LabourCost: this.formObj.labourCost,
        MaterialCostSum: this.formObj.materialCostSum,
        CompResult: this.formObj.workState,
        ProcessDetaile: this.formObj.processDetaile,
        Voice1: this.mp3.path || '',
        Memo: this.mp3.duration || ''
      }
      // this.imgs.forEach((item, index) => {
      //   params['Image' + (index + 1)] = item
      // })
      let tmpArr = ['', '', '', '']
      tmpArr.forEach((item, index) => {
        params['Image' + (index + 1)] = this.imgs[index] || ''
      })
      let res = await this.$xml(p0, params, {
        p1: this.nav.userName
      })
      if (this.canActionBtn) {
        localStorage.removeItem('startAndEnd_' + this.work.WorkOrdID)
      }
      // let params = {
      //   userName: this.nav.userName,
      //   workOrdId: this.work.WorkOrdID,
      //   woQuestionId: this.work.WorkQuestionID,
      //   orgId: this.work.OrgID,
      //   orgName: this.work.OrgName,
      //   vQuesType: this.work.QuesTypeID,
      //   vQuesTypeName: this.work.QuesTypeName,
      //   startTime: this.formObj.startTime + ':00',
      //   endTime: this.formObj.endTime + ':00',
      //   labourCost: this.formObj.labourCost,
      //   materialCostSum: this.formObj.materialCostSum,
      //   compResult: this.formObj.workState,
      //   processDetaile: this.formObj.processDetaile,
      //   voice1: this.mp3.path || ''
      // }
      // this.imgs.forEach((item, index) => {
      //   params['image' + (index + 1)] = item
      // })
      // let url = '/ets/syswin/smd/userServiceSaveWorkOrdFeedbackMerge'
      // let res = await this.$http.post(url, params)

      this.$toast('反馈成功')
      // this.$root.back()
      this.$store.commit('setHomeRand', Date.now())
      // if (!this.isDetail) {
      //   this.$parent.refresh()
      // }
      if (!this.isDetail) {
        this.$root.back()
        this.$parent.refresh()
      } else {
        this.$parent.$parent && this.$parent.$parent.refresh && this.$parent.$parent.refresh()
        this.$router.go(-2)
      }
      //   this.$parent.refresh && this.$parent.refresh()
      console.log(res)
    }
  },
  destroyed () {
    // 清空roundTime
    if (this.roundTime) {
      clearTimeout(this.roundTime)
    }
    // if (this.isDetail) {
    //   this.$parent.reload && this.$parent.reload() // 在详情页时reload
    //   this.$parent.$parent.refresh && this.$parent.$parent.refresh()
    // }
  }
}
</script>

<style lang="scss">
.voice_btn {
    background: transparent;
    border: 1px solid #cbcbcb;
    color: #8E8E93;
    padding: 3px 10px;
    border-radius: 20px;
    outline: none;
}
.cir_quan {
    width: 1.5rem;
    height: 1.5rem;
    background: #3395FF;
    border-radius: 100%;
    line-height: 20px;
    text-align: center;
    font-size: 16px;
    padding-top: 28px;
    color: #FFF;
    display: inline-block;
    box-shadow: 0px 0px 6px rgba(51, 149, 255, 0.55);
}
</style>
