<template>
  <div class="page">
    <!-- <mt-header  title="这个是详情页">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="这个是详情页"></nav-title>
    <div class="page_bd">
      <index-list></index-list>
    </div>
  </div>
</template>
<script>
import indexList from '@/components/indexList'
import navTitle from '@/components/navTitle'
export default {
  name: 'detail',
  data () {
    return {
    }
  },
  components: {
    navTitle,
    indexList
  },
  created () {
  },
  methods: {}
}
</script>

<style scoped>

</style>
