<template>
  <div class="page">
    <!-- <mt-header  title="服务器地址">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="服务器地址"></nav-title>
    <div class="page_bd">
      <div class="weui-cells" style="margin-top:10px;">
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <!-- <p>你当前的服务器地址</p> -->
            <p>{{$store.getters.ip}}</p>
          </div>
          <!-- <div class="weui-cell__ft">{{$store.getters.ip}}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'serverAddress',
  components: {navTitle},
  created () {
  },
  methods: {
  }
}
</script>
<style scoped></style>
