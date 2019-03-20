<template>
  <div class="page customer">
    <nav-title :title="title"></nav-title>
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
    <component v-if="currConfig" ref="pageList" :is="currIndex" :params="currConfig.params"  :config="currConfig" @listDone="listDone" >
      <template slot-scope="scope" >
        <div class="weui-panel weui-panel_access margin-bottom needsclick">
          <div @click="routeTo(scope.item)"   class="weui-panel__hd needsclick">
            <i class="iconfont icon-gongdan padding-right5 "></i>{{ scope.item.WONo }}
            <span class="float_right">
              <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Sub'">新服务需求</span>
              <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Proc'">工单已接收</span>
              <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Finish'">工单已处理</span>
              <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Visit'">工单已回访</span>
              <span class="main_color" v-if="scope.item.WorkOrdState === 'WOSta_Close'">服务成功</span>
            </span>
          </div>
          <div @click="routeTo(scope.item)"  class="weui-panel__bd needsclick">
              <div class="weui-media-box weui-media-box_text needsclick" style="padding-bottom:5px;">
                  <h4 class="weui-media-box__title needsclick">{{scope.item.QuesDesc}}</h4>
                  <div class="img_list_wrap needsclick">
                    <ul class="clearfix">
                      <li @click.stop  class="img_wrap" v-for="(item,index) in scope.item.ImageList" :key="index">
                        <img :preview="'list'+scope.item.WONo" :src="item.Path">
                      </li>
                    </ul>
                  </div>
                  <p class="dark_99 needsclick"><i class="iconfont icon-z-location"></i> {{scope.item.WorkPos}}</p>
                  <p class="dark_99 needsclick"><i class="iconfont icon-icon"></i> {{scope.item.WONoBasicName}} {{ scope.item.RSDate }}</p>
              </div>
          </div>
          <div class="weui-panel__ft text-right padding-right15 padding-bottom15">
              <!--hasTransferOrder//不知道怎么来的 item.WorkState==='2' && hasTransferOrder==='true' -->
              <a class="call" :href="'tel:'+scope.item.CallPhone" v-show="scope.item.CallPhone&&scope.item.showCall">{{scope.item.RSPeoName}}</a>
              <i class="iconfont icon-dianhua1 iconPhone" v-show="scope.item.CallPhone" @click.stop="scope.item.showCall=!scope.item.showCall"></i>
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
import navTitle from '@/components/navTitle'
export default {
  name: 'customer',
  componentName: 'customer',
  mixins: [customerMixin],
  components: {
    navTitle,
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
    console.log('$route:', this.$route)
    // 从原生来的数据
    this.isTransferBtn = this.auth['APP_Service_SwitchSingle'] // 是否显示转单按钮
    this.isMaterial = this.auth['APP_Service_Picking'] // 材料申请权限
    // --------------
    // （Equipment设备（维修）、Resource资源(客服)
    this.workPosFrom = this.$route.params.workPosFrom
    this.title = this.workPosFrom === 'Equipment' ? '维修工单' : '客服工单'
    // this.configList = []
    this.nav = {
      orgId: this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.UserID,
      positionId: this.user.PositionID,
      memberId: this.user.memberId,
      workPosFrom: this.workPosFrom,
      memberName: this.user.memberName
    }
    this.getStatus()
    this.configList = this.typeList.map(item => {
      return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15})
    })
  },
  computed: {
    ...mapGetters({
      'auth': 'auth',
      'user': 'user'
    }),
    currConfig () {
      if (this.configList) {
        return this.configList.find(item => item.name === this.currIndex) || {}
      } else {
        return ''
      }
    }
  },
  // watch: {
  //   $route (to, from) {
  //     console.log(to, this.$route.query.taskId, 'tooooooooooooooooooooooooo')
  //   }
  // },
  methods: {
    // 刷新当前列表页
    refresh () {
      this.getStatus()
      this.$refs.pageList.refresh()
    },
    routeTo (item) {
      console.log(item)
      this.workItem = item
      this.$router.push({path: this.$route.path + '/detail/' + item.WorkOrdID})
    },
    listDone () {
      this.$previewRefresh()
    },
    async notice (taskId) {
      let p0 = 'UserCS_GetWorkOrdDetailSyswin'
      let res = await this.$xml(p0, {
        taskId: taskId,
        orgid: this.nav.orgId,
        employeeid: this.nav.memberId,
        PositionID: this.nav.positionId
      })
      if (res.data && res.data[0]) {
        console.log(res.data, '----')
        return res.data[0]
        // this.workItem = res.data[0]
      }
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
        // url: '/ets/syswin/smd/userCSGetWorkOrdSyswinH5',
        url: 'UserCS_GetWorkOrdSyswinH5',
        xml: true,
        params: {
          projectId: this.nav.orgId,
          employeeId: this.nav.memberId,
          workPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
          positionID: this.nav.positionId,
          sort: '-1', // 1为升序，其他为降序
          workPos: this.searchKey, // search 筛选
          ...params
        },
        format: function (res) {
          let data = res[0]
          return data.WorkInfo.map(item => {
            item.showCall = false
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
      let p0 = 'UserCS_GetWorkOrdCountInfoH5'
      let res = await this.$xml(p0, {
        projectID: this.nav.orgId,
        EmployeeID: this.nav.memberId,
        WorkPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
        PositionID: this.nav.positionId
      }, {}, true)
      // let url = '/ets/syswin/smd/userCSGetWorkOrdCountInfoH5'
      // let res = await this.$http.post(url, {
      //   projectId: this.nav.orgId,
      //   employeeId: this.nav.memberId,
      //   workPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
      //   positionID: this.nav.positionId
      // })
      res.data.map((item, index) => {
        this.typeList[index].name = item['GDName']
        this.typeList[index].badge = item['GDCount']
        this.typeList[index].state = item['State']
      })
    },
    // 关闭工单
    async closeOrder (obj) {
      await this.$message.confirm('确认关闭此' + this.title + '？')
      let p0 = 'UserService_VisitManClose'
      let res = await this.$xml(p0, {}, {
        p1: this.nav.userName,
        p2: obj.WorkOrdID,
        p3: new Date().format('yyyy-MM-dd hh:mm:ss')
      })
      this.refresh()
      this.$store.commit('setHomeRand', Date.now())
      this.$toast('工单关闭成功')
      console.log(res)
    },
    // 转单
    async setPerson (item) {
      console.log(this.workItem, item)
      let params = {
        strWorkOrdID: this.workItem.WorkOrdID,
        PositionId: item.PositionID,
        PositionName: item.PositionName,
        OrdersID: item.EmployeeID,
        Orders: item.EmployeeName,
        OrdersDepart: item.DeptName,
        PlusEmployeeName: ''
      }
      let p0 = 'UserService_SingleBill'
      let res = await this.$xml(p0, params, {}, true)
      // this.refresh()
      console.log(res)
      this.$store.commit('setHomeRand', Date.now())
      try {
        await this.sendMsg(this.workItem, item)
        this.$toast('转单成功并推送消息')
      } catch (error) {
        this.$toast('转单成功但消息推送失败')
      } finally {
        this.refresh()
      }
    }
    // 消息推送
    // async sendMsg (work, person) {
    //   let state = ''
    //   let title = this.title
    //   let type = 'CustomerService'
    //   switch (work.WorkOrdState) {
    //     case 'WOSta_Sub': state = '待接单'; break
    //     case 'WOSta_Proc': state = '待接单'; break
    //     case 'WOSta_Finish': state = '待接单'; break
    //     case 'WOSta_Visit': state = '待接单'; break
    //   }
    //   let params = {
    //     'ID': work.WorkOrdID,
    //     'Type': type,
    //     'Title': title,
    //     'Content': this.nav.userName + '给您转发一个新的' + state + '工单，请及时处理',
    //     'Tag': person.UserId,
    //     'Status': '1',
    //     'FromTag': ''
    //   }
    //   let p0 = 'AppWeChat_JGWorkPush'
    //   let res = await this.$xml(p0, params)
    //   this.$toast('消息推送成功')
    //   console.log(res)
    // }
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

.customer{
  .iconPhone{
    position: relative;
    top: 4px;
    display: inline-block;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: right;
    margin-right: 5px;
    color:#3395FF;
    font-size: 24px;
  }
  .call{
    position: relative;
    top:  0;
    display: inline-block;
    height: 30px;
    min-width: 50px;
    padding: 0 10px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    background: #3395ff;
    color: #fff;
    border-radius: 3px;
    &::after{
      position: absolute;
      top: 10px;
      right: -5px;
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-right: 10px solid #3395FF;
      border-bottom: 10px solid #3395FF;
      transform:rotate(45deg);
    }
  }
}
</style>
