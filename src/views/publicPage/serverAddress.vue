<template>
  <div class="page">
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
export default {
  name: 'serverAddress',
  components: {},
  created () {
  },
  methods: {
  }
}
</script>
<style scoped></style>
