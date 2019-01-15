<template>
    <div class="page">
        <mt-header title="客服工单">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div>
          <navbar :list="typeList" v-model="currIndex"></navbar>
        </div>
        <component ref="test" :is="currIndex" :config="currConfig" >
          <template slot-scope="scope" >
            <div class="weui-panel weui-panel_access margin-bottom">
              <div @click="routeTo(scope.item)"   class="weui-panel__hd">
                <i class="iconfont icon-gongdan padding-right5 "></i>{{ scope.item.WONo }}
                <span class="float_right">
                  <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Sub'">新服务需求</span>
                  <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Proc'">工单已接收</span>
                  <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Finish'">工单已处理</span>
                  <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Visit'">工单已回访</span>
                  <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Close'">服务成功</span>
                </span>
              </div>
              <div @click="routeTo(scope.item)"  class="weui-panel__bd">
                  <div class="weui-media-box weui-media-box_text">
                      <h4 class="weui-media-box__title">{{scope.item.QuesDesc}}</h4>
                      <div>展示图片区域</div>
                      <p class="dark_99"><i class="iconfont icon-z-location"></i> {{scope.item.WorkPos}}</p>
                      <p class="dark_99"><i class="iconfont icon-icon"></i> {{scope.item.WONoBasicName}} {{ scope.item.RSDate }}</p>
                  </div>
              </div>
              <div class="weui-panel__ft text-right">
                  <!--hasTransferOrder//不知道怎么来的 item.WorkState==='2' && hasTransferOrder==='true' -->
                  <button :key="index" v-for="(buttonItem,index) in showButtons(scope.item.WorkOrdState, scope.item.bHandle, scope.item.IsFromSkill)" @click="covertOrder" class="weui-btn weui-btn_mini weui-btn_default">{{buttonItem}}</button>
              </div>
            </div>
          </template>
        </component>
        <transition name="page">
          <!-- <keep-alive > -->
            <router-view/>
          <!-- </keep-alive> -->
        </transition>
        <!-- <div class="page_bd">
          {{currIndex}}
          <div></div>
        </div> -->
    </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import navbar from './child/navbar'
import PageList from '@/components/pageList'
export default {
  name: 'inspection',
  components: {
    navbar,
    all: PageList,
    waiting: PageList,
    working: PageList,
    looking: PageList,
    closeing: PageList
  },
  data () {
    return {
      currIndex: 'all',
      search: {
        startTime: '',
        endTime: ''
      },
      workItem: {},
      typeList: [
        {id: 'all', name: '全部', state: '5', badge: ''},
        {id: 'waiting', name: '待接单', state: '1', badge: ''},
        {id: 'working', name: '待完工', state: '2', badge: ''},
        {id: 'looking', name: '待回访', state: '3', badge: ''},
        {id: 'closeing', name: '待关闭', state: '4', badge: ''}
      ]
    }
  },
  created () {
    // 从原生来的数据
    this.isTransferBtn = true // 是否显示转单按钮
    this.isMaterial = true // 材料申请权限
    // --------------
    this.orderType = 'Inspection'
    this.nav = {
      orgId: '11091315263400010000' || this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.userName,
      positionId: this.user.PositionID,
      memberId: '30' || this.user.memberId
    }
    this.getStatus()
    this.configList = this.typeList.map(item => {
      return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15})
    })
    console.log(this.configList, 'configList')
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    currConfig () {
      return this.configList.find(item => item.name === this.currIndex) || {}
    }
  },
  methods: {
    routeTo (item) {
      console.log(item)
      this.workItem = item
      this.$router.push({path: this.$route.path + '/detail'})
    },
    // 转单
    covertOrder (obj) {
      this.$router.push({path: this.$route.path + '/personSelector'})
    },
    createListConfig (name, params) {
      return {
        name: name,
        url: '/ets/syswin/smd/userCSGetWorkOrdSyswinH5',
        params: {
          projectId: this.nav.orgId,
          employeeId: this.nav.memberId,
          workPosFrom: 'Resource', // （Equipment设备（维修）、Resource资源(客服)
          positionID: this.nav.positionId,
          sort: '-1', // 1为升序，其他为降序
          workPos: '', // search 筛选
          ...params
        },
        format: function (data) {
          return data.WorkInfo
        }
      }
    },
    async getStatus () {
      let url = '/ets/syswin/smd/userCSGetWorkOrdCountInfoH5'
      let res = await this.$http.post(url, {
        projectId: this.nav.orgId,
        employeeId: this.nav.memberId,
        workPosFrom: 'Resource', // （Equipment设备（维修）、Resource资源(客服)
        positionID: this.nav.positionId
      })
      res.data.map((item, index) => {
        this.typeList[index].name = item['GDName']
        this.typeList[index].badge = item['GDCount']
        this.typeList[index].state = item['State']
      })
    },
    // 显示底部按钮逻辑
    showButtons: function (workOrderState, bHandle, isFromSkill) {
      /*
                    WOSta_Sub    : 已提交
                    WOSta_Proc   : 处理中
                    WOSta_Finish : 已完成
                    WOSta_Visit  : 已评价
                    WOSta_Close  : 已关闭
                    */
      if (workOrderState === 'WOSta_Sub') {
        if (bHandle === '1') {
          if (isFromSkill === '1') {
            return ['抢单']
          } else {
            if (this.isTransferBtn) {
              return ['转单', '接单']
            } else {
              return ['接单']
            }
          }
        }
      } else if (workOrderState === 'WOSta_Proc') {
        if (this.isMaterial && this.isTransferBtn) {
          return ['转单', '材料申请', '反馈']
        } else if (!this.isMaterial && this.isTransferBtn) {
          return ['转单', '反馈']
        } else if (this.isMaterial && !this.isTransferBtn) {
          return ['材料申请', '反馈']
        } else {
          return ['反馈']
        }
      } else if (workOrderState === 'WOSta_Finish') {
        return this.isTransferBtn ? ['转单', '完成回访'] : ['完成回访']
      } else if (workOrderState === 'WOSta_Visit') {
        return ['回访详情', '关闭工单']
      } else {
        return []
      }
    },
    // 关闭工单
    async closeOrder (obj) {
      console.log(this.$refs.test)
      await this.$message.confirm('确定关闭该巡检工单？')
      let url = '/ets/syswin/smd/equipBaseWorkCompletionColse'
      let res = await this.$http.post(url, {
        wordId: obj.WorkID,
        wordType: obj.WordType,
        workState: obj.WorkState,
        opUserId: this.nav.memberId
      })
      this.$toast('关闭巡检成功')
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

</style>
