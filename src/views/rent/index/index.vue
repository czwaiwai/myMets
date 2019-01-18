<template>
  <div class="page page_bg">
    <nav-title title="租赁"></nav-title>
    <div class="page_bd firstPage">
      <div class="banner">
        <img src="../../../assets/img/rent/banner.png">
      </div>
      <div class="content">
        <div class="house items clearfix" @click.stop="toHouse" v-show="showHouse">
          <i class="iconfont pics icon-fangyuan1"></i>
          <span>房源</span>
        </div>
        <div class="guest items clearfix" @click.stop="toGuest" v-show="showGuest">
          <i class="iconfont pics icon-keyuanxiangqing"></i>
          <span>客源</span>
        </div>
        <div class="business items clearfix" @click.stop="toBusinessList" v-show="showBusiness">
          <i class="iconfont pics icon-shangyerenshi"></i>
          <span>商机</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import navTitle from '@/components/navTitle'
export default {
  name: 'index',
  components: {navTitle},
  data () {
    return {
      showHouse: false,
      showGuest: false,
      showBusiness: false
    }
  },
  computed: {
    ...mapGetters({
      guestStatus: 'getGuestStatus',
      businessStatus: 'getBusinessStatus'
    })
  },
  methods: {
    toHouse () {
      this.$router.push(`/houseList`)
    },
    async toGuest () {
      if (this.guestStatus.initStatus) {
        // this.$vux.loading.show()
        // let obj = {
        //   p0: 'UserCS_CustomerSearchList'
        // }
        // let res = await this.$http.post(obj)
        let res = await this.$xml('UserCS_CustomerSearchList', {})
        // this.$vux.loading.hide()
        console.log(res)
        if (res.status !== 200) {
          this.$toast(res.msg)
          return
        }
        res.data.forEach(arr => {
          if (arr.IsDefault === 'True') {
            this.$store.commit('updateGuestStatus', arr)
          }
        })
      }
      this.$router.push(`/guestList`)
    },
    async toBusinessList () {
      console.log(this.businessStatus)
      if (this.businessStatus.initStatus) {
        // this.$vux.loading.show()
        // let obj = {
        //   p0: 'UserCS_OpportSearchList'
        // }
        // let res = await this.$http.post(obj)
        let res = await this.$xml('UserCS_OpportSearchList', {})
        // this.$vux.loading.hide()
        console.log(res)
        if (res.status !== 200 && res.status !== '200') {
          this.$toast(res.msg)
          return
        }
        res.data.forEach(arr => {
          if (arr.IsDefault === 'True') {
            this.$store.commit('updateBusinessStatus', arr)
          }
        })
      }
      this.$router.push(`/businessList`)
    }
  },
  created () {
    if (this.$route.query.mode) {
      let mode = this.$route.query.mode
      if (mode.indexOf('APP_LeaseHouse') > -1) {
        this.showHouse = true
      } else {
        this.showHouse = false
      }
      if (mode.indexOf('APP_LeaseCst') > -1) {
        this.showGuest = true
      } else {
        this.showGuest = false
      }
      if (mode.indexOf('APP_LeaseOpport') > -1) {
        this.showBusiness = true
      } else {
        this.showBusiness = false
      }
    }
    if (localStorage.locationData) {
      let locationData = JSON.parse(localStorage.locationData)
      if (this.$route.query.orgId !== locationData.orgData.orgId) {
        let local = {
          orgData: {orgName: this.$route.query.orgName, orgId: this.$route.query.orgId},
          employeeData: {employeeId: this.$route.query.employeeId, employeeJobId: this.$route.query.employeeJobId}
        }
        localStorage.locationData = JSON.stringify(local)
      } else {
        locationData.employeeData = {employeeId: this.$route.query.employeeId, employeeJobId: this.$route.query.employeeJobId}
        localStorage.locationData = JSON.stringify(locationData)
      }
    } else {
      let local = {
        orgData: {orgName: this.$route.query.orgName, orgId: this.$route.query.orgId},
        employeeData: {employeeId: this.$route.query.employeeId, employeeJobId: this.$route.query.employeeJobId}
      }
      localStorage.locationData = JSON.stringify(local)
    }
  }
}
</script>
<style lang="scss" scoped>
  .firstPage{
    // position: relative;
    // flex: 1;
    // overflow: hidden;
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
    .house .pics{
      background: #3395FF;
    }
    .guest .pics{
      background: #FA8A2C;
    }
    .business .pics{
      background: #2CB4FA;
      font-size: .7rem !important;
      line-height: .9rem !important;
    }
  }
</style>
