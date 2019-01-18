<template>
  <div class="page page_bg">
    <nav-title title="选择有效时间"></nav-title>
    <div class="page_bd selectTime">
      <div class="content">
        <div class="showItem clearfix" @click.stop="$router.go(-1)">
          <span class="name">意向资源</span>
          <span class="value">{{resCode}}</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="msg">
          <!-- <datetime v-model="dateTimes" format="YYYY-MM-DD" :start-date="startDate" :max-year=3000> -->
            <div class="date clearfix" @click.stop="toChoiseDate">
              <span class="dateName">跟进时间</span>
              <input class="inputBox" type="text" placeholder="请选择(必填)" v-model="dateTimes" readonly="readonly">
              <i class="iconfont icon-calendar"></i>
            </div>
          <!-- </datetime> -->
          <div class="inputItem clearfix">
            <span class="name">意向用途</span>
            <input class="inputs" v-model="orderUse" maxlength="40" type="text" placeholder="请输入(选填)">
          </div>
          <div class="inputItem clearfix">
            <span class="name">价格上限</span>
            <input class="inputs" v-model="price" @input="setPrice" type="text" placeholder="请输入(选填)">
          </div>
          <div class="status clearfix noneBb">
            <span class="name">紧急程度</span>
            <span class="bt" :class="item.isSelect?item.color:''" @click.stop="selectStatus(item)" v-for="(item,index) in statusData.list" :key="index">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor':dateTimes.length}" @click.stop="submit">提 交</div>
      </div>
    </div>
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
/*eslint-disable*/
import navTitle from '@/components/navTitle'
import { DatetimePicker } from 'mint-ui'
import initDate from '@/mixins/initDate'
import { mapGetters } from 'vuex'
export default {
  name: 'selectTime',
  components: {navTitle, DatetimePicker},
  mixins: [initDate],
  data () {
    return {
      locationData: {},
      statusData: {
        type: '',
        list: [
          {name: '! 低', type: 0, isSelect: false, color: 'blue'},
          {name: '!! 中', type: 1, isSelect: false, color: 'yellow'},
          {name: '!!! 高', type: 2, isSelect: false, color: 'red'}
        ]
      },
      resCode: '',
      dateTimes: '',
      startDate: '',
      orderUse: '',
      price: '',
      isHttping: false,
      pickerValue: ''
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  methods: {
    toChoiseDate () {
      this.pickerValue = this.dateTimes || this.initToday()
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      this.dateTimes = date.format('yyyy-MM-dd')
    },
    selectStatus (item) {
      if (item.isSelect) {
        return
      }
      this.statusData.list.forEach(arr => {
        if (item.type === arr.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.statusData.type = item.type
    },
    setPrice () {
      let num = this.price
      if (num.substr(0, 1) === '.') {
        num = ''
      }
      num = num.replace(/^0*(0\.|[1-9])/, '$1')
      num = num.replace(/[^\d.]/g, '')
      num = num.replace(/\.{2,}/g, '.')
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (num.indexOf('.') < 0 && num !== '') {
        if (num.substr(0, 1) === '0' && num.length === 2) {
          num = num.substr(1, num.length)
        }
      }
      this.price = num
    },
    com_status () {
      if (this.statusData.type === 0) {
        return 'AR_Lower'
      } else if (this.statusData.type === 1) {
        return 'AR_Middle'
      } else if (this.statusData.type === 2) {
        return 'AR_Height'
      } else {
        return ''
      }
    },
    async submit () {
      if (this.dateTimes.length) {
        if (this.isHttping) {
          return
        }
        this.isHttping = true
        // this.$vux.loading.show()
        // let obj = {
        //   p0: 'UserCS_OpportIntentionAdd',
        //   p7: {
        //     'CstID': this.business.detail.CstID,
        //     'RegisterDate': this.initToday(),
        //     'Validity': this.dateTimes,
        //     'IntenResID': '',
        //     'IntenPriceLimit': this.price || '0',
        //     'IntenUse': this.orderUse,
        //     'MatcRequ': '',
        //     'IntenAttention': this.com_status(),
        //     'ResCode': this.resCode,
        //     'OptID': this.business.detail.Id,
        //     'OpUser': this.locationData.employeeData.employeeId,
        //     'Memo': ''
        //   }
        // }
        // let res = await this.$http.post(obj)
        let res = await this.$xml('UserCS_OpportIntentionAdd', {
          'CstID': this.business.detail.CstID,
          'RegisterDate': this.initToday(),
          'Validity': this.dateTimes,
          'IntenResID': '',
          'IntenPriceLimit': this.price || '0',
          'IntenUse': this.orderUse,
          'MatcRequ': '',
          'IntenAttention': this.com_status(),
          'ResCode': this.resCode,
          'OptID': this.business.detail.Id,
          'OpUser': this.locationData.employeeData.employeeId,
          'Memo': ''
        })
        // this.$vux.loading.hide()
        console.log(res)
        this.$toast(res.msg)
        if (res.status === 200 || res.status === '200') {
          setTimeout(() => {
            this.isHttping = false
            this.$store.commit('updateBusinessDetailType', {type: 2})
            this.$router.go(-3)
          }, 2000)
        } else {
          this.isHttping = false
        }
      }
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.resCode = this.$route.query.resCode || ''
    this.startDate = this.initToday()
  }
}
</script>
<style lang="scss" scoped>
  .selectTime{
    .content{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .showItem{
        position: relative;
        height: .88rem;
        padding-left: .3rem;
        background: #fff;
        margin-bottom: .2rem;
        .name{
          float: left;
          width: 2rem;
          height: .88rem;
          font-size: .3rem;
          color: #999;
          text-align: left;
          line-height: .88rem;
        }
        .value{
          float: left;
          width: 4.5rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          color: #333;
        }
        .icon-gengduo{
          position: absolute;
          right: .3rem;
          top: 0;
          display: block;
          width: .4rem;
          height: .88rem;
          font-size: .34rem;
          line-height: .88rem;
          color: #999;
        }
      }
      .msg{
        padding-left: .3rem;
        background: #fff;
        .date{
          position: relative;
          width: 7.2rem;
          border-bottom: 1px solid #E9E9E9;
          .dateName{
            float: left;
            height: .88rem;
            width: 2rem;
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
            top: .24rem;
            right: .3rem;
            width: .4rem;
            height: .4rem;
            line-height: .4rem;
            font-size: .4rem;
            text-align: center;
            color: #999;
          }
        }
        .status{
          position: relative;
          height: .88rem;
          border-bottom: 1px solid #E9E9E9;
          .name{
            float: left;
            width: 2rem;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #999;
          }
          .bt{
            float: left;
            width: 1.02rem;
            height: .5rem;
            margin: .19rem .3rem .19rem 0;
            color: #fff;
            text-align: center;
            line-height: .5rem;
            font-size: .3rem;
            border-radius: 3px;
            background: #D9DDE3;
            &.blue{
              background: #57A7FE;
            }
            &.yellow{
              background: #EDC905;
            }
            &.red{
              background: #FF6262;
            }
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
  }
</style>
