<template>
<div class="page">
  <div class="page_hd">
    <nav-title :title="user && user.OrgName" :hasBtn="hasBtn"></nav-title>
  </div>
  <div class="page_bd">
    <div class="weui-grids">
      <!-- <a  @click="$app.loadView({url:`http://${ipTest}/?ipAddress=budget.xinchengyue.com:8080&userId=${user.memberId}&projectId=${user.OrgID}#/energy`, type: 'baoyang', title:'能耗抄表'})" href="javascript:;" class="weui-grid light_bg"> -->
      <a  @click="routeTo" href="javascript:;" class="weui-grid light_bg">
        <div class="weui-grid__icon">
          <img src="../../assets/img/work/ic_work_cb.png"  alt="">
        </div>
        <p class="weui-grid__label">能耗抄表</p>
      </a>
    </div>
    <div class="scroll">
       <div class="weui-cells" >
        <a @click="$router.forward('/orgChoose')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">
            <p>选择项目列表</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/serverAddress')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">
            <p>服务器地址</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="clearCache" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">
            <p>清除缓存</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/about')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">
            <p>关于软件</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
      <a @click="logoutHandle"  class="logout_btn"  href="javascript:" id="showTooltips">退出登录</a>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'Vuex'
import local from '@/utils/local'
// import CryptoJS from 'crypto-js'
export default {
  name: 'appE',
  data () {
    return {
      ipTest: 'http://budget.xinchengyue.com:8080',
      hasBtn: false,
      offBadge: 0,
      currRand: 0,
      otherList: []
    }
  },
  created () {
    if (this.user) {
      let obj = local.get('setOrg')
      if (obj && obj.projectId) {
        this.$store.commit('setOrg', {
          projectId: obj.projectId,
          projectName: obj.projectName
        })
      }
    }
  },
  activated () {},
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'auth': 'auth',
      'rand': 'rand'
    })
  },
  methods: {
    routeTo () {
      let ip = this.ip
      // if (this.$dev) {
      // ip = 'budget.xinchengyue.com:8080'
      // console.log(this.user.memberId, this.user.OrgID, '用户id及项目id')
      // }
      let time = new Date().valueOf()
      this.$app.loadView({url: `http://${ip}/?time=${time}&userId=${this.user.memberId}&projectId=${this.user.OrgID}#/energy`, type: 'baoyang'})
    },
    async logoutHandle () {
      await this.$message.confirm('确定要退出登录')
      this.$app.logout()
    },
    clearCache () {
      this.$message.confirm('<p class="error_color fs13">确定清除吗？<br/>抄表、巡检、保养的缓存数据将被清除，如有完成一部分的工单，<br/>请先完成提交后再清除缓存</p>').then(action => {
        localStorage.clear()
        this.$app.clearCache()
      })
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
  .logout_btn {
    text-align:center;display:block;color:#333;font-size:16px;height:40px;line-height:40px;background:#FFF;margin-top:15px;border:none;
  }
</style>
