<template>
<div class="page_modal">
  <div class="page">
    <nav-title title="回访详情"></nav-title>
    <div class="page_bd">
      <div class="weui-panel weui-panel_access">
        <div class="weui-panel__hd">
          {{detail.ObjectName}} <span class="padding-left">{{detail.ReturnVisitWay}}</span>
          <span class="fs15 main_color float_right" style="margin-top: -2px;">{{detail.VisitState }}</span>
        </div>
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_text">
            <h4 class="weui-media-box__title fs15">
              客服满意度
              <star v-model="score" :readonly="true"></star>
            </h4>
            <p v-if="detail.VisitState === '有效回访'">{{detail.Memo}}</p>
            <p v-if="detail.VisitState === '无效回访'">{{detail.FailureCause}}</p>
          </div>
        </div>
        <div class="weui-panel__ft">
          <div class="weui-cell weui-cell_access weui-cell_link">
            <div class="weui-cell__bd text-right dark_99">{{detail.ReturnVisitDate}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Star from '../child/star'
import navTitle from '@/components/navTitle'
export default {
  name: 'visitDetail',
  components: {navTitle, Star},
  data () {
    return {
      score: 0,
      nav: {},
      work: {},
      detail: {}
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let p0 = 'UserCS_ReturnVisitHistoryH5'
      let res = await this.$xml(p0, {
        WordOrdId: this.work.WorkOrdID
      })
      // let url = '/ets/syswin/smd/userCSReturnVisitHistoryH5'
      // let res = await this.$http.post(url, {
      //   wordOrdId: this.work.WorkOrdID
      // })
      if (res.data[0]) {
        this.detail = res.data[0]
        this.setScore()
      }
    },
    setScore () {
      switch (parseInt(this.detail.TotalScore)) {
        case 10 : this.score = 1; break
        case 30 : this.score = 2; break
        case 70 : this.score = 3; break
        case 80 : this.score = 4; break
        case 90 : this.score = 5; break
      }
    }
  }
}
</script>

<style lang="scss">

</style>
