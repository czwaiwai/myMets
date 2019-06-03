<template>
<div class="page">
  <div class="page_hd">
    <!-- <nav-title :title="user && user.OrgName" :hasBtn="hasBtn"></nav-title> -->
  </div>
  <div class="page_bd main_page">
    <div class="title_gb">
      <p class="orgInfo">
        <span  @click="$router.forward('/changeProject')">{{user.OrgName}}</span>
        <i class="iconfont icon-open-close-selected classblue"  @click="$router.forward('/changeProject')" style="font-size: 33px;font-size:#fff"></i>
      </p>
      <!-- <span class="title">亚洲的希望  产业的未来</span> -->
    </div>
    <div class="title_context">
      <div class="weui-grids">
        <a v-for="(item,index) in getIconList" :key="item.displayName"  :index="index" @click="iconClick(item)"  href="javascript:;" class="weui-grid light_bg">
           <div class="weui-grid__icon " :class="item.iconType==='icon' && item.auth!=='APP_DiKuai' ?' text-center':''"
            :style="item.auth==='APP_DiKuai'?'font-size: 26px;line-height: 40px;text-align: center;color: orange;':''">
             <i v-if="item.iconType==='icon'" :class="'iconfont '+item.iconName" :style="item.iconStyle===''?'':item.iconStyle"></i>
             <div v-else style="margin: 0 auto;width: 35px;height: 35px;">
                <img :src="item.iconName" alt="">
             </div>
          </div>
          <p class="weui-grid__label">{{item.displayName}}</p>
          <span v-if="item.auth==='APP_jumpOffline' && offBadge" class="weui-badge" >{{offBadge > 99 ?'99': offBadge}}</span>
        </a>
      </div>
      <div v-show="isDisplay" @click="isDisplay=false" style="text-align: center;color:#A9A8A8;font-size:15px;"><span>收起全部</span></div>
    </div>
    <div class="notice" v-if="auth['APP_NoticeInformation']"
      @click="$app.loadView({url: getSingleDynamicLink('公告咨讯'), type: 'chaobiao', isTitle: '公告咨讯'})">
      <div class="left_title">
         <div class="weui-grid__icon">
            <i class="iconfont icon-gonggaozixun classorange"></i>
          </div>
      </div>
      <div class='right_context'>
        <ul class="marquee_list" :class="{marquee_top:animate}">
          <li v-for="(item,index) in noticeList" :key="index">{{item.rotationName}}</li>
        </ul>
        <!-- <swipe :auto="2000"  :show-indicators="false">
          <swipe-item  v-for="(item,index) in GetNoticeRollList"  :key="index">
            <div v-for="(notice,indexN) in item"  :key="indexN"><span>{{notice.rotationName}}</span></div>
          </swipe-item>
        </swipe> -->
        <!-- <div><span>广东家居设计谷进驻亚洲国际!</span></div>
        <div><span>欢迎进驻到亚洲国际市场,商家永无后顾之忧!</span></div> -->
      </div>
    </div>
    <div class="scene_manage" v-if="auth['APP_MarketCooperation'] &&(auth['APP_Inspection'] || twoOtherList.length>0)">
      <div><span class="title">现场管理</span></div>
      <div class="weui-grids">
        <a v-show="auth['APP_Inspection']" @click="$router.forward('/workOrder/inspection/Inspection')" href="javascript:;" class="weui-grid light_bg">
           <div class="weui-grid__icon text-center">
            <i class="iconfont icon-xunjian1 classgreen" style="font-size: 45px;"></i>
            <!-- <img src="../assets/img/work/icon_work_inspection.png"  alt=""> -->
          </div>
          <p class="weui-grid__label">设备巡检</p>
          <!-- <p class="weui-grid__context">设备日常巡检</p> -->
        </a>

        <a v-for="(item, index) in twoOtherList" :key="index"  @click="$app.loadView({url: item.h5Url, type: 'chaobiao', isTitle: item.appName})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <div style="margin: 0 auto;width: 45px;height: 45px;">
              <img :src="item.h5Icon" alt="">
            </div>
          </div>
          <p class="weui-grid__label">{{item.appName}}</p>
        </a>
        <!-- <a v-show="auth['APP_Maintain']" @click="$router.forward('/workOrder/inspection/KeepFit')" href="javascript:;" class="weui-grid light_bg">
         <div class="weui-grid__icon text-center">
            <i class="iconfont icon-baoyang classblue" style="font-size: 55px;"></i>
          </div>
          <p class="weui-grid__label">设备保养</p>
          <p class="weui-grid__context">设备日常保养</p>
        </a>
        <a v-show="auth['APP_Inspection']" @click="$router.forward('/workOrder/inspection/Inspection')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <div style="margin: 0 auto;width: 45px;height: 45px;">
              <img src="../assets/img/work/icon_work_inspection.png"  alt="">
            </div>
          </div>
          <p class="weui-grid__label">安防巡更</p>
          <p class="weui-grid__context">安全日常巡检</p>
        </a> -->
      </div>
    </div>
    <div class="introduce" v-show="auth['APP_AboutUs']">
      <div class="weui-grids">
        <div class="weui-grid light_bg" @click="$app.loadView({url: getSingleDynamicLink('业务介绍'), type: 'chaobiao', isTitle: '业务介绍'})">
          <div class="title">
            <p class="weui-grid__label title_p">业务介绍</p>
            <p class="weui-grid__context title_c">产品方案介绍</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_introduction.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg" @click="$app.loadView({url: getSingleDynamicLink('市场合作'), type: 'chaobiao', isTitle: '市场合作'})">
          <div class="title">
            <p class="weui-grid__label title_p">市场合作</p>
            <p class="weui-grid__context title_c">合作伙伴计划</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_workmc.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg" @click="$app.loadView({url: getSingleDynamicLink('入园指南'), type: 'chaobiao', isTitle: '入园指南'})">
          <div class="title">
            <p class="weui-grid__label title_p">入园指南</p>
            <p class="weui-grid__context title_c">入园流程指引</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_guide.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg" @click="$app.loadView({url: getSingleDynamicLink('关于我们'), type: 'chaobiao', isTitle: '关于我们'})">
          <div class="title">
            <p class="weui-grid__label title_p">关于我们</p>
            <p class="weui-grid__context title_c">企业文化概况</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_about.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
