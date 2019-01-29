<template>
  <div class="page_modal">
      <div class="page">
          <mt-header title="服务跟踪">
              <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
          </mt-header>
          <div class="page_bd">
            <div class="light_bg weui-flex padding15 margin-bottom">
              <div class="padding-right item_center">
                <i class="iconfont icon-fuwuerji c-666 fs60" style="font-size:30px;"></i>
              </div>
              <div class="weui-flex__item">
                <p>责任人：{{detail.Orders }} <span class="main_color padding-left">{{detail.OrdersMobile }}</span></p>
                <p class="dark_99">辅助责任人:{{detail.PlusEmployeeName }} <span class="padding-left">{{detail.PlusEmployeeNameMobile }}</span></p>
              </div>
            </div>
            <div class="light_bg">
              <ul class="track_time_wrap">
                <li class="border-top-half " v-for="(item, index) in tracks" :key="index" :class="index==0? 'main_color':'dark_99'">
                    <div class="cell padding15-h padding-v">
                        <div class="dot"></div>
                        <!-- <div class="dot" v-bind:class="{'new': index == 0}"></div> -->
                        <div class="pl90 pr30 pt30 pb30">
                            <p class="text">{{item.name}}</p>
                            <p class="fs12">{{ item.time }}</p>
                        </div>
                    </div>
                </li>
              </ul>
            </div>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'customerTracking',
  data () {
    return {
      tracks: [],
      nav: {}
    }
  },
  created () {
    this.nav = this.$parent.nav
    this.detail = this.$parent.detail
    this.tracks = this.$parent.tracks.map(item => {
      return {
        name: this.getStrName(item),
        time: item.WorkOrdTime
      }
    })
  },
  methods: {
    getStrName (obj) {
      let {Name: name, FeedState: feedstate} = obj
      let res = ''
      switch (obj.WorkOrdType) {
        case '101': res = name + '提交了报事，等待服务响应'; break
        case '102': res = name + '完成了接单'; break
        case '103': res = name + '反馈了工单，状态:' + feedstate; break
        case '104': res = name + '填写了材料消耗'; break
        case '105': res = name + '完成了回访，状态:' + feedstate; break
        case '106': res = name + '关闭了工单，服务成功'; break
        case '107': res = '当前待处理人：' + name; break
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.track_time_wrap {
  padding-left:40px;
  & li:before{
    content: "";
    position: absolute;
    height: 100%;
    width: 1px;
    left: -15px;
    border-left: 1px solid #e3e3e3;
  }
  & li.main_color .dot{
    background: #3395FF;
    box-shadow: 0 0 0 4px rgba(51, 149, 255, 0.30);
  }
  & li:first-child:before{
    top:15px;
  }
  & li:last-child:before{
    bottom:38px;
  }
  & .dot {
    border-radius: 100%;
    background: #999;
    width: 10px;
    height: 10px;
    position: absolute;
    z-index:1;
    left: -19px;
    top: 16px;

  }
}
</style>
