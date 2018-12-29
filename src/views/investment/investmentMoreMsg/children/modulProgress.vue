<template>
  <div class="modulProgress">
    <div class="progressBox mt20" v-for="(item,index) in 20" :key="index">
      <div class="title">
        <span class="time">2018-10-11</span>
        <span class="name">胡歌</span>
      </div>
      <div class="msg">
        <p class="value">业主不想卖了，觉得现在不划算业主不想卖了，觉得现在不划算业主不想卖了，觉得现在不划算业主不想卖了，觉得现在不划算</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modulProgress',
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .modulProgress{
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
