<template>
    <div class="page">
        <mt-header title="客服工单监控">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div>
          <navbar :list="typeList" v-model="currIndex"></navbar>
          <div class="weui-flex" style="background:#EFEFF4;">
            <div class="weui-flex__item">
               <search v-model="searchKey" placeholder="关键字、工单号或位置" :no-focus="true" @searchRes="searchHandle" @searchCancel="searchHandle"></search>
            </div>
            <div class="padding-h" @click="sheetVisible = true"><i  style="font-size: 23px;line-height: 43px;" class="main_color iconfont icon-shaixuan"></i></div>
          </div>
        </div>
        <component ref="pageList" :params="currConfig.params" :is="currIndex" :config="currConfig" @listDone="listDone" >
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
              <!--hasTransferOrder//不知道怎么来的 item.WorkState==='2' && hasTransferOrder==='true' -->
              <!-- <div class="weui-panel__ft text-right padding-right15 padding-bottom">

                  <button :key="index" v-for="(buttonItem,index) in showButtons(scope.item.WorkOrdState, scope.item.bHandle, scope.item.IsFromSkill)" @click="btnAction(scope.item, buttonItem)"  class="ins_btn ins_btn_plain_default">{{buttonItem}}</button>
              </div> -->
            </div>
          </template>
        </component>
        <mt-actionsheet :actions="actions" cancelText='' v-model="sheetVisible"></mt-actionsheet>
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
import {Actionsheet} from 'mint-ui'
import {mapGetters} from 'Vuex'
import Search from '@/components/search'
import navbar from '@/components/navbar'
import PageList from '@/components/pageList'
export default {
  name: 'monitorCustomer',
  components: {
    MtActionsheet: Actionsheet,
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
      sheetVisible: false,
      currIndex: 'all',
      actions: [],
      search: {
        startTime: '',
        endTime: ''
      },
      searchKey: '',
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
    this.workPosFrom = 'Resource'
    this.nav = {
      orgId: this.user.OrgID || '11091315263400010000',
      orgName: this.user.OrgName,
      userName: this.user.userName,
      positionId: this.user.PositionID,
      memberId: this.user.memberId || '30'
    }
    this.currMember = ''
    this.getStatus()
    this.configList = this.typeList.map(item => {
      return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15})
    })
    console.log(this.configList, 'configList')
    // 设置底部弹出按钮方法
    this.setActions()
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
    setActions () {
      this.actions = [
        {
          name: '全部工单',
          method: (arg) => {
            this.currMember = ''
            this.currConfig.params.employeeId = this.currMember
            this.configList = this.typeList.map(item => {
              return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15, employeeId: this.currMember})
            })
            this.refresh()
          }
        },
        {
          name: '我的发布',
          method: (arg) => {
            this.currMember = this.nav.memberId
            this.currConfig.params.employeeId = this.currMember
            this.configList = this.typeList.map(item => {
              return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15, employeeId: this.currMember})
            })
            this.refresh()
          }
        }
      ]
    },
    // 刷新当前列表页
    refresh () {
      this.getStatus()
      this.$refs.pageList.refresh()
    },
    searchHandle () {
      this.currConfig.params.workPos = this.searchKey
      this.configList = this.typeList.map(item => {
        return this.createListConfig(item.id, {eventStateId: item.state, pageSize: 15, workPos: this.searchKey})
      })
      this.refresh()
    },
    routeTo (item) {
      console.log(item)
      this.workItem = item
      this.$router.push({path: this.$route.path + '/detail', query: {monitor: true}})
    },
    listDone () {
      this.$previewRefresh()
    },
    createListConfig (name, params) {
      let ip = this.$store.getters.ip
      return {
        name: name,
        url: '/ets/syswin/smd/userCSGetWorkOrdSyswinH5',
        params: {
          projectId: this.nav.orgId,
          employeeId: this.currMember,
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
      // let url = '/ets/syswin/smd/userCSGetWorkOrdCountInfoH5'
      // let res = await this.$http.post(url, {
      //   projectId: this.nav.orgId,
      //   employeeId: this.currMember,
      //   workPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
      //   positionID: this.nav.positionId
      // })

      let p0 = 'UserCS_GetWorkOrdCountInfoH5'
      let res = await this.$xml(p0, {
        projectID: this.nav.orgId,
        EmployeeID: this.currMember,
        WorkPosFrom: this.workPosFrom, // （Equipment设备（维修）、Resource资源(客服)
        PositionID: this.nav.positionId
      })
      // let data = this.$toLower(res.data)
      console.log(res.data)
      this.list = res.data
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
    btnAction (item, btnName) {
      this.workItem = item
      switch (btnName) {
        case '抢单': this.routeTakeOrder(item); break
        case '接单': this.routeTakeOrder(item); break
        case '转单': this.covertOrder(item); break
        case '反馈': this.routeFeedback(item); break
        case '材料申请': this.routeMaterial(item); break
        case '完成回访': this.routeVisit(item); break
        case '回访详情': this.routeVisitDetail(item); break
        case '关闭工单': this.closeOrder(item); break
      }
    },
    // 抢单
    // 接单
    routeTakeOrder (obj) {
      this.$router.push({path: this.$route.path + '/takeOrder'})
    },
    // 转单
    covertOrder (obj) {
      this.$router.push({path: this.$route.path + '/personSelector'})
    },
    // 反馈
    routeFeedback (obj) {
      this.$router.push({path: this.$route.path + '/feedback'})
    },
    // 材料申请
    routeMaterial (obj) {
      this.$router.push({path: this.$route.path + '/material'})
    },
    // 完成回访
    routeVisit (obj) {
      this.$router.push({path: this.$route.path + '/visit'})
    },
    // 回访详情
    routeVisitDetail (obj) {
      this.$router.push({path: this.$route.path + '/visitDetail'})
    },
    // 关闭工单
    async closeOrder (obj) {
      await this.$message.confirm('确认关闭此客服工单？')
      // let url = '/ets/syswin/smd/userServiceVisitManClose'
      // let res = await this.$http.post(url, {
      //   userName: this.nav.userName,
      //   orderId: obj.WorkOrdID,
      //   closeDate: new Date().format('yyyy-MM-dd hh:mm:ss')
      // })
      let p0 = 'UserService_VisitManClose'
      let res = await this.$xml(p0, {
        UserName: this.nav.userName,
        OrderId: obj.WorkOrdID,
        CloseDate: new Date().format('yyyy-MM-dd hh:mm:ss')
      })
      this.refresh()
      this.$toast('工单关闭成功')
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
