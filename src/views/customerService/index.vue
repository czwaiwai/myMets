<template>
    <div class="page">
        <!-- <mt-header :title="title + titleType">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header> -->
        <nav-title :title="title + titleType"></nav-title>
        <div class="page_bd">
          <form ref="form">
            <div class="customer_service" >
          <div class="text_wrap" style="position:relative;padding-bottom: 5px;">
                <textarea v-model="formObj.quesDesc" maxlength="200" :placeholder="titleType+'的内容是...'"></textarea>
                <div class="weui-flex padding15-h">
                  <div class="weui-flex__item">
                    <button type="button" @click="voiceClick" class="voice_btn" :class="recTime?'voice_btn_show':''">
                      <i class="icon-yuyin iconfont"></i>
                      {{recTime || '语音'}}
                    </button><button v-show="recTime" class="voice_btn_del" type="button" @click="delVoice"><i class="iconfont icon-tuichu"></i></button>
                  </div>
                  <div class="weui-flex__item text-right item_center" ></div>
                </div>
                <div class="padding15">
                  <div class="weui-uploader">
                    <div class="weui-uploader__bd">
                      <ul class="weui-uploader__files" id="uploaderFiles">
                        <li v-for="(item, index) in imgs" :key="index" class="weui-uploader__file" style="overflow:hidden;position:relative;">
                      <img preview  :src="'data:image/jpg;base64,'+ item"  style="max-width:100%;width:100%;height:100%;" >
                      <a class="img_del_btn" @click="imgDelClick(index)" ></a>
                      <!--<img src="../../assets/img/tool/close_img.png" >-->
                        </li>
                      </ul>
                      <div @click="getPic" v-show="imgs.length <= 3" class="weui-uploader__input-box"></div>
                    </div>
                  </div>
                </div>
                <span class="txt_nums">{{formObj.quesDesc.length}}/200</span>
              </div>
              <div class="weui-cells weui-cells_form  margin-top">
            <div v-if="type==='baoshi'" class="weui-cell weui-cell_select padding-left15 ">
              <div class="weui-cell__hd padding-right15 padding-v"><i class="iconfont icon-weizhibiaoji" ></i></div>
              <div class="weui-cell__bd padding-v">
                <input class="weui-input" type="text" v-model="formObj.workPos"  placeholder="选择地址（必填）">
                  </div>
              <div style="width:60px;" class="weui-cell__ft padding-v" @click="routeTo('locationChoose')" >&nbsp;</div>
                </div>
                <a  v-if="type==='baoxiu'"  @click="routeTo('deviceChoose')" class="weui-cell weui-cell_access" href="javascript:;">
                  <div class="weui-cell__hd padding-right15"><i class="iconfont icon-shebei" ></i></div>
                  <div class="weui-cell__bd">
                    <p :class="formObj.workPos?'':'dark_99'">{{formObj.workPos?formObj.workPos: '哪个设备'}}</p>
                  </div>
                  <div class="weui-cell__ft"></div>
                </a>
                <a @click="routeTo('serviceTypeChoose')" class="weui-cell weui-cell_access" href="javascript:;">
                  <div class="weui-cell__hd padding-right15"><i class="iconfont icon-yingyongziliao" style="color:#FEA411;"></i></div>
                  <div class="weui-cell__bd">
                    <p :class="typeTxt?'':'dark_99'">{{typeTxt?typeTxt: '选择' + titleType +'类型（必填）'}}</p>
                  </div>
                  <div class="weui-cell__ft"></div>
                </a>
                <div class="weui-cell weui-cell_select">
                  <div class="weui-cell__hd padding-left15"><i class="iconfont icon-zonghechaxun" style="color:#3395ff;"></i></div>
                  <div class="weui-cell__bd">
                    <select v-model="formObj.rsWay" class="weui-select " :class="!formObj.rsWay?'dark_99':''">
                      <option v-for="(item, index) in options" :key="index" :value="item.showText">{{item.showText}}</option>
                    </select>
                  </div>
                </div>
                <a @click="routeTo('responsibleChoose')" class="weui-cell weui-cell_access" href="javascript:;">
                  <div class="weui-cell__hd padding-right15"><i class="iconfont icon-kehuchaxun" style="color:#28B7F2;"></i></div>
                  <div class="weui-cell__bd">
                    <p :class="this.formObj.orders?'':'dark_99'">{{this.formObj.orders?this.formObj.orders: '选择责任人'}}</p>
                  </div>
                  <div class="weui-cell__ft"></div>
                </a>
              </div>
              <div class="weui-cells weui-cells_form margin-top">
                <div class="weui-cell " :class="userList.length > 0?'weui-cell_select padding-left15':''" >
                  <div class="weui-cell__hd"><label class="weui-label">报事人</label></div>
                  <div class="weui-cell__bd">
                    <input class="weui-input" v-model="formObj.cstName" type="text" placeholder="请输入报事人名称(必填)">
                  </div>
              <div class="weui-cell__ft"  v-if="userList.length > 0">
                    <select class="weui-select" @change="userIndexChange" v-model="userIndex">
                      <option v-for="(user, index) in userList" :key="index" :value='index' >{{user.CstName}}</option>
                    </select>
                  </div>
                </div>
                <div class="weui-cell " :class="userTel.length > 0?'weui-cell_select padding-left15':''" >
                  <div class="weui-cell__hd">
                    <label class="weui-label">电话</label>
                  </div>
                  <div class="weui-cell__bd">
                    <input class="weui-input" v-model="formObj.callPhone" type="tel" placeholder="请输入电话">
                  </div>
                  <div v-if="userTel.length > 0" class="weui-cell__ft">
                    <select class="weui-select" v-model="userTelIndex" @change="userTelChange">
                      <option v-for="(tel, index) in userTel" :key="index" :value='tel' >{{tel}}</option>
                    </select>
                  </div>
                </div>
                <div class="weui-cell ">
                  <div class="weui-cell__hd">
                    <label class="weui-label">预约时间</label>
                  </div>
                  <div class="weui-cell__bd" @click="dateClick">
                    <input class="weui-input" v-model="formObj.rStartTime" type="text" readonly placeholder="请选择预约时间">
                  </div>
                </div>
              </div>
              <div style="padding-top:10px;"></div>
            </div>
          </form>
        </div>
    <div class="page_ft light_bg" style="padding: 10px 15px 0px;border-top: 1px solid rgb(229, 229, 229);height: 60px;">
      <button class="weui-btn weui-btn_primary"  type="button" @click="submitXml">提交{{titleType}}</button>
        </div>
        <transition name="page">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </transition>

      <datetime-picker ref="picker" type="datetime" v-model="dateTime"
        @confirm="dateConfirm"
        @cancel="dateConfirm"
        :startDate="new Date()"
        year-format="{value}"
        month-format="{value}月"
        date-format="{value}日"
        cancelText = '重置'
        hour-format="{value}">
      </datetime-picker>
    </div>
