<template>
<div class="page">
  <div class="page_hd">
    <mt-header   :title="user && user.OrgName"></mt-header>
  </div>
  <div class="page_bd">
    <div class="scroll">
      <div class="weui-grids light_bg">
        <a @click="$router.forward('/approvalIndex')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sp.png" alt="">
          </div>
          <p class="weui-grid__label">审批</p>
        </a>
        <a @click="$router.forward('/meterLocation')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_cb.png"  alt="">
          </div>
          <p class="weui-grid__label">抄表</p>
        </a>
        <!-- <a @click="$app.loadView({url: chaoBiaoUrl, type:'chaobiao', isTitle: '抄表'})"  href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_cb.png" alt="">
          </div>
          <p class="weui-grid__label">抄表</p>
        </a> -->
        <a  @click="$app.loadView({url: 'http://' + ip +'/ETSInspection/#page=0', type:'xunjian'})" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/msg_list_icon_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">巡检</p>
        </a>
        <a  @click="$router.forward('/workOrder/inspection')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/msg_list_icon_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">巡检</p>
        </a>
        <a  @click="$router.forward('/workOrder/customerService')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/msg_list_icon_inspection.png"  alt="">
          </div>
          <p class="weui-grid__label">客服工单</p>
        </a>
        <a  @click="$app.loadView({url:'http://' + ip +'/ETSInspection/#page=0', type: 'baoyang'})" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_by.png"  alt="">
          </div>
          <p class="weui-grid__label">保养</p>
        </a>
        <a  @click="$router.forward('/customerService')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_bs.png" alt="">
          </div>
          <p class="weui-grid__label">报事</p>
        </a>
        <a  @click="$router.forward('/customerService')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_wx.png" alt="">
          </div>
          <p class="weui-grid__label">维修</p>
        </a>
        <a @click="$router.forward('/getCash')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_sk.png" alt="">
          </div>
          <p class="weui-grid__label">收款</p>
        </a>
        <a  @click="$router.forward('/rentIndex')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_work_zl.png" alt="">
          </div>
          <p class="weui-grid__label">租赁</p>
        </a>
        <a @click="$app.loadView({url:shenlinagUrl, type: 'oa'})" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/icon_oa.png" alt="">
          </div>
          <p class="weui-grid__label">OA</p>
        </a>
        <a @click="jumpOffline" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_off_download.png" alt="">
          </div>
          <p class="weui-grid__label">离线中心</p>
          <span v-if="offBadge" class="weui-badge" >{{offBadge > 99 ?'99': offBadge}}</span>
        </a>
        <!-- 暂时无用 -->
        <!-- <a @click="$router.forward('/cash')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_off_download.png" alt="">
          </div>
          <p class="weui-grid__label">收款测试</p>
        </a> -->
        <a @click="$router.forward('/meeting')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_off_download.png" alt="">
          </div>
          <p class="weui-grid__label">会议室</p>
        </a>
        <a @click="$router.forward('/investmentIndex')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_off_download.png" alt="">
          </div>
          <p class="weui-grid__label">投资性物业</p>
        </a>
        <a @click="$router.forward('/comparedBuild')" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img src="../assets/img/work/ic_work_compare.png" alt="">
          </div>
          <p class="weui-grid__label">整改对比</p>
        </a>
        <a v-for="(item, index) in otherList" :key="index"  @click="$app.loadView({url: item.h5Url, type: 'other', isTitle: item.appName})" href="javascript:;" class="weui-grid">
          <div class="weui-grid__icon">
            <img :src="item.h5Icon" alt="">
          </div>
          <p class="weui-grid__label">{{item.appName}}</p>
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'Vuex'
import CryptoJS from 'crypto-js'
export default {
  name: 'tabWork',
  data () {
    return {
      offBadge: 0,
      currRand: 0,
      otherList: []
    }
  },
  created () {
    // this.$store.dispatch('getUserAction').then(res => {
    //   console.log(res, '--------------getUserAction')
    // })
    this.getPageData()
    this.shenliangTest()
    console.log(this.user, '--------user--------')
    console.log(this.encryptByDES('test20', 'SE83232U'), '----')
    console.log(this.encryptDES('test20', 'SE83232U'), '----')
    // console.log(this.shenlinagUrl)
  },
  activated () {
    console.log('调用offlineBadge')
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      this.getPageData()
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
    shenlinagUrl () {
      // http://183.62.210.175:888/Global/KK/SSO.aspx?encrypt=CommonDES
      let key = 'SE83232U'
      let sso = '' + key
      console.log(this.encryptByDES('test20', key), '结果---')
      let returnUrl = decodeURIComponent('/mobileapp/home.aspx')
      let baseUrl = 'http://183.62.210.175:888/Global/KK/SSO.aspx?encrypt=CommonDES'
      let paramStr = `&sso=${sso}&returnUrl=${returnUrl}`
      console.log(baseUrl)
      return baseUrl + paramStr
    },
    chaoBiaoUrl () {
      let orgName = encodeURIComponent(this.user.OrgName)
      return `http://${this.ip}/ETSMeterList/#/?orgId=${this.user.OrgID}&orgName=${orgName}`
    },
    etsRentUrl () {
      // let app_cst = ''
      // let app_house = ''
      // if (this.auth['APP_Cst']) {
      //   app_cst = 'APP_Cst'
      // }
      // if (this.auth['APP_House']) {
      //   app_house = 'APP_House'
      // }
      // let orgName = encodeURIComponent(this.user.OrgName)
      // return `http://${this.ip}/ETSRent/#/?mode=${app_cst},${app_house}&orgId=${this.user.OrgID}&orgName=${orgName}&employeeId=${this.user.memberId}&employeeJobId=${this.user.PositionID}`
      return ''
    }
  },
  methods: {
    encryptByDES (message, key) {
      const keyHex = CryptoJS.enc.Utf8.parse(key)
      // var keyHex = CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Hex))
      const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.toString()
    },
    encryptDES (psw, key) {
      var iv = [1, 2, 3, 4, 5, 6, 7, 8]
      var ivHex = CryptoJS.enc.Latin1.parse(this.byteToString(iv))// 原java使用的是iv = [1,2,3,4,5,6,7,8]
      var keyHex = CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Hex))
      var encrypted = CryptoJS.DES.encrypt(psw, keyHex,
        { iv: ivHex,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      )
      return encrypted.toString()
    },
    async getPageData () {
      window.md5 = this.md5
      let res = await this.authLogin()
      let info = await this.authGetInfo()
      console.log(res, info, 'res & info')
      this.otherList = info.data
      // res.data
    },
    async authLogin () {
      let url = '/roc/open/app/admin/login?userName=demo1&password=59adb24ef3cdbe0297f05b395827453f'
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
    md5 (word) {
      return CryptoJS.MD5(word).toString()
    },
    shenliangTest () {
      var key = CryptoJS.enc.Base64.parse('SE83232U')
      var message = CryptoJS.enc.Base64.parse('test20')
      var encrypted = CryptoJS.DES.encrypt(message, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      // AZ+wtAtBLpk=
      // qahmXfF8euU=
      // 0stzyYStVxs=
      console.log(encrypted.ciphertext.toString(), 'encrypted.ciphertext.toString-------------')
      console.log(CryptoJS.enc.Base64.stringify(encrypted.ciphertext))
      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    },
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
    width: 54px;
    height: 54px;
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
