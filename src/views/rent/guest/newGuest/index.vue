<template>
  <div class="page page_bg">
    <nav-title title="新增客源"></nav-title>
    <div class="page_bd newGuest">
      <div class="content">
        <div class="baseMsg">
          <h3 class="title">基本信息 <span>(必填)</span></h3>
          <div class="top">
            <div class="selectItem clearfix" @click.stop="selectType('CstType')">
              <span class="name">客源类型：</span>
              <span class="value textLeft" v-if="cstType.hasSelect">{{cstType.showText}}</span>
              <span class="value" v-else>请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="inputItem clearfix">
              <span class="name">客源名称：</span>
              <input class="inputs" type="text" placeholder="请输入" v-model="name">
            </div>
            <div class="inputItem clearfix" v-show="cstType.value!='P'">
              <span class="name">联系人：</span>
              <input class="inputs" type="text" placeholder="请输入" v-model="person">
            </div>
            <div class="sex">
              <span>联系人性别：</span>
              <div class="select-box clearfix">
                <p class="man" @click.stop="sexType='M'">
                  <i class="iconfont icons" :class="sexType=='M'?'icon-xuanzhong':'icon-yuancircle46'"></i>
                  <span>男</span>
                </p>
                <p class="gril" @click.stop="sexType='F'">
                  <i class="iconfont icons" :class="sexType=='F'?'icon-xuanzhong':'icon-yuancircle46'"></i>
                  <span>女</span>
                </p>
              </div>
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">联系方式：</span>
              <input class="inputs" type="text" placeholder="请输入" v-model="phone">
            </div>
          </div>
        </div>
        <div class="moreMsg">
          <h3 class="title">更多信息 <span>(选填)</span></h3>
          <div class="msg">
            <div class="selectItem clearfix" @click.stop="selectType('CstCategory')">
              <span class="name">客源类别：</span>
              <span class="value textLeft" v-if="cstCategory.hasSelect">{{cstCategory.showText}}</span>
              <span class="value" v-else>请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="selectItem clearfix" @click.stop="selectType('CstLevel')">
              <span class="name">客源等级：</span>
              <span class="value textLeft" v-if="cstLevel.hasSelect">{{cstLevel.showText}}</span>
              <span class="value" v-else>请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="selectItem clearfix" @click.stop="selectType('CognitiveWay')">
              <span class="name">认知途径：</span>
              <span class="value textLeft" v-if="cognitiveWay.hasSelect">{{cognitiveWay.showText}}</span>
              <span class="value" v-else>请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="inputItem clearfix" v-show="cstType.value!='P'">
              <span class="name">传真：</span>
              <input class="inputs" type="text" placeholder="请输入" v-model="fax">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">备注：</span>
              <input class="inputs" type="text" placeholder="请输入" v-model="remark">
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="save" @click.stop="submit">提 交</div>
      </div>
    </div>
    <select-list ref="selectList" :selectData="selectData" @selectItem="selectItem"></select-list>
  </div>
