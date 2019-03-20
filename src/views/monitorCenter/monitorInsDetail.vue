<template>
  <div class="page_modal">
    <div class="page">
      <nav-title :title="title"></nav-title>
      <div class="page_bd">

        <div class="light_bg padding-v padding15-h margin-bottom">
          <p><span class="dark_99">工 单 号：</span><span>{{work.WorkOrdNo}}</span></p>
          <p><span class="dark_99">开始日期：</span><span>{{work.PlanStartTime}}</span></p>
          <p><span class="dark_99">负 责 人：</span><span>{{work.Principal}}</span></p>
        </div>

        <div >
          <ul>
            <li v-for="(item, index) in list" :key="index" class=" light_bg margin-bottom5">
              <div class="weui-flex padding15-h padding-v"  @click="item.show = !item.show">
                <div class="weui-flex__item">
                  <p>{{item.EquiName}}</p>
                  <p class="dark_99 fs13"><i class="iconfont icon-weizhi-tianchong"></i>{{item.InstallationSite}}</p>
                </div>
                <div class="ft item_center direct_icon " :class="item.show?'weui_icon_download':''" >
                  <i class="iconfont   icon-shouqi" ></i>
                </div>
              </div>
              <div v-show="item.show" class="sub_item_content relative">
                <div style="position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;"></div>
                <ul v-if="work.WorkState === '2'"  class="sub_ul_opera border-bottom-half">
                  <li  v-for="(sub, key) in item.OptionsInfo" :key="key" class="border-top-half padding-v padding15-h">
                    <div>{{sub.StepsName}} <span v-if="sub.IsInput === 'True'">(正常值: {{sub.ValueMin}}~{{sub.ValueMax}}{{sub.ValueUnit}})</span></div>
                    <ins-number  v-if="sub.IsInput === 'True'" v-model="sub.InputResult" :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                    <ins-radio v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" :option-str="sub.OptionsInfo" ></ins-radio>
                  </li>
                </ul>
                <ul v-else class="sub_ul_show border-bottom-half">
                  <li v-for="(sub, key) in item.OptionsInfo" :key="key" class="border-top-half padding-v padding15-h">
                    <div>{{sub.StepsName}} <span v-if="sub.IsInput === 'True'">(正常值: {{sub.ValueMin}}~{{sub.ValueMax}}{{sub.ValueUnit}})</span></div>
                    <!-- 数值类型显示 -->
                    <ins-number :readonly="true" v-if="sub.IsInput === 'True'" v-model="sub.InputResult" :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                    <!-- 选项内容展示 --><ins-radio :readonly="true" v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" :option-str="sub.OptionsInfo" ></ins-radio>
                    <p>{{sub.FeedContent}}</p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

      </div>
      <transition name="page">
        <router-view/>
      </transition>
    </div>
  </div>
</template>
<script>
import InsRadio from '@/views/workOrder/child/insRadio'
import InsNumber from '@/views/workOrder/child/insNumber'
export default {
  name: 'inspectionDetail',
  data () {
    return {
      test: '通过',
      test1: '不通过',
      work: {},
      list: [],
      title: ''
    }
  },
  components: {
    InsRadio,
    InsNumber
  },
  created () {
    if (this.$parent.workItem.WordType === 'Work_KeepFit') {
      this.title = '保养详情'
    } else {
      this.title = '巡检详情'
    }
    this.nav = this.$parent.nav
    this.currNav = this.$parent.currNav
    this.work = this.$parent.workItem
    this.getPageData()
  },
  methods: {
    async getPageData () {
      // let res = await this.$http.post('/ets/table/list/equipBaseGetInspectionEquipmentH5', {
      //   projId: this.nav.orgId,
      //   workID: this.work.WorkID,
      //   caseID: this.work.CaseID,
      //   isCase: this.work.IsCase
      // })
      let p0 = 'EquipBase_GetInspectionEquipmentH5'
      let res = await this.$xml(p0, {
        OrgID: this.nav.orgId,
        BillID: this.work.WorkID,
        CaseID: this.work.CaseID,
        IsCase: this.work.IsCase
      })
      let list = res.data
      list.forEach((item, index) => {
        item.show = false
        if (index === 0) {
          item.show = true
        }
        item.OptionsInfo.forEach(sub => {
          if (sub.IsInput === 'True') {
            sub.InputResult = sub.InputResult || sub.ValueMin
          } else {
            sub.InputResult = sub.InputResult || sub.StandardOptions
          }
        })
      })
      this.list = list
      console.log(res)
    },
    toPhoto () {
      this.$router.push({path: this.$route.path + '/photo'})
    },
    // 数值类型显示颜色
    fnIsNumNormal (item) {
      if (item.IsInput !== 'False') {
        let min = parseFloat(item.ValueMin)
        let max = parseFloat(item.ValueMax)
        let num = parseFloat(item.InputResult)
        if (num < min || num > max) {
          return 'wrong_text_color'
        } else {
          return 'right_text_color'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.right_text_color {
  color:#3395ff;
}
.wrong_text_color {
  color: #f00404;
}
.sub_item_content {
  background:#f8f8f8;
}
.sub_ul_show {
  display:block;
}
.direct_icon.weui_icon_download {
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
}
.direct_icon {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
    -webkit-transition: -webkit-transform 0.2s linear;
    transition: -webkit-transform 0.2s linear;
    transition: transform 0.2s linear;
    transition: transform 0.2s linear, -webkit-transform 0.2s linear;
}
</style>
