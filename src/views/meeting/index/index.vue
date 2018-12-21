<template>
  <div class="page page_bg">
    <nav-title title="会议"></nav-title>
    <div class="page_bd meeting">
      <div class="banner">
        <img src="../../../assets/img/meeting/banner.png">
      </div>
      <div class="content">
        <div class="destine items clearfix" @click.stop="toDestine">
          <i class="iconfont pics icon-m3-meeting-fill"></i>
          <span>会议预订</span>
        </div>
        <div class="myDestine items clearfix" @click.stop="toMyDestine">
          <i class="iconfont pics icon-yuding"></i>
          <span>我的预订</span>
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
import navTitle from '@/components/navTitle'
import { mapGetters } from 'vuex'
import statusColor from '../components/statusColor'
export default {
  name: 'meeting',
  components: {navTitle},
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      locationData: 'getMeetingLocation',
      statusColor: 'getStatusColor'
    })
  },
  methods: {
    // 到会议预定
    toDestine () {
      this.$store.commit('setSearchKey', '')
      this.$store.commit('setDate', {year: '', month: '', day: ''})
      this.$router.push(`/destine`)
    },
    // 我的预定
    async toMyDestine () {
      this.$router.push(`/myDestine`)
    },
    // 我的会议
    async toMyMeeting () {
      this.$router.push(`/myMeeting`)
    },
    // 获取颜色列表
    async getStatusColor () {
      if (this.statusColor.length) {
        return
      }
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingUseStatusColor', {
        'OrgID': this.$route.query.orgId
      })
      this.$indicator.close()
      console.log(res)
      if (res.data) {
        let resData = this.$toLower(res.data)
        statusColor(resData)
        this.$store.commit('setStatusColor', resData)
      }
    },
    // 获取项目信息
    getLocationData () {
      if (this.locationData.orgId) {
        return
      }
      let location = {
        orgId: this.$route.query.orgId,
        orgName: this.$route.query.orgName,
        employeeId: this.$route.query.employeeId,
        employeeJobId: this.$route.query.employeeJobId
      }
      this.$store.commit('setMeetingLocation', location)
      console.log('locationData', this.locationData)
    }
  },
  created () {
    this.getLocationData()
    this.getStatusColor()
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
