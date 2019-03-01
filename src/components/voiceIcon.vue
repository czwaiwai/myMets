<template>
  <div  class="voiceIcon">
    <div class="voice_icon_wrap">
      <div class="voice_icon">
        <div class="voice_dot"></div>
        <div class="voice_radius_1"></div>
        <div class="voice_radius_2"></div>
        <div class="voice_icon_mask " :class="isVoice?'voice_animate':''"></div>
      </div>
      <!-- <audio ref="audio" :src="com_url()" v-if="url"></audio> -->
    </div>
    <p class="num">{{audioLength}}</p>
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
    length: {
      type: String,
      default: '0'
    },
    url: String
  },
  data () {
    return {
      audio: '',
      audioSrc: '',
      audioLength: 0,
      time: ''
    }
  },
  created () {
    this.audioLength = this.length - 0
  },
  mounted () {
    this.audio = this.$refs.audio
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
    async getVoiceData (id) {
      console.log(id.replace(/^.*\/([^\\.]+).mp3$/, '$1'))
      let p0 = 'UserCS_GetVoiceInfo'
      let res = await this.$xml(p0, {
        ImageID: id.replace(/^.*\/([^\\.]+).mp3$/, '$1')
      })
      return res.data[0].MP3
    },
    async play () {
      if (!this.mp3) {
        this.mp3 = await this.getVoiceData(this.url)
      }
      // console.log(this.mp3)
      this.$app.playAudio(this.mp3)
      // if (!this.audio) {
      //   this.audio = this.$refs.audio
      //   console.log(this.url)
      //   // this.audio.src = 'http://172.31.118.201:8092' + this.url
      //   this.audio.onended = () => {
      //     this.$emit('update:isVoice', false)
      //     clearInterval(this.timer)
      //   }
      // }
      // this.audio.load()
      // this.audio.play()
      this.audioLength = this.length - 0
      this.time = setInterval(() => {
        this.audioLength -= 1
        console.log(this.audioLength)
        if (!this.audioLength) {
          this.$emit('update:isVoice', false)
          clearInterval(this.time)
          setTimeout(() => {
            this.audioLength = this.length - 0
          }, 500)
        }
      }, 1000)
    },
    stop () {
      if (this.mp3) {
        this.$app.playAudio(this.mp3)
      }
      // if (this.audio) {
      //   this.audio.pause()
      clearInterval(this.time)
      setTimeout(() => {
        this.audioLength = this.length - 0
      }, 500)
      // }
    },
    com_url () {
      let ip = this.$store.getters.ip
      if (ip) {
        return 'http://' + ip + this.url
      } else {
        return this.url
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
.voiceIcon{
  position: relative;
}
.num{
  position: absolute;
  right: 5px;
  top: 0;
  height: 34px;
  line-height: 34px;
  font-size: 13px;
  line-height: 34px;
  color: #fff;
}
</style>
