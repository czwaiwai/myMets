<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <div class="page_bd saveRes">
      <div class="header">
        <p class="title">{{houseDetail.ResCode}}</p>
        <p class="name"><span v-if="houseDetail.RentalArea">{{com_point(houseDetail.RentalArea)}}㎡/</span><span v-show="houseDetail.FloorNum">{{houseDetail.FloorNum}}层/</span><span v-show="houseDetail.ResType">{{houseDetail.ResType}}</span></p>
        <p class="building">{{houseDetail.GrpName}}{{houseDetail.BudName}}<span v-show="houseDetail.UnitNO">{{houseDetail.UnitNO}}单元</span><span v-show="houseDetail.ResNO">{{houseDetail.ResNO}}号</span></p>
      </div>
      <div class="content">
        <div class="date clearfix" @click.stop="openPicker">
          <span class="dateName">{{dateName}}</span>
          <input class="inputBox" type="text" placeholder="选择日期" v-model="dateTimes" readonly="readonly">
          <i class="iconfont icon-gengduo1"></i>
        </div>
        <div class="text-wrap clearfix">
          <p class="tip">{{tipName}}</p>
          <textarea class="text-box" placeholder="请填写（选填）" v-model="remark"></textarea>
        </div>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor':dateTimes.length}" @click.stop="submit">{{btnName}}</div>
      </div>
    </div>
    <datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="new Date()"
      @confirm="handleConfirm"
      v-model="pickerValue">
    </datetime-picker>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import comPoint from '@/mixins/comPoint'
import navTitle from '@/components/navTitle'
import { DatetimePicker } from 'mint-ui'
export default {
  name: 'saveRes',
  mixins: [comPoint],
  components: {navTitle, DatetimePicker},
  data () {
    return {
      locationData: {},
      pageType: '',
      dateName: '',
      dateTime: '',
      tipName: '',
      btnName: '',
      dateTimes: '',
      remark: '',
      isHttping: false,
      title: '',
      pickerValue: ''
    }
  },
  watch: {
    remark (newVal, oldVal) {
      if (newVal.length > 300) {
        this.remark = newVal.slice(0, 300)
      }
    }
  },
  computed: {
    ...mapGetters({
      houseDetail: 'getHouseDetail'
    })
  },
  methods: {
    handleConfirm (date) {
      this.dateTimes = date.format('yyyy-MM-dd')
    },
    openPicker () {
      this.$refs.picker.open()
      this.pickerValue = this.dateTimes
    },
    async submit () {
      if (this.dateTimes.length) {
        if (this.isHttping) {
          return
        }
        this.isHttping = true
        // this.$vux.loading.show()
        // let obj = {
        //   p0: 'UserAppHouse_UpdateHouseStatus',
        //   p7: {
        //     'HouseID': this.$route.params.id,
        //     'StatusKey': this.$route.query.type === 0 ? '1' : '2',
        //     'Stime': this.com_time(),
        //     'Etime': this.dateTimes,
        //     'Memo': this.remark,
        //     'EmployeeID': this.locationData.employeeData.employeeId
        //   }
        // }
        // let res = await this.$http.post(obj)
        let res = await this.$xml('UserAppHouse_UpdateHouseStatus', {
          'HouseID': this.$route.params.id,
          'StatusKey': this.$route.query.type === 0 ? '1' : '2',
          'Stime': this.com_time(),
          'Etime': this.dateTimes,
          'Memo': this.remark,
          'EmployeeID': this.locationData.employeeData.employeeId
        })
        this.$toast(res.msg)
        console.log(res)
        setTimeout(() => {
          this.isHttping = false
          this.$router.go(-1)
        }, 2000)
        // if (res.Syswin[0].status === 1 || res.Syswin[0].status === '1') {
        //   if (this.$route.query.type === 0) {
        //     // this.$vux.toast.text('保留成功！')
        //   } else {
        //     // this.$vux.toast.text('预定成功！')
        //   }
        //   setTimeout(() => {
        //     this.isHttping = false
        //     this.$router.go(-1)
        //   }, 2000)
        // } else {
        //   this.isHttping = false
        //   if (this.$route.query.type === 0) {
        //     // this.$vux.toast.text('保留失败！')
        //   } else {
        //     // this.$vux.toast.text('预定失败！')
        //   }
        // }
      } else {
        // this.$vux.toast.text('请选择日期！')
      }
    },
    com_time () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let time = year + '-' + month + '-' + strDate
      return time
    },
    com_endTIme () {
      let date = new Date(new Date().getTime() + (3600 * 24 * 1000))
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let time = year + '-' + month + '-' + strDate
      return time
    }
  },
  created () {
    if (this.$route.query.type === 0) {
      document.title = '保留资源'
      this.title = '保留资源'
      this.btnName = '保留'
      this.dateName = '保留截至'
      this.tipName = '保留原因'
      this.pageType = this.$route.query.type
    } else {
      document.title = '预定资源'
      this.title = '预定资源'
      this.btnName = '预定'
      this.dateName = '预定截至'
      this.tipName = '预定原因'
      this.pageType = this.$route.query.type
    }
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .saveRes{
    // position: relative;
    // flex: 1;
    // overflow: hidden;
    .header{
      padding: .2rem .3rem;
      background: #fff;
      .title{
        line-height: 1.5;
        font-size: .34rem;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .name, .building{
        margin-top: .1rem;
        line-height: 1.2;
        font-size: .28rem;
        color: #999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .content{
      margin-top: .2rem;
      background: #fff;
      .date{
        position: relative;
        width: 100vw;
        padding: 0 .3rem;
        border-bottom: 1px solid #E9E9E9;
        .dateName{
          float: left;
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          color: #999;
        }
        .inputBox{
          float: left;
          height: .88rem;
          width: 5rem;
          margin-left: .2rem;
          border: 0;
          font-size: .3rem;
          // line-height: .8rem;
          color: #333;
          &::placeholder{
            color: #999;
          }
        }
        .icon-gengduo1{
          position: absolute;
          top: .24rem;
          right: .3rem;
          width: .4rem;
          height: .4rem;
          line-height: .4rem;
          font-size: .34rem;
          text-align: center;
          color: #999;
        }
      }
      .text-wrap{
        padding: .2rem .3rem;
        .tip{
          float: left;
          width: 1.4rem;
          font-size: .3rem;
          color: #999;
          line-height: 1.5;
        }
        .text-box{
          float: left;
          width: 5.4rem;
          height: 2rem;
          font-size: .3rem;
          color: #333;
          line-height: 1.5;
          &::-webkit-input-placeholder{
            line-height: 1.5 !important;
            color: #999 !important;
          }
        }
      }
    }
    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1.2rem;
      padding: .2rem .3rem;
      border-top: 1px solid #ededed;
      background: #fff;
      .btn{
        width: 6.9rem;
        height: .8rem;
        margin: 0 auto;
        font-size: .3rem;
        line-height: .8rem;
        text-align: center;
        color: #fff;
        background:rgba(51, 149, 255, 0.5);
        border-radius: .1rem;
        &.deepColor{
          background: #3395FF;
        }
      }
    }
  }
</style>
