<template>
  <div class="page">
    <!-- <mt-header title="设备详情">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="设备详情"></nav-title>
    <div class="page_bd">
      <div></div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'repairDetail',
  components: {navTitle},
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    // async getPageData() {
    //   // let p0 = 'UserCS_GetEquiRepairH5'
    //   // let res = await this.$xml(p0, {

    //   // })
    // }
  }
}
</script>

<style lang="scss">

</style>
