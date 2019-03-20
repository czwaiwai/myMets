<template>
  <div class="page">
    <nav-title title="巡保工作监控"></nav-title>
    <div>
      <navbar :list="typeList" v-model="currIndex"></navbar>
    </div>
    <component ref="pageList" :params="currConfig.params"  :is="currIndex" :config="currConfig" >
        <template slot-scope="scope" >
          <div class="weui-panel weui-panel_access margin-bottom needsclick">
            <div @click="routeTo(scope.item)"   class="weui-panel__hd needsclick">
              <i class="iconfont icon-building-automation padding-right5 "></i>{{nav.orgName}}
              <span class="float_right">
                <span v-if="scope.item.WordType === 'Work_insp'" class="span_tag">巡</span>
                <span v-if="scope.item.WordType === 'Work_KeepFit'" class="span_tag">保</span>
              </span>
            </div>
            <div @click="routeTo(scope.item)"  class="weui-panel__bd needsclick">
                <div class="moni_ins_bg weui-media-box weui-media-box_text weui-flex needsclick" >
                  <div class="light needsclick" style="width: 95px;padding-right: 15px;text-align: center;">
                    <p class="fs18 padding-top padding-bottom5" >{{scope.item.Principal}}</p>
                    <!-- <p >共{{scope.item.BillNum }}设备</p> -->
                  </div>
                  <div class="weui-flex__item needsclick">
                    <h4 class="weui-media-box__title needsclick">{{scope.item.WORID}}</h4>
                    <p class="needsclick" v-if="currNav.state === '1'"><span class="dark_99 needsclick">计划开始：</span> {{scope.item.PlanStartTime}}</p>
                    <p class="needsclick" v-if="currNav.state === '2' && scope.item.PlanEndTime"><span class="dark_99 needsclick" :class="scope.item.StateType !== '已关闭'?'span_orange':''">{{scope.item.StateType }}</span> | <span class="needsclick" :class="scope.item.StateType?'error_color':''">{{ scope.item.PlanEndTime }} 完成 </span></p>
                    <p class="needsclick" v-if="currNav.state === '2' && !scope.item.PlanEndTime"><span class="dark_99 needsclick" :class="scope.item.StateType !== '已关闭'?'span_orange':''">{{scope.item.StateType }}</span></p>
                  </div>
                </div>
            </div>
          </div>
        </template>
      </component>
      <transition name="page">
        <!-- <keep-alive > -->
          <router-view/>
        <!-- </keep-alive> -->
      </transition>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import navbar from '@/views/workOrder/child/navbar'
import PageList from '@/components/pageList'
import qs from 'qs'
export default {
  name: 'repairDetail',
  components: {
    navbar,
    wait: PageList,
    ready: PageList
  },
  data () {
    return {
      currIndex: 'wait',
      workItem: {},
      typeList: [
        {id: 'wait', name: '待完成巡保', state: '1', badge: ''},
        {id: 'ready', name: '已完成巡保', state: '2', badge: ''}
      ]
    }
  },
  created () {
    let obj = qs.parse(location.search.replace('?', ''))
    this.nav = {
      orgId: obj.projectId || this.user.OrgID,
      orgName: obj.projectName || this.user.OrgName,
      userName: obj.UserId || this.user.UserID,
      memberId: obj.memberId || this.user.memberId
    }
    this.configList = this.typeList.map(item => {
      return this.createListConfig(item.id, {eventStateId: item.state})
    })
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    currNav () {
      return this.typeList.find(item => item.id === this.currIndex) || {}
    },
    currConfig () {
      return this.configList.find(item => item.name === this.currIndex) || {}
    }
  },
  methods: {
    routeTo (item) {
      this.workItem = item
      this.$router.push({path: this.$route.path + '/monitorInsDetail'})
      console.log(item, '---')
    },
    createListConfig (name, params) {
      return {
        name: name,
        // url: '/ets/table/list/equipBase_GetInspectionMonitorH5',
        url: 'EquipBase_GetInspectionMonitorH5',
        xml: true,
        params: {
          strOrgID: this.nav.orgId,
          starTime: '1',

          // projId: this.nav.orgId,
          // memberId: this.nav.memberId,
          // orderType: this.orderType,
          // starTime: '1', // 1为升序其他都为降序
          // code: '', // search 筛选
          // pageSize: 15,
          // queryStarTime: this.search.startTime,
          // queryEndTime: this.search.endTime,
          // stid: '',
          ...params
        },
        format: function (res) {
          let data = res[0]
          return data.EquiInfo
        }
      }
      // let = /ets/table/list/equipBaseGetInspectionInfoH5
    }
  }
}
</script>

<style lang="scss">
.span_tag {
  border:1px solid #3395FF;
  padding:3px 5px;
  color: #3395FF;
}
.span_orange {
  color: #fa8a2c;
}
.moni_ins_bg {
  background:#FFF url('../../assets/img/monitor/bg_gdjk.png') no-repeat 15px center;
  background-size:80px ;
}
</style>
