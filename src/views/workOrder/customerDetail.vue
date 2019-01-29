<template>
  <div class="page_modal">
    <div class="page">
        <mt-header title="巡检详情">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
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
            <p><span class="dark_99">位  置：</span><span>{{detail.WorkPos}}</span></p>
            <p><span class="dark_99">联系人：</span><span>{{detail.RSPeoName}}</span>
            <a class="float_right" :href="'tel:'+detail.CallPhone">拨打电话</a></p>
          </div>
          <div class="weui-panel weui-panel_access padding-bottom  margin-bottom">
            <div class="weui-panel__hd"><i class="iconfont icon-building-automation padding-right"></i>{{nav.orgName}}</div>
            <div class="weui-panel__bd padding15-h ">
              <h3 class="fs16">{{detail.QuesDesc}}</h3>
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
                  <voice-icon :isVoice.sync="isVoice" :url="detail.Voice"  ></voice-icon>
                </div>
              </div>

              <p class="date dark_99">报事时间：{{ detail.RSDate }}</p>
              <p class="date dark_99">预约时间：{{ (!detail.RStartTime || detail.RStartTime.indexOf('1900')> -1)? '无': detail.RStartTime }}</p>
              <p class="dark_99">{{ detail.WONoBasicName }}</p>
              <!-- 反馈 -->
              <div v-if="feedbackList && feedbackList.length>0" class="feedback_wrap">
                <div class="feed_item " v-for="(item,index) in feedbackList" :key="index">
                  {{'处理反馈' + (index + 1) + '：' + item.ProcessDetaile }}
                  <p class="cost">人工费:<span class="error_color">{{ '￥' + item.LabourCost }}</span> </p>
                  <p class="cost">材料费:<span class="error_color">{{ '￥' + item.MaterialCostSum }}</span></p>
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
            <p v-for="(item,index) in timeList" :key="index"><span class="dark_99">{{item.Name}}：</span><span>{{item.Content}}</span></p>
          </div>

        </div>
        <transition name="page">
          <router-view/>
        </transition>
    </div>
  </div>
</template>
<script>
import voiceIcon from '@/components/voiceIcon'
export default {
  name: 'inspectionDetail',
  components: {
    voiceIcon
  },
  data () {
    return {
      work: {},
      list: [],
      detail: {},
      timeList: [],
      newTracks: {},
      tracks: [],
      isVoice: false,
      feedbackList: []
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.getPageData()
    this.getWorkTime()
    this.getTracking()
    this.getFeedback()
  },
  computed: {
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
    }
  },
  methods: {
    async getPageData () {
      let url = '/ets/syswin/smd/userCSGetWorkOrdDetailSyswinH5'
      let res = await this.$http.post(url, {
        workOrdID: this.work.WorkOrdID,
        orgid: this.nav.orgId,
        employeeid: this.nav.userName,
        nativeDict: this.work.nativeDict
      })
      this.detail = res.data[0]
      this.$previewRefresh()
      console.log(res)
    },
    // 工单进度查询
    async getTracking () {
      let url = '/ets/syswin/list/userCSGetWorkSchedule'
      let res = await this.$http.post(url, {
        workId: this.work.WorkOrdID
      })
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
      let url = '/ets/syswin/smd/userCSGetWorkTimneScheduleH5'
      let res = await this.$http.post(url, {
        workID: this.work.WorkOrdID
      })
      this.timeList = res.data
      console.log(res)
    },
    // 请求客服工单进度反馈详情
    async getFeedback () {
      let url = '/ets/syswin/smd/userCSGetWorkFeedBackInfoH5'
      let res = await this.$http.post(url, {
        orgid: this.nav.orgId,
        wordQuertionID: this.work.WorkQuestionID
      })
      this.feedbackList = res.data
      this.$previewRefresh()
    },
    routeTracking () {
      this.$router.push({path: this.$route.path + '/customerTracking'})
    },
    // 最新服务跟踪
    newTrack () {

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
</style>
