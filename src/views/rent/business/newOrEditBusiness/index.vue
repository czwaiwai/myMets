<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <div class="page_bd newOrEditBusiness">
      <div class="header clearfix" v-if="business.hasDetail" @click.stop="toSelectGuest">
        <div class="h-icon">
          <i class="iconfont pic" :class="detailData.CstType=='P'?'icon-geren':'icon-gongsi'"></i>
          <p class="name" v-if="detailData.CstType=='P'">个人</p>
          <p class="name" v-else-if="detailData.CstType=='C'">公司</p>
          <p class="name more" v-else-if="detailData.CstType=='D'">开发商</p>
        </div>
        <div class="msg">
          <p class="name clearfix"><span class="title">{{detailData.CstName}}<span v-show="detailData.CstType=='P'">{{com_sex()}}</span></span><span class="point" v-show="detailData.CstLevelName||detailData.CstLevelCH">{{detailData.CstLevelName||detailData.CstLevelCH}}</span></p>
          <p class="company"><span v-show="detailData.CstType!='P'">联系人：{{detailData.LinkMan}}<span v-show="detailData.LinkMan">{{com_sex()}}</span></span></p>
          <p class="contact"><span>联系方式：</span><a :href="'tel:'+detailData.ContactManner" @click.stop="">{{detailData.ContactManner}}<i class="iconfont icon-dianhua" v-show="detailData.ContactManner"></i></a></p>
        </div>
        <i class="iconfont icon-tubiao- icon" v-show="isNew"></i>
      </div>
      <div class="selectGuest" @click.stop="toSelectGuest" v-else>
        <span>选择客户</span>
        <i class="iconfont icon-tubiao- icon"></i>
      </div>
      <div class="content" :class="{'hasGuest':hasGuest}">
        <div class="top">
          <div class="selectItem clearfix" @click.stop="getSelectType">
            <span class="name">客户来源</span>
            <span class="value textLeft" v-if="detailData.CognitiveWay">{{detailData.CognitiveWayName}}</span>
            <span class="value" v-else>请选择(必填)</span>
            <i class="iconfont icon-tubiao- icon"></i>
          </div>
          <div class="selectItem clearfix">
            <span class="name">预定房屋</span>
            <span class="value textLeft" v-if="detailData.ReservedHouseCode" @click.stop="toShowHouse">{{detailData.ReservedHouseCode}}</span>
            <span class="value" v-else  @click.stop="toSelectResHouse">请选择</span>
            <i class="iconfont icon-tubiao- icon" @click.stop="toSelectResHouse"></i>
          </div>
          <div class="inputItem clearfix">
            <span class="name">预定面积</span>
            <input class="inputs" type="text" @input="setNum('area')" v-model="detailData.ReserveArea" placeholder="请输入">
          </div>
          <div class="rang clearfix">
            <span class="name">成交机率</span>
            <span class="num">{{detailData.TradChance}}%</span>
            <span class="ranger" @touchMove="BtnTouchMove">
              <!-- <range v-model="detailData.TradChance" @on-change="changeRange"></range> -->
              <range
                v-model="detailData.TradChance"
                @touchMove="BtnTouchMove"
                :min="0"
                :max="100"
                :step="1"
                :bar-height="5">
              </range>
            </span>
          </div>
          <div class="status clearfix">
            <span class="name">紧急程度</span>
            <span class="bt" :class="item.type===statusData.type?item.color:''" @click.stop="selectStatus(item)" v-for="(item,index) in statusData.list" :key="index">{{item.name}}</span>
          </div>
          <!-- <datetime v-model="detailData.STime" format="YYYY-MM-DD" :end-date="detailData.ETime" :max-year=3000 @on-change="changeData"> -->
            <div class="date clearfix" @click.stop="toChoiseDate('STime')">
              <span class="dateName">开始时间</span>
              <input class="inputBox" type="text" placeholder="请选择" v-model="detailData.STime" readonly="readonly">
              <i class="iconfont icon-calendar"></i>
            </div>
          <!-- </datetime>
          <datetime v-model="detailData.ETime" format="YYYY-MM-DD" :start-date="detailData.STime" :max-year=3000 @on-change="changeData"> -->
            <div class="date clearfix noneBb" @click.stop="toChoiseDate('ETime')">
              <span class="dateName">结束时间</span>
              <input class="inputBox" type="text" placeholder="请选择" v-model="detailData.ETime" readonly="readonly">
              <i class="iconfont icon-calendar"></i>
            </div>
          <!-- </datetime> -->
        </div>
        <p class="tip">更多信息</p>
        <div class="bottom">
          <div class="inputItem clearfix">
            <span class="name">租赁用途</span>
            <input class="inputs" v-model="detailData.RentUseFor" @input="changeData" maxlength="40" type="text" placeholder="请输入">
          </div>
          <div class="inputItem clearfix">
            <span class="name">预定单价</span>
            <input class="inputs" @input="setNum('price')" v-model="detailData.ReservePrice" type="text" placeholder="请输入">
          </div>
          <div class="inputItem clearfix">
            <span class="name">预估成交单价</span>
            <input class="inputs" @input="setNum('money')" v-model="detailData.EstimatePrice" type="text" placeholder="请输入">
          </div>
          <div class="inputItem clearfix">
            <span class="name">免租期天数</span>
            <input class="inputs" @input="setDays" v-model="detailData.RentFreeDay" type="text" placeholder="请输入">
          </div>
          <div class="text-wrap clearfix">
            <p class="name">备注</p>
            <textarea class="text-box" placeholder="请填入" v-model="detailData.Memo" @input="changeData" maxlength="300"></textarea>
          </div>
          <!-- <div class="inputItem clearfix">
            <span class="name">备注</span>
            <input class="inputs" v-model="detailData.Memo" @input="changeData" maxlength="300" type="text" placeholder="请输入">
          </div> -->
        </div>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor': com_btnStatus()}" @click.stop="submit">提交</div>
      </div>
    </div>
    <select-list ref="selectList" :selectData="selectData" @selectItem="selectItem"></select-list>
    <show-list ref="showCodes" :listData="detailData.ReservedHouseCode"></show-list>
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
      :startDate="new Date(pickerDate.startDate)"
      :endDate="new Date(pickerDate.endDate)"
      @confirm="handleConfirm"
      v-model="pickerDate.pickerValue">
    </datetime-picker>
  </div>
