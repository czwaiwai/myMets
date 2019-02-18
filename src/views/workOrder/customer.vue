<template>
    <div class="page">
        <mt-header :title="title">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div>
          <navbar :list="typeList" v-model="currIndex"></navbar>
          <div class="weui-flex">
            <div class="weui-flex__item">
              <search v-model="searchKey" :no-focus="true" @searchCancel="searchHandle" placeholder="关键字、工单号或位置"></search>
            </div>
            <div @click="searchHandle" style="background:#EFEFF4;" class="weui-search-bar  main_color">
              <span style="margin-top:2px;">搜索</span>
            </div>
          </div>
        </div>
        <component ref="pageList" :is="currIndex" :params="currConfig.params"  :config="currConfig" @listDone="listDone" >
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
                  <div class="weui-media-box weui-media-box_text" style="padding-bottom:5px;">
                      <h4 class="weui-media-box__title">{{scope.item.QuesDesc}}</h4>
                      <div class="img_list_wrap">
                        <ul class="clearfix">
                          <li @click.stop  class="img_wrap" v-for="(item,index) in scope.item.ImageList" :key="index">
                            <img :preview="'list'+scope.item.WONo" :src="item.Path">
                          </li>
                        </ul>
                      </div>
                      <p class="dark_99"><i class="iconfont icon-z-location"></i> {{scope.item.WorkPos}}</p>
                      <p class="dark_99"><i class="iconfont icon-icon"></i> {{scope.item.WONoBasicName}} {{ scope.item.RSDate }}</p>
                  </div>
              </div>
              <div class="weui-panel__ft text-right padding-right15 padding-bottom15">
                  <!--hasTransferOrder//不知道怎么来的 item.WorkState==='2' && hasTransferOrder==='true' -->
                  <button :key="index" v-for="(buttonItem,index) in showButtons(scope.item.WorkOrdState, scope.item.bHandle, scope.item.IsFromSkill)" @click="btnAction(scope.item, buttonItem)"  class="ins_btn ins_btn_plain_default">{{buttonItem}}</button>
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
import navbar from '@/components/navbar'
import PageList from '@/components/pageList'
import customerMixin from './customerMixin'
import Search from '@/components/search'
export default {
  name: 'customer',
  componentName: 'customer',
  mixins: [customerMixin],
  components: {
    navbar,
    Search,
    all: PageList,
    waiting: PageList,
    working: PageList,
    looking: PageList,
    closeing: PageList
  },
  data () {
    return {
      title: '客服工单',
      searchKey: '',
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
    // （Equipment设备（维修）、Resource资源(客服)
    this.workPosFrom = this.$route.query.workPosFrom || 'Resource'
    this.title = this.$route.query.workPosFrom ? '维修工单' : '客服工单'
    this.nav = {
      orgId: this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.UserID,
      positionId: this.user.PositionID,
      memberId: this.user.memberId || '1',
      workPosFrom: this.workPosFrom
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
    // 刷新当前列表页
    refresh () {
      this.getStatus()
      this.$refs.pageList.refresh()
    },
    routeTo (item) {
      console.log(item)
      this.workItem = item
      this.$router.push({path: this.$route.path + '/detail'})
    },
    listDone () {
      this.$previewRefresh()
    },
    searchHandle () {
      this.currConfig.params.workPos = this.searchKey
      this.configList = this.typeList.map(item => {
        return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15, workPos: this.searchKey})
      })
      this.refresh()
    },
    createListConfig (name, params) {
      let ip = this.$store.getters.ip
      return {
        name: name,
        url: '/ets/syswin/smd/userCSGetWorkOrdSyswinH5',
        params: {
          projectId: this.nav.orgId,
          employeeId: this.nav.memberId,
          workPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
          positionID: this.nav.positionId,
          sort: '-1', // 1为升序，其他为降序
          workPos: this.searchKey, // search 筛选
          ...params
        },
        format: function (data) {
          return data.WorkInfo.map(item => {
            if (ip) {
              item.ImageList.map(sub => {
                sub.Path = 'http://' + ip + sub.Path
                return sub
              })
            }
            return item
          })
        }
      }
    },
    async getStatus () {
      let url = '/ets/syswin/smd/userCSGetWorkOrdCountInfoH5'
      let res = await this.$http.post(url, {
        projectId: this.nav.orgId,
        employeeId: this.nav.memberId,
        workPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
        positionID: this.nav.positionId
      })
      res.data.map((item, index) => {
        this.typeList[index].name = item['GDName']
        this.typeList[index].badge = item['GDCount']
        this.typeList[index].state = item['State']
      })
    },
    // 关闭工单
    async closeOrder (obj) {
      await this.$message.confirm('确认关闭此' + this.title + '？')
      let url = '/ets/syswin/smd/userServiceVisitManClose'
      let res = await this.$http.post(url, {
        userName: this.nav.userName,
        orderId: obj.WorkOrdID,
        closeDate: new Date().format('yyyy-MM-dd hh:mm:ss')
      })
      this.refresh()
      this.$toast('工单关闭成功')
      console.log(res)
    },
    // 转单
    async setPerson (item) {
      console.log(this.workItem, item)
      let params = {
        strWorkOrdID: this.workItem.WorkOrdID,
        positionId: item.PositionID,
        positionName: item.PositionName,
        ordersID: item.EmployeeID,
        orders: item.EmployeeName,
        ordersDepart: item.DeptName
      }
      let url = '/ets/syswin/smd/userServiceSingleBill'
      let res = await this.$http.post(url, params)
      console.log(res)
      this.$toast('转单成功')
      this.refresh()
      await this.sendMsg(this.workItem)
    },
    async sendMsg (work) {
      let url = '/ets/message/getMessage'
      let state = ''
      let title = this.title
      let type = 'CustomerService'
      switch (work.WorkOrdState) {
        case 'WOSta_Sub': state = '待接单'; break
        case 'WOSta_Proc': state = '待接单'; break
        case 'WOSta_Finish': state = '待接单'; break
        case 'WOSta_Visit': state = '待接单'; break
      }
      let params = {
        id: work.WorkOrdID,
        type: type,
        title: title,
        content: this.nav.userName + '给您转发一个新的' + state + '工单，请及时处理',
        tag: work.UserId,
        status: '1'
      }
      let res = await this.$http.post(url, params)
      this.$toast('消息推送成功')
      console.log(res)
    }
  }
}
</script>

<style lang="scss">
.img_list_wrap {
  padding:5px 0;
}
.img_list_wrap .img_wrap{
  float:left;
  width:65px;
  height:65px;
  margin-right: 10px;
  margin-bottom: 5px;
  overflow: hidden;
}
.img_list_wrap .img_wrap img{
  max-width:100%;
  // max-height:100%;
}
.ins_btn + .ins_btn {
  margin-left:5px;
}
.ins_btn_plain_default{
  border-radius:5px;
  border:1px solid #999;
  padding:5px 10px;
  color:#999;
}
.ins_btn:last-child{
   border:1px solid #3395FF;
   color:#3395FF;
}
.ins_btn_plain_primary {
  border-radius:5px;
  border:1px solid #3395FF;
  padding:5px 10px;
  color:#3395FF;
}
</style>
