<template>
  <div class="page_modal">
    <div class="page">
      <mt-header title="收款成功">
        <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
      </mt-header>
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
            <a @click="$router.back()" class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:">返回</a>
            <button @click="routeTo" class="weui-form-preview__btn weui-form-preview__btn_primary" type="button">查看单据</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'customerList',
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
  .back_btn_plain {
    background: transparent;
    border: 1px solid #0dc88c;
    border-radius: 20px;
    height: 36px;
    width: 100px;
    font-size: 16px;
    color: #0dc88c;
    line-height: 34px;
    margin-top: 10px;
    outline: none;
  }
</style>
