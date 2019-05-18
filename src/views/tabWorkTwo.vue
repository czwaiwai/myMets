<template>
<div class="page">
  <div class="page_hd">
    <nav-title :title="user && user.OrgName" :hasBtn="hasBtn"></nav-title>
  </div>
  <div class="page_bd main_page">
    <div class="title_gb">
      <select v-model="currOrgID" @change="projectChange">
        <!-- <option>银河世纪</option>
        <option>思源软件</option>
        <option>银河思源</option>
        <option>银河思软世纪</option> -->
        <option v-for="(item,index) in filterList" :key="index" :value='item.projectId'>{{item.projectName}}</option>
      </select>
      <span>亚洲的希望  产业的未来</span>
    </div>
    <div class="title_context clearfix">
      <div class="weui-grids">
        <a v-show="auth['ETS_APPAudit']" @click="$router.forward('/approvalIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
          </div>
          <p class="weui-grid__label">审批</p>
        </a>
        <a v-show="auth['APP_MeterRead']" @click="$router.forward('/meterLocation')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_cb.png"  alt="">
          </div>
          <p class="weui-grid__label">抄表</p>
        </a>
        <a v-show="auth['APP_Inspection']" @click="$router.forward('/workOrder/inspection/Inspection')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_work_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">巡检</p>
        </a>
        <a v-show="auth['APP_Maintain']" @click="$router.forward('/workOrder/inspection/KeepFit')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_by.png"  alt="">
          </div>
          <p class="weui-grid__label">保养</p>
        </a>
        <a v-show="auth['APP_Service_PostIt']" @click="$router.forward('/customerService?type=baoshi')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_bs.png" alt="">
          </div>
          <p class="weui-grid__label">报事</p>
        </a>
        <a v-show="auth['APP_Service_Repair']" @click="$router.forward('/customerService?type=baoxiu')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_wx.png" alt="">
          </div>
          <p class="weui-grid__label">报修</p>
        </a>
        <a v-show="auth['APP_FinancePay']" @click="$router.forward('/getCash')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sk.png" alt="">
          </div>
          <p class="weui-grid__label">收款</p>
        </a>
        <a v-show="auth['APP_Lease']" @click="$router.forward('/rentIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_work_zl.png" alt="">
          </div>
          <p class="weui-grid__label">租赁</p>
        </a>
        <a v-show="auth['APP_LLOA']" @click="routeToOA" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_oa.png" alt="">
          </div>
          <p class="weui-grid__label">OA</p>
        </a>
        <a v-show="auth['APP_MeterRead']||auth['APP_Inspection']||auth['APP_Maintain']" @click="jumpOffline" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_off_download.png" alt="">
          </div>
          <p class="weui-grid__label">离线中心</p>
          <span v-if="offBadge" class="weui-badge" >{{offBadge > 99 ?'99': offBadge}}</span>
        </a>
        <a v-show="auth['APP_Meeting']" @click="$router.forward('/meeting')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_meeting.png" alt="">
          </div>
          <p class="weui-grid__label">会议</p>
        </a>
        <a v-show="auth['APP_Property']" @click="$router.forward('/investmentIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_investment.png" alt="">
          </div>
          <p class="weui-grid__label">投资性物业</p>
        </a>
        <a v-show="auth['APP_Rectification']" @click="$router.forward('/getCst')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_compare.png" alt="">
          </div>
          <p class="weui-grid__label">管家报事</p>
        </a>
        <a v-show="auth['APP_Rectification']" @click="$router.forward('/massifStatistics')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_compare.png" alt="">
          </div>
          <p class="weui-grid__label">地块统计</p>
        </a>
        <a v-for="(item, index) in otherList" :key="index"  @click="$app.loadView({url: item.h5Url, type: 'chaobiao', isTitle: item.appName})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img :src="item.h5Icon" alt="">
          </div>
          <p class="weui-grid__label">{{item.appName}}</p>
        </a>
        <a  @click="$app.loadView({url:'http://' + ip +'/ETSInspection/#page=0', type: 'baoyang'})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_by.png"  alt="">
          </div>
          <p class="weui-grid__label">保养</p>
        </a>
      </div>
    </div>
    <div class="notice">
      <div clss='left_img'>图片</div>
      <div clss='right_context'>内容</div>
    </div>
    <div class="scene_manage">
      <div><span class="title">现场管理</span></div>
      <div class="weui-grids">
        <a v-show="auth['ETS_APPAudit']" @click="$router.forward('/approvalIndex')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
          </div>
          <p class="weui-grid__label">设备保养</p>
          <p class="weui-grid__context">设备日常保养</p>
        </a>
        <a v-show="auth['APP_MeterRead']" @click="$router.forward('/meterLocation')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_cb.png"  alt="">
          </div>
          <p class="weui-grid__label">设备巡检</p>
          <p class="weui-grid__context">设备日常巡检</p>
        </a>
        <a v-show="auth['APP_Inspection']" @click="$router.forward('/workOrder/inspection/Inspection')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_work_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">安防巡更</p>
          <p class="weui-grid__context">安全日常巡检</p>
        </a>
      </div>
    </div>
    <div class="introduce">
      <div class="weui-grids">
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">业务介绍</p>
            <p class="weui-grid__context title_c">产品方案介绍</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">市场合作</p>
            <p class="weui-grid__context title_c">合作伙伴计划</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">入园指南</p>
            <p class="weui-grid__context title_c">入园流程指引</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
          </div>
        </div>
        <div class="weui-grid light_bg">
          <div class="title">
            <p class="weui-grid__label title_p">关于我们</p>
            <p class="weui-grid__context title_c">企业文化概况</p>
          </div>
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
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
      orglist: []
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
    this.currOrgID = this.user.OrgID
    this.getPageDataNet()
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
    this.offlineBadge()
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'auth': 'auth',
      'rand': 'rand'
    }),
    filterList () {
      let list = this.orglist
      return list
    }
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
    async getPageDataNet () {
      let p0 = 'UserCS_GetPositionIdInfo'
      let res = await this.$xml(p0, {
        EmployeeID: '1604271708130001001E'// this.user.memberId //
      })
      if (!res.data) return
      let resData = this.$toLower(res.data)
      if (!resData.status) {
        let subList = []
        resData.forEach(item => {
          if (item.positionId === this.user.PositionID) {
            subList = item
          }
        })
        this.orglist = subList.areaInfo.map(item => {
          item.projectId = item.id
          item.projectName = item.organizationName
          return item
        })
      }
    },
    projectChange () {
      let projectName = ''
      this.orglist.forEach(item => {
        if (item.projectId === this.currOrgID) {
          projectName = item.projectName
        }
      })
      this.$app.changeProject({
        projectId: this.currOrgID,
        projectName: projectName
      }).then(() => {
        this.$store.dispatch('getUserAction')
        this.$store.commit('setRandNum', Date.now())
        // this.$root.back()
      }).catch(err => {
        console.log(err)
        if (this.$dev) {
          this.$store.commit('setRandNum', Date.now())
        }
      // this.$root.back()
      })
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
      background-color: antiquewhite;
      height: 120px;
      width: 100%;
      // position: absolute;
      z-index: -1;
    }
    .title_context{
        width: 90%;
        height: auto;
        background: #FFF;
        border-radius: 20px;
        margin: -66px auto 10px auto;
    }
    .notice{
       height: 84px;
       width: 100%;
       display: inline-flex;
       background: #FFF;
      .left_img{
        width: 40px;
        height: 70px;
        background-color: yellow;
      }
      .right_context{
        width: 50px;
        background-color: green;
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
          margin-top: 10px;
          font-size: 15px;
          text-align: center;
      }
      .weui-grid__context {
          margin-top: 5px;
          font-size: 12px;
          color: #A2A2A2;
          text-align: center;
      }
      .weui-grid {
        width: 33.333333%;
        padding:5px 8px;
      }
      .weui-grid__icon {
        width: 26px;
        height: 31px;
        margin: 0 auto;
      }
    }
    .introduce{
      height: 181px;
      background: #FFF;
      margin: 5px auto 5px auto;
      display: inline-flex;
      color: #333333;
      .weui-grid {
        width: 50%;
        padding:5px 8px;
        height: 90px;
      }
      .weui-grid__icon {
        width: 50%;
        height: 60px;
        margin: 0 auto;
        float: left;
        img {
          display: block;
          width: 60px;
          height: 60px;
          margin: 13px auto;
        }
      }
      .title{
        float: left;
        width: 50%;
        margin: 20px auto 5px;
      }
      .title_p{
        font-size: 15px;
        font-weight:bold;
      }
      .title_c{
        font-size: 12px;
        margin: 4px auto 0px;
      }
    }
  }
  .light_bg .weui-grid{
    background:#FFF;
  }
  .weui-grid__icon {
    width: 25px;
    height: 25px;
    margin: 0 auto;
  }
  .weui-grids {
    border-radius: 20px;
  }
  .weui-grid {
    width: 25%;
    padding:8px 8px;
  }
  .weui-grid::before{
      display: none;
  }
  .weui-grid::after{
      display: none;
  }
  .weui-grid__label {
    font-size:14px;
  }
  .weui-badge {
    position: absolute;
    top: 8px;
    right: 8.1vw;
  }
</style>