</template>
<script>
/*eslint-disable*/
import {mapGetters} from 'vuex'
import { Range, DatetimePicker } from 'mint-ui'
import selectList from '@/components/selectList'
import showList from '@/components/showList'
import initDate from '@/mixins/initDate/index.js'
import dialogConfire from '@/components/dialogConfire.vue'
import navTitle from '@/components/navTitle'
export default {
  name: 'newOrEditBusiness',
  components: {selectList, showList, dialogConfire, navTitle, Range, DatetimePicker},
  mixins: [initDate],
  data () {
    return {
      detailData: {
        TradChance: 0
      },
      title: '',
      hasGuest: true,
      isNew: false,
      msgData: {},
      statusData: {
        type: '',
        list: [
          {name: '! 低', type: 0, color: 'blue'},
          {name: '!! 中', type: 1, color: 'yellow'},
          {name: '!!! 高', type: 2, color: 'red'}
        ]
      },
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
      isClickRange: false,
      isHttping: false,
      pickerDate: {
        type: '',
        startDate: '',
        endDate: '',
        pickerValue: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  beforeRouteLeave (to, from, next) {
    console.log(this.detailData.isChange)
    if (to.name === 'businessDetail' && this.$route.query.type > 0 && !this.isSubmit && this.detailData.isChange) {
      this.$refs.dialog.show()
      this.dialogData.status = next
    } else {
      next()
    }
  },
  methods: {
    toChoiseDate (type) {
      if (type === 'STime') {
        this.pickerDate = {
          type: type,
          startDate: this.detailData.STime || new Date(),
          endDate: this.detailData.ETime || '2300-01-01',
          pickerValue: this.detailData[type] || new Date()
        }
      } else if (type === 'ETime') {
        this.pickerDate = {
          type: type,
          startDate: this.detailData.STime || new Date(),
          endDate: '2300-01-01',
          pickerValue: this.detailData[type] || new Date()
        }
      }
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      this.detailData[this.pickerDate.type] = date.format('yyyy-MM-dd')
      this.changeData()
    },
    changeData () {
      this.detailData.isChange = true
    },
    BtnTouchMove () {
      console.log('in.....')
      this.changeData()
    },
    clickLeftBtn () {
      document.title = '编辑商机'
      this.$refs.dialog.hide()
      this.dialogData.status(false)
    },
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.dialogData.status()
    },
    // 提交按钮状态
    com_btnStatus () {
      if (this.business.hasDetail && this.detailData.CognitiveWay && this.detailData.ReservedHouse && this.detailData.ReserveArea && this.detailData.UrgentDegree && this.detailData.STime && this.detailData.ETime) {
        return true
      } else {
        return false
      }
    },
    com_sex () {
      if (this.detailData.Sex === 'F') {
        return '(女士)'
      } else if (this.detailData.Sex === 'M') {
        return '(先生)'
      } else {
        return ''
      }
    },
    setStatus () {
      if (this.detailData.UrgentDegree.indexOf('Height') > -1) {
        this.statusData.type = 2
      } else if (this.detailData.UrgentDegree.indexOf('Middle') > -1) {
        this.statusData.type = 1
      } else if (this.detailData.UrgentDegree.indexOf('Lower') > -1) {
        this.statusData.type = 0
      } else {
        this.statusData.type = ''
      }
    },
    getStatus () {
      if (this.statusData.type === 2) {
        this.detailData.UrgentDegree = 'CD_Height'
      } else if (this.statusData.type === 1) {
        this.detailData.UrgentDegree = 'CD_Middle'
      } else if (this.statusData.type === 0) {
        this.detailData.UrgentDegree = 'CD_Lower'
      } else {
        this.detailData.UrgentDegree = ''
      }
    },
    toSelectGuest () {
      if (this.isNew) {
        let businessData = {
          hasDetail: this.business.hasDetail,
          detail: this.business.detail,
          msg: this.detailData
        }
        this.$store.commit('updateBusiness', businessData)
        this.$router.push('/selectGuest')
      }
    },
    toShowHouse () {
      this.$refs.showCodes.show()
    },
    toSelectResHouse () {
      // this.setInitData()
      this.$router.push('/selectResHouse')
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
    async getSelectType () {
      // let obj = {
      //   p0: 'UserRent_GetOptionList',
      //   p7: {
      //     'TypeName': 'CognitiveWay'
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserRent_GetOptionList', {
        'TypeName': 'CognitiveWay'
      })
      res.data.forEach(arr => {
        if (this.detailData.CognitiveWay === arr.value) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.selectData.title = '客户来源'
      this.selectData.list = res.data
      this.$refs.selectList.show()
    },
    selectItem (item) {
      this.detailData.isChange = true
      this.detailData.CognitiveWay = item.value
      this.detailData.CognitiveWayName = item.showText
    },
    setInitData () {
      // this.$store.commit('updateBusiness', {data: this.business.data, houseCodes: this.business.houseCodes})
    },
    // 输入处理
    setNum (type) {
      this.detailData.isChange = true
      let num = ''
      if (type === 'area') {
        num = this.detailData.ReserveArea
      } else if (type === 'price') {
        num = this.detailData.ReservePrice
      } else if (type === 'money') {
        num = this.detailData.EstimatePrice
      }
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
      if (type === 'area') {
        this.detailData.ReserveArea = num
      } else if (type === 'price') {
        this.detailData.ReservePrice = num
      } else if (type === 'money') {
        this.detailData.EstimatePrice = num
      }
    },
    setDays () {
      this.changeData()
      this.detailData.RentFreeDay = this.detailData.RentFreeDay.replace(/[^\d]/g, '') - 0
    },
    async submit () {
      if (this.com_btnStatus()) {
        if (this.isHttping) {
          return
        }
        this.isHttping = true
        // this.$vux.loading.show()
        let obj = {
          p7: {
            'ReservedHouseCode': this.detailData.ReservedHouseCode || '',
            'ReservedHouse': this.detailData.ReservedHouse,
            'ReserveArea': this.detailData.ReserveArea || '0.00',            
            'STime': this.detailData.STime,            
            'ETime': this.detailData.ETime,
            'CognitiveWay': this.detailData.CognitiveWay,            
            'UrgentDegree': this.detailData.UrgentDegree,
            'TradChance': this.detailData.TradChance,            
            'Memo': this.detailData.Memo,
            'RentUseFor': this.detailData.RentUseFor,
            'EstimatePrice': this.detailData.EstimatePrice || '0.00',
            'RentFreeDay': this.detailData.RentFreeDay || 0,
            'ReservePrice': this.detailData.ReservePrice || '0.00'
          }
        }
        console.log(obj.p7)
        if (this.$route.query.type > 0) {
          obj.p0 = 'UserCS_OpportUpdateInfo'
          obj.p7.Id = this.detailData.Id
        } else {
          obj.p0 = 'UserCS_OpportAddInfo'
          let p7 = {
            'OrgID': this.locationData.orgData.orgId,
            'CstID': this.detailData.CstID,
            'CstName': this.detailData.CstName,
            'Theme': '',
            'CstType': this.detailData.CstType,
            'CstLevel': this.detailData.CstLevel,
            'LinkMan': this.detailData.LinkMan,
            'TradMoney': '0.00',
            'ContactType': '',
            'ContactManner': this.detailData.ContactManner,
            'EmployeeJobID': this.locationData.employeeData.employeeJobId,
            'EmployeeID': this.locationData.employeeData.employeeId,
          }
          obj.p7 = {...obj.p7, ...p7}
        }
        // let res = await this.$http.post(obj)
        let res = await this.$xml(obj.p0, obj.p7)
        // this.$vux.loading.hide()
        console.log(res)
        this.$toast(res.msg)
        if (res.status === 200 || res.status === '200') {
          this.isSubmit = true
          if (this.$route.query.type > 0) {
            let businessData = {
              hasDetail: true,
              detail: {...this.detailData, ...{}},
              msg: this.detailData
            }
            this.$store.commit('updateBusiness', businessData)
          }
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
    console.log(this.business)
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    console.log(this.business.msg)
    this.detailData = this.business.msg
    if (this.$route.query.type > 0) {
      document.title = '编辑商机'
      this.title = '编辑商机'
      this.hasGuest = true
      this.isNew = false
    } else {
      document.title = '新增商机'
      this.title = '新增商机'
      this.isNew = true
      if (this.business.hasDetail) {
        this.hasGuest = true
      } else {
        this.hasGuest = false
      }
    }
    this.setStatus()
  }
}
</script>
<style lang="scss" scoped>
  .newOrEditBusiness{
    .header{
      position: relative;
      height: 2.06rem;
      padding: .3rem;
      overflow: hidden;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .icon{
        position: absolute;
        right: .3rem;
        top: 0;
        display: block;
        width: .4rem;
        height: 2.06rem;
        font-size: .34rem;
        color: #999;
        line-height: 2.06rem;
        text-align: center;
      }
      .h-icon{
        position: relative;
        float: left;
        width: 1.27rem;
        height: 1.4rem;
        .pic{
          display: block;
          width: 1.27rem;
          height: 1.27rem;
          font-size: .56rem;
          color: #fff;
          background: #FB8A2C;
          text-align: center;
          line-height: 1.27rem;
          border-radius: .635rem;
        }
        .name{
          position: absolute;
          bottom: 0;
          left: .32rem;
          z-index: 9;
          height: 18px;
          min-width: .65rem;
          padding: 0 .05rem;
          line-height: 17px;
          font-size: 12px;
          text-align: center;
          border: 1px solid #FB8A2C;
          border-radius: 3px;
          color: #FB8A2C;
          background: #fff;
          &.more{
            left: .22rem;
          }
        }
      }
      .msg{
        float: left;
        margin-left: .2rem;
        width: 5.4rem;
        .name{
          height: .5rem;
          font-size: .4rem;
          color: #333;
          line-height: .5rem;
          .title{
            float: left;
            max-width: 3.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .point{
            float: left;
            height: .4rem;
            padding: 0 3px;
            margin-left: .1rem;
            margin-top: .05rem;
            font-size: .28rem;
            line-height: .4rem;
            color: #3395FF;
            border: 1px solid #3395FF;
            border-radius: 3px;
          }
        }
        .company{
          font-size: .3rem;
          color: #333;
          margin-top: .06rem;
          min-height: .2rem;
        }
        .contact{
          font-size: .3rem;
          color: #333;
          margin-top: .06rem;
          .icon-dianhua{
            display: inline-block;
            margin-left: .1rem;
            font-size: .34rem;
            color: #3395FF;
          }
        }
      }
      .icon{
        position: absolute;
        top: .8rem;
        right: .3rem;
        display: block;
        width: .4rem;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
        font-size: .34rem;
        color: #999;
      }
    }
    .selectGuest{
      position: relative;
      padding-left: .3rem;
      height: .88rem;
      line-height: .88rem;
      font-size: .3rem;
      color: #333;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .icon{
        position: absolute;
        right: .2rem;
        top: 0;
        display: block;
        width: .4rem;
        height: .88rem;
        font-size: .46rem;
        line-height: .88rem;
        color: #999;
      }
    }
    .content{
      position: absolute;
      top: .88rem;
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &.hasGuest{
        top: 2.06rem;
      }
      .top{
        margin-top: .2rem;
        padding-left: .3rem;
        background: #fff;
        .rang{
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
          .num{
            float: left;
            width: 1rem;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #333;
            text-align: left;
          }
          .ranger{
            float: left;
            width: 3.9rem;
            height: .88rem;
            padding-top: calc((.88rem - 30px) / 2);
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
      }
      .tip{
        height: .66rem;
        padding-left: .3rem;
        line-height: .66rem;
        font-size: .28rem;
        color: #777E8C;
      }
      .bottom{
        padding-left: .3rem;
        background: #fff;
        .inputItem{
          &:last-child{
            border-bottom: none;
          }
        }
        .text-wrap{
          padding: .2rem 0;
          .name{
            float: left;
            width: 2rem;
            font-size: .3rem;
            color: #999;
            line-height: 1.5;
          }
          .text-box{
            float: left;
            width: 4.9rem;
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
