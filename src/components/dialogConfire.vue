<template>
  <transition name="dialog">
      <div class="_dialog" v-if="showDialog">
          <div class="_mark" @click.stop="clickMark"></div>
          <div class="_content">
              <div class="_title">{{title}}</div>
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
      opacity: .8;
      z-index: 10;
    }
    ._content{
      position: absolute;
      left: 1.1rem;
      // top: 50vw;
      top: calc(50vh - 2rem);
      z-index: 11;
      width: 5.28rem;
      background: #fff;
      border-radius: .05rem;
      ._title{
        padding: .7rem .3rem;
        line-height: 1.5;
        font-size: .3rem;
        color: #333;
      }
      .oneBtn{
        border-top: 1px solid #D2D2D2;
        height: .86rem;
        font-size: .34rem;
        color: #0DC88C;
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
          color: #0DC88C;
          line-height: .86rem;
          text-align: center;
        }
      }
    }
  }
</style>
