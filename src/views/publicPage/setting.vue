<template>
  <div class="page">
    <nav-title title="个人信息"></nav-title>
    <div class="page_bd">
      <div class="weui-cells">
        <div class="weui-cell " >
          <div class="weui-cell__bd">
            <p>头像</p>
          </div>
          <div class="weui-cell__ft">
            <div class="img_wrap main_bg" style="font-size:18px;">
              {{user && user.memberName.slice(-2)}}
            </div>
          </div>
        </div>
      </div>
      <div class="weui-cells">
        <div class="weui-cell " >
          <div class="weui-cell__bd">
            <p>账号</p>
          </div>
          <div class="weui-cell__ft">
            {{user.UserID}}
          </div>
        </div>
        <a @click="$router.forward('/positionId')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>职位</p>
          </div>
          <div class="weui-cell__ft">
            {{user && user.PositionName}}
          </div>
        </a>
      </div>
      <div v-if="$dev" class="weui-cells">
        <a @click="$router.forward('/test')"  class="weui-cell weui-cell_access" href="javascript:;">
          <div class="weui-cell__bd">
            <p>测试页面</p>
          </div>
          <div class="weui-cell__ft">
            {{user && user.PositionName}}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'setting',
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  created () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  .img_wrap {
    width:54px;
    height:54px;
    color: #FFF;
    border:2px solid #FFF;
    border-radius:100%;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
  }
</style>
