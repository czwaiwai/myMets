<template>
    <div class="page">
        <mt-header title="巡检工单">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div>
          <navbar :list="typeList" v-model="currIndex"></navbar>
        </div>
        <component ref="inslist" :params="currConfig.params"  :is="currIndex" :config="currConfig" >
          <template slot-scope="scope" >
            <div class="weui-panel weui-panel_access margin-bottom">
              <div @click="routeTo(scope.item)"   class="weui-panel__hd">
                <i class="iconfont icon-building-automation padding-right5 "></i>{{nav.orgName}}
                <span class="float_right">
                  <span class="main_color" v-if="scope.item.WorkState === '2'">请巡检</span>
                  <span class="main_color" v-if="scope.item.WorkState === '3'">巡检人已提交</span>
                  <span class="dark_99" v-if="scope.item.WorkState === '4'">完成</span>
                </span>
              </div>
              <div @click="routeTo(scope.item)"  class="weui-panel__bd" >
                  <div class="weui-media-box weui-media-box_text" style="padding-bottom:5px">
                      <h4 class="weui-media-box__title">{{scope.item.PlanName}}</h4>
                      <p><span class="dark_99">巡 检 人:</span> {{scope.item.Principal}}</p>
                      <p><span class="dark_99">开始时间:</span> {{scope.item.PlanStartTime}}</p>
                  </div>
              </div>
              <div class="weui-panel__ft text-right padding-right15 padding-bottom">
                  <!--hasTransferOrder//不知道怎么来的 item.WorkState==='2' && hasTransferOrder==='true' -->
                  <button @click="covertOrder(scope.item)" class="ins_btn ins_btn_plain_default"  v-if="scope.item.WorkState==='2'">转单</button>
                  <button @click="routeTo(scope.item)"   class="ins_btn ins_btn_plain_primary" v-if="scope.item.WorkState==='2'">巡检</button>
                  <button @click="closeOrder(scope.item)"  class="ins_btn ins_btn_plain_primary"   v-if="scope.item.WorkState==='3'">关闭</button>
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
    closing: PageList,
    closed: PageList
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
        {id: 'all', name: '全部', state: '1', badge: ''},
        {id: 'waiting', name: '待巡检', state: '2', badge: ''},
        {id: 'closing', name: '待关闭', state: '3', badge: ''},
        {id: 'closed', name: '已关闭', state: '4', badge: ''}
      ]
    }
  },
  created () {
    this.orderType = 'Inspection'
    this.nav = {
      orgId: '11091315263400010000' || this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.userName,
      memberId: '30' || this.user.memberId
    }
    this.getThreeMouth()
    this.getStatus()
    this.configList = this.typeList.map(item => {
      return this.createListConfig(item.id, {orderState: item.state})
    })
    console.log(this.configList, 'configList')
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
    // 刷新当前列表页
    refresh () {
      this.getStatus()
      this.$refs.inslist.refresh()
    },
    routeTo (item) {
      console.log(item)
      this.workItem = item
      this.$router.push({path: this.$route.path + '/detail'})
    },
    // 转单
    covertOrder (obj) {
      console.log(obj, 'order')
      this.$router.push({path: this.$route.path + '/personSelector', query: {workId: obj.WorkID}})
    },
    // 转单结果
    async setPerson (item, query) {
      let url = '/ets/syswin/smd/equipBaseSingleBill'
      await this.$http.post(url, {
        orgID: item.PositionID,
        workOrdID: query.workId,
        workType: this.orderType,
        ordersID: item.EmployeeID,
        orders: item.EmployeeName
      })
      // 刷新当前列表
      this.refresh()
      // 发送消息
      try {
        await this.sendMsg(item, query.workId)
        // 提示
        this.$toast('转单成功')
      } catch (e) {
        console.log(e)
        this.$toast('转单成功但推送失败')
      }
    },
    // 推送消息
    async sendMsg (data, workId) {
      let url = '/ets/message/getMessage'
      await this.$http.post(url, {
        id: workId,
        type: 'E_Inspection', // [E_Inspection, E_KeepFit]
        title: '巡检工单', // [巡检工单, 保养工单]
        content: '您有一个新的转单工单，请及时处理',
        tag: data.UserId,
        status: '1'
      })
    },
    createListConfig (name, params) {
      return {
        name: name,
        url: '/ets/table/list/equipBaseGetInspectionInfoH5',
        params: {
          projId: this.nav.orgId,
          memberId: this.nav.memberId,
          orderType: this.orderType,
          starTime: '1', // 1为升序其他都为降序
          code: '', // search 筛选
          pageSize: 15,
          queryStarTime: this.search.startTime,
          queryEndTime: this.search.endTime,
          stid: '',
          ...params
        },
        format: function (data) {
          return data.EquiInfo
        }
      }
      // let = /ets/table/list/equipBaseGetInspectionInfoH5
    },
    async getStatus () {
      let url = '/ets/syswin/smd/equipBaseGetInspectionCount'
      let res = await this.$http.post(url, {
        strOrgId: this.nav.orgId,
        strCstId: this.nav.memberId,
        strAppWordType: this.orderType,
        queryStarTime: this.search.startTime,
        queryEndTime: this.search.endTime
      })
      res.data.map((item, index) => {
        this.typeList[index].name = item['GDName']
        this.typeList[index].badge = item['GDCount']
        this.typeList[index].state = item['State']
      })
    },
    // 获取3个月的时间
    getThreeMouth: function () {
      let before = new Date()
      let end = new Date()
      before.setMonth(before.getMonth() - 1)
      before.setDate(1)
      end.setMonth(end.getMonth() + 2)
      end.setDate(0)
      this.search = {
        startTime: before.format('yyyy-MM-dd') + ' 00:00:00',
        endTime: end.format('yyyy-MM-dd') + ' 23:59:59'
      }
    },

    // 关闭工单
    async closeOrder (obj) {
      await this.$message.confirm('确定关闭该巡检工单？')
      let url = '/ets/syswin/smd/equipBaseWorkCompletionColse'
      let res = await this.$http.post(url, {
        wordId: obj.WorkID,
        wordType: obj.WordType,
        workState: obj.WorkState,
        opUserId: this.nav.memberId
      })
      this.refresh()
      this.$toast('关闭巡检成功')
      console.log(res)
    }
  }
}
</script>

<style lang="scss">
.ins_btn + .ins_btn {
  margin-left:5px;
}
.ins_btn_plain_default{
  border-radius:5px;
  border:1px solid #999;
  padding:5px 10px;
  color:#999;
}
.ins_btn_plain_primary {
  border-radius:5px;
  border:1px solid #3395FF;
  padding:5px 10px;
  color:#3395FF;
}
</style>
