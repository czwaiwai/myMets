<template>
  <div class="baseMsg">
    <div class="base" @click.stop="showBox">
      <span class="name">基本信息</span>
      <span class="status">
        <span class="btn">{{showMsg?'收起':'展开'}}</span>
        <i class="iconfont" :class="showMsg?'icon-zhankai1':'icon-zhankai'"></i>
      </span>
    </div>
    <collapse-transition>
      <ul class="msg" v-show="showMsg && listMsg.length">
        <li class="item" v-for="(item,index) in listMsg" :key="index">
          <span class="name">{{item.ShowText}}</span>
          <span class="value">：{{item.Value}}</span>
        </li>
      </ul>
    </collapse-transition>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
export default {
  name: 'baseMsg',
  components: {CollapseTransition},
  props: {
    listMsg: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showMsg: false
    }
  },
  methods: {
    showBox () {
      this.showMsg = !this.showMsg
    }
  }
}
</script>

<style lang="scss" scoped>
  .baseMsg{
    margin-bottom: .2rem;
    .base{
      position: relative;
      width: 100vw;
      height: .8rem;
      padding: 0 .3rem;
      line-height: .8rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .name{
        font-size: .3rem;
        color: #333;
      }
      .status {
        position: absolute;
        right: .3rem;
        top: 0;
        display: block;
        height: .8rem;
        font-size: .28rem;
        color: #FA8A2C;
      }
    }
    .msg{
      width: 100vw;
      padding: .1rem .3rem;
      background: #fff;
      .item{
        display: flex;
        align-items: center;
        margin: .1rem 0;
        .name{
          width: 2rem;
          min-height: .4rem;
          font-size: .28rem;
          color: #999;
          line-height: .4rem;
        }
        .value{
          flex: 1;
          height: .4rem;
          font-size: .28rem;
          line-height: .4rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
