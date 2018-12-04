<template>
  <div class="page">
    <mt-header  title="我的">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
      <div class="my_header_wrap weui-flex ">
        <div class="img_wrap main_bg"  >
          {{user.UserID.slice(-2)}}
        </div>
        <div class="weui-flex__item" style="padding-left:15px;">
          <p class="" style="padding: 0px 0px 5px;font-size:16px;">{{user.UserID}}</p>
          <p class="dark_98">{{user.PositionName}}</p>
        </div>
      </div>
      <div class="weui-cells" style="margin-top:10px;">
        <a @click="$router.forward('/positionId')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>职位</p>
          </div>
          <div class="weui-cell__ft">{{user.PositionName}}</div>
        </a>
        <a @click="$router.forward('/cashInfo')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>我的收款</p>
          </div>
          <div class="weui-cell__ft">
          </div>
        </a>
        <a @click="$router.forward('/serverAddress')" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>服务器地址</p>
          </div>
          <div class="weui-cell__ft">
          </div>
        </a>
        <a @click="clearCache" class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>清除缓存</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
      <div class="weui-btn-area">
        <a @click="logoutHandle" class="weui-btn weui-btn_default" href="javascript:" id="showTooltips">退出登录</a>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'detail',
  created () {
    // this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    logoutHandle () {
      this.$app.logout()
    },
    clearCache () {
      this.$message.confirm('确定要清楚缓存数据?<br />您将会退出登录').then(action => {
        localStorage.clear()
        this.$app.clearCache()
      })
    }
    // async getPageData () {
    //   let res = await this.$xml('UserCS_ReportLeaseRentals', {
    //     'OrgID': '11091315263400010000', // '11091315263400010000',
    //     'Stime': '2018-08-01',
    //     'Etime': '2018-10-31'
    //   })
    //   // this.$http.post(obj)
    //   console.log(res)
    // }
  }
}
</script>

<style scoped>
  .dark_98 {
    color:#989898;
  }
  .my_header_wrap {
    padding: 15px;
    background: #FFF;
    border-bottom:0.5px solid #e5e5e5;
  }
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
</style>
