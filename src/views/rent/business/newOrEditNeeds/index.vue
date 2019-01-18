<template>
  <div class="page page_bg">
    <nav-title :title="title"></nav-title>
    <div class="page_bd newOrEditNeeds">
      <div class="content">
        <div class="wrap">
          <div class="selectItem clearfix" @click.stop="getSelectType('ResType')">
            <span class="name">资源类型</span>
            <span class="value textLeft" v-if="resType.hasSelect">{{resType.showText}}</span>
            <span class="value" v-else>请选择</span>
            <i class="iconfont icon-tubiao- icon"></i>
          </div>
          <div class="selectItem clearfix" @click.stop="getRequCstDrop()">
            <span class="name">需求提交人</span>
            <span class="value textLeft" v-if="requCstDrop.hasSelect">{{requCstDrop.CstName}}</span>
            <span class="value" v-else>请选择</span>
            <i class="iconfont icon-tubiao- icon"></i>
          </div>
          <div class="header clearfix">
            <div class="it" :class="item.position" v-for="(item,index) in headerData" :key="index">{{item.name}}</div>
          </div>
          <div class="list clearfix" v-for="(item,index) in listData" :key="index">
            <div class="name left clearfix">
              <span @click.stop="setCstDrop(item,index)">{{item.ColumnNameInfo}}</span>
              <i class="iconfont icon-xiala" @click.stop="setCstDrop(item,index)"></i>
            </div>
            <div class="name center">
              <div class="n-wrap clearfix" @click.stop="getSelectType('Connector', item, index)">
                <span @click.stop="getSelectType('Connector', item, index)">{{item.Connector}}</span>
                <i class="iconfont icon-xiala"></i>
              </div>
            </div>
            <div class="name right clearfix" v-if="item.ColumnType==='CBO'">
              <i class="iconfont icon-xiala" @click.stop="getSelectType('EditType', item, index)"></i>
              <span @click.stop="getSelectType('EditType', item, index)">{{item.ValueStartName}}</span>
            </div>
            <div class="name right clearfix" v-if="item.ColumnType==='TXT'">
              <input type="text" v-model="item.ValueStart" @input="changeData" maxlength="10" placeholder="请输入">
            </div>
            <div class="name right clearfix" v-if="item.ColumnType==='NUM'">
              <input type="text" v-model="item.ValueStart" @input="setNum(item)" placeholder="请输入">
            </div>
            <div class="name right clearfix" v-if="item.ColumnType==='DTP'">
              <!-- <datetime v-model="item.ValueStart" format="YYYY-MM-DD" :max-year=3000 @on-change="changeData"> -->
                <div class="date clearfix" @click.stop="toChoiseDate(item)">
                  <input class="inputBox" type="text" placeholder="请选择" v-model="item.ValueStart" readonly="readonly">
                </div>
              <!-- </datetime> -->
            </div>
            <i class="iconfont icon-jianqu del" @click.stop="deleteItem(item,index)"></i>
          </div>
          <div class="new clearfix">
            <i class="iconfont icon-zengjia1 icon" @click.stop="getCstDrop()"></i>
            <span @click.stop="getCstDrop()">再加字段</span>
          </div>
        </div>
      </div>
      <div class="footer clearfix">
        <div class="sub" :class="{'deepColor':com_allReady()}" @click.stop="submitAndNew">提交并生成匹配意向</div>
        <div class="submit" :class="{'deepColor':com_allReady()}" @click.stop="submit">提交</div>
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
    <select-list ref="selectList" :selectData="selectData" @selectItem="selectItem"></select-list>
    <dialog-confire
      :title="dialogData.title"
      ref="dialog"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
    ></dialog-confire>
  </div>