</template>
<script>
import selectList from '@/components/selectList'
import navTitle from '@/components/navTitle'
export default {
  name: 'newGuest',
  components: {selectList, navTitle},
  data () {
    return {
      locationData: {},
      name: '',
      person: '',
      phone: '',
      fax: '',
      remark: '',
      sexType: 'M',
      selectData: {
        title: '',
        type: '',
        list: []
      },
      itemType: '',
      cstType: {hasSelect: false, value: 'P'},
      cstCategory: {hasSelect: false},
      cstLevel: {hasSelect: false},
      cognitiveWay: {hasSelect: false},
      isHttping: false
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal.length > 40) {
        this.name = newVal.slice(0, 40)
      }
    },
    person (newVal, oldVal) {
      if (newVal.length > 20) {
        this.person = newVal.slice(0, 20)
      }
    },
    phone (newVal, oldVal) {
      let phone = newVal.replace(/[^0-9]/g, '')
      if (phone.length > 11) {
        this.phone = phone.slice(0, 11)
      } else {
        this.phone = phone
      }
    },
    fax (newVal, oldVal) {
      let fax = newVal.replace(/[^\d- ]/g, '')
      if (fax.length > 15) {
        this.fax = fax.slice(0, 15)
      } else {
        this.fax = fax
      }
    },
    remark (newVal, oldVal) {
      if (newVal.length > 300) {
        this.remark = newVal.slice(0, 300)
      }
    }
  },
  methods: {
    async selectType (type) {
      // let obj = {
      //   p0: 'UserRent_GetOptionList',
      //   p7: {
      //     'TypeName': type
      //   }
      // }
      this.itemType = type
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserRent_GetOptionList', {
        'TypeName': type
      })
      console.log(res)
      if (type === 'CstType') {
        this.selectData.title = '客源类型'
        res.data.forEach(arr => {
          if (this.cstType.hasSelect && this.cstType.value === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      } else if (type === 'CstCategory') {
        this.selectData.title = '客源类别'
        res.data.forEach(arr => {
          if (this.cstCategory.hasSelect && this.cstCategory.value === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      } else if (type === 'CstLevel') {
        this.selectData.title = '客源等级'
        res.data.forEach(arr => {
          if (this.cstLevel.hasSelect && this.cstLevel.value === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      } else if (type === 'CognitiveWay') {
        this.selectData.title = '认知途径'
        res.data.forEach(arr => {
          if (this.cognitiveWay.hasSelect && this.cognitiveWay.value === arr.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      }
      this.selectData.type = type
      this.selectData.list = res.data
      this.$refs.selectList.show()
    },
    selectItem (item) {
      console.log(item)
      if (this.itemType === 'CstType') {
        this.cstType = item
      } else if (this.itemType === 'CstCategory') {
        this.cstCategory = item
      } else if (this.itemType === 'CstLevel') {
        this.cstLevel = item
      } else if (this.itemType === 'CognitiveWay') {
        this.cognitiveWay = item
      }
    },
    async submit () {
      if (!this.cstType.hasSelect) {
        this.$toast('请选择客源类型！')
        return
      }
      if (!this.name.length) {
        this.$toast('请输入客源名称！')
        return
      }
      if (this.cstType.value !== 'P' && !this.person.length) {
        this.$toast('请输入联系人！')
        return
      }
      if (!this.phone.length) {
        this.$toast('请输入联系电话！')
        return
      }
      if (this.isHttping) {
        return
      }
      this.isHttping = true
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserAppCst_Add',
      //   p7: {
      //     'OrgID': this.locationData.orgData.orgId,
      //     'CstType': this.cstType.value,
      //     'Name': this.name,
      //     'CstComName': this.name,
      //     'LinkName': this.person,
      //     'Sex': this.sexType,
      //     'LinkValue': this.phone,
      //     'Category': this.cstCategory.value || '',
      //     'CstLevel': this.cstLevel.value || '',
      //     'CognitiveWay': this.cognitiveWay.value || '',
      //     'Fax': this.fax,
      //     'Memo': this.remark,
      //     'SaveType': 'RO',
      //     'EmployeeID': this.locationData.employeeData.employeeId,
      //     'EmployeeJobID': this.locationData.employeeData.employeeJobId
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserAppCst_Add', {
        'OrgID': this.locationData.orgData.orgId,
        'CstType': this.cstType.value,
        'Name': this.name,
        'CstComName': this.name,
        'LinkName': this.person,
        'Sex': this.sexType,
        'LinkValue': this.phone,
        'Category': this.cstCategory.value || '',
        'CstLevel': this.cstLevel.value || '',
        'CognitiveWay': this.cognitiveWay.value || '',
        'Fax': this.fax,
        'Memo': this.remark,
        'SaveType': 'RO',
        'EmployeeID': this.locationData.employeeData.employeeId,
        'EmployeeJobID': this.locationData.employeeData.employeeJobId
      })
      // this.$vux.loading.hide()
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        this.$toast('新增成功！')
        setTimeout(() => {
          this.isHttping = false
          this.$router.go(-1)
        }, 2000)
      } else {
        this.isHttping = false
        this.$toast(res.msg)
      }
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .newGuest{
    .content{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 1.08rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .baseMsg{
        .title{
          height: .7rem;
          padding: 0 .3rem;
          line-height: .7rem;
          font-size: .3rem;
          color: #999;
          span{
            color: #3395FF;
          }
        }
        .top{
          padding-left: .3rem;
          background: #fff;
          .sex{
            position: relative;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #999;
            border-bottom: 1px solid #ededed;
            .select-box{
              position: absolute;
              right: .3rem;
              top: 0;
              color: #333;
              .man{
                position: relative;
                float: left;
                width: .82rem;
                height: .88rem;
                font-size: .3rem;
                color: #999;
                text-align: right;
              }
              .gril{
                position: relative;
                float: left;
                width: .82rem;
                height: .88rem;
                margin-left: .3rem;
                font-size: .3rem;
                color: #999;
                text-align: right;
              }
              .icons{
                position: absolute;
                top: 0;
                left: 0;
                display: block;
                width: .4rem;
                height: .88;
                line-height: .88rem;
                text-align: center;
              }
              .icon-xuanzhong{
                font-size: .38rem;
                color: #3395FF;
              }
              .icon-yuancircle46{
                font-size: .4rem;
                color: #BFBFBF;
              }
            }
          }
        }
        .bottom{
          margin-top: .2rem;
          padding-left: .3rem;
          background: #fff;
        }
      }
      .moreMsg{
        .title{
          height: .7rem;
          padding: 0 .3rem;
          line-height: .7rem;
          font-size: .3rem;
          color: #999;
        }
        .msg{
          background: #fff;
          padding-left: .3rem;
        }
      }
    }
    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1.08rem;
      padding: .15rem .3rem;
      background: #fff;
      border-top: 1px solid #ededed;
      .save{
        height: .78rem;
        font-size: .3rem;
        line-height: .78rem;
        text-align: center;
        color: #fff;
        background: #3395FF;
        border-radius: 3px;
      }
    }
  }
</style>
