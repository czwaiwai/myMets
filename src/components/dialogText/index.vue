<template>
  <transition name="dialog">
    <div class="_dialog" v-if="showDialog">
      <div class="_mark" @click.stop="clickMark"></div>
      <div class="_content">
        <div class="_title">{{title}}</div>
        <div class="_text-box">
          <textarea class="_text" :placeholder="placeholder" v-model="text" :maxLength="maxLength"></textarea>
          <p class="_num">{{text.length}}/{{maxLength}}</p>
        </div>
        <div class="_btns clearfix">
          <div class="_cancel" @click.stop="clickLeftBtn">{{text.length?leftName:'取消'}}</div>
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
    maxLength: {
      type: String,
      default: '100'
    },
    placeholder: {
      type: String,
      default: '请输入...'
    },
    leftName: {
      type: String,
      default: '取消'
    },
    rightName: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      showDialog: false,
      text: ''
    }
  },
  methods: {
    hide () {
      this.showDialog = false
    },
    show () {
      this.showDialog = true
    },
    reset () {
      this.text = ''
    },
    clickMark () {
      this.showDialog = false
      this.$emit('clickMark')
    },
    clickLeftBtn () {
      if (!this.text.length) {
        this.hide()
      }
      this.$emit('clickLeftBtn')
    },
    clickRightBtn () {
      this.$emit('clickRightBtn', this.text)
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
      width: 6rem;
      background: #fff;
      border-radius: .05rem;
      ._title{
        padding: .2rem .3rem;
        line-height: 1.5;
        font-size: .3rem;
        color: #333;
        text-align: center;
      }
      ._text-box{
        position: relative;
        padding: .1rem .3rem .5rem;
        width: 5.4rem;
        height: 2.6rem;
        margin: 0 auto;
        border: 1px solid #d2d2d2;
        border-radius: 3px;
        ._text{
          display: block;
          width: 4.8rem;
          height: 2rem;
          font-size: .28rem;
          color: #333;
          line-height: 1.3;
          &::placeholder{
            font-size: .28rem;
            color: #999;
            line-height: 1.3;
          }
        }
        ._num{
          position: absolute;
          bottom: 0;
          right: .2rem;
          font-size: .28rem;
          color: #999;
        }
      }
      ._btns{
        margin-top: .2rem;
        border-top: 1px solid #D2D2D2;
        ._cancel{
          float: left;
          width: 3rem;
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
          width: 3rem;
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
