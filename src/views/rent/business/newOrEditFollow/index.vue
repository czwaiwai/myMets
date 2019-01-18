<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <div class="page_bd newOrEditFollow">
      <div class="content">
        <div class="wrap">
          <!-- <datetime v-model="dateTimes" format="YYYY-MM-DD" :max-year=3000 @on-change="changeDate"> -->
            <div class="date clearfix" @click.stop="toChoiseDate">
              <span class="dateName">跟进时间</span>
              <input class="inputBox" type="text" placeholder="请选择" v-model="dateTimes" readonly="readonly">
              <i class="iconfont icon-calendar"></i>
            </div>
          <!-- </datetime> -->
          <div class="selectItem clearfix"  @click.stop="getSelectType()">
            <span class="name">跟进方式</span>
            <span class="value textLeft" v-if="mode.hasSelect">{{mode.showText}}</span>
            <span class="value" v-else>请选择</span>
            <i class="iconfont icon-tubiao- icon"></i>
          </div>
          <div class="text-wrap clearfix">
            <i class="iconfont icon-kefu icon"></i>
            <textarea class="text-box" placeholder="跟进情况..." v-model="followRemark" @input="change"></textarea>
          </div>
          <div class="text-wrap clearfix">
            <i class="iconfont icon-kehu icon"></i>
            <textarea class="text-box" placeholder="客户反馈..." v-model="guestRemark" @input="change"></textarea>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor':mode.hasSelect}" @click.stop="submit">提交</div>
      </div>
    </div>
    <select-list ref="selectList" :selectData="selectData" @selectItem="selectItem"></select-list>
    <dialog-confire
      :title="dialogData.title"
      ref="dialog"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
    ></dialog-confire>
    <datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      v-model="pickerValue">
    </datetime-picker>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { DatetimePicker } from 'mint-ui'
