<template>
  <div class="page page_bg">
    <div class="page_bd meeting">
      <div class="banner">
        <img src="../../../assets/img/meeting/banner.png">
      </div>
      <div class="content">
        <div class="destine items clearfix" @click.stop="toDestine">
          <i class="iconfont pics icon-m3-meeting-fill"></i>
          <span>会议预定</span>
        </div>
        <div class="myDestine items clearfix" @click.stop="toMyDestine">
          <i class="iconfont pics icon-yuding"></i>
          <span>我的预定</span>
        </div>
        <div class="myMeeting items clearfix" @click.stop="toMyMeeting">
          <i class="iconfont pics icon-meeting"></i>
          <span>我的会议</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'meeting',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
    })
  },
  methods: {
    toDestine () {
      this.$router.push(`/destine`)
    },
    async toMyDestine () {
      this.$router.push(`/myDestine`)
    },
    async toMyMeeting () {
      this.$router.push(`/myMeeting`)
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
  .meeting{
    .banner{
      width: 100vw;
      height: 3.2rem;
      img{
        width: 100%;
        height: 100%;
        margin-top: -1px;
      }
    }
    .content{
      padding: 0 .3rem;
      .items{
        margin-top: .22rem;
        height: 1.68rem;
        font-size: .34rem;
        line-height: 1.68rem;
        color: #333;
        background: #fff;
        border-radius: .1rem;
        .pics{
          float: left;
          width: 1rem;
          height: 1rem;
          margin: .34rem .3rem;
          font-size: .5rem;
          color: #fff;
          line-height: 1rem;
          text-align: center;
          border-radius: .5rem;
        }
      }
    }
    .destine .pics{
      background: #0DC88C;
    }
    .myDestine .pics{
      background: #FA8A2C;
    }
    .myMeeting .pics{
      background: #2CB4FA;
      line-height: 1.1rem !important;
      font-size: .46rem !important;
    }
  }
</style>
