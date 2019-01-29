<template>
<div class="page_modal">
    <div class="page">
        <mt-header title="回访详情">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-panel weui-panel_access">
            <div class="weui-panel__hd">
              {{detail.ObjectName}} <span class="padding-left">{{detail.ReturnVisitWay}}</span>
              <span class="fs15 main_color float_right">{{detail.VisitState }}</span>
            </div>
            <div class="weui-panel__bd">
                <div class="weui-media-box weui-media-box_text">
                    <h4 class="weui-media-box__title">
                      客服满意度 <span>
                        <i class="iconfont icon-star" ></i>
                        <i class="iconfont icon-star" ></i>
                        <i class="iconfont icon-star" ></i>
                        <i class="iconfont icon-star" ></i>
                        <i class="iconfont icon-wujiaoxingkong" ></i>
                      </span>
                    </h4>
                    <!-- <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p> -->
                </div>
            </div>
            <div class="weui-panel__ft">
                <div class="weui-cell weui-cell_access weui-cell_link">
                    <div class="weui-cell__bd text-right dark_99">{{detail.ReturnVisitDate}}</div>
                </div>
            </div>
          </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: 'visitDetail',
  data () {
    return {
      nav: {},
      work: {},
      detail: {}
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.work = this.$parent.workItem
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let url = '/ets/syswin/smd/userCSReturnVisitHistoryH5'
      let res = await this.$http.post(url, {
        wordOrdId: this.work.WorkOrdID
      })
      if (res.data[0]) {
        this.detail = res.data[0]
      }
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

</style>