</template>
<script>
import { DatetimePicker } from 'mint-ui'
import {mapGetters} from 'Vuex'
import navTitle from '@/components/navTitle'
// import Vue from 'vue'
import sess from '../../utils/sess'
export default {
  name: 'customerService',
  components: { DatetimePicker, navTitle },
  data () {
    return {
      isSendForm: false,
      options: [],
      imgs: [],
      title: '客服',
      titleType: '报事',
      type: 'baoshi',
      typeTxt: '',
      dateTime: new Date(),
      // reservation: '',
      nav: {},
      userList: [],
      userTel: [],
      userIndex: '',
      userTelIndex: '',
      recTime: '', // 录音的时间
      formObj: {
        userName: '', // 用户名称.
        orgId: '', // 项目ID.
        orgName: '', // 项目名称.
        woNo: '', // KF201805021803  SSs.
        rsDate: '', // 2018-05-02 18:01.
        woNoBasicId: '', // 主规则ID 最顶层
        cstId: '', // 空
        cstName: '', // 报事人名称.
        workPosFrom: 'Resource', // .
        woId: '', // 空
        workPos: '', // 拼接地址.
        rsWay: '', // PDA 电话.
        callPhone: '', // 责任人电话.
        orders: '', // 责任人.
        ordersId: '', // 责任人ID.
        ordersDepart: '', // 部门名称.
        ordersPositionId: '', // 责任人ID.
        quesTypeId: '', // 问题类型ID. 最后一层
        quesDesc: '', // 问题描述.
        createTime: '', // 图1
        createUser: '', // 图2
        opTime: '', // 图3
        image: '', // 图4
        opUser: '', // 语音.
        memo: '',
        rStartTime: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip'
    })
  },
  created () {
    // 判断是报事还是报修
    this.deviceOrLocation()
    if (this.$route.query.type === 'baoxiu') {
      this.title = '设备'
      this.titleType = '报修'
      this.type = 'baoxiu'
    }
    if (this.$route.query.type === 'baoshi') {
      this.title = '客服'
      this.titleType = '报事'
      this.type = 'baoshi'
    }

    this.nav = {
      orgId: this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.UserID
    }
    this.formObj.orgName = this.nav.orgName
    this.formObj.orgId = this.nav.orgId
    this.formObj.userName = this.nav.userName
    // this.setUserInfo ()
    if (this.type === 'baoxiu') {
      this.deviceInit()
      this.formObj.cstName = this.nav.userName
    }
    this.getPageData()
  },
  methods: {
    // 获取报事保修快捷音频及图片
    getQuickChannel () {
      let img = sess.get('mainImg')
      let voice = sess.get('mainVoice')
      return {
        img,
        voice
      }
    },
    setUserInfo () {
      let that = this
      window.set_login_info = function (infos) {
        console.log(infos, ' infos------------------')
        let data = JSON.parse(infos)
        that.nav = {
          orgId: data.orgId,
          orgName: data.orgName,
          userName: data.userName
        }
        console.log(that.nav, '--------------------')
        that.formObj.orgName = data.orgName
        that.formObj.orgId = data.orgId
        that.formObj.userName = data.userName
        if (that.type === 'baoxiu') {
          that.formObj.cstName = data.userName
        }
      }
      console.log('setUserInfo---', window.callData)
      if (window.webkit) {
        window.webkit.messageHandlers.Native_Js_onLoadPage.postMessage('')
      } else if (window.callData) {
        console.log()
        window.callData.Native_Js_onLoadPage()
      }
    },
    deviceOrLocation () {
      let href = window.location.href
      if (href.indexOf('ETSRepair') > -1) {
        this.title = '设备'
        this.titleType = '报修'
        this.type = 'baoxiu'
      }
      if (href.indexOf('ETSReport') > -1) {
        this.title = '客服'
        this.titleType = '报事'
        this.type = 'baoshi'
      }
    },
    async deviceInit () {
      this.urlinfo = window.location.href.split('?')[1]
      this.urlinfo = decodeURI(this.urlinfo)
      if (this.urlinfo.split('=')[0] === 'device_id') {
        // this.$http.post('/ets/table/list/userCSGetEquiArchivesH5', {
        //   barcodeCode: this.urlinfo.split('=')[1]
        // }).then(res => {
        //   this.formObj.workPos = res.data[0].EquiName
        // })
        let p0 = 'UserCS_GetEquiArchivesH5'
        let res = await this.$xml(p0, {
          BarcodeCode: this.urlinfo.split('=')[1]
        })
        this.formObj.workPos = res.data[0].EquiName
      }
      if (this.urlinfo.split('=')[0] === 'name') {
        var data = this.urlinfo.split('&')
        var par = {}
        for (var index = 0; index < data.length; index++) {
          par[data[index].split('=')[0]] = data[index].split('=')[1]
        }
        this.formObj.cstName = par.userName
        this.formObj.orgId = par.orgId
        this.formObj.orgName = par.orgName
        this.formObj.workPos = par.name
      }
    },
    async getPageData () {
      // let res = await this.$http.get('/ets/table/list/userRentGetOptionList?typeName=ReceiptMethod')
      let p0 = 'UserRent_GetOptionList'
      let res = await this.$xml(p0, {
        TypeName: 'ReceiptMethod'
      })
      console.log(res)
      this.options = res.data
      if (res.data) {
        this.formObj.rsWay = res.data[0].showText
      }
    },
    userIndexChange (e) {
      let val = this.userIndex
      this.formObj.cstName = this.userList[val].CstName
      if (this.userList[val].Mobile.length === 0) {
        this.userTel = []
        this.formObj.callPhone = ''
      } else if (this.userList[val].Mobile.split(',').length > 0) {
        this.userTel = this.userList[val].Mobile.split(',')
        this.formObj.callPhone = this.userList[val].Mobile.split(',')[0]
      } else {
        this.formObj.callPhone = ''
      }
    },
    userTelChange () {
      this.formObj.callPhone = this.userTelIndex
    },
    delVoice: function () {
      this.formObj.opUser = ''
      this.formObj.memo = ''
      this.recTime = ''
    },
    async voiceClick () {
      if (!this.recTime) {
        let mp3 = await this.$app.getRec()
        this.formObj.opUser = mp3.path
        this.formObj.memo = mp3.duration
        this.recTime = `${mp3.duration}''`
      } else {
        await this.$app.playAudio(this.formObj.opUser)
      }
    },
    dateClick () {
      this.$refs.picker.open()
    },
    dateConfirm (date) {
      if (date) {
        this.formObj.rStartTime = date.format('yyyy-MM-dd hh:mm')
      } else {
        this.formObj.rStartTime = ''
      }
    },
    imgDelClick (index) {
      this.imgs.splice(index, 1)
    },
    // 设置房号
    setLocation (data) {
      this.formObj.cstName = data.cstName
      this.formObj.callPhone = data.callPhone
      this.formObj.workPos = data.name
      this.formObj.woId = data['ResID']
      this.userList = data.userList
      console.log(data, 'setLocation----')
    },
    // 设置设备
    setDevice (data) {
      this.formObj.workPos = data.EquiName
      this.formObj.woId = data.ID
    },
    // 设置报事类型
    setType (data, pid) {
      this.formObj.quesTypeId = data.ID
      this.formObj.woNoBasicId = pid
      this.typeTxt = data.Name
    },
    // 设置责任人
    setPerson (person) {
      console.log(person)
      this.formObj.orders = person.EmployeeName
      this.formObj.ordersId = person.EmployeeID
      this.formObj.ordersDepart = person.DeptName
      this.formObj.ordersPositionId = person.PositionID
    },
    validate () {
      if (!this.formObj.quesDesc) {
        this.$toast(this.titleType + '内容不能为空')
        return false
      }
      if (!this.formObj.workPos) {
        this.$toast('请输入或选择地址')
        return false
      }
      if (!this.formObj.woNoBasicId) {
        this.$toast('请选择' + this.titleType + '类型')
        return false
      }
      if (!this.formObj.cstName) {
        this.$toast('请输入报事人')
        return false
      }
      if (!this.formObj.callPhone && this.formObj.rsWay === '来电') {
        this.$toast('来电来源需录入电话')
        return false
      }
      return true
    },
    setImgs () {
      if (this.imgs.length > 0) {
        this.formObj.createTime = this.imgs[0]
      }
      if (this.imgs.length > 1) {
        this.formObj.createUser = this.imgs[1]
      }
      if (this.imgs.length > 2) {
        this.formObj.opTime = this.imgs[2]
      }
      if (this.imgs.length > 3) {
        this.formObj.image = this.imgs[3]
      }
    },
    // async submit () {
    //   if (!this.validate()) return
    //   if (this.isSendForm) return
    //   try {
    //     this.formObj.woNo = 'KF' + new Date().format('yyyyMMddhhmmssS')
    //     this.formObj.rsDate = new Date().format('yyyy-MM-dd hh:mm:ss')
    //     this.setImgs()
    //     let url = '/ets/syswin/smd/userCSSaveWorkOrdInfo'
    //     this.isSendForm = true
    //     let res = await this.$http.post(url, this.formObj)
    //     console.log(res)
    //     this.$toast('提交成功')
    //     setTimeout(() => {
    //       this.isSendForm = false
    //       // this.$root.back()
    //       this.$app.back()
    //     }, 1500)
    //   } catch (err) {
    //     console.log(err)
    //     this.isSendForm = false
    //   }
    // },
    titleCase (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
      // return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    },
    async submitXml () {
      if (!this.validate()) return
      if (this.isSendForm) return
      try {
        this.formObj.woNo = 'KF' + new Date().format('yyyyMMddhhmmssS')
        this.formObj.rsDate = new Date().format('yyyy-MM-dd hh:mm:ss')
        this.setImgs()
        this.isSendForm = true
        let sendObj = {}
        let arr = ['RSDate', 'OrdersID', 'WOID', 'WOID', 'QuesTypeID', 'CstID', 'WONoBasicID', 'WONo', 'OrgID', 'RSWay', 'OrdersPositionID']
        for (let key in this.formObj) {
          let newkey = arr.find(item => item.toLocaleLowerCase() === key.toLocaleLowerCase())
          if (newkey) {
            sendObj[newkey] = this.formObj[key]
          } else {
            sendObj[this.titleCase(key)] = this.formObj[key]
          }
        }
        console.log(sendObj, 'this.formObj.userName', '--------------')
        let res = await this.$xml('UserCS_SaveWorkOrdInfo', sendObj, {
          p1: this.formObj.userName
        })
        console.log(res)
        this.$toast('提交成功')
        setTimeout(() => {
          this.isSendForm = false
          this.$root.back()
          // this.$app.back()
        }, 1500)
      } catch (err) {
        console.log(err)
        this.isSendForm = false
      }
    },
    async getPic () {
      // this.imgs.push('iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=')
      let img = await this.$app.getPic()
      this.imgs.push(img)
      this.$previewRefresh()
    },
    routeTo (name) {
      this.$router.push({name})
    }
  }
}
</script>

<style lang="scss" scoped>
  .weui-cells:before {
    border-top:none;
  }
  .txt_nums {
    position: absolute;
    bottom: 5px;
    right: 15px;
    color: #999;
  }
.customer_service{

  .text_wrap {
    min-height: 220px;
    background:#FFF;
    textarea {
      height: 84px;
      width:100%;
      resize:none;
      border:none;
      padding:10px;
    }
  }
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
  .img_del_btn {
      width:20px;
      height:20px;
    display:block;
    position: absolute;
      top:0;
      right:0;
      z-index:2;
    color:#FFF;
    text-align:center;
      background:url('../../assets/img/tool/close_img.png') no-repeat;
      background-size:cover;
    }
  }
</style>