import comPoint from '@/mixins/comPoint'
import selectList from '@/components/selectList'
import initDate from '@/mixins/initDate/index.js'
import dialogConfire from '@/components/dialogConfire.vue'
import navTitle from '@/components/navTitle'
export default {
  name: 'newOrEditFollow',
  mixins: [comPoint, initDate],
  components: {selectList, dialogConfire, navTitle, DatetimePicker},
  data () {
    return {
      title: '',
      locationData: {},
      dateTimes: '',
      followRemark: '',
      guestRemark: '',
      selectData: {
        title: '',
        list: []
      },
      mode: {hasSelect: false, value: ''},
      dialogData: {
        title: '退出此次编辑？',
        status: ''
      },
      isSubmit: false,
      isChange: false,
      isHttping: false,
      pickerValue: ''
    }
  },
  watch: {
    followRemark (newVal, oldVal) {
      if (newVal.length > 200) {
        this.followRemark = newVal.slice(0, 200)
      }
    },
    guestRemark (newVal, oldVal) {
      if (newVal.length > 200) {
        this.guestRemark = newVal.slice(0, 200)
      }
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'businessDetail' && this.$route.query.type > 0 && !this.isSubmit && this.isChange) {
      this.$refs.dialog.show()
      this.dialogData.status = next
    } else {
      next()
    }
  },
  methods: {
    toChoiseDate () {
      this.pickerValue = this.dateTimes
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      this.dateTimes = date.format('yyyy-MM-dd')
      this.isChange = true
    },
    changeDate (value) {
      this.isChange = true
    },
    change () {
      this.isChange = true
    },
    clickLeftBtn () {
      document.title = '编辑跟进'
      this.$refs.dialog.hide()
      this.dialogData.status(false)
    },
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.dialogData.status()
    },
    async getSelectType () {
      // let obj = {
      //   p0: 'UserRent_GetOptionList',
      //   p7: {
      //     'TypeName': 'Mode'
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserRent_GetOptionList', {
        'TypeName': 'Mode'
      })
      res.data.forEach(arr => {
        if (this.mode.hasSelect && this.mode.value === arr.value) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      // this.$vux.loading.hide()
      this.selectData.title = '跟进方式'
      this.selectData.list = res.data
      this.$refs.selectList.show()
    },
    selectItem (item) {
      this.mode = item
      this.isChange = true
    },
    async submit () {
      if (this.mode.hasSelect) {
        if (this.isHttping) {
          return
        }
        this.isHttping = true
        // this.$vux.loading.show()
        let obj = {
          p7: {
            'FollowDate': this.dateTimes,
            'Mode': this.mode.value,
            'Situation': this.followRemark,
            'Feedback': this.guestRemark,
            'OptID': this.business.detail.Id,
            'OpUser': this.locationData.employeeData.employeeId,
            'Memo': ''
          }
        }
        if (this.$route.query.type > 0) {
          obj.p0 = 'UserCS_OpportFollowUpdate'
          obj.p7.Id = this.business.msg.Id
        } else {
          obj.p0 = 'UserCS_OpportFollowAdd'
          obj.p7.CstID = this.business.detail.CstID
        }
        // let res = await this.$http.post(obj)
        let res = await this.$xml(obj.p0, obj.p7)
        // this.$vux.loading.hide()
        console.log(res)
        this.$toast(res.msg)
        if (res.status === 200 || res.status === '200') {
          this.isSubmit = true
          setTimeout(() => {
            this.isHttping = false
            this.$router.go(-1)
          }, 2000)
        } else {
          this.isHttping = false
          this.isSubmit = false
        }
      }
    }
  },
  created () {
    if (this.$route.query.type > 0) {
      document.title = '编辑跟进'
      this.title = '编辑跟进'
      this.dateTimes = this.business.msg.FollowDate
      this.followRemark = this.business.msg.Situation
      this.guestRemark = this.business.msg.Feedback
      this.mode = {hasSelect: true, value: this.business.msg.Mode, showText: this.business.msg.ModeName}
    } else {
      document.title = '新增跟进'
      this.title = '新增跟进'
      this.dateTimes = this.initToday()
    }
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .newOrEditFollow{
    .content{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .wrap{
        padding-left: .3rem;
        background: #fff;
      }
      .date{
        position: relative;
        width: 7.2rem;
        border-bottom: 1px solid #E9E9E9;
        .dateName{
          float: left;
          width: 2rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          color: #999;
        }
        .inputBox{
          float: left;
          height: .88rem;
          width: 4.9rem;
          border: 0;
          font-size: .3rem;
          // line-height: .8rem;
          color: #333;
          &::placeholder{
            color: #999;
          }
        }
        .icon-calendar{
          position: absolute;
          top: 0;
          right: .3rem;
          width: .4rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .4rem;
          text-align: center;
          color: #999;
        }
      }
      .item{
        position: relative;
        height: .88rem;
        font-size: .3rem;
        color: #999;
        line-height: .88rem;
        border-bottom: 1px solid #E9E9E9;
        .icon-gengduo{
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
        padding: .2rem .3rem .2rem 0;
        border-bottom: 1px solid #E9E9E9;
        &:last-child{
          border-bottom: none;
        }
        .icon{
          float: left;
          width: .5rem;
          height: .6rem;
          font-size: .42rem;
          text-align: left;
          color: #3395FF;
          line-height: .6rem;
        }
        .text-box{
          float: left;
          width: 6.3rem;
          height: 2rem;
          padding: .1rem 0;
          font-size: .3rem;
          color: #333;
          line-height: .4rem;
          &::-webkit-input-placeholder{
            line-height: .4rem !important;
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
      background: #fff;
      border-top: 1px solid #E9E9E9;
      .btn{
        height: .8rem;
        font-size: .3rem;
        line-height: .8rem;
        text-align: center;
        color: #fff;
        background:rgba(51,149,255,.5);
        border-radius: .1rem;
        &.deepColor{
          background: #3395FF;
        }
      }
    }
    .items{
      position: relative;
      height: .88rem;
      padding-right: .3rem;
      font-size: .3rem;
      color: #999;
      line-height: .88rem;
      border-bottom: 1px solid #ededed;
      .type{
        display: inline-block;
        margin-left: .9rem;
        color: #333;
      }
      .tip{
        position: absolute;
        right: .3rem;
        top: 0;
        height: .88rem;
        line-height: .88rem;
        span{
          float: left;
        }
        .icon-gengduo{
          float: left;
          width: .3rem;
          height: .88rem;
          font-size: .34rem;
          color: #999;
          text-align: right;
        }
      }
    }
  }
</style>
