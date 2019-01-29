<template>
  <div class="app_bd">
    <div class="tab-bd">
        <transition name="fade">
          <keep-alive include="">
            <router-view/>
          </keep-alive>
        </transition>
    </div>
    <div class="tab-bar">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="tabHome">
          <img v-if="selected === 'tabHome'"  slot="icon" src="../assets/img/tab/ic_tab_message_selected.png">
          <img v-else slot="icon" src="../assets/img/tab/ic_tab_message.png">
          消息
        </mt-tab-item>
        <mt-tab-item id="tabWork">
          <img v-if="selected === 'tabWork'" slot="icon" src="../assets/img/tab/ic_tab_work_selected.png">
          <img v-else slot="icon" src="../assets/img/tab/ic_tab_work.png">
          工作
        </mt-tab-item>
        <mt-tab-item  style="position:relative;" >
          <div  @click="toolShow" slot="icon">
            <img  class="tab_add" src="../assets/img/tab/ic_tab_plsh.png">
          </div>
          <div @click="toolShow">
            添加
          </div>
        </mt-tab-item>
        <mt-tab-item id="tabReport">
          <img v-if="selected === 'tabReport'" slot="icon" src="../assets/img/tab/ic_tab_stata_selected.png">
          <img v-else slot="icon" src="../assets/img/tab/ic_tab_stata.png">
          报表
        </mt-tab-item>
        <mt-tab-item id="tabMy">
          <img v-if="selected === 'tabMy'" slot="icon" src="../assets/img/tab/ic_tab_person_selected.png">
          <img v-else slot="icon" src="../assets/img/tab/ic_tab_person.png">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
    <transition name="fade">
      <div v-if="isTool" class="tool_warp" @click="toolOut">
        <div class="tool_content">
          <div class="weui-flex text-center fs16">
            <div class="weui-flex__item  delay_01" :class="animateIn?'bounceInUp animated':'bounceOutDown animated_out'">
              <button @click.stop="callPhoto" class="tool_btn">
                <img src="../assets/img/tool/bottom_icon_photo.png">
              </button>
              <p style="line-height:2">拍照</p>
            </div>
            <div class="weui-flex__item  delay_02" :class="animateIn?'bounceInUp animated':'bounceOutDown animated_out'">
              <button  @click.stop="callScan"  class="tool_btn">
                <img src="../assets/img/tool/bottom_icon_scanning.png">
              </button>
              <p  style="line-height:2">扫码</p>
            </div>
            <div class="weui-flex__item  delay_03" :class="animateIn?'bounceInUp animated':'bounceOutDown animated_out'">
              <button  @click.stop="callVoice"  class="tool_btn" >
                <img src="../assets/img/tool/bottom_icon_voice.png">
              </button>
              <p  style="line-height:2">语音</p>
            </div>
          </div>
          <div class="text-center padding-top15">
            <button class="tool_show_btn"   :class="animateIn?'rotate animated':'rotate_out animated_out'" @click="toolOut">
              <img src="../assets/img/tool/ic_add_bottom.png">
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import sess from '../utils/sess'
export default {
  name: 'index',
  data () {
    return {
      isTool: false,
      btnAnimate: false,
      animateIn: false,
      selected: ''
    }
  },
  created () {
    this.selected = this.$route.name
  },
  watch: {
    selected: function (id, oldVal) {
      if (id) {
        this.$router.push({name: id})
      } else {
        this.selected = oldVal
      }
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'auth': 'auth'
    })
  },
  methods: {
    toolShow () {
      this.animateIn = true
      this.isTool = !this.isTool
    },
    toolOut () {
      this.animateIn = false
      setTimeout(() => {
        this.isTool = false
      }, 500)
    },
    quickOut () {
      this.animateIn = false
      this.isTool = false
    },
    callPhoto () {
      this.$app.waterCamera().then(res => {
        this.quickOut()
        sess.set('mainImg', res)
        sess.remove('mainVoice')
        this.$router.forward({path: '/btnFunc'})
      }).catch(err => {
        console.log(err)
        if (this.$dev) {
          this.quickOut()
          sess.set('mainImg', 'hahahah')
          sess.remove('mainVoice')
          this.$router.forward({path: '/btnFunc'})
        }
      })
    },
    callScan () {
      this.$app.scan().then((res) => {
        console.log(res)
        // this.$router.forward({path: '/btnFunc', params:{data: res}})
        this.$app.loadView({url: `http://${this.ip}/ETSScancode/?device_id=${res}#page=0`, type: 'shebeisaoma'})
      }).catch(err => {
        if (this.$dev) {
          this.quickOut()
          this.$router.forward('/scan/ScanDetail/XM001RD-XF-CC001')
        }
        console.log(err)
      })
    },
    callVoice () {
      this.$app.getRec().then((res) => {
        console.log('getRec_res:', res)
        sess.set('mainVoice', res)
        sess.remove('mainImg')
        this.quickOut()
        this.$router.forward({path: '/btnFunc'})
      }).catch(err => {
        console.log(err)
        if (this.$dev) {
          this.quickOut()
          sess.set('mainVoice', '设置语音')
          sess.remove('mainImg')
          this.$router.forward({path: '/btnFunc'})
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .mint-tabbar {
    background-color: #FFF;
    padding-top: 1px;
  }
  .mint-tab-item {
    color:#989898;
  }
  .mint-tabbar > .mint-tab-item.is-selected {
    color:#0DC88C;
    background-color:#FFF;
  }
  .tool_warp {
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background: rgba(255, 255, 255, 0.7);
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both
  }
  .animated_out {
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  .delay_01 {
    animation-delay: 0s;
  }
  .delay_02 {
    animation-delay: .1s;
  }
  .delay_03 {
    animation-delay: .2s;
  }

  .animate_rotate {
     transform: rotateZ(135deg);
  }
   @-webkit-keyframes rotateHalf {
    from {transform: rotateZ(0);}
    to {transform: rotateZ(135deg);}
   }
  @keyframes rotateHalf {
    from {transform: rotateZ(0);}
    to {transform: rotateZ(135deg);}
  }
  @-webkit-keyframes rotateHalfOut {
    from  {transform: rotateZ(135deg);}
    to  {transform: rotateZ(0);}
  }
  @keyframes rotateHalfOut {
    from  {transform: rotateZ(135deg);}
    to  {transform: rotateZ(0);}
  }

  .rotate {
    -webkit-animation-name: rotateHalf;
    animation-name: rotateHalf;
  }
  .rotate_out {
    -webkit-animation-name: rotateHalfOut;
    animation-name: rotateHalfOut;
  }
  @-webkit-keyframes bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 3000px, 0);
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  75% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 3000px, 0);
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  75% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.bounceInUp {
  -webkit-animation-name: bounceInUp;
  animation-name: bounceInUp;
}
@-webkit-keyframes bounceOutDown {
  20% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  40%,
  45% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 2000px, 0);
    transform: translate3d(0, 2000px, 0);
  }
}

@keyframes bounceOutDown {
  20% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  40%,
  45% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 2000px, 0);
    transform: translate3d(0, 2000px, 0);
  }
}

.bounceOutDown {
  -webkit-animation-name: bounceOutDown;
  animation-name: bounceOutDown;
}
</style>
<style lang="scss" scoped>
  .tool_content {
    bottom: 16px;
    position: absolute;
    width: 100%;
    z-index:11;
  }
  .tool_show_btn {
    border: none;
    background: transparent;
    outline: none;
    & img {
      width: 60px;
    }
  }
  .tool_btn {
    border: none;
    background: transparent;
    outline: none;
    & img {
      width: 20vw;
    }
  }
.tab_add{
  position: absolute;
  width: 50px;
  top: -18px;
  left: 50%;
  margin-left: -25px;
}

</style>
