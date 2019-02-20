<template>
<div class="page" style='background-color: #F0F2F4;'>
  <!-- <mt-header title="设备详情">
    <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
  </mt-header> -->
  <nav-title title="设备详情"></nav-title>
      <div class="weui-panel weui-panel_access margin-bottom " style="margin-top:0;">
          <!-- <div class="weui-panel__hd">图文组合列表</div> -->
          <div class="weui-panel__bd">
              <div href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg padding-v" >
                  <div class="weui-media-box__bd">
                      <span class="span_tag span_tag_normal">{{scanObj.DevStatus}}</span>
                      <h4 class="weui-media-box__title fs18">{{scanObj.EquiName}}</h4>
                      <p class="dark_99">{{scanObj.EquiCode}}</p>
                      <p class="desc"><span class="dark_99">型号：</span>{{scanObj.EquiModel}}</p>
                      <p class="desc"><span class="dark_99">规格：</span>{{scanObj.Specification}}</p>
                      <p class="desc"><span class="dark_99">安装位置：</span>{{scanObj.InstallationsiteId}}</p>
                      <p class="desc"><span class="dark_99">启用日期：</span>{{scanObj.EnableTime}} <span><span class="dark_99 padding-left">负责人：</span>{{scanObj.Principal}}</span></p>
                  </div>
              </div>
          </div>
          <div class="weui-panel__ft">
              <div class="weui-cell weui-cell_access  weui-cell_link">
                <div class="weui-cell__hd"><span class="dark_99">备注：</span></div>
                <div class="weui-cell__bd " style="overflow:hidden" ><p class="dark_33 p_dot">{{scanObj.Memo}}</p></div>
                <!-- <span class="weui-cell__ft"></span> -->
              </div>
          </div>
      </div>
      <mt-navbar v-model="selected" style="margin-bottom:3px;">
        <mt-tab-item id="moreDetail">更多信息</mt-tab-item>
        <mt-tab-item id="list0">巡检记录</mt-tab-item>
        <mt-tab-item id="list1">保养记录</mt-tab-item>
        <mt-tab-item id="list2">维修记录</mt-tab-item>
      </mt-navbar>
      <keep-alive>
          <component :is="selected" :params="currConfig.params"  :config="currConfig" :obj="scanObj">
            <template slot-scope="scope" >
              <div @click="routeTo(scope.item)" v-if="['list0','list1'].indexOf(selected) > -1" class="light_bg weui-flex padding15-h padding-v border-bottom-half">
                <div class="weui-flex__item">{{scope.item.PlanStartTime}}</div>
                <div :class="scope.item.Normal === '正常'?'normal_color':'error_color'">{{scope.item.Normal}}</div>
              </div>
              <div v-else @click="routeTo(scope.item)" class=" light_bg padding15-h padding-v border-bottom-half">
                <p>{{scope.item.QuesDesc}}</p>
                <p class="dark_99 fs13">报事人：{{scope.item.RSPeoName}}</p>
                <p class="dark_99 fs13">{{scope.item.RSDate}}</p>
              </div>
            </template>
          </component>
      </keep-alive>
      <div class="page_ft light_bg text-center padding-top5">
        <button  class=" weui-btn weui-btn_mini weui-btn_plain-primary">报修此设备</button>
      </div>
      <transition name="page">
        <router-view></router-view>
      </transition>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import { Navbar } from 'mint-ui'
import ScanList from '@/components/pageList'
import OtherDetail from './child/otherDetail'
import navTitle from '@/components/navTitle'
// import ScanList1 from './child/list1'
export default {
  name: 'scanDetail',
  data () {
    return {
      selected: 'moreDetail',
      scanObj: {},
      subItem: {},
      workItem: {},
      configList: []
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    currConfig () {
      let config = this.configList.find(item => item.name === this.selected)
      return config || {}
    }
  },
  created () {
    this.nav = {
      orgId: this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.UserID,
      positionId: this.user.PositionID,
      memberId: this.user.memberId || '1',
      workPosFrom: 'Equipment'
    }
    this.deviceId = this.$route.params.id
    this.configList = [
      this.createPageConfig('list0', 'Inspection'),
      this.createPageConfig('list1', 'KeepFit'),
      this.createLastConfig('list2')
    ]
    this.getPageData()
  },
  components: {
    navTitle,
    moreDetail: OtherDetail,
    list0: ScanList,
    list1: ScanList,
    list2: ScanList,
    MtNavbar: Navbar
  },
  methods: {
    tocustomerService () {
      this.$router.push({
        name: 'customerService',
        query: {
          type: 'baoxiu',
          workPos: this.scanObj.EquiName,
          woId: this.scanObj.Id,
          quick: true
        }
      })
    },
    // 扫码后设备档案详情接口 [巡检 Inspection,保养 KeepFit]
    createPageConfig (name, workType = 'Inspection') {
      return {
        name: name,
        // url: '/ets/syswin/smd/userCS_GetEquiInspectionH5',
        url: 'UserCS_GetEquiInspectionH5',
        xml: true,
        params: {
          equipmentId: this.deviceId,
          workType: workType // KeepFit
        },
        format: function (res) {
          let data = res[0]
          return data.WorkList
        }
      }
    },
    // 获取设备维修工单列表接口
    createLastConfig (name) {
      // /ets/syswin/smd/userCS_GetEquiRepairH5
      return {
        name: name,
        // url: '/ets/syswin/smd/userCS_GetEquiRepairH5',
        url: 'UserCS_GetEquiRepairH5',
        xml: true,
        params: {
          equipmentId: this.deviceId
        },
        format: function (res) {
          let data = res[0]
          return data.WorkList
        }
      }
    },
    async getPageData () {
      let res = await this.$xml('UserCS_GetEquiArchivesH5', {
        barcodeCode: this.deviceId
      })
      // let res = await this.$http.post('/ets/table/list/userCSGetEquiArchivesH5', {
      //   barcodeCode: this.deviceId
      // })
      if (res.data && res.data[0]) {
        this.scanObj = res.data[0]
      }
    },
    routeTo (item) {
      this.subItem = item
      this.workItem = {
        ...item,
        WorkOrdID: item.ID,
        WorkQuestionID: item.QuestionID
      }
      console.log(item, '---item---')
      if (this.selected === 'list2') {
        this.$router.forward(this.$route.path + '/repairDetail?monitor=true')
      } else {
        this.$router.forward(this.$route.path + '/scanInspectionDetail')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.normal_color {
  color:#3395ff;
}
.error_color {
  color:#f00404;
}
.p_dot {
  height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.span_tag {
  border-radius:5px;
  padding:2px 5px;
  position:absolute;
  right:15px;
}
.span_tag_normal {
  background:#3395ff;
  color:#FFF;
}
</style>
