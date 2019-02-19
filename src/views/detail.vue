<template>
  <div class="page">
    <!-- <mt-header  title="这个是详情页">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="这个是详情页"></nav-title>
    <div class="page_bd">
      很健康很快就环境可好就经理
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'detail',
  components: {navTitle},
  created () {
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let res = await this.$xml('UserCS_ReportLeaseRentals', {
        'OrgID': '11091315263400010000', // '11091315263400010000',
        'Stime': '2018-08-01',
        'Etime': '2018-10-31'
      })
      // this.$http.post(obj)
      console.log(res)
    }
  }
}
</script>

<style scoped>

</style>
