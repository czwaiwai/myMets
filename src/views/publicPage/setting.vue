<template>
    <div class="page">
        <mt-header title="个人信息">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-cells">
            <div class="weui-cell " >
              <div class="weui-cell__bd">
                <p>头像</p>
              </div>
              <div class="weui-cell__ft">
                <div class="img_wrap main_bg">
                  {{user && user.UserID.slice(-2)}}
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
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'setting',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  created () {
  },
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
