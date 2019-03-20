<template>
  <div class="page">
    <nav-title title="设备详情"></nav-title>
    <div style="height:80px">fdsdsfds</div>
    <div class="page_bd">
      <a @click="routeTo">跳转</a>
      <div>
        <p v-for="(item, index) in 100" :key="index">fdsfdsjk</p>
      </div>
    </div>
    <div class="page_ft" style="height:100px;">
      fdsfdsfds
    </div>
    <transition name="page" >
      <router-view></router-view>
    </transition>
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
  },
  methods: {
    routeTo () {
      this.$router.push({name: 'test'})
    }
  }
}
</script>

<style lang="scss">

</style>
