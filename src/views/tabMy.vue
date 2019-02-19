<template>
  <div class="page">
    <div class="page_hd">
      <!-- <mt-header  title="我的"></mt-header> -->
      <nav-title title="我的" :hasBtn="hasBtn"></nav-title>
    </div>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:0;">
        <div @click="$router.forward('/setting')" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">
            <!--<img src="images/pic_160.png" style="width: 50px;display: block">-->
            <div  class="img_wrap main_bg">
              {{user && user.UserID.slice(-2)}}
            </div>
          </div>
          <div class="weui-cell__bd">
            <p>{{user.UserID}}</p>
            <p style="font-size: 13px;color: #888888;">{{user && user.PositionName}}</p>
          </div>
          <div class="weui-cell__ft"></div>
        </div>
      </div>
      <div class="weui-cells"  style="margin-top:15px;">
        <a @click="$router.forward('/changeProject')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_icon_qhxm.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>切换项目</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/monitor/index')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_icon_jk.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>监控中心</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/cashInfo')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_sk.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>我的收款</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/status')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_icon_ztsz.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>我的状态</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/serverAddress')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_icon_fwqdz.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>服务器地址</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="clearCache" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_icon_qchc.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>清除缓存</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a @click="$router.forward('/about')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__hd"><img src="../assets/img/tabMy/ic_me_icon_about.png" alt="" style="width:20px;margin-right:15px;display:block"></div>
          <div class="weui-cell__bd">
            <p>关于软件</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
      <!--<button @click="testAddData">添加数据</button>-->
      <!--<button @click="testGetData">取出出去</button>-->
      <!--<button @click="testDelData">删除数据</button>-->
      <!--<button @click="testHasData">是否存在数据</button>-->
      <a @click="logoutHandle"  class="logout_btn"  href="javascript:" id="showTooltips">退出登录</a>
    </div>
  </div>
</template>

<script>
import navTitle from '@/components/navTitle'
import {mapGetters} from 'Vuex'
export default {
  name: 'tabMy',
  components: {navTitle},
  data () {
    return {
      hasBtn: false
    }
  },
  created () {
    // this.$store.dispatch('getUserAction').then(res => {
    //   console.log(res, '--------------getUserAction')
    // })
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    testAddData () {
      this.$app.addData({
        key: 'test',
        data: {
          a: 1,
          b: 2,
          c: 'hahaha',
          d: [{aa: 1, bb: 2, cc: 3}]
        }
      })
    },
    testGetData () {
      this.$app.getData({key: 'test'}).then(res => {
        console.log('testGetData:', res)
      })
    },
    testDelData () {
      this.$app.delData({key: 'test'}).then(res => {
        console.log('testDelData:', res)
      })
    },
    testHasData () {
      this.$app.hasData({key: 'test'}).then(res => {
        console.log('testHasData:', res)
      })
    },
    logoutHandle () {
      this.$app.logout()
    },
    clearCache () {
      this.$message.confirm('确定要清楚缓存数据?<br />您将会退出登录').then(action => {
        localStorage.clear()
        this.$app.clearCache()
      })
    }
  }
}
</script>

<style scoped>
  .img_wrap {
    width:54px;
    height:54px;
    color: #FFF;
    border:2px solid #FFF;
    border-radius:100%;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
  }
  .logout_btn {
    text-align:center;display:block;color:#333;font-size:16px;height:40px;line-height:40px;background:#FFF;margin-top:15px;border:none;
  }
</style>
