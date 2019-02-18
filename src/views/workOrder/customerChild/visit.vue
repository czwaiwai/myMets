<template>
<div class="page_modal">
    <div class="page">
        <mt-header title="填报回访">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-cells " style="margin-top:0;">
            <div class="weui-cell">
                <div class="weui-cell__hd">客服满意度</div>
                <div class="weui-cell__bd">
                  <star v-model="formObj.star"></star>
                </div>
                <div class="weui-cell__ft"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea v-model="formObj.content" class="weui-textarea" maxlength="200" placeholder="客户的评价是..." rows="3"></textarea>
                    <div class="weui-textarea-counter"><span>{{formObj.content.length}}</span>/200</div>
                </div>
            </div>
            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">回访方式</label>
                </div>
                <div class="weui-cell__bd">
                    <select v-model="formObj.way"  dir="rtl" class="weui-select " name="select2">
                      <option v-for="(item,index) in options" :key="index" :value="item.value">{{item.showText}}</option>
                    </select>
                </div>
            </div>
            <a @click="$refs.picker.open()" class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>回访时间</p>
                </div>
                <div class="weui-cell__ft">{{formObj.datetime}}</div>
            </a>
          </div>
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">有效</div>
                <div class="weui-cell__ft">
                    <input class="weui-switch" v-model="formObj.isValid" type="checkbox">
                </div>
            </div>
            <div v-if="!formObj.isValid" class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea v-model="formObj.failContent" class="weui-textarea" maxlength="200" placeholder="无效原因是..." rows="2"></textarea>
                    <div class="weui-textarea-counter"><span>{{formObj.failContent.length}}</span>/200</div>
                </div>
            </div>
          </div>
          <div class="padding15">
            <button class="ins_submit_btn" @click="submit">提交回访</button>
          </div>
        </div>
        <mt-datetime-picker class="mydate"  @confirm="dateConfirm" ref="picker" type="datetime" v-model="pickerValue" year-format="{value}年"  month-format="{value}月"  date-format="{value}日" hour-format="{value}时" minute-format="{value}分" ></mt-datetime-picker>
    </div>
</div>
</template>
<script>
import Star from '../child/star'
export default {
  name: 'visit',
  components: {Star},
  data () {
    return {
      formObj: {
        star: 0,
        content: '',
        way: '',
        failContent: '',
        datetime: '',
        isValid: true
      },
      pickerValue: new Date(),
      nav: {},
      work: {},
      detail: {},
      options: []
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.formObj.datetime = (new Date()).format('yyyy-MM-dd hh:mm')
    this.getPageData()
  },
  computed: {
    isDetail () {
      return this.$route.path.indexOf('/customerService/detail') > -1
    }
  },
  methods: {
    // getBigParent () {
    //   let name = ''
    //   let parent = this.$parent
    //   while (parent && name !== 'customer') {
    //     parent = parent.$parent
    //     name = parent.$options.componentName
    //   }
    //   return parent
    // },
    async getPageData () {
      let p0 = 'UserRent_GetOptionList'
      let res = await this.$xml(p0, {
        TypeName: 'ReturnVisitWay'
      })
      // let url = '/ets/table/list/userRentGetOptionList'
      // let res = await this.$http.post(url, {
      //   typeName: 'ReturnVisitWay'
      // })

      if (res.data && res.data[0]) {
        this.options = res.data
        this.formObj.way = this.options[0].value
      }
      console.log(res, 'ReturnVisitWay')
    },
    async submit () {
      console.log(this.formObj, '-----')
      if (!this.formObj.star) {
        return this.$toast('请先选择满意度')
      }
      let scoreArr = [10, 30, 70, 80, 90]
      let satisfactionArr = ['NotSatisfaction1', 'NotSatisfaction1', 'Satisfaction3', 'Satisfaction2', 'Satisfaction1']
      let p0 = 'UserService_InsertReturnVisit'
      let res = await this.$xml(p0, {
        'Object': '',
        'ObjectName': this.nav.userName,
        'ReturnVisitWay': this.formObj.way,
        'TotalScore': scoreArr[this.formObj.star - 1],
        'FailureCause': this.formObj.isValid ? '' : this.formObj.failContent, // 无效原因
        'ReturnVisitType': 'WorkVisit',
        'ReturnSatisfaction': satisfactionArr[this.formObj.star - 1],
        'SatisfiedVisit': this.formObj.isValid ? 1 : 2,
        'WorkOrdID': this.work.WorkOrdID,
        'VisitState': this.formObj.isValid ? 1 : 2,
        'ReturnVisitDate': this.formObj.datetime,
        'OpUser': this.nav.memberId,
        Memo: this.formObj.content
      }, {
        p1: this.nav.userName
      })
      // let url = '/ets/syswin/smd/userServiceInsertReturnVisit'
      // let res = await this.$http.post(url, {
      //   userName: this.nav.userName,
      //   object: '',
      //   objectName: this.nav.userName,
      //   returnVisitWay: this.formObj.way,
      //   totalScore: scoreArr[this.formObj.star - 1],
      //   failureCause: this.formObj.isValid ? '' : this.formObj.failContent, // 无效原因
      //   returnVisitType: 'WorkVisit',
      //   returnSatisfaction: satisfactionArr[this.formObj.star - 1],
      //   satisfiedVisit: this.formObj.isValid ? 1 : 2,
      //   workOrdID: this.work.WorkOrdID,
      //   visitState: this.formObj.isValid ? 1 : 2,
      //   returnVisitDate: this.formObj.datetime,
      //   opUser: this.nav.memberId,
      //   memo: this.formObj.content
      // })
      this.$toast('回访成功')
      this.$root.back()
      if (!this.isDetail) {
        this.$parent.refresh()
      }
      console.log(res)
    },
    dateConfirm (date) {
      this.formObj.datetime = date.format('yyyy-MM-dd hh:mm')
    }
  },
  destroyed () {
    if (this.isDetail) {
      this.$parent.reload && this.$parent.reload() // 在详情页时reload
      this.$parent.$parent.refresh()
    }
  }
}
</script>

<style lang="scss">

</style>
