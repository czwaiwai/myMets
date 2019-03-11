<template>
  <div>
    <button type="button" @click="voiceClick" class="voice_btn" :class="recTime?'voice_btn_show':''">
      <i class="icon-yuyin iconfont"></i>
      {{recTime || '语音'}}
    </button><button v-show="recTime" class="voice_btn_del" type="button" @click="delVoice"><i class="iconfont icon-icon-1"></i></button>
  </div>
</template>
<script>
export default {
  name: 'voice',
  data () {
    return {
      recTime: '',
      mp3: {}
    }
  },
  created () {
  },
  methods: {
    async voiceClick () {
      if (!this.recTime) {
        if (this.$dev) {
          this.mp3 = {
            path: 'fdsfdfjdsklfjdksljflkdsjfkldsfkldsl',
            duration: '3'
          }
          this.recTime = `${this.mp3.duration}''`
        } else {
          this.mp3 = await this.$app.getRec()
          this.recTime = `${this.mp3.duration}''`
        }
        this.$emit('mp3Voice', {...this.mp3})
      } else {
        await this.$app.playAudio(this.mp3.path)
      }
    },
    delVoice () {
      this.recTime = ''
      this.mp3 = {}
      this.$emit('delVoice')
    }
  }
}
</script>

<style lang="scss" scoped>
  .voice_btn {
    background:transparent;
    border:1px solid #cbcbcb;
    color:#8E8E93;
    padding:3px 10px;
    border-radius:20px;
    outline: none;
  }
  .voice_btn.voice_btn_show {
    border-radius:20px 0 0  20px;
  }
  .voice_btn_del {
    background:transparent;
    border:1px solid #cbcbcb;
    border-left-style:none;
    color:red;
    padding:3px 5px;
    border-radius:0 10px 10px 0;
    outline: none;
  }
</style>