</template>
<script>
/*eslint-disable*/
import selectList from '@/components/selectList'
import dialogConfire from '@/components/dialogConfire.vue'
import {mapGetters} from 'vuex'
import initDate from '@/mixins/initDate/index.js'
import navTitle from '@/components/navTitle'
import { DatetimePicker } from 'mint-ui'
export default {
  name: 'newOrEditNeeds',
  components: {selectList, dialogConfire, navTitle, DatetimePicker},
  mixins: [initDate],
  data () {
    return {
      title: '',
      locationData: {},
      headerData: [
        {name: '字段名称', position: 'left'},
        {name: '连接符', position: 'center'},
        {name: '字段值', position: 'right'}
      ],
      listData: [],
      resType: {hasSelect: false, value: ''},
      requCstDrop: {hasSelect: false, ID: ''},
      cstDropList: [],
      selectData: {
        title: '',
        type: '',
        item: {},
        index: 0,
        list: []
      },
      dialogData: {
        title: '',
        type: '',
        index: 0,
        status: '',
        data: {}
      },
      isSubmit: false,
      isChange: false,
      isHttping: false,
      itemData: {},
      pickerValue: ''
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
      this.dialogData.type = 'before'
      this.dialogData.title = '退出此次编辑？'
    } else {
      next()
    }
  },
  methods: {
    com_allReady () {
      if (this.resType.hasSelect && this.requCstDrop.hasSelect && this.listData.length) {
        return true
      } else {
        return false
      }
    },
    toChoiseDate (item) {
      this.pickerValue = item.ValueStart || this.initToday()
      this.itemData = item
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      this.itemData.ValueStart = date.format('yyyy-MM-dd')
      this.changeData()
    },
    changeData () {
      this.isChange = true
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
      if (this.dialogData.type === 'before') {
        this.dialogData.status(false)
      }
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      if (this.dialogData.type === 'before') {
        this.dialogData.status()
      } else {
        this.isChange = true
        this.delete()
      }
    },
    // 删除
    deleteItem (item, index) {
      this.dialogData.title = '确定删除该项？'
      this.dialogData.data = item
      this.dialogData.index = index
      this.dialogData.type = 'delete'
      this.$refs.dialog.show()
    },
    delete () {
      this.listData.splice(this.dialogData.index, 1)
      console.log(this.listData)
    },
    async submitAndNew () {
      if (!this.com_allReady()) {
        return
      }
      if (this.isHttping) {
        return
      }
      this.isHttping = true
      let obj = {}
      if (this.$route.query.type > 0) {
        obj = {
          p0: 'UserCS_OpportCstRequUpdate',
          p7: {
          'ID': this.business.msg.Id,
          'RegisterPeo': this.requCstDrop.ID || '',
          'ResType': this.resType.value,
          }
        }
      } else {
        obj = {
          p0: 'UserCS_OpportCstRequAdd',
          p7: {
            'RegisterPeo': this.locationData.employeeData.employeeId,
            'ResType': this.resType.value,
            'CstID': this.requCstDrop.ID,
            'RegisterDate': this.initToday(),
            'Memo': '',
            'OptID': this.business.detail.Id,
            'DayNumber': '',
            'IsVacant': '',
            'OrgID': this.locationData.orgData.orgId
          }
        }
      }
      let CstRequDeta = []
      this.listData.forEach(arr => {
        let list = {
          'ColumnName': arr.ColumnName,
          'Connector': arr.Connector || '',
          'ValueStart': arr.ValueStart || '',
          'ColumnType': arr.ColumnType
        }
        CstRequDeta.push(list)
      })
      obj.p7.CstRequDeta = CstRequDeta
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml(obj.p0, obj.p7)
      // this.$vux.loading.hide()
      if (res.status === 200 || res.status === '200') {
        let msg = this.business.msg
        msg.CstRequDeta = CstRequDeta
        this.$store.commit('updateBusiness', {
          hasDetail: true,
          detail: this.business.detail,
          msg: msg
        })
        this.$store.commit('updateRentSearchKey', {key: ''})
        this.$toast('提交需求成功！')
        setTimeout(() => {
          this.isHttping = false
          this.$router.push('/matchOrder')
        }, 2000)
      } else {
        this.isHttping = false
        this.$toast(res.msg)
      }
    },
    // 输入数字
    setNum (item) {
      this.isChange = true
      let num = item.ValueStart || ''
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
      if (num - 0 > 1000000000) {
        num =  '999999999.99'
      }
      item.ValueStart = num
    },
    async submit () {
      if (!this.com_allReady()) {
        return
      }
      if (this.isHttping) {
        return
      }
      this.isHttping = true
      let obj = {}
      if (this.$route.query.type > 0) {
        obj = {
          p0: 'UserCS_OpportCstRequUpdate',
          p7: {
            'ID': this.business.msg.Id,
            'RegisterPeo': this.locationData.employeeData.employeeId,
            'CstID': this.requCstDrop.ID || '',
            'ResType': this.resType.value
          }
        }
      } else {
        obj = {
          p0: 'UserCS_OpportCstRequAdd',
          p7: {
            'RegisterPeo': this.locationData.employeeData.employeeId,
            'ResType': this.resType.value,
            'CstID': this.requCstDrop.ID || '',
            'RegisterDate': this.initToday(),
            'Memo': '',
            'OptID': this.business.detail.Id,
            'DayNumber': '',
            'IsVacant': '',
            'OrgID': this.locationData.orgData.orgId
          }
        }
      }
      let CstRequDeta = []
      this.listData.forEach(arr => {
        let list = {
          'ColumnName': arr.ColumnName,
          'Connector': arr.Connector || '',
          'ValueStart': arr.ValueStart || '',
          'ColumnType': arr.ColumnType
        }
        CstRequDeta.push(list)
      })
      obj.p7.CstRequDeta = CstRequDeta
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml(obj.p0, obj.p7)
      // this.$vux.loading.hide()
      this.$toast(res.msg)
      if (res.status === 200 || res.status === '200') {
        setTimeout(() => {
          this.isSubmit = true
          this.isHttping = false
          this.$router.go(-1)
        }, 2000)
      } else {
        this.isHttping = false
      }
    },
    // 获取需求提交人
    async getRequCstDrop () {
      // let obj = {
      //   p0: 'UserCS_OpportCstRequCstDrop',
      //   p7: {
      //     'CstID': this.business.detail.CstID
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportCstRequCstDrop', {
        'CstID': this.business.detail.CstID
      })
      console.log(res)
      res.data.forEach(arr => {
        if (arr.ID === this.requCstDrop.ID) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      // this.$vux.loading.hide()
      this.selectData.title = '需求提交人'
      this.selectData.list = res.data
      this.selectData.type = 'RequCstDrop'
      this.$refs.selectList.show()
    },
    // 获取字段名称
    async getCstDrop () {
      // if (this.cstDropList.length) {
      //   this.selectData.list = this.cstDropList
      //   this.selectData.type = 'CstDrop'
      //   this.$refs.selectList.show()
      //   console.log(this.selectData.list)
      //   return
      // }
      // let obj = {
      //   p0: 'UserCS_OpportCstRequDrop',
      //   p7: {}
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportCstRequDrop', {})
      console.log(res.data)
      res.data.forEach(arr => {
        if (arr.value === this.resType.value) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      // this.$vux.loading.hide()
      this.selectData.title = '字段名称'
      this.cstDropList = res.data
      this.selectData.list = res.data
      this.selectData.type = 'CstDrop'
      this.$refs.selectList.show()
    },
    // 选择字段名称
    async setCstDrop (item, index) {
      // let obj = {
      //   p0: 'UserCS_OpportCstRequDrop',
      //   p7: {}
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportCstRequDrop', {})
      console.log(item)
      console.log(res)
      res.data.forEach(arr => {
        if (item.ColumnName === arr.FieldName) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      // this.$vux.loading.hide()
      this.selectData.title = '字段名称'
      this.cstDropList = res.data
      this.selectData.list = res.data
      this.selectData.type = 'editCst'
      this.selectData.item = item
      this.selectData.index = index
      this.$refs.selectList.show()
    },
    // 获取下拉列表
    async getSelectType (type, item, index) {
      let obj = {
        p0: 'UserRent_GetOptionList'
      }
      if (type === 'ResType') {
        obj.p7 = {
          'TypeName': 'ResType1'
        }
        this.selectData.title = '资源类型'
        this.selectData.type = 'ResType'
      } else if (type === 'Connector') {
        obj.p7 = {
          'TypeName': 'Connector'
        }
        this.selectData.title = '连接符'
        this.selectData.type = 'Connector'
        this.selectData.item = item
        this.selectData.index = index
      } else if (type === 'EditType') {
        this.selectData.title = '字段值'
        this.selectData.type = 'EditType'
        this.selectData.item = item
        this.selectData.index = index
        if (item.ColumnName === 'HouseLayID') {
          obj.p7 = {
            'TypeName': 'HouseLay'
          }
          this.getHouseLay(type, item, index)
          return
        } else {
          obj.p7 = {
            'TypeName': item.ColumnName
          }
        }
      }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml(obj.p0, obj.p7)
      console.log(res)
      if (type === 'ResType') {
        let temp = []
        res.data.forEach(arr => {
          if (this.resType.hasSelect && this.resType.value === arr.value) {
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
        res.data = temp
      } else if (type === 'Connector') {
        res.data.forEach(arr => {
          if (item.Connector === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
          arr.showText = arr.value
        })
      } else if (type === 'EditType') {
        res.data.forEach(arr => {
          if (item.ValueStart === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      }
      // this.$vux.loading.hide()
      this.selectData.list = res.data
      this.$refs.selectList.show()
    },
    // 获取户型下拉列表
    async getHouseLay (type, item, index) {
      this.selectData.type = 'HouseLay'
      // let obj = {
      //   p0: 'UserCS_OpportHouseLay',
      //   p7: {
      //     'OrgID': this.locationData.orgData.orgId
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportHouseLay', {
        'OrgID': this.locationData.orgData.orgId
      })
      console.log(res)
      // this.$vux.loading.hide()
      if (res.status === 200 || res.status === '200') {
        res.data.forEach(arr => {
          if (item.ValueStart === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
        this.selectData.list = res.data
        this.$refs.selectList.show()
      } else {
        this.$toast(res.msg)
      }
    },
    // 选择下拉列表项
    selectItem (item) {
      console.log(item)
      this.isChange = true
      if (this.selectData.type === 'ResType') {
        this.resType = item
      } else if (this.selectData.type === 'RequCstDrop') {
        this.requCstDrop = item
      } else if (this.selectData.type === 'CstDrop') {
        let obj = {
          'ColumnName': item.FieldName,
          'ColumnNameInfo': item.Text,
          'ColumnType': item.EditType,
          'ValueStart': ''
        }
        this.listData.push(obj)
        console.log(this.listData)
      } else if (this.selectData.type === 'editCst') {
        let obj = {
          'ColumnName': item.FieldName,
          'ColumnNameInfo': item.Text,
          'ColumnType': item.EditType,
          'ValueStart': ''
        }
        this.listData.splice(this.selectData.index, 1, obj)
        console.log('listData', this.listData)
      } else if (this.selectData.type === 'Connector') {
        let obj = {
          'Connector': item.value
        }
        this.listData.splice(this.selectData.index, 1, {...this.selectData.item, ...obj})
      } else if (this.selectData.type === 'EditType' || this.selectData.type === 'HouseLay') {
        let obj = {
          'ValueStart': item.value,
          'ValueStartName': item.showText
        }
        // if (this.selectData.item.ColumnName === 'HouseLayID') {
        //   obj.ValueStart = item.id
        // }
        this.listData.splice(this.selectData.index, 1, {...this.selectData.item, ...obj})
      }
    }
  },
  created () {
    if (this.$route.query.type > 0) {
      document.title = '编辑需求'
      this.title = '编辑需求'
      this.listData = this.business.msg.CstRequDetaList
      if (this.business.msg.ResType) {
        this.resType = {hasSelect: true, value: this.business.msg.ResType, showText: this.business.msg.ResTypeName}
      }
      if (this.business.msg.RequSubmitEmpl) {
        this.requCstDrop = {hasSelect: true, CstName: this.business.msg.RequSubmitEmplName, ID: this.business.msg.RequSubmitEmpl}
      }
    } else {
      document.title = '新增需求'
      this.title = '新增需求'
    }
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .newOrEditNeeds{
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
        .header{
          border-bottom: 1px solid #e9e9e9;
          .it{
            float: left;
            height: .88rem;
            line-height: .88rem;
            font-size: .28rem;
            color: #777E8C;
            &.left{
              text-align: left;
              width: 3.2rem;
            }
            &.center{
              text-align: center;
              width: 1.1rem;
            }
            &.right{
              text-align: right;
              width: 2.6rem;
            }
          }
        }
        .list{
          position: relative;
          height: .88rem;
          padding-left: .6rem;
          border-bottom: 1px solid #e9e9e9;
          .name{
            float: left;
            width: 2.1rem;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            &.left{
              position: relative;
              text-align: left;
              width: 2.6rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              span{
                float: left;
              }
              .icon-xiala{
                float: left;
                width: .4rem;
                height: .88rem;
                font-size: .4rem;
                line-height: .9rem;
              }
            }
            &.center{
              position: relative;
              text-align: center;
              width: 1.1rem;
              .n-wrap{
                display: inline-block;
                text-align: center;
                span{
                  float: left;
                }
                .icon-xiala{
                  float: left;
                  width: .4rem;
                  height: .88rem;
                  font-size: .4rem;
                  line-height: .9rem;
                }
              }
            }
            &.right{
              text-align: right;
              width: 2.6rem;
              span{
                float: right;
              }
              input{
                width: 2.6rem;
                height: .88rem;
                text-align: right;
                font-size: .3rem;
                color: #333;
                &::placeholder{
                  text-align: right;
                  color: #999;
                }
              }
              .icon-xiala{
                float: right;
                width: .4rem;
                height: .88rem;
                font-size: .4rem;
                line-height: .9rem;
              }
              .date{
                position: relative;
                width: 2.6rem;
                .inputBox{
                  float: left;
                  height: .88rem;
                  width: 2.6rem;
                  border: 0;
                  font-size: .3rem;
                  color: #333;
                  &::placeholder{
                    color: #999;
                  }
                }
              }
            }
            span{
              display: inline-block;
              height: .88rem;
              line-height: .88rem;
            }
          }
          .del{
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            width: .6rem;
            height: .88rem;
            text-align: left;
            font-size: .4rem;
            color: #FF6263;
            line-height: .88rem;
          }
        }
        .new{
          height: .88rem;
          .icon{
            float: left;
            width: .5rem;
            height: .88rem;
            line-height: .88rem;
            font-size: .4rem;
            color: #3395FF;
          }
          span{
            float: left;
            height: .88rem;
            margin-left: .1rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #3395FF;
          }
        }
      }
    }
    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1.2rem;
      width: 100vw;
      padding: .2rem .3rem;
      background: #fff;
      border-top: 1px solid #e9e9e9;
      .sub{
        float: left;
        width: 3.3rem;
        height: .8rem;
        line-height: .8rem;
        text-align: center;
        color: #99CAFF;
        font-size: .3rem;
        border: 1px solid #99CAFF;
        border-radius: 3px;
        &.deepColor{
          border: 1px solid #3395FF;
          color: #3395FF;
        }
      }
      .submit{
        float: right;
        width: 3.3rem;
        height: .8rem;
        line-height: .8rem;
        text-align: center;
        color: #fff;
        font-size: .3rem;
        background: rgba(51,149,255,.5);
        border-radius: 3px;
        &.deepColor{
          background: #3395FF;
        }
      }
    }
  }
</style>
