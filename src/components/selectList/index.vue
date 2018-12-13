<template>
  <transition name="selectList">
    <div class="selectList" v-if="dialogShow">
      <div class="mark" @click.stop="hide"></div>
      <div class="_content">
        <h3 class="title">{{selectData.title}}</h3>
        <ul class="list">
          <li class="item" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectData.list" :key="index" @click.stop="selectItem(item,index)">{{item.showText||item.Text||item.CstName}}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'selectList',
  props: {
    selectData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogShow: false
    }
  },
  methods: {
    hide () {
      this.dialogShow = false
    },
    show () {
      this.dialogShow = true
    },
    selectItem (item, index) {
      item.hasSelect = true
      item.isSelect = true
      this.$emit('selectItem', item)
      this.hide()
    }
  }
}
</script>
<style lang="scss" scoped>
  .selectList-enter-active, .selectList-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .selectList-enter, .selectList-leave-active {
    opacity: 0
  }
  .selectList{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 9999;
    .mark{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9;
      overflow: hidden;
      background: #000;
      opacity: .5;
    }
    ._content{
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 11;
      width: 5.64rem;
      white-space:nowrap;
      transform: translate(-50%,-50%);
      background: #fff;
      border-radius: .1rem;
      overflow: hidden;
      .title{
          height: .95rem;
          font-size: .34rem;
          color: #333;
          text-align: center;
          line-height: .95rem;
          border-bottom: 1px solid #ededed;
      }
      .list{
        min-height: .8rem;
        max-height: 6.65rem;
        padding: 0 .3rem;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        .item{
          padding: .2rem 0;
          font-size: .3rem;
          color: #333;
          line-height: 1.3;
          white-space: normal;
          border-bottom: 1px solid #ededed;
          &.isSelect{
            color: #3395FF;
          }
        }
      }
    }
  }
</style>