import { Swipe, SwipeItem } from 'mint-ui'
// import CryptoJS from 'crypto-js'
export default {
  name: 'tabWork',
  components: {Swipe, SwipeItem},
  data () {
    return {
      hasBtn: false,
      animate: false,
      timer: 0,
      offBadge: 0,
      currRand: 0,
      otherList: [],
      groupList: [], // 所有显示的APP
      appDynamicLink: [], // APP动态链接地址
      noticeList: [], // 公告信息{rotationName: '1111'}, {rotationName: '222'}, {rotationName: '333'}, {rotationName: '4444'}, {rotationName: '555'}
      noticeRollIndexId: [0, 1], // 滚动信息索引值
      isDiKuai: false, // 地块统计是否显示（包括某一报表权限）
      isDisplay: false // 是否显示全部
    }
  },
  created () {
    // this.$store.dispatch('getUserAction').then(res => {
    //   console.log(res, '--------------getUserAction')
    // })
    // setTimeout(() => {
    //   // 执行window
    //   console.log('执行tabwork方法')
    //   window.APP_pushMsg('{"fromTag":"","id":"20190220092648764888","status":"1","type":"CustomerService","url":""}')
    // }, 5000)
    this.isDiKuai = this.auth['APP_Rectification']
    this.getReportRight()
    this.getNoticeInfo()
    this.getAppDynamicLink()
    this.initIconList()
    if (this.auth['APP_Quality']) {
      this.getPageData()
    }
    this.timer = setInterval(this.showMarquee, 2000)
  },
  activated () {
    this.getReportRight()
    this.getAppDynamicLink()
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      if (this.auth['APP_Quality']) {
        this.getPageData()
      } else {
        this.initIconList()
      }
      this.getNoticeInfo()
      this.currRand = this.rand
    } else {
      this.currRand = this.rand
    }
    this.offlineBadge()
    // clearInterval(this.timer)
    // this.timer = setInterval(this.getRollNotice, 10000)
  },
  deactivated () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'auth': 'auth',
      'rand': 'rand'
    }),
    getIconList () {
      let iconList = []
      if (this.isDisplay) {
        iconList = this.groupList
      } else {
        if (this.groupList.length > 8) {
          iconList = this.getIconMin()
        } else {
          iconList = this.groupList
        }
      }
      console.log('iconList', iconList)
      return iconList
    },
    twoOtherList () {
      return this.otherList.filter((ele, index) => { return index < 2 })
    },
    GetNoticeRollList () {
      let noticeRollList = []
      // this.noticeRollIndexId.forEach(ele => {
      //   // console.log('GetNoticeRollList', ele)
      //   if (this.noticeList && this.noticeList[ele]) {
      //     noticeRollList.push(this.noticeList[ele])
      //   }
      // })
      let noticeitem = []
      this.noticeList.forEach((ele, index) => {
        if (index % 2 === 0) {
          noticeitem = []
          noticeitem.push(ele)
        } else {
          noticeitem.push(ele)
          noticeRollList.push(noticeitem)
          noticeitem = []
        }
      })
      if (noticeitem) {
        noticeRollList.push(noticeitem)
      }
      console.log('noticeRollList', noticeRollList)
      return noticeRollList
    }
    // filterList () {
    //   let list = this.orglist
    //   return list
    // }
  },
  methods: {
    showMarquee: function () {
      this.animate = true
      setTimeout(() => {
        this.noticeList.push(this.noticeList[0])
        this.noticeList.shift()
        this.animate = false
      }, 500)
    },
    getRollNotice () {
      let maxIndexId = -1
      if (this.noticeRollIndexId && this.noticeRollIndexId.length > 0) {
        maxIndexId = this.noticeRollIndexId[this.noticeRollIndexId.length - 1]
      }
      maxIndexId++
      if (maxIndexId >= this.noticeList.length) {
        maxIndexId = 0
      }
      this.noticeRollIndexId = []
      this.noticeRollIndexId.push(maxIndexId)
      maxIndexId++
      if (maxIndexId === this.noticeList.length) {
        maxIndexId = 0
      }
      this.noticeRollIndexId.push(maxIndexId)
      // console.log('this.noticeRollIndexId', this.noticeRollIndexId)
    },
    getSingleDynamicLink (itemName) {
      // console.log('this.appDynamicLink', this.appDynamicLink)
      let url = this.appDynamicLink.filter(ele => { return ele.Names === itemName })
      if (url && url.length > 0) {
        let link = url[0].ShowLink
        if (link.indexOf('?') > -1) {
          return link + '&time=' + (new Date().valueOf())
        } else {
          return link + '?time=' + (new Date().valueOf())
        }
      }
      return ''
    },
    getIconMin () {
      let iconList = this.groupList.filter((ele, index) => { return index < 7 })
      iconList.push({'auth': 'APP_DisplayAll',
        'iconName': 'icon-quanbu classgray',
        'iconType': 'icon',
        'iconStyle': 'font-size: 28px;color:#C0D8F1',
        'openType': 'clickEventJump',
        'pathParams': {url: '', type: '', isTitle: ''},
        'displayName': '全部'})
      return iconList
    },
    initIconList () {
      let url = ''
      this.groupList = []
      if (this.auth['APP_GovernmentService']) {
        url = this.getSingleDynamicLink('政务服务')
        this.addGroup({'auth': 'APP_GovernmentService',
          'iconName': 'icon-jiguanzhengwu classblue',
          'iconType': 'icon',
          'iconStyle': 'font-size: 32px;',
          'openType': 'loadView',
          'pathParams': {url: url, type: 'chaobiao', isTitle: '政务服务'},
          'displayName': '政务服务'})
      }
      if (this.auth['APP_FinancePay']) {
        this.addGroup({'auth': 'APP_FinancePay',
          'iconName': 'icon-wuyefei classgreen',
          'iconType': 'icon',
          'iconStyle': '',
          'openType': 'routerJump',
          'pathParams': {url: '/getCash', type: '', isTitle: ''},
          'displayName': '物业缴费'})
      }
      if (this.auth['APP_LifeMatch']) {
        url = this.getSingleDynamicLink('生活配套')
        this.addGroup({'auth': 'APP_LifeMatch',
          'iconName': 'icon-ffcx classorange',
          'iconType': 'icon',
          'iconStyle': '',
          'openType': 'loadView',
          'pathParams': {url: url, type: 'chaobiao', isTitle: '生活配套'},
          'displayName': '生活配套'})
      }
      if (this.auth['ETS_APPAudit']) {
        this.addGroup({'auth': 'ETS_APPAudit',
          'iconName': 'icon-shenpi classred',
          'iconType': 'icon',
          'iconStyle': 'font-size: 33px;',
          'openType': 'routerJump',
          'pathParams': {url: '/approvalIndex', type: '', isTitle: ''},
          'displayName': '移动审批'})
      }
      if (this.auth['APP_Service_PostIt']) {
        this.addGroup({'auth': 'APP_Service_PostIt',
          'iconName': 'icon-woyaobaoshi classblue',
          'iconType': 'icon',
          'iconStyle': '',
          'openType': 'routerJump',
          'pathParams': {url: '/customerService?type=baoshi', type: '', isTitle: ''},
          'displayName': '客户报事'})
      }
      if (this.auth['APP_Lease']) {
        this.addGroup({'auth': 'APP_Lease',
          'iconName': 'icon-zu classred',
          'iconType': 'icon',
          'iconStyle': 'font-size: 25px;',
          'openType': 'routerJump',
          'pathParams': {url: '/rentIndex', type: '', isTitle: ''},
          'displayName': '招商租赁'})
      }
      if (this.auth['APP_Meeting']) {
        this.addGroup({'auth': 'APP_Meeting',
          'iconName': 'icon-meeting1 classred',
          'iconType': 'icon',
          'iconStyle': 'font-size: 29px;',
          'openType': 'routerJump',
          'pathParams': {url: '/meeting', type: '', isTitle: ''},
          'displayName': '会议预订'})
      }
      if (this.auth['APP_MeterRead'] || this.auth['APP_Inspection'] || this.auth['APP_Maintain']) {
        this.addGroup({'auth': 'APP_jumpOffline',
          'iconName': 'icon-lixianzhongxin classgreen',
          'iconType': 'icon',
          'iconStyle': 'font-size: 45px;',
          'openType': 'clickEventJump',
          'pathParams': {url: '', type: '', isTitle: ''},
          'displayName': '离线中心'})
      }
      // 品质接口
      this.otherList.forEach(item => {
        this.addGroup({'auth': 'APP_' + item.appName,
          'iconName': item.h5Icon,
          'iconType': 'img',
          'iconStyle': '',
          'openType': 'loadView',
          'pathParams': {url: item.h5Url, type: 'chaobiao', isTitle: item.appName},
          'displayName': item.appName})
      })
      if (this.auth['APP_Maintain']) {
        this.addGroup({'auth': 'APP_Maintain',
          'iconName': 'icon-baoyang classblue',
          'iconType': 'icon',
          'iconStyle': '',
          'openType': 'routerJump',
          'pathParams': {url: '/workOrder/inspection/KeepFit', type: '', isTitle: ''},
          'displayName': '设备保养'})
      }
      if (this.auth['APP_Inspection']) {
        this.addGroup({'auth': 'APP_Inspection',
          'iconName': 'icon-xunjian1 classgreen',
          'iconType': 'icon',
          'iconStyle': 'font-size: 33px;',
          'openType': 'routerJump',
          'pathParams': {url: '/workOrder/inspection/Inspection', type: '', isTitle: ''},
          'displayName': '设备巡检'})
      }
      if (this.auth['APP_Service_Repair']) {
        this.addGroup({'auth': 'APP_Service_Repair',
          'iconName': 'icon-weixiu classorange',
          'iconType': 'icon',
          'iconStyle': 'font-size: 33px;',
          'openType': 'routerJump',
          'pathParams': {url: '/customerService?type=baoxiu', type: '', isTitle: ''},
          'displayName': '设备维修'})
      }
      if (this.auth['APP_MeterRead']) {
        this.addGroup({'auth': 'APP_MeterRead',
          'iconName': 'icon-chaobiao classblue',
          'iconType': 'icon',
          'iconStyle': 'font-size: 33px;',
          'openType': 'routerJump',
          'pathParams': {url: '/meterLocation', type: '', isTitle: ''},
          'displayName': '移动抄表'})
      }
      if (this.auth['APP_LLOA']) {
        this.addGroup({'auth': 'APP_LLOA',
          'iconName': 'icon-oa1 classred',
          'iconType': 'icon',
          'iconStyle': 'font-size: 32px;',
          'openType': 'clickEventJump',
          'pathParams': {url: '', type: '', isTitle: ''},
          'displayName': 'OA'})
      }
      if (this.auth['APP_Property']) {
        this.addGroup({'auth': 'APP_Property',
          'iconName': 'icon-wuye classgreen',
          'iconType': 'icon',
          'iconStyle': 'font-size: 32px;',
          'openType': 'routerJump',
          'pathParams': {url: '/investmentIndex', type: '', isTitle: ''},
          'displayName': '投资物业'})
      }
      if (this.auth['APP_ButlerService']) {
        this.addGroup({'auth': 'APP_ButlerService',
          'iconName': 'icon-guanjia classorange',
          'iconType': 'icon',
          'iconStyle': 'font-size: 30px;',
          'openType': 'routerJump',
          'pathParams': {url: '/getCst', type: '', isTitle: ''},
          'displayName': '管家报事'})
      }
      if (this.isDiKuai) {
        this.addGroup({'auth': 'APP_DiKuai',
          'iconName': 'icon-dikuai classored',
          'iconType': 'icon',
          'iconStyle': 'font-size: 27px;',
          'openType': 'routerJump',
          'pathParams': {url: '/massifStatistics', type: '', isTitle: ''},
          'displayName': '地块统计'})
      }
    },
    iconClick (iconItem) {
      switch (iconItem.openType) {
        case 'routerJump':
          this.$router.forward(iconItem.pathParams.url)
          break
        case 'loadView':
          this.$app.loadView(iconItem.pathParams)
          break
        case 'clickEventJump':
          this.customClickJump(iconItem.auth)
          break
      }
    },
    addGroup (iconGroup) {
      this.groupList.push(iconGroup)
    },
    customClickJump (auth) {
      switch (auth) {
        case 'APP_jumpOffline': // 离线中心
          this.jumpOffline()
          break
        case 'APP_LLOA': // OA
          this.routeToOA()
          break
        case 'APP_DisplayAll': // 显示全部
          this.displayAll()
          break
      }
    },
    async getPageData () {
      try {
        let p0 = 'UserCS_ConnectionQuality'
        let res = await this.$xml(p0, {
          OrgID: this.user.OrgID,
          UserName: this.user.UserID,
          PassWord: ''
        })
        this.otherList = res.data.filter(item => item.h5Url)
        this.groupList = []
        this.initIconList()
      } catch (e) {
        this.initIconList()
        console.log(e)
      }
    },
    routeToOA () {
      if (this.$app.isIOS) {
        // this.$app.network().then(res => {
        //   console.log('当前网络环境:', res)
        // })
        // this.$app.routeOA() // 测试OA接口
        this.$xml('UserCS_ConnectionOA', {
          UserName: this.user.UserID,
          URL: ''
        }).then(res => {
          let url = res.data[0].OAUrl
          this.$app.loadView({url: url, type: 'oa', isTitle: 'OA'})
        })
      } else {
        this.$app.loadView({url: '', type: 'oa', isTitle: 'OA'})
      }
    },
    async authLogin () {
      let url = '/roc/open/app/admin/login?userNam=liaojiangwei&password=59adb24ef3cdbe0297f05b395827453f'
      let res = await this.$http.post(url, {}, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [function (data) {
          return JSON.stringify(data)
        }]
      })
      console.log(res, '------')
      return res
    },
    async getReportRight () {
      let p7 = {
        UserId: this.user.UserID,
        PositionId: this.user.PositionID
      }
      let res = await this.$xml('UserSL_ReportRight', p7)
      if (!res.data) return
      let resData = res.data.ReportRight
      let reportRight = resData.some(sub => sub.Content === 'DQ_APP_ContractStatistics' || sub.Content === 'DQ_APP_LeasingStatistics' || sub.Content === 'DQ_APP_WarrantStatistics')
      if (reportRight) {
        this.isDiKuai = reportRight
      }
    },
    async getNoticeInfo () {
      let p7 = {
        OrgID: this.user.OrgID
      }
      let res = await this.$xml('UserCS_ConnectionAnnouncement', p7)
      if (!res.data) return
      let resData = res.data
      this.noticeList = []
      if (resData && resData.data) {
        this.noticeList = resData.data.list
      }
      console.log('resData', resData)
    },
    async getAppDynamicLink () {
      let p7 = {
        OrgID: this.user.OrgID
      }
      let res = await this.$xml('UserCS_GetAppShowModules', p7)
      if (res.data) {
        this.appDynamicLink = res.data
      }
      // console.log('appDynamicLink', res.data)
    },
    async authGetInfo () {
      // /roc/workbench/member/app/getAppList?orgId=58
      let url = '/roc/workbench/member/app/getAppList?orgId=58'
      let res = await this.$http.post(url, {}, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-User-Token': 'user_token_82cdae32-a240-424f-9a33-f824e7023e04'
        }
      })
      console.log(res)
      return res
    },
    jumpOffline () {
      this.$app.jumpOffline()
    },
    displayAll () {
      this.isDisplay = true
    },
    beforeDestroy () {
      // clearInterval(this.timer)
    },
    async offlineBadge () {
      let res = await this.$app.offlineBadge()
      this.offBadge = parseInt(res.total ? res.total : 0)
      console.log(res, '角标数量', this.offBadge)
    }
  }
}
</script>

