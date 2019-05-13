<template>
<div class="page">
  <div class="page_hd">
    <nav-title :title="user && user.OrgName" :hasBtn="hasBtn"></nav-title>
  </div>
  <div class="page_bd">
    <div class="scroll">
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
        <!-- <a @click="$app.loadView({url: chaoBiaoUrl, type:'chaobiao', isTitle: '抄表'})"  href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_cb.png" alt="">
          </div>
          <p class="weui-grid__label">抄表</p>
        </a> -->
        <!-- <a  @click="$app.loadView({url: 'http://' + ip +'/ETSInspection/#page=0', type:'xunjian'})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/msg_list_icon_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">巡检</p>
        </a> -->
        <a v-show="auth['APP_Inspection']" @click="$router.forward('/workOrder/inspection/Inspection')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_work_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">巡检</p>
        </a>
        <!-- <a  @click="$router.forward('/workOrder/customerService')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/msg_list_icon_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">客服工单</p>
        </a> -->
        <!-- <a  @click="$app.loadView({url:'http://' + ip +'/ETSInspection/#page=0', type: 'baoyang'})" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_by.png"  alt="">
          </div>
          <p class="weui-grid__label">保养</p>
        </a> -->
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
        <!-- 暂时无用 -->
        <!-- <a @click="$router.forward('/cash')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_off_download.png" alt="">
          </div>
          <p class="weui-grid__label">收款测试</p>
        </a> -->
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
        <!-- <a v-show="auth['APP_Rectification']" @click="$router.forward('/comparedBuild')" href="javascript:;" class="weui-grid light_bg">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_compare.png" alt="">
          </div>
          <p class="weui-grid__label">整改对比</p>
        </a> -->
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
        <!-- <button @click="routeTest" style="width:100px;height:100px;">test</button> -->
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
      otherList: []
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
    })
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

      // console.log(res.data)
      // window.md5 = this.md5
      // let res = await this.authLogin()
      // let info = await this.authGetInfo()
      // console.log(res, info, 'res & info')
      // this.otherList = info.data
      // res.data
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

<style scoped>
  .light_bg .weui-grid{
    background:#FFF;
  }
  .weui-grid__icon {
    width: 40px;
    height: 40px;
    margin: 0 auto;
  }
  .weui-grid {
    padding:15px 10px;
  }
  .weui-grid__label {
    font-size:16px;
  }
  .weui-badge {
    position: absolute;
    top: 8px;
    right: 8.1vw;
  }
</style>
