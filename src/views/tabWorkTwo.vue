<template>
<div class="page">
  <div class="page_hd">
    <!-- <nav-title :title="user && user.OrgName" :hasBtn="hasBtn"></nav-title> -->
  </div>
  <div class="page_bd main_page">
    <div class="title_gb">
      <p class="orgInfo" @click="$router.forward('/changeProject')">
        <span>{{currOrgName}}</span>
        <i class="iconfont icon-open-close-selected classblue" style="font-size: 33px;font-size:#fff"></i>
      </p>
      <!-- <select v-model="currOrgID" @change="projectChange">
        <option v-for="(item,index) in filterList" :key="index" :value='item.projectId'>{{item.projectName}}</option>
      </select> -->
      <span class="title">亚洲的希望  产业的未来</span>
    </div>
    <div class="title_context">
      <div class="weui-grids">
        <a v-if="auth['APP_GovernmentService']" @click="$app.loadView({url: 'http://www.gdzwfw.gov.cn/',type: 'chaobiao', isTitle: '政务服务'})"  href="javascript:;" class="weui-grid light_bg">
           <div class="weui-grid__icon text-center">
             <i class="iconfont icon-jiguanzhengwu classblue" style="font-size: 32px;"></i>
          </div>
          <p class="weui-grid__label">政务服务</p>
        </a>
        <a v-if="auth['APP_FinancePay']" @click="$router.forward('/getCash')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_sk.png" alt=""> -->
          <i class="iconfont icon-wuyefei classgreen" ></i>
          </div>
          <p class="weui-grid__label">物业缴费</p>
        </a>
        <a v-if="auth['APP_LifeMatch']" @click="$app.loadView({url: 'https://www.bayvalley.com.cn/?page_id=44',type: 'chaobiao', isTitle: '生活配套'})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_compare.png" alt=""> -->
          <i class="iconfont icon-ffcx classorange" ></i>
          </div>
          <p class="weui-grid__label">生活配套</p>
        </a>
        <a v-if="auth['ETS_APPAudit']" @click="$router.forward('/approvalIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_sp.png" alt=""> -->
            <i class="iconfont icon-shenpi classred" style='font-size: 35px;' ></i>
          </div>
          <p class="weui-grid__label">审批</p>
        </a>
        <a v-if="auth['APP_Service_PostIt']" @click="$router.forward('/customerService?type=baoshi')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_bs.png" alt=""> -->
            <i class="iconfont icon-woyaobaoshi classblue"></i>
          </div>
          <p class="weui-grid__label">客户报事</p>
        </a>
        <a v-if="auth['APP_Lease']" @click="$router.forward('/rentIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/icon_work_zl.png" alt=""> -->
            <i class="iconfont icon-zu classred"  style='font-size: 25px;'></i>
          </div>
          <p class="weui-grid__label">招商租赁</p>
        </a>
        <a v-if="auth['APP_Meeting']" @click="$router.forward('/meeting')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_meeting.png" alt=""> -->
            <i class="iconfont icon-meeting1 classred" style='font-size: 29px;'></i>
          </div>
          <p class="weui-grid__label">会议预订</p>
        </a>
        <a  @click="displayAll" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon" style="text-align: center">
            <!-- <img src="../assets/img/work/ic_off_download.png" alt=""> -->
            <i class="iconfont icon-quanbu" style="font-size: 28px;color:#C0D8F1"></i>
          </div>
          <p class="weui-grid__label">全部</p>
        </a>
        <a v-if="auth['APP_MeterRead']||auth['APP_Inspection']||auth['APP_Maintain']" @click="jumpOffline" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_off_download.png" alt=""> -->
            <i class="iconfont icon-lixianzhongxin classgreen" style="font-size: 45px;"></i>
          </div>
          <p class="weui-grid__label">离线中心</p>
          <span v-if="offBadge" class="weui-badge" >{{offBadge > 99 ?'99': offBadge}}</span>
        </a>
        <a v-for="(item, index) in otherList" :key="index"  @click="$app.loadView({url: item.h5Url, type: 'chaobiao', isTitle: item.appName})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <div style="margin: 0 auto;width: 35px;height: 35px;">
              <img :src="item.h5Icon" alt="">
            </div>
          </div>
          <p class="weui-grid__label" style="margin-top: 0px">{{item.appName}}</p>
        </a>
        <a v-if="auth['APP_Maintain']" @click="$router.forward('/workOrder/inspection/KeepFit')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_by.png"  alt=""> -->
            <i class="iconfont icon-baoyang classblue"></i>
          </div>
          <p class="weui-grid__label">设备保养</p>
        </a>
        <a v-if="auth['APP_Inspection']" @click="$router.forward('/workOrder/inspection/Inspection')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <i class="iconfont icon-xunjian1 classgreen" style="font-size: 33px;"></i>
            <!-- <img src="../assets/img/work/icon_work_inspection.png"  alt=""> -->
          </div>
          <p class="weui-grid__label">设备巡检</p>
        </a>
        <a v-if="auth['APP_Service_Repair']" @click="$router.forward('/customerService?type=baoxiu')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_wx.png" alt=""> -->
            <i class="iconfont icon-weixiu classorange" style="font-size: 33px;"></i>
          </div>
          <p class="weui-grid__label">设备维修</p>
        </a>
        <a v-if="auth['APP_MeterRead']" @click="$router.forward('/meterLocation')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_cb.png"  alt=""> -->
            <i class="iconfont icon-chaobiao classblue" style='font-size: 30px;'></i>
          </div>
          <p class="weui-grid__label">抄表</p>
        </a>
        <a v-if="auth['APP_LLOA']" @click="routeToOA" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/icon_oa.png" alt=""> -->
            <i class="iconfont icon-oa1 classred" style="font-size: 32px;"></i>
          </div>
          <p class="weui-grid__label">OA</p>
        </a>
        <a v-if="auth['APP_Property']" @click="$router.forward('/investmentIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <!-- <img src="../assets/img/work/ic_work_investment.png" alt=""> -->
            <i class="iconfont icon-wuye classgreen" style="font-size: 32px;"></i>
          </div>
          <p class="weui-grid__label">投资性物业</p>
        </a>
        <a v-if="auth['APP_ButlerService']" @click="$router.forward('/getCst')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon text-center">
            <i class="iconfont icon-guanjia classorange" style="font-size: 30px;"></i>
          </div>
          <p class="weui-grid__label">管家报事</p>
        </a>
        <a v-if="isDiKuai" @click="$router.forward('/massifStatistics')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon " style="font-size: 26px;line-height: 40px;text-align: center;color: orange;">
            <i class="iconfont icon-dikuai classored" style="font-size: 27px;"></i>
          </div>
          <p class="weui-grid__label">地块统计</p>
        </a>
      </div>
    </div>
    <div class="notice" v-if="auth['APP_NoticeInformation']">
      <div class="left_title">
         <div class="weui-grid__icon">
            <i class="iconfont icon-gonggaozixun classorange"></i>
          </div>
      </div>
      <div class='right_context'>
        <div><a href="javascript:;" @click="$app.loadView({url: 'http://wwww.baidu.com',type: 'chaobiao', isTitle: '公告咨讯'})">广东家居设计谷进驻亚洲国际!</a></div>
        <div><a>欢迎进驻到亚洲国际市场,商家永无后顾之忧!</a></div>
      </div>
    </div>
    <div class="scene_manage" v-if="auth['APP_MarketCooperation'] &&(auth['APP_Service_Repair'] || auth['APP_Maintain'])" >
      <div><span class="title">现场管理</span></div>
      <div class="weui-grids">
        <a v-show="auth['APP_Service_Repair']" @click="$router.forward('/customerService?type=baoxiu')" href="javascript:;" class="weui-grid light_bg">
           <div class="weui-grid__icon text-center">
            <i class="iconfont icon-xunjian1 classgreen" style="font-size: 45px;"></i>
            <!-- <img src="../assets/img/work/icon_work_inspection.png"  alt=""> -->
          </div>
          <p class="weui-grid__label">设备巡检</p>
          <p class="weui-grid__context">设备日常巡检</p>
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
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">业务介绍</p>
            <p class="weui-grid__context title_c">产品方案介绍</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_introduction.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">市场合作</p>
            <p class="weui-grid__context title_c">合作伙伴计划</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_workmc.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">入园指南</p>
            <p class="weui-grid__context title_c">入园流程指引</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_guide.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg">
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
import {mapGetters} from 'Vuex'
// import CryptoJS from 'crypto-js'
export default {
  name: 'tabWork',
  data () {
    return {
      hasBtn: false,
      offBadge: 0,
      currRand: 0,
      otherList: [],
      groupList: [],
      currOrgID: '',
      currOrgName: '',
      isDiKuai: false
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
    if (this.auth['APP_Quality']) {
      this.getPageData()
    }
    this.isDiKuai = this.auth['APP_Rectification']
    this.getReportRight()
    // this.initIcon()
  },
  activated () {
    console.log('调用offlineBadge')
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      if (this.auth['APP_Quality']) {
        this.getPageData()
      }
      this.currRand = this.rand
    } else {
      this.currRand = this.rand
    }
    this.currOrgID = this.user.OrgID
    this.currOrgName = this.user.OrgName
    this.offlineBadge()
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'auth': 'auth',
      'rand': 'rand'
    })
    // filterList () {
    //   let list = this.orglist
    //   return list
    // }
  },
  methods: {
    async getPageData () {
      try {
        let p0 = 'UserCS_ConnectionQuality'
        let res = await this.$xml(p0, {
          OrgID: this.user.OrgID,
          UserName: this.user.UserID,
          PassWord: ''
        })
        this.otherList = res.data.filter(item => item.h5Url)
        // this.initIcon()
      } catch (e) {
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
    // async getPageDataNet () {
    //   let p0 = 'UserCS_GetPositionIdInfo'
    //   let res = await this.$xml(p0, {
    //     EmployeeID: this.user.memberId //
    //   })
    //   if (!res.data) return
    //   let resData = this.$toLower(res.data)
    //   if (!resData.status) {
    //     let subList = []
    //     resData.forEach(item => {
    //       if (item.positionId === this.user.PositionID) {
    //         subList = item
    //       }
    //     })
    //     this.orglist = subList.areaInfo.map(item => {
    //       item.projectId = item.id
    //       item.projectName = item.organizationName
    //       return item
    //     })
    //   }
    // },
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
      console.log('getReportAuth', resData)
    },
    // projectChange () {
    //   let projectName = ''
    //   this.orglist.forEach(item => {
    //     if (item.projectId === this.currOrgID) {
    //       projectName = item.projectName
    //     }
    //   })
    //   this.$app.changeProject({
    //     projectId: this.currOrgID,
    //     projectName: projectName
    //   }).then(() => {
    //     this.$store.dispatch('getUserAction')
    //     this.$store.commit('setRandNum', Date.now())
    //     // this.$root.back()
    //   }).catch(err => {
    //     console.log(err)
    //     if (this.$dev) {
    //       this.$store.commit('setRandNum', Date.now())
    //     }
    //   // this.$root.back()
    //   })
    // },
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
    // md5 (word) {
    //   return CryptoJS.MD5(word).toString()
    // },
    // shenliangTest () {
    //   var key = CryptoJS.enc.Base64.parse('SE83232U')
    //   var message = CryptoJS.enc.Base64.parse('test20')
    //   var encrypted = CryptoJS.DES.encrypt(message, key, {
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.Pkcs7
    //   })
    //   // AZ+wtAtBLpk=
    //   // qahmXfF8euU=
    //   // 0stzyYStVxs=
    //   console.log(encrypted.ciphertext.toString(), 'encrypted.ciphertext.toString-------------')
    //   console.log(CryptoJS.enc.Base64.stringify(encrypted.ciphertext))
    //   return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    // },
    jumpOffline () {
      this.$app.jumpOffline()
    },
    displayAll () {
      let allP = this.$el.querySelectorAll('.title_context a')
      console.log('tag', allP)
    },
    initIcon () {
      let allP = this.$el.querySelectorAll('.title_context a')
      if (allP.length > 8) {
        allP.forEach((ele, index) => {
          if (index > 6) {
            ele.style.display = 'none'
          }
          console.log('tag', index)
        })
      }
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
        padding: 15px 0;
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
        margin: 10px 10px 0 97px;
        /* line-height: 35px; */
        height: 80px;
        div{
          left: 70px;
          font-size: 14px;
          line-height: 31px;
          height: 32px;
          overflow: hidden;
          a{
            color: #333333;
            font-size: 16px;
          }
        }
      }

    }
    .scene_manage{
      height: 155px;
      background: #FFF;
      margin: 5px auto 5px auto;
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
      margin: 5px auto 5px auto;
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
          width: 70px;
          height: 70px;
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
    padding: 6px 1px;
  }
  .weui-grid::before{
      display: none;
  }
  .weui-grid::after{
      display: none;
  }
  .weui-grid__label {
    font-size:17px;
    margin-top: 0px;
    //  margin-top: 15px;
  }
  .weui-badge {
    position: absolute;
    top: 8px;
    right: 8.1vw;
  }
</style>
