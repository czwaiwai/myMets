<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <div class="page_bd newOrEditOrder">
      <div class="content">
        <div class="wrap">
          <div class="selectItem clearfix" @click.stop="getSelectType">
            <span class="name">资源类型</span>
            <span class="value textLeft" v-if="detailData.ResType">{{detailData.ResTypeName}}</span>
            <span class="value" v-else>请选择</span>
            <i class="iconfont icon-tubiao- icon"></i>
          </div>
          <div class="selectItem clearfix" @click.stop="getSelectHouse">
            <span class="name">意向资源</span>
            <span class="value textLeft" v-if="detailData.ResCode">{{detailData.ResCode}}</span>
            <span class="value" v-else>请选择</span>
            <i class="iconfont icon-tubiao- icon"></i>
          </div>
          <div class="inputItem clearfix">
            <span class="name">意向用途</span>
            <input class="inputs" maxlength="20" v-model="detailData.IntenUse" @input="changeDate" type="text" placeholder="请输入">
          </div>
          <div class="textareaItem clearfix">
            <span class="name">配套要求</span>
            <textarea placeholder="请输入" v-model="detailData.MatcRequ" @input="changeDate" maxlength="200" class="text"></textarea>
          </div>
          <div class="inputItem clearfix">
            <span class="name">价格上限</span>
            <input class="inputs" @input="inputSetVal" v-model="detailData.IntenPriceLimit" type="text" placeholder="请输入">
          </div>
          <div class="status clearfix">
            <span class="name">关注度</span>
            <span class="bt" :class="item.type===statusData.type?item.color:''" @click.stop="selectStatus(item)" v-for="(item,index) in statusData.list" :key="index">{{item.name}}</span>
          </div>
          <!-- <datetime v-model="detailData.Validity" format="YYYY-MM-DD" :start-date="startDate" :max-year=3000 @on-change="changeDate"> -->
            <div class="date clearfix" @click.stop="toChoiseDate">
              <span class="dateName">有效期限</span>
              <input class="inputBox" type="text" placeholder="请选择" v-model="detailData.Validity" readonly="readonly">
              <i class="iconfont icon-calendar"></i>
            </div>
          <!-- </datetime> -->
        </div>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor':detailData.IntenAttention&&detailData.Validity.length&&detailData.ResType}" @click.stop="submit">提交</div>
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
import { DatetimePicker } from 'mint-ui'
import comPoint from '@/mixins/comPoint'
import selectList from '@/components/selectList'
import initDate from '@/mixins/initDate'
import dialogConfire from '@/components/dialogConfire.vue'
import navTitle from '@/components/navTitle'
import { mapGetters } from 'vuex'
export default {
  name: 'newOrEditOrder',
  components: {selectList, dialogConfire, navTitle, DatetimePicker},
  mixins: [comPoint, initDate],
  data () {
    return {
      title: '',
      locationData: {},
      detailData: {},
      statusData: {
        type: '',
        list: [
          {name: '! 低', type: 0, color: 'blue'},
          {name: '!! 中', type: 1, color: 'yellow'},
          {name: '!!! 高', type: 2, color: 'red'}
        ]
      },
      dateTimes: '',
      startDate: '',
      resType1: {hasSelect: false, value: ''},
      selectData: {
        title: '',
        type: '',
        list: []
      },
      dialogData: {
        title: '退出此次编辑？',
        status: ''
      },
      isSubmit: false,
      isHttping: false,
      pickerValue: ''
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'businessDetail' && this.$route.query.type > 0 && !this.isSubmit && this.detailData.isChange) {
      this.$refs.dialog.show()
      this.dialogData.status = next
    } else {
      next()
    }
  },
  methods: {
    toChoiseDate () {
      this.pickerValue = this.detailData.Validity || this.initToday()
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      this.detailData.Validity = date.format('yyyy-MM-dd')
      this.changeDate()
    },
    changeDate () {
      this.detailData.isChange = true
    },
    clickLeftBtn () {
      document.title = '编辑意向'
      this.$refs.dialog.hide()
      this.dialogData.status(false)
    },
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.dialogData.status()
    },
    // 选择房屋
    getSelectHouse () {
      this.$store.commit('updateBusiness', {
        hasDetail: true,
        detail: this.business.detail,
        msg: this.detailData
      })
      this.$router.push('/selectHouse')
    },
    /*eslint-disable*/
    inputSetVal () {
      this.detailData.isChange = true
      let num = this.detailData.IntenPriceLimit || ''
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
      if (num - 0 > 999999999.99) {
        num = 999999999.99
      }
      this.detailData.IntenPriceLimit = num
    },
    selectStatus (item) {
      if (item.isSelect) {
        return
      }
      this.detailData.isChange = true
      this.statusData.list.forEach(arr => {
        if (item.type === arr.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.statusData.type = item.type
      this.getStatus()
    },
    setStatus () {
      if (!this.detailData.IntenAttention) {
        this.statusData.type = ''
      } else if (this.detailData.IntenAttention.indexOf('Height') > -1) {
        this.statusData.type = 2
      } else if (this.detailData.IntenAttention.indexOf('Middle') > -1) {
        this.statusData.type = 1
      } else if (this.detailData.IntenAttention.indexOf('Lower') > -1) {
        this.statusData.type = 0
      } else {
        this.statusData.type = ''
      }
    },
    getStatus () {
      if (this.statusData.type === 2) {
        this.detailData.IntenAttention = 'AR_Height'
      } else if (this.statusData.type === 1) {
        this.detailData.IntenAttention = 'AR_Middle'
      } else if (this.statusData.type === 0) {
        this.detailData.IntenAttention = 'AR_Lower'
      } else {
        this.detailData.IntenAttention = ''
      }
    },
    async getSelectType () {
      // let obj = {
      //   p0: 'UserRent_GetOptionList',
      //   p7: {
      //     'TypeName': 'ResType1'
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserRent_GetOptionList', {
        'TypeName': 'ResType1'
      })
      let temp = []
      res.data.forEach(arr => {
        if (this.detailData.ResType === arr.value) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
        if (arr.value !== 'ResR') {
          temp.push(arr)
        }
      })
      // let temp = []
      // temp.push(res.Table[0])
      res.Table = temp
      this.selectData.title = '资源类型'
      this.selectData.list = res.data
      this.$refs.selectList.show()
    },
    selectItem (item) {
      this.detailData.isChange = true
      this.resType1 = item
      this.detailData.ResType = item.value
      this.detailData.ResTypeName = item.showText
      console.log(this.detailData)
    },
    async submit () {
      if (this.detailData.IntenAttention&&this.detailData.Validity.length&&this.detailData.ResType) {
        if (this.isHttping) {
          return
        }
        this.isHttping = true
        // this.$vux.loading.show()
        let obj = {
          p7: {
            'RegisterDate': this.detailData.RegisterDate || this.initToday(),
            'Validity': this.detailData.Validity,
            'IntenResID': '2dfb32b7-42b3-4cb3-b',
            'IntenPriceLimit': this.detailData.IntenPriceLimit || '0',
            'IntenUse': this.detailData.IntenUse,
            'MatcRequ': this.detailData.MatcRequ,
            'IntenAttention': this.detailData.IntenAttention,
            'ResCode': this.detailData.ResCode,
            'OptID': this.business.detail.Id,
            'OpUser': this.locationData.employeeData.employeeId,
            'Memo': ''
          }
        }
        if (this.$route.query.type > 0) {
          obj.p0 = 'UserCS_OpportIntentionUpdate'
          obj.p7.Id = this.business.msg.Id
        } else {
          obj.p0 = 'UserCS_OpportIntentionAdd'
          obj.p7.CstID = this.business.detail.CstID
        }
        // let res = await this.$http.post(obj)
        let res = await this.$xml(obj.p0, obj.p7)
        // this.$vux.loading.hide()
        console.log(res)
        this.$toast(res.msg)
        if (res.status === 200 || res.status === '200') {
          setTimeout(() => {
            this.isSubmit = true
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
    this.startDate = this.initToday()
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    if (this.$route.query.type > 0) {
      document.title = '编辑意向'
      this.title = '编辑意向'
    } else {
      document.title = '新增意向'
      this.title = '新增意向'
    }
    let initData = {
      IntenAttention: '',
      ResType: '',
      ResTypeName: '',
      Validity: '',
      isChange: false
    }
    this.detailData = {...initData, ...this.business.msg}
    this.detailData.Validity = this.detailData.Validity
    this.setStatus()
  }
}
</script>
<style lang="scss" scoped>
  .newOrEditOrder{
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
        .date{
          position: relative;
          width: 7.2rem;
          background: #fff;
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
  .textareaItem{
    position: relative;
    height: 1.76rem;
    padding: .22rem 0;
    border-bottom: 1px solid #E9E9E9;
    .name{
      float: left;
      width: 2rem;
      height: 1.34rem;
      line-height: .44rem;
      font-size: .3rem;
      color: #999;
    }
    .text{
      float: left;
      width: 4.9rem;
      height: 1.34rem;
      line-height: .44rem;
      font-size: .3rem;
      color: #333;
      &::placeholder{
        color: #999;
      }
    }
  }
</style>
