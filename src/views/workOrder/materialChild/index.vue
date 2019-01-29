<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="设备详情">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
      <div class="padding">
        <a @click="routeAdd" class="left_btn">新建申请</a>
      </div>
       <button @click="routeDetail" >去详情</button>
    </div>
    <transition name="page">
      <!-- <keep-alive > -->
        <router-view/>
      <!-- </keep-alive> -->
    </transition>
  </div>
</div>
</template>
<script>
export default {
  name: 'repairDetail',
  data () {
    return {
    }
  },
  created () {
    this.nav = this.$parent.nav
    console.log(this.$parent.workItem, this.$parent.work)
    this.work = this.$parent.workItem || this.$parent.work

    this.getPageData()
  },
  methods: {
    async getPageData () {
      let url = '/ets/syswin/smd/userCSGetApplyInfoH5'
      let res = await this.$http.post(url, {
        orgID: this.work.OrgID,
        wordQuertionID: this.work.WorkQuestionID
      })
      console.log(res.data)
    },
    routeAdd () {
      this.$router.forward(this.$route.path + '/materialAdd')
    },
    routeDetail () {
      this.$router.forward(this.$route.path + '/materialDetail')
    }

  }
}
</script>

<style lang="scss">
.left_btn {
  padding: 10px 30px;
  color:#FFF;
  background:#3395FF;
  margin-left:-15px;
  display: inline-block;
  width:150px;
  text-align:right;
  border-radius: 0 10px 10px 0;
}
</style>
