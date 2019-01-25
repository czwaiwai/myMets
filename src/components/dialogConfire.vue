<template>
  <transition name="dialog">
    <div class="_dialog" v-if="showDialog">
      <div class="_mark" @click.stop="clickMark"></div>
      <div class="_content">
        <div class="_title" :class="textAlign">{{title}}</div>
        <div class="oneBtn" v-if="oneBtn" @click.stop="clickOneBtn">确定</div>
        <div class="_btns clearfix" v-else>
          <div class="_cancel" @click.stop="clickLeftBtn">{{leftName}}</div>
          <div class="_sure" @click.stop="clickRightBtn">{{rightName}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'dialogConfire',
  props: {
    title: {
      type: String,
      default: ''
    },
    leftName: {
      type: String,
      default: '取消'
    },
    rightName: {
      type: String,
      default: '确定'
    },
    oneBtn: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      showDialog: false
    }
  },
  methods: {
    hide () {
      this.showDialog = false
    },
    show () {
      this.showDialog = true
    },
    clickMark () {
      this.showDialog = false
      this.$emit('clickMark')
    },
    clickLeftBtn () {
      this.$emit('clickLeftBtn')
    },
    clickRightBtn () {
      this.$emit('clickRightBtn')
    },
    clickOneBtn () {
      this.showDialog = false
      this.$emit('clickOneBtn')
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-enter-active, .dialog-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .dialog-enter, .dialog-leave-active {
    opacity: 0
  }
  ._dialog{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 999;
    ._mark{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      opacity: .5;
      z-index: 10;
    }
    ._content{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      z-index: 11;
      width: 5.28rem;
      background: #fff;
      border-radius: .05rem;
      ._title{
        padding: .7rem .3rem;
        line-height: 1.5;
        font-size: .3rem;
        color: #333;
        &.left{
          text-align: left;
        }
        &.center{
          text-align: center;
        }
        &.right{
          text-align: right;
        }
      }
      .oneBtn{
        border-top: 1px solid #D2D2D2;
        height: .86rem;
        font-size: .34rem;
        color: #3395ff;
        line-height: .86rem;
        text-align: center;
      }
      ._btns{
        border-top: 1px solid #D2D2D2;
        ._cancel{
          float: left;
          width: 2.64rem;
          height: .86rem;
          border-right: 1px solid #D2D2D2;
          box-sizing: border-box;
          font-size: .34rem;
          color: #898989;
          line-height: .86rem;
          text-align: center;
        }
        ._sure{
          float: left;
          width: 2.64rem;
          height: .86rem;
          font-size: .34rem;
          color: #3395ff;
          line-height: .86rem;
          text-align: center;
        }
      }
    }
  }
</style>
