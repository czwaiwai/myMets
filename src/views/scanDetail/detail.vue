<template>
<div class="page_modal">
    <div class="page">
        <nav-title title="设备详情"></nav-title>
        <div class="page_bd">
          <div class="light_bg padding-v padding15-h margin-bottom">
            <p  class="dark_13 fs16"><span>{{detail.EquiName}}</span></p>
            <p class="dark_99 "><span class="padding-right"><i class="iconfont icon-weizhi-tianchong"></i></span><span>{{detail.InstallationsiteId}}</span></p>
          </div>
          <div class="light_bg padding-v padding15-h margin-bottom">
            <p><span class="dark_99">工 单 号：</span><span>{{work.WorkOrdNo}}</span></p>
            <p><span class="dark_99">开始日期：</span><span>{{work.PlanStartTime}}</span></p>
            <p><span class="dark_99">负 责 人：</span><span>{{work.Principal}}</span></p>
          </div>
          <div class="padding-left15">巡检结果</div>
          <div class="light_bg">
            <ul>
              <li v-for="(sub, key) in list" :key="key" class="border-top-half padding-v padding15-h">
                <div>{{sub.StepsName}} <span v-if="sub.IsInput === 'True'">(正常值: {{sub.ValueMin}}~{{sub.ValueMax}}{{sub.ValueUnit}})</span></div>
                <!-- 数值类型显示 -->
                <ins-number :readonly="true" v-if="sub.IsInput === 'True'" v-model="sub.InputResult"  :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                <!-- 选项内容展示 --><ins-radio :readonly="true" v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" :option-str="sub.OptionsInfo" ></ins-radio>
                <p>{{sub.FeedContent}}</p>
              </li>
            </ul>
          </div>
        </div>
    </div>
</div>
</template>
<script>
import InsRadio from '../workOrder/child/insRadio'
import InsNumber from '../workOrder/child/insNumber'
import navTitle from '@/components/navTitle'
export default {
  name: 'detail',
  components: {navTitle, InsRadio, InsNumber},
  data () {
    return {
      detail: {},
      work: {},
      txt: '',
      list: []
    }
  },
  created () {
    this.detail = this.$parent.scanObj
    this.work = this.$parent.subItem
    console.log(this.work, 'hahh')
    if (this.$parent.selected === 'list0') {
      this.txt = '巡检'
    } else {
      this.txt = '保养'
    }
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let p0 = 'EquipBase_GetInspectionWorkInstructH5'
      let res = await this.$xml(p0, {
        'OrgID': this.work.OrgID,
        'BillID': this.work.ID,
        'EAID': this.work.EAID,
        'CaseID': this.work.CaseID,
        'IsCase': this.work.IsCase
      })
      console.log(res)
      this.list = res.data
      // let url = '/ets/syswin/smd/userCS_GetEquiInspectionH5'
      // let res = await this.$http.post(url, {

      // })

      // var param = {
      //       equipmentId: this.code,
      //       workType: 'Inspection',
      //       page: this.pageNum1,
      //       pageSize: this.pageSize1
      //     };
      // /ets/syswin/smd/userCS_GetEquiInspectionH5
    }
  }
}
</script>

<style lang="scss">

</style>
