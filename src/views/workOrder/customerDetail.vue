<template>
  <div class="page_modal">
    <div class="page">
      <nav-title :title="title"></nav-title>
      <div class="page_bd">

        <div class="cus_bg padding-v padding15-h margin-bottom" >
          <p><i style="font-size:30px;vertical-align: middle;" class="iconfont padding-right" :class="orderStateObj.fontClass"></i><span class="fs16">{{orderStateObj.text}}</span></p>
        </div>

        <div class="weui-media-box weui-media-box_small-appmsg">
          <div class="weui-cells" @click="routeTracking">
            <a class="weui-cell weui-cell_access" href="javascript:;">
              <div class="weui-cell__hd padding-right">
                <i class="iconfont icon-yonghu-copy"></i>
              </div>
              <div class="weui-cell__bd weui-cell_primary main_color">
                <p class="fs15">{{trackStr}}</p>
                <p class="weui-media-box__desc">{{newTracks.workOrdTime }}</p>
              </div>
              <span class="weui-cell__ft"></span>
            </a>
          </div>
        </div>
        <div  class="light_bg padding-v padding15-h margin-bottom">
          <p><span class="dark_99 width60">位  置：</span><span>{{detail.WorkPos}}</span></p>
          <p><span class="dark_99 width60">联系人：</span><span>{{detail.RSPeoName}}</span>
          <a class="float_right" :href="'tel:'+detail.CallPhone">拨打电话</a></p>
        </div>
        <div class="weui-panel weui-panel_access padding-bottom  margin-bottom">
          <div class="weui-panel__hd"><i class="iconfont icon-building-automation padding-right"></i>{{nav.orgName}}</div>
          <div class="weui-panel__bd padding15-h ">
            <h3 style="line-height: 1.5;font-size: .3rem;">{{detail.QuesDesc}}</h3>
            <!-- 图片 -->
            <div class="img_list_wrap">
              <ul class="clearfix">
                <li class="img_wrap" v-for="(item,index) in detail.ImageList" :key="index">
                  <img preview="1" :src="item.Path">
                </li>
              </ul>
            </div>

            <!-- 语音  -->
            <div  v-if="detail.Voice"  class="padding-bottom">
              <div @click="showVoice" class="voice_wrap ">
                <voice-icon :isVoice.sync="isVoice" :length="detail.Memo" :url="detail.Voice"  ></voice-icon>
              </div>
            </div>

            <p class="date dark_99"><span class="width74">报事时间：</span>{{ detail.RSDate }}</p>
            <p class="date dark_99"><span class="width74">预约时间：</span>{{ (!detail.RStartTime || detail.RStartTime.indexOf('1900')> -1)? '无': detail.RStartTime }}</p>
            <p class="dark_99">{{ detail.WONoBasicName }}</p>
            <!-- 反馈 -->
            <div v-if="feedbackList && feedbackList.length>0" class="feedback_wrap">
              <div class="feed_item " v-for="(item,index) in feedbackList" :key="index">
                {{'处理反馈' + (index + 1) + '：' + item.ProcessDetaile }}
                <p class="cost">人工费:<span class="error_color">{{ '￥' + item.LabourCost }}</span> </p>
                <p class="cost">材料费:<span class="error_color">{{ '￥' + item.MaterialCostSum }}</span></p>
                <!-- {{item}} -->
                <div  v-if="item.Voice"  class="padding-bottom">
                  <div @click="showItemVoice(item)" class="voice_wrap ">
                    <voice-icon :isVoice.sync="item.isVoice" :length="item.Memo" :url="item.Voice"  ></voice-icon>
                  </div>
                </div>
                <!-- 图片 -->
                <div class="img_list_wrap no-padding">
                  <ul class="clearfix">
                    <li v-show="sub.Path !== ''" class="img_wrap" v-for="(sub,index) in item.ImageList" :key="index" style="width:40px;height:40px;">
                      <img preview="2" :src="sub.Path">
                    </li>
                  </ul>
                </div>
                <p class="fs12 dark_99"><span>{{ item.ResponsibleName }}</span><span>{{ item.EndTime }}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div  class="light_bg padding-v padding15-h margin-bottom">
          <p v-for="(item,index) in timeList" :key="index"><span class="dark_99 width74">{{item.Name}}：</span><span>{{item.Content}}</span></p>
        </div>
      </div>
      <template v-if="!monitor">
        <div v-if="detail.WorkOrdState === 'WOSta_Close'" class="page_ft light_bg weui-flex" >
          <div class="fs16 padding-left15" style="line-height:42px;">已评价</div>
          <div class="weui-flex__item padding-top5"><star v-model="score" :readonly="true"></star></div>
        </div>
        <div v-else class="page_ft light_bg text-right padding-right15 padding-top5 _bt">
          <button :key="index" v-for="(buttonItem,index) in buttons" @click="btnAction(work, buttonItem)"  class="ins_btn ins_btn_plain_default">{{buttonItem}}</button>
        </div>
      </template>
      <transition name="page">
        <router-view/>
      </transition>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import voiceIcon from '@/components/voiceIcon'
