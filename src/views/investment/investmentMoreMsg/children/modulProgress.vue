<template>
  <div class="modulProgress">
    <div class="progressBox mt20" v-for="(item,index) in progressList" :key="index">
      <div class="title">
        <span class="time">{{com_setAllDate(item.CreateTime)}}</span>
        <span class="name">{{item.CreateUser}}</span>
      </div>
      <div class="msg">
        <p class="value" v-if="item.ProjPlan">{{item.ProjPlan}}</p>
        <p class="value" v-else>暂无</p>
      </div>
    </div>
    <none-page title="暂无数据~" v-show="progressList.length==0"></none-page>
  </div>
</template>
<script>
import nonePage from '@/components/nonePage/index.vue'
import dateChange from '@/mixins/dateChange'
export default {
  name: 'modulProgress',
  components: {nonePage},
  mixins: [dateChange],
  props: {
    progressList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .modulProgress{
    width: 100vw;
    height: calc(100vh - 1.76rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .progressBox{
      background: #fff;
      .title{
        position: relative;
        height: .88rem;
        padding: 0 .3rem;
        line-height: .88rem;
        font-size: .34rem;
        color: #333;
        border-bottom: 1px solid #ededed;
        .name{
          position: absolute;
          right: .3rem;
          top: 0;
          display: block;
          height: .88rem;
          line-height: .88rem;
          color: #999;
        }
      }
      .msg{
        padding: .2rem .3rem;
        .value{
          font-size: .3rem;
          color: #333;
          line-height: 1.5;
        }
      }
    }
  }
</style>
