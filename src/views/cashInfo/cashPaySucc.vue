<template>
  <div class="page_modal">
    <div class="page">
      <nav-title title="收款成功"></nav-title>
      <div class="page_sub_hd padding15-h light_bg"  style="background: #FFF;">
        <i class="iconfont icon-shouye-copy main_color padding-right"></i>{{roomName}}
      </div>
      <div class="page_bd">
        <div class="weui-form-preview">
          <div class="weui-form-preview__bd text-center">
            <p style="font-size:30px;color:#e40101;"><small>￥</small>{{totalMoney}}</p>
            <p>收款成功</p>
          </div>
          <div class="weui-form-preview__ft">
            <a @click="$router.forward($route.path + '/invoice/'+$route.params.id+'/'+orgId)" class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:">开票</a>
            <button @click="routeTo" class="weui-form-preview__btn weui-form-preview__btn_primary" type="button">查看单据</button>
          </div>
        </div>
      </div>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'customerList',
  components: {navTitle},
  data () {
    return {
      orgId: '',
      roomName: '',
      noCash: '',
      userList: []
    }
  },
  created () {
    this.orgId = this.$parent.orgId
    this.roomName = this.$parent.roomName
    this.personCash = this.$parent.choosePersonCash
    this.totalMoney = this.personCash.totalMoney
    // this.getPageData()
  },
  methods: {
    routeTo () {
      console.log('id:', this.$route.params.id)
      this.$router.replace({name: 'cashPayDetail', params: {id: this.$route.params.id}})
    }
    // async getPageData () {
    //   let url = '/ets/payment/house/getArrearsCost'
    //   let res = await this.$http.post(url, {
    //     orgID: this.orgId,
    //     resID: this.$route.params.id
    //   })
    //   if (res.data) {
    //     this.noCash = false
    //     this.userList = res.data
    //   } else {
    //     this.noCash = true
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.weui-form-preview__btn_primary {
  color: #3395ff;
}
</style>
