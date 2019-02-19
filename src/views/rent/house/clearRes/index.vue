<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <div class="page_bd clearRes">
      <div class="header">
        <p class="title">{{houseDetail.ResCode}}</p>
        <p class="name"><span v-if="houseDetail.RentalArea">{{com_point(houseDetail.RentalArea)}}㎡/</span><span v-show="houseDetail.FloorNum">{{houseDetail.FloorNum}}层/</span><span v-show="houseDetail.ResType">{{houseDetail.ResType}}</span></p>
        <p class="building">{{houseDetail.GrpName}}{{houseDetail.BudName}}<span v-show="houseDetail.UnitNO">{{houseDetail.UnitNO}}单元</span><span v-show="houseDetail.ResNO">{{houseDetail.ResNO}}号</span></p>
      </div>
      <div class="content">
        <div class="text-wrap clearfix">
          <p class="tip">{{tipName}}</p>
          <textarea class="text-box" placeholder="请填写(选填)" v-model="remark"></textarea>
        </div>
      </div>
      <div class="footer">
        <div class="btn" @click.stop="clickCancel">{{btnName}}</div>
      </div>
      <dialog-confire
        :title="dialogTitle"
        ref="dialog"
        leftName='返回'
        @clickLeftBtn="clickLeftBtn"
        @clickRightBtn="clickRightBtn"
      ></dialog-confire>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dialogConfire from '@/components/dialogConfire.vue'
import comPoint from '@/mixins/comPoint'
import navTitle from '@/components/navTitle'
export default {
  name: 'clearRes',
  mixins: [comPoint],
  components: {dialogConfire, navTitle},
  data () {
    return {
      locationData: {},
      remark: '',
      pageType: '',
      dateName: '',
      dateTime: '',
      tipName: '',
      btnName: '',
      dialogTitle: '',
      isHttping: false,
      title: ''
    }
  },
  computed: {
    ...mapGetters({
      houseDetail: 'getHouseDetail'
    })
  },
  watch: {
    remark (newVal, oldVal) {
      if (newVal.length > 300) {
        this.remark = newVal.slice(0, 300)
      }
    }
  },
  methods: {
    clickCancel () {
      if (this.isHttping) {
        return
      }
      if (this.pageType === 0) {
        this.dialogTitle = '确定取消保留？'
      } else {
        this.dialogTitle = '确定取消预定？'
      }
      this.$refs.dialog.show()
    },
    async cancel () {
      this.isHttping = true
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserAppHouse_UpdateHouseStatus',
      //   p7: {
      //     'HouseID': this.$route.params.id,
      //     'StatusKey': this.$route.query.type === 0 ? '-1' : '-2',
      //     'Memo': this.remark,
      //     'EmployeeID': this.locationData.employeeData.employeeId
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserAppHouse_UpdateHouseStatus', {
        'HouseID': this.$route.params.id,
        'StatusKey': this.$route.query.type === 0 ? '-1' : '-2',
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
      //     // this.$vux.toast.text('取消保留成功！')
      //   } else {
      //     // this.$vux.toast.text('取消预定成功！')
      //   }
      //   setTimeout(() => {
      //     this.isHttping = false
      //     this.$router.go(-1)
      //   }, 2000)
      // } else {
      //   this.isHttping = false
      //   if (this.$route.query.type === 0) {
      //     // this.$vux.toast.text('取消保留失败！')
      //   } else {
      //     // this.$vux.toast.text('取消预定失败！')
      //   }
      // }
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.cancel()
    }
  },
  created () {
    this.pageType = this.$route.query.type
    if (this.pageType === 0) {
      document.title = '取消保留'
      this.title = '取消保留'
      this.btnName = '取消保留'
      this.dateName = '保留截至'
      this.tipName = '取消原因'
    } else {
      document.title = '取消预定'
      this.title = '取消预定'
      this.btnName = '取消预定'
      this.tipName = '取消原因'
    }
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .clearRes{
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
      margin: .2rem 0 .5rem;
      background: #fff;
      .text-wrap{
        padding: .2rem .3rem;
        .tip{
          float: left;
          width: 1.4rem;
          font-size: .3rem;
          color: #999;
          line-height: .4rem;
        }
        .text-box{
          float: left;
          width: 5.4rem;
          height: 2.86rem;
          font-size: .3rem;
          color: #333;
          line-height: .4rem;
          &::placeholder{
            color: #999;
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
        background: #3395FF;
        border-radius: .1rem;
      }
    }
  }
</style>
