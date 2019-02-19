<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header title="设备详情">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="设备详情"></nav-title>
    <div class="page_bd">
      <div class="padding">
        <a @click="routeAdd" class="left_btn">新建申请</a>
      </div>
      <div class="text-center padding15 margin-top" v-if="list.length === 0">
        <p class="fs16">暂无材料申请</p>
      </div>
      <div v-if="list.length > 0" class="padding-bottom15">
        <div v-for="(item,index) in list" :key="index" @click="routeDetail(item)" class="weui-panel weui-panel_access">
            <div class="weui-panel__hd">{{item.applyTime}}</div>
            <div class="weui-panel__bd ">
                <div v-for="(sub,subIndex) in item.materialList" :key="subIndex" class="weui-media-box weui-media-box_text">
                    <h4 class="weui-media-box__title fs15 " style="margin-bottom:5px;">{{sub.materialName}}</h4>
                    <p class="weui-media-box__desc">
                      <span class="dark_99 fs12">型号: {{sub.smodels}}</span>
                      <span class="dark_99 padding-left15 fs12">规格: {{sub.specification}}</span>
                    </p>
                    <span style="position: absolute;right: 15px;top: 28px;">{{sub.planNum}}</span>
                </div>
            </div>
            <div class="weui-panel__ft">
                <div class="weui-cell weui-cell_link dark_33">
                    <div class="weui-cell__bd">共{{item.materialList.length}}种,{{item.planAllNum}}件材料</div>
                    <span class="weui-cell__ft dark_33">小计: <span class="error_color">￥{{item.planAllPrice}}</span></span>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div v-if="list.length > 0" class="page_ft dark_33  light_bg text-right border-top-half padding15-h" style="line-height:44px;">
      <span class="fs16">合计: <span class="error_color">￥{{totalPrice}}</span></span>
    </div>
    <transition name="page">
      <!-- <keep-alive > -->
        <router-view/>
      <!-- </keep-alive> -->
    </transition>
  </div>
</div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'material',
  components: {navTitle},
  data () {
    return {
      totalPrice: 0,
      subItem: {},
      list: []
    }
  },
  created () {
    this.nav = this.$parent.nav
    console.log(this.$parent.workItem, this.$parent.work)
    this.work = this.$parent.workItem || this.$parent.work
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let p0 = 'UserCS_GetApplyInfoH5'
      let res = await this.$xml(p0, {
        OrgID: this.work.OrgID,
        WordQuertionID: this.work.WorkQuestionID
      })
      // let url = '/ets/syswin/smd/userCSGetApplyInfoH5'
      // let res = await this.$http.post(url, {
      //   orgID: this.work.OrgID,
      //   wordQuertionID: this.work.WorkQuestionID
      // })
      if (res.data && res.data[0]) {
        let total = 0
        this.list = this.$toLower(res.data).map(item => {
          item.planAllNum = item.materialList.reduce((before, sub) => before + (sub.planNum - 0), 0)
          item.planAllPrice = Math.round(item.materialList.reduce((before, sub) => before + (sub.price - 0) * sub.planNum, 0) * 100) / 100
          total += item.planAllPrice
          return item
        })
        this.totalPrice = total
      }
      console.log(res.data)
    },
    routeAdd () {
      this.$router.forward(this.$route.path + '/materialAdd')
    },
    routeDetail (item) {
      this.subItem = item
      this.$router.forward(this.$route.path + '/materialDetail')
    }
  }
}
</script>

<style lang="scss">
.left_btn {
  padding: 10px 30px;
  color:#FFF;
  background:#3395FF;
  margin-left:-15px;
  display: inline-block;
  width:150px;
  text-align:right;
  border-radius: 0 10px 10px 0;
}
</style>
