<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="查找添加">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <search v-model="search"></search>
      </div>
      <div @click="searchClick" class=" weui-search-bar" style="background:#EFEFF4;padding:0 10px 0 0 ;">
        <i class="main_color icon-sousuo iconfont" style="font-size: 18px; line-height: 43px;"></i>
      </div>
    </div>
    <div class="top_result padding15-h">
        <p>查找结果:  {{list.length}}条</p>
    </div>
    <div class="page_bd">

      <div class="light_bg">
        <ul>
          <li class="padding15-h padding-v border-top-half" v-for="(item,key) in list" :key="key" >
            <p>
              <span>黑白复印纸</span>
              <span class="dark_99 float_right">库存:189</span>
            </p>
            <p>
              <span class="prop_bl dark_99">型号:70g</span>
              <span class="prop_bl dark_99">规格:A4/70g</span>
            </p>
            <div class="weui-flex">
              <p class="error_color">￥30.00</p>
              <div class="weui-flex__item"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="page_ft weui-flex light_bg">
       <div class="padding-h">
         <i class="iconfont icon-xuqiu-hui" style="font-size:32px;"></i>
       </div>
       <div class="weui-flex__item text-right padding-right15">
         <p class="dark_99 " style="line-height:44px;">请添加材料</p>
       </div>
    </div>
  </div>
</div>
</template>
<script>
import Search from '@/components/search'
export default {
  name: 'repairDetail',
  components: {Search},
  data () {
    return {
      search: '',
      list: []
    }
  },
  created () {
    this.nav = this.$parent.nav
  },
  methods: {
    async getPageData () {
      let url = '/ets/table/list/userCSGetMaterialInfoH5'
      let res = await this.$http.post(url, {
        orgID: this.nav.orgId,
        employeeID: this.nav.memberId,
        materialQuery: ''
      })
      this.list = res.data
      console.log(res.data)
    },
    searchClick () {
      this.getPageData()
    }
  }
}
</script>

<style lang="scss" scoped>
.top_result {
  height:25px;
  color: #9B9B9C;
  background: #F1F2F4;
  line-height:25px;
}
.prop_bl {
  width:120px;
  display:inline-block;
}
</style>