import customerMixin from './customerMixin'
import Star from './child/star'
import navTitle from '@/components/navTitle'
export default {
  name: 'inspectionDetail',
  mixins: [customerMixin],
  components: {
    navTitle,
    voiceIcon,
    Star
  },
  data () {
    return {
      score: 5,
      title: '',
      work: {},
      list: [],
      detail: {},
      timeList: [],
      newTracks: {},
      tracks: [],
      isVoice: false,
      workItem: {},
      feedbackList: [],
      monitor: false
      // showButtons: function () {}
    }
  },
  created () {
    console.log(this.$route.params, 'this.$route.params')
    // 从原生来的数据
    this.isTransferBtn = this.auth['APP_Service_SwitchSingle'] // 是否显示转单按钮
    this.isMaterial = this.auth['APP_Service_Picking'] // 材料申请权限
    this.monitor = this.$route.query.monitor || false
    let taskId = this.$route.params.taskId
    if (!this.$parent.workItem || (this.$parent.workItem && !this.$parent.workItem.WorkOrdID)) {
      this.nav = {
        orgId: this.user.OrgID,
        orgName: this.user.OrgName,
        userName: this.user.UserID,
        positionId: this.user.PositionID,
        memberId: this.user.memberId,
        memberName: this.user.memberName,
        positionName: this.user.PositionName,
        workPosFrom: ''
      }
      this.notice(taskId).then(res => {
        this.work = this.workItem = res
        this.nav.workPosFrom = this.workPosFrom = this.workItem.WorkPosFrom
        if (this.nav.workPosFrom === 'Resource') {
          this.title = '客服详情'
        } else {
          this.title = '维修详情'
        }
        this.init()
      })
    } else {
      this.workPosFrom = this.$route.params.workPosFrom || this.$route.query.workPosFrom
      if (this.workPosFrom === 'Resource') {
        this.title = '客服详情'
      } else {
        this.title = '维修详情'
      }
      this.nav = this.$parent.nav
      this.work = this.workItem = this.$parent.workItem
      this.init()
    }
  },
  computed: {
    ...mapGetters({
      'auth': 'auth',
      'user': 'user'
    }),
    trackStr () {
      if (!this.newTracks.track) return ''
      let obj = this.newTracks.track
      let {Name: name, FeedState: feedstate} = obj
      let res = ''
      switch (obj.WorkOrdType) {
        case '101': res = name + '提交了报事，等待服务响应'; break
        case '102': res = name + '完成了接单'; break
        case '103': res = name + '反馈了工单，状态:' + feedstate; break
        case '104': res = name + '填写了材料消耗'; break
        case '105': res = name + '完成了回访，状态:' + feedstate; break
        case '106': res = name + '关闭了工单，服务成功'; break
        case '107': res = '当前待处理人：' + name; break
      }
      return res
    },
    orderStateObj () {
      let obj = {}
      if (!this.detail.WorkOrdState) return obj
      switch (this.detail.WorkOrdState) {
        case 'WOSta_Sub': obj = {text: '新服务需求', fontClass: 'icon-xuqiu-hui'}; break
        case 'WOSta_Proc': obj = {text: '工单处理中，待完成', fontClass: 'icon-daichuli'}; break
        case 'WOSta_Finish': obj = {text: '已完成处理，待回访', fontClass: 'icon-huifangguanli'}; break
        case 'WOSta_Visit': obj = {text: '工单已回访，待关闭', fontClass: 'icon-daishenhe'}; break
        case 'WOSta_Close':obj = {text: '完成', fontClass: 'icon-wanchengdu'}; break
      }
      return obj
    },
    buttons () {
      let workOrderState = this.detail.WorkOrdState
      let bHandle = this.work.bHandle
      let isFromSkill = this.work.IsFromSkill
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
    }
  },
  methods: {
    init () {
      this.getPageData()
      this.getWorkTime()
      this.getTracking()
      this.getFeedback()
    },
    reload () {
      this.init()
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
    setScore (totalScore) {
      switch (parseInt(totalScore)) {
        case 0 : this.score = 0; break
        case 10 : this.score = 1; break
        case 30 : this.score = 2; break
        case 70 : this.score = 3; break
        case 80 : this.score = 4; break
        case 90 :
        case 100: this.score = 5; break
      }
    },
    async getPageData () {
      // UserCS_GetWorkOrdDetailSyswinH5
      let p0 = 'UserCS_GetWorkOrdDetailSyswinH5'
      let res = await this.$xml(p0, {
        WorkOrdID: this.work.WorkOrdID,
        OrgID: this.nav.orgId,
        EmployeeID: this.nav.userName,
        PositionID: this.work.nativeDict
      })

      // let url = '/ets/syswin/smd/userCSGetWorkOrdDetailSyswinH5'
      // let res = await this.$http.post(url, {
      //   workOrdID: this.work.WorkOrdID,
      //   orgid: this.nav.orgId,
      //   employeeid: this.nav.userName,
      //   nativeDict: this.work.nativeDict
      // })
      if (res.data && res.data[0]) {
        let ip = this.$store.getters.ip
        let detail = res.data[0]
        this.setScore(detail.TotalScore)
        if (detail.Voice && ip) {
          detail.Voice = 'http://' + ip + detail.Voice
        }
        detail.ImageList.map(item => {
          if (ip) {
            item.Path = 'http://' + ip + item.Path
          }
          return item
        })
        this.detail = detail
        this.$previewRefresh()
      }
      console.log(res)
    },
    // 工单进度查询
    async getTracking () {
      // UserCS_GetWorkSchedule
      let p0 = 'UserCS_GetWorkSchedule'
      let res = await this.$xml(p0, {
        WorkID: this.work.WorkOrdID
      })
      // let url = '/ets/syswin/list/userCSGetWorkSchedule'
      // let res = await this.$http.post(url, {
      //   workId: this.work.WorkOrdID
      // })
      // console.log(res, 'getTracking')
      if (res.data[0]) {
        this.tracks = res.data
        this.newTracks = {
          workOrdTime: res.data[0].WorkOrdTime,
          track: res.data[0]
        }
      }
    },
    // 请求工单状态时间列表
    async getWorkTime () {
      // UserCS_GetWorkTimneScheduleH5
      let p0 = 'UserCS_GetWorkTimneScheduleH5'
      let res = await this.$xml(p0, {
        WorkID: this.work.WorkOrdID
      })
      // let url = '/ets/syswin/smd/userCSGetWorkTimneScheduleH5'
      // let res = await this.$http.post(url, {
      //   workID: this.work.WorkOrdID
      // })
      this.timeList = res.data
      console.log(res)
    },
    // 请求客服工单进度反馈详情
    async getFeedback () {
      // UserCS_GetWorkFeedBackInfoH5
      let p0 = 'UserCS_GetWorkFeedBackInfoH5'
      let res = await this.$xml(p0, {
        OrgID: this.nav.orgId,
        WordQuertionID: this.work.WorkQuestionID
      })
      // let url = '/ets/syswin/smd/userCSGetWorkFeedBackInfoH5'
      // let res = await this.$http.post(url, {
      //   orgid: this.nav.orgId,
      //   wordQuertionID: this.work.WorkQuestionID
      // })
      if (res.data && res.data[0]) {
        let ip = this.$store.getters.ip // || '172.31.118.205:8066'
        res.data.forEach(arr => {
          arr.isVoice = false
          arr.ImageList.forEach(a => {
            if (ip && a.Path) {
              a.Path = 'http://' + ip + a.Path
            }
          })
        })
        this.feedbackList = res.data
        // this.feedbackList = res.data.map(item => {
        //   if (ip) {
        //     item.Path = 'http://' + ip + item.Path
        //   }
        //   return item
        // })
      }
      this.$previewRefresh()
    },
    routeTracking () {
      this.$router.push({path: this.$route.path + '/customerTracking'})
    },
    async closeOrder (item) {
      await this.$message.confirm('确认关闭此' + this.title + '？')
      let p0 = 'UserService_VisitManClose'
      let res = await this.$xml(p0, {}, {
        p1: this.nav.userName,
        p2: item.WorkOrdID,
        p3: new Date().format('yyyy-MM-dd hh:mm:ss')
      })
      this.$parent && this.$parent.refresh()
      this.$toast('工单关闭成功')
      this.$store.commit('setHomeRand', Date.now())
      console.log(res)
      // await this.$parent.closeOrder(item)
      this.init()
    },
    // setPerson (item) {
    //   this.$parent.setPerson(item)
    //   this.$root.back()
    // },
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
      let res = await this.$xml(p0, params)
      console.log(res)
      this.$parent.refresh && this.$parent.refresh()
      this.$root.back()
      this.$store.commit('setHomeRand', Date.now())
      try {
        await this.sendMsg(this.workItem, item)
        this.$toast('转单成功并推送消息')
      } catch (error) {
        this.$toast('转单成功但消息推送失败')
      }
    },
    showItemVoice (item) {
      item.isVoice = !item.isVoice
    },
    showVoice () {
      this.isVoice = !this.isVoice
    }
  }
}
</script>

<style lang="scss">
.cus_bg{
  height:80px;
  line-height:60px;
  background:#3395FF;
  color:#FFF;
}
.img_list_wrap {
  padding:5px 0;
}
.img_list_wrap .img_wrap{
  float:left;
  width:65px;
  height:65px;
  margin-right: 10px;
  margin-bottom: 5px;
}
.img_list_wrap .img_wrap img{
  max-width:100%;
}
.voice_wrap {
  width: 90px;
  height: 34px;
  background: #3395FF;
  border-radius: 5px;
  position:relative;
  margin-left:10px;
  &:before {
    content: "";
    position: absolute;
    left:-10px;
    top:9px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 10px solid #3395FF;
  }
}

.feedback_wrap {
  background:#ececec;
  border-radius:5px;
  padding:10px;
  & .feed_item + .feed_item {
    padding-top:10px;
  }
}
.width60{
  display: inline-block;
  width: 60px;
}
.width74{
  display: inline-block;
  width: 74px;
}
</style>
