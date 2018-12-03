<template>
  <div class="page">
    <mt-header  title="用户登录">
      <!--<mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>-->
    </mt-header>
    <div class="page_bd">
      <form @submit.prevent="submit">
        <div class="form_wrap">
          <div>
            <label class="input_radius"><i class="iconfont icon-zhanghu"></i><input v-model="formObj.userName" placeholder="请输入账号"></label>
            <label class="input_radius"><i class="iconfont icon-mima"></i><input v-model="formObj.password" type="password" placeholder="请输入密码"></label>
            <label class="input_radius"><i class="iconfont icon-ip"></i><input v-model="formObj.ip" placeholder="请输入IP地址"></label>
          </div>
          <div style="padding:15px;">
            <button class="weui-btn weui-btn_primary"  type="submit" href="javascript:" id="showTooltips">确定</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>

export default {
  name: 'login',
  data () {
    return {
      formObj: {
        userName: '',
        password: '',
        ip: ''
      }
    }
  },
  created () {
  },
  methods: {
    readLocal () {

    },
    async submit () {
      if (!this.formObj.userName) {
        return this.$toast('账户名不能为空')
      }
      // if (!this.formObj.ip) {
      //   return this.$toast('IP地址不能为空')
      // }
      // if (/^\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}[:\d+]?$/.test(this.formObj.ip)) {
      //   return this.$toast('无效的IP地址')
      // }
      let res = await this.$xml('User_LoginAppNew', null, {
        p1: this.formObj.userName,
        p2: this.formObj.password
      }, true)
      console.log(res.data)
      this.$store.commit('login', res.data)
      this.$router.back('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
  .form_wrap {
    padding:55vw 10vw 0 10vw;
    margin:0 auto;
    background: url('../assets/img/loginBanner.png') no-repeat;
    background-size:100%;
    & label.input_radius {
      border-bottom: 1px solid #e5e5e5;
      border-radius: 0;
      height: 36px;
      margin-bottom: 10px;
      display: block;
      overflow: hidden;
    }
    & label.input_radius input {
      border:none;
      background:#f9f9f9;
      height:34px;
      line-height:34px;
      padding-left:15px;
    }
    .weui-btn {
      height:40px;
      line-height: 40px;
    }
  }
</style>
