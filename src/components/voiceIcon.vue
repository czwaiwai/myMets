<template>
  <div class="voice_icon_wrap">
    <div class="voice_icon">
      <div class="voice_dot"></div>
      <div class="voice_radius_1"></div>
      <div class="voice_radius_2"></div>
      <div class="voice_icon_mask " :class="isVoice?'voice_animate':''"></div>
    </div>
    <audio ref="audio"></audio>
  </div>
</template>
<script>
// 组件模块
export default {
  name: 'voiceIcon',
  props: {
    isVoice: {
      type: Boolean,
      default: false
    },
    url: String
  },
  created () {

  },
  watch: {
    isVoice (val, old) {
      if (typeof val !== 'boolean') return
      if (val) {
        this.play()
      } else {
        this.stop()
      }
    }
  },
  methods: {
    play () {
      if (!this.audio) {
        this.audio = this.$refs.audio
        console.log(this.url)
        this.audio.src = this.url
        this.audio.onended = () => {
          this.$emit('update:isVoice', false)
          clearInterval(this.timer)
        }
      }
      this.audio.load()
      this.audio.play()
    },
    stop () {
      if (this.audio) {
        this.audio.pause()
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="less"> -->
<style scoped lang="scss">
@keyframes voice{
  0%  {transform: translate3d(-14px, -14px, 0)  rotateZ(45deg);}
  30% {transform: translate3d(-20px, -20px, 0)  rotateZ(45deg);}
  50% {transform: translate3d(-20px, -20px, 0)  rotateZ(45deg);}
  70% {transform: translate3d(-30px, -30px, 0)  rotateZ(45deg);}
  100% {transform: translate3d(-30px, -30px, 0)  rotateZ(45deg);}
}
@-webkit-keyframes voice {
  0%   {transform: translate3d(-14px, -14px, 0)  rotateZ(45deg);}
  30%  {transform: translate3d(-20px, -20px, 0)  rotateZ(45deg);}
  50%  {transform: translate3d(-20px, -20px, 0)  rotateZ(45deg);}
  70%  {transform: translate3d(-30px, -30px, 0)  rotateZ(45deg);}
  100% {transform: translate3d(-30px, -30px, 0)  rotateZ(45deg);}
}
.voice_animate {
  animation: voice 1.5s infinite;
  animation-timing-function: steps(1) ;
}
.voice_icon_wrap {
  width: 17px;
  height: 17px;
  overflow: hidden;
  transform: translate(0,-6px) rotateZ(135deg);
  transform-origin: bottom;
}
.voice_icon {
  position: relative;
  width:34px;
  height:34px;
  .voice_icon_mask {
    width: 100%;
    height: 100%;
    background: #3395FF;
    position: absolute;
    transform: translate3d(-30px, -30px, 0)  rotateZ(45deg);
  }
  .voice_dot{
    width:6px;
    height:6px;
    background:#FFF;
    border-radius:100%;
    position: absolute;
    margin-top: 50%;
    margin-left: 50%;
    transform: translate3d(-50%,-50%,0);
  }
  .voice_radius_1 {
    position: absolute;
    border-radius: 100%;
    width:20px;
    height:20px;
    border:2px solid #FFF;
    margin-top: 50%;
    margin-left: 50%;
    transform: translate3d(-50%,-50%,0);
  }
  .voice_radius_2 {
    position: absolute;
    border-radius:100%;
    width:35px;
    height:35px;
    border:2px solid #FFF;
    margin-top: 50%;
    margin-left: 50%;
    transform: translate3d(-50%,-50%,0);
  }
}
</style>