<style  lang="scss" scoped>
  .main_page{
    margin: 0;
    display:inline-block ;
    .title_gb{
      // text-align:center;
      top:0px;
      //background-color: antiquewhite;
      background-image: url('../assets/img/work/i_work_titlebg.png');
      height: 180px;
      width: 100%;
      padding: 0 12px;
      text-align: center;
      .orgInfo{
        color: #FFF;
        font-size: 16px;
        padding-top: 10px;
        text-align: left;
        width:auto;
        .iconfont{
          padding-left:3px;
        }
        // ::after{
        //   content: '';
        //   border-top: 12px solid #fff;
        //   border-left: 5px solid transparent;
        //   border-right: 5px solid transparent;
        //   float: right;
        //   top: 7px;
        //   position: absolute;
        //   -webkit-transform: rotate(135deg);
        //   transform: rotate(0deg);
        //   margin-left: 5px;
        // }
      }
      .title{
        line-height: 60px;
        color: #FFFFFF;
        font-size: 18px;
        font-weight: bold;
      }
      // position: absolute;
      // z-index: -1;
    }
    .title_context{
        width: 92%;
        height: auto;
        background: #FFF;
        border-radius: 10px;
        margin: -80px auto 10px auto;
        padding: 5px 0;
    }
    .notice{
      height: 84px;
      width: 100%;
      display: inline-block;
      background: #FFF;
      .left_title{
        float: left;
        width: 73px;
        margin-left: 10px;
        .weui-grid__icon .iconfont{
          line-height: 90px;
          font-size: 56px;
          color:#FC4B4B;
        }
      }
      .right_context{
        margin: 10px 20px 10px 97px;
        white-space: nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
          // left: 70px;
        font-size: 14px;
        line-height: 30px;
        height: 60px;
        overflow: hidden;
        display: block;
        position: relative;
        width: 65%;
        span{
          color: #333333;
          font-size: 16px;
        }
        // .mint-swipe-item .is-active {
        //   white-space: nowrap;
        //   overflow:hidden;
        //   text-overflow:ellipsis;
        // }
        .marquee_list {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 70px;
        }
        .marquee_top {
          transition: all 0.5s;
          margin-top: -30px;
        }
        .marquee_list li {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #333333;
          padding-left: 0px;
        }
        // }
      }

    }
    .scene_manage{
      height: 155px;
      background: #FFF;
      margin: 10px auto 0px auto;
      color: #333333;
      .title{
        font-size: 16px;
        margin-left: 21px;
        line-height: 48px;
      }
      .title::before{
        content: " ";
        display: inline-block;
        height: 16px;
        width: 3px;
        background-color: #46A9FC;
        margin-top: 17px;
        right: 2px;
        position: absolute;
        left: 12px;
      }
      .weui-grid__label {
          margin-top: -10px;
          font-size: 15px;
          text-align: center;
      }
      .weui-grid__context {
          // margin-top: 5px;
          font-size: 12px;
          color: #A2A2A2;
          text-align: center;
      }
      .weui-grids {
        padding: 7px 10px;
      }
      .weui-grid {
        width: 33.333333%;
        padding:5px 8px;
      }
      .weui-grid__icon {
        // width: 26px;
        // height: 31px;
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }
    }
    .introduce{
      height: 181px;
      background: #FFF;
      margin: 10px auto;
      display: inline-flex;
      color: #333333;
      width: 100%;
      .weui-grid {
        width: 50%;
        padding:5px 8px;
        height: 90px;
      }
      .weui-grid__icon {
        width: 50%;
        height: 50px;
        margin: 0 auto;
        float: left;
        img {
          display: block;
          width: 60px;
          height: 60px;
          margin: 7px auto;
        }
      }
      .title{
        float: left;
        width: 50%;
        margin: 20px auto 5px;
        color: #A2A2A2;
        padding-left: 5px;
      }
      .title_p{
        font-size: 15px;
        font-weight:bold;
        text-align: left;
      }
      .title_c{
        text-align: left;
        font-size: 12px;
        margin: 4px auto 0px;
        overflow: hidden;
      }
    }
  }
  .light_bg .weui-grid{
    background:#FFF;
  }
  .weui-grid__icon {
    // width: 25px;
    // height: 25px;
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 auto;
  }
  .text-center{
    line-height: 40px;
    .iconfont{
      font-size: 40px;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .classblue{
      background-image: -webkit-gradient(linear, 0% 0%, 100% 100%, from(rgb(1, 129, 244)), to(rgb(121, 184, 241)));
    }
    .classgreen{
      background-image: -webkit-gradient(linear, 0% 0%, 100% 100%, from(rgba(0, 184, 151, 1)), to(rgba(11, 213, 177, 1)));
    }
    .classorange{
      background-image: -webkit-gradient(linear, 0% 0%, 100% 100%, from(rgba(253, 151, 25, 1)), to(rgba(253, 195, 0, 1)));
    }
    .classred{
      background-image: -webkit-gradient(linear, 0% 0%, 100% 100%, from(rgba(247, 86, 84, 1)), to(rgba(254, 106, 106, 1)));
    }
    .classgray{
      background-image: -webkit-gradient(linear, 0% 0%, 100% 100%, from(#C0D8F1), to(#C0D8F1));
    }
  }
  .weui-grids {
    border-radius: 20px;
    padding: 0 10px;
  }
  .weui-grids::before{
      display: none;
  }
  .weui-grid {
    width: 25%;
    padding: 10px 1px;
  }
  .weui-grid::before{
      display: none;
  }
  .weui-grid::after{
      display: none;
  }
  .weui-grid__label {
    font-size:15px;
    margin-top: 0px;
    //  margin-top: 15px;
  }
  .weui-badge {
    position: absolute;
    top: 8px;
    right: 8.1vw;
  }
</style>
