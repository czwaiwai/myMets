<template>
  <div class="page_modal">
    <div class="page picDetail">
      <nav-title title="平面位置图"></nav-title>
      <div class="page_bd _content">
        <div  v-if="imageList.length">
          <img preview :src="item.Path" v-for="(item,index) in imageList" :key="index" class="pic">
        </div>
        <none-page title="暂无平面位置图~" v-else></none-page>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import nonePage from '../components/nonePage/index.vue'
export default {
  name: 'picDetail',
  components: {navTitle, nonePage},
  data () {
    return {
      imageList: []
    }
  },
  methods: {
    // 获取轮播图列表
    async getPicList () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_GetMeettingRoomImageInfo', {
        'MeettingRoomID': this.$parent.$route.params.id,
        'TypeStr': 'Plant'
      })
      console.log('UserCS_GetMeettingRoomImageInfo:', res)
      this.$indicator.close()
      if (res.data.length && res.data[0].ImageList && res.data[0].ImageList.length) {
        this.imageList = res.data[0].ImageList
        this.$previewRefresh()
      }
    }
  },
  created () {
    this.getPicList()
  }
}
</script>
<style lang="scss" scoped>
  .picDetail{
    ._content{
      .pic{
        display: inline-block;
        width: 100vw;
        height: auto;
      }
    }
  }
</style>
