<template>
<div class="page_modal">
    <div class="page">
        <mt-header title="填报回访">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-cells weui-cells_form" style="margin-top:0;">
            <div class="weui-cell">
                <div class="weui-cell__hd">客服满意度</div>
                <div class="weui-cell__bd">
                    <span>
                      <i class="iconfont icon-star" ></i>
                      <i class="iconfont icon-star" ></i>
                      <i class="iconfont icon-star" ></i>
                      <i class="iconfont icon-star" ></i>
                      <i class="iconfont icon-wujiaoxingkong" ></i>
                    </span>
                </div>
                <div class="weui-cell__ft">说明文字</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea" placeholder="客户的评价是..." rows="3"></textarea>
                    <div class="weui-textarea-counter"><span>0</span>/200</div>
                </div>
            </div>
            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">回访方式</label>
                </div>
                <div class="weui-cell__bd">
                    <select class="weui-select text-right" name="select2">
                      <option v-for="(item,index) in options" :key="index" :value="item.value">{{item.showText}}</option>
                    </select>
                </div>
            </div>
            <a class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>回访时间</p>
                </div>
                <div class="weui-cell__ft">2019-01-18 6-16:28</div>
            </a>
          </div>
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">有效</div>
                <div class="weui-cell__ft">
                    <input class="weui-switch" type="checkbox">
                </div>
            </div>
          </div>
          <div class="padding15">
            <button class="ins_submit_btn" @click="submit">提交回访</button>
          </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: 'repairDetail',
  data () {
    return {
      nav: {},
      work: {},
      detail: {},
      options: []
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let url = '/ets/table/list/userRentGetOptionList'
      let res = await this.$http.post(url, {
        typeName: 'ReturnVisitWay'
      })
      this.options = res.data
      console.log(res, 'ReturnVisitWay')
    },
    async submit () {
      let url = '/ets/syswin/smd/userServiceInsertReturnVisit'
      let res = await this.$http.post(url, {
        userName: '',
        object: '',
        objectName: '',
        returnVisitWay: '',
        totalScore: '',
        failureCause: '',
        returnVisitType: 'WorkVisit',
        returnSatisfaction: '',
        satisfiedVisit: '',
        workOrdID: '',
        visitState: '',
        returnVisitDate: '',
        opUser: '',
        memo: ''
      })
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

</style>
