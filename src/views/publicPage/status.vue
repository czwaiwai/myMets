<template>
  <div class="page">
    <!-- <mt-header title="状态设置">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="状态设置"></nav-title>
    <div class="page_bd">
      <div class="weui-cells weui-cells_radio">
        <label class="weui-cell weui-check__label" for="x11">
          <div class="weui-cell__bd">
            <p>在线</p>
          </div>
          <div class="weui-cell__ft">
            <input type="radio" v-model="status"  class="weui-check" name="radio1" value="0" id="x11">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
        <label class="weui-cell weui-check__label" for="x12">
          <div class="weui-cell__bd">
            <p>离线</p>
          </div>
          <div class="weui-cell__ft">
            <input type="radio" v-model="status"  name="radio1" class="weui-check" value="1" id="x12" checked="checked">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
        <label class="weui-cell weui-check__label" for="x13">
          <div class="weui-cell__bd">
            <p>忙碌</p>
          </div>
          <div class="weui-cell__ft">
            <input type="radio" v-model="status" name="radio1" class="weui-check" value="2" id="x13" checked="checked">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'status',
  components: {navTitle},
  data () {
    return {
      status: '0'
    }
  },
  created () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
