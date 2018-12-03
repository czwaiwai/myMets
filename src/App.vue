<template>
  <div id="app" transition-direction="forward">
    <transition name="page" >
      <!--:include="/a|b/"-->
      <keep-alive include="index">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import pushBus from './utils/pushMsg'
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      selected: 'index',
      direction: 'forward',
      isTab: false
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'auth': 'auth',
      'rand': 'rand'
    }),
  },
  created () {
    // 首次初始化
    this.$root.back = function () {
      history.back()
    }
    let that = this
    pushBus.$on('jPush', function (data) {
      console.log(data, 'pushMsg收到的数据---')
      that.$app.loadView({url: 'http://'　+ that.ip +'/ETSmobileApproval/#page=0', type:'shenpi'})
    })
  },
  watch: {
    $route (to, from) {
      if (this.$app.isAndroid) {
        if (['tabHome', 'tabWork', 'tabReport', 'tabMy'].indexOf(to.name) > -1) {
          this.$app.outApp('out')
        } else {
          this.$app.outApp('back')
        }
      }
    }
  },
  methods: {
    back () {
      this.direction = 'back'
      history.back()
      console.log('返回')
    }
  }
}
</script>

<style lang="scss" >
  .page-enter-active, .page-leave-active,.page-enter-active,.page-leave-active {
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-backface-visibility: hidden;
    -webkit-transition-timing-function: cubic-bezier(.36,.66,.04,1);
    transition-timing-function: cubic-bezier(.36,.66,.04,1);
    -webkit-transform-style: preserve-3d;
    -webkit-transition-property: opacity,-webkit-transform;
    transition-property: opacity,transform
  }
  /*.page-enter-active,.page-leave-active {*/
    /*-webkit-transition-duration: .2s;*/
    /*transition-duration: .2s;*/
    /*-webkit-transition-timing-function: cubic-bezier(.4,.6,.2,1);*/
    /*transition-timing-function: cubic-bezier(.4,.6,.2,1)*/
  /*}*/

  [transition-direction=forward] .page-enter {
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(100%,0,0);
    opacity: 1;
    z-index: 2
  }
  [transition-direction=forward] .page-enter-active, .page-leave-active {
    position:absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
   [transition-direction=forward] .page-enter-active {
     box-shadow: 0 0 10px rgba(0,0,0,.15)
   }
   [transition-direction=forward] .page-enter-to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
    z-index: 2
  }
   [transition-direction=forward] .page-leave {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    /*opacity: .8;*/
    z-index: 1
  }
  [transition-direction=forward] .page-leave-to {
    -webkit-transform: translate3d(-33%,0,0);
    transform: translate3d(-33%,0,0);
    /*opacity: 0.5;*/
    z-index: 0
  }

  [transition-direction=back] .page-enter {
    -webkit-transform: translate3d(-33%,0,0);
    transform: translate3d(-33%,0,0);
    opacity: .8;
    z-index: 1
  }

  [transition-direction=back] .page-enter-to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
    z-index: 1
  }

  [transition-direction=back] .page-leave {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
    z-index: 2
  }

  [transition-direction=back] .page-leave-active {
    box-shadow: 0 0 10px rgba(0,0,0,.15)
  }

  [transition-direction=back] .page-leave-to {
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(100%,0,0);
    opacity: 1;
    z-index: 2
  }
  .fade-enter-active {
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
