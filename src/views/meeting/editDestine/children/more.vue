<template>
  <div>
    <div class="more" v-if="detailData.BookStatus==='HB'">
      <div class="title" @click.stop="showMore=!showMore">
        <p :class="{'noneBb':!showMore}">
          <span>更多</span>
        </p>
        <i class="iconfont icon" :class="showMore?'icon-zhankai1':'icon-zhankai'"></i>
      </div>
      <transition name="slide-bottom">
        <div class="more-msg" v-show="showMore">
          <div class="msg1">
            <div class="selectItem clearfix" @click.stop="getSelectType('MeetFormName')">
              <span class="name">会议形式</span>
              <span class="value textLeft" v-if="detailData.MeetFormName">{{detailData.MeetFormName}}</span>
              <span class="value" v-else >请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="selectItem clearfix" @click.stop="getSelectType('MeetUseName')">
              <span class="name">会议用途</span>
              <span class="value textLeft" v-if="detailData.MeetUseName">{{detailData.MeetUseName}}</span>
              <span class="value" v-else >请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="inputItem clearfix">
              <span class="name">参会人数</span>
              <input class="inputs" type="text" v-model="detailData.MeetNumber" @input="inputMeetNumber" placeholder="请输入参会人数">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">使用部门</span>
              <input class="inputs" type="text" v-model="detailData.UserDepartments" @input="inputUserDepartments" placeholder="请输入使用部门">
            </div>
          </div>
          <div class="msg2">
            <div class="inputItem clearfix">
              <span class="name">会议联系人</span>
              <input class="inputs" type="text" v-model="detailData.MeetPerson" @input="inputMeetPerson" placeholder="请输入联系人">
            </div>
            <div class="inputItem clearfix">
              <span class="name">联系人电话</span>
              <input class="inputs" type="text" v-model="detailData.Phone" @input="inputPhone" placeholder="请输入联系人电话">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">联系人邮箱</span>
              <input class="inputs" type="text" v-model="detailData.Email" @input="inputEmail" placeholder="请输入联系人邮箱">
            </div>
          </div>
          <div class="msg3">
            <div class="inputItem clearfix">
              <span class="name">单价</span>
              <input class="inputs" type="text" v-model="detailData.UnitPrice" @input="inputUnitPrice" placeholder="请输入单价">
            </div>
            <div class="inputItem clearfix">
              <span class="name">预收金额</span>
              <input class="inputs" type="text" v-model="detailData.AdvanceMoney" @input="inputAdvanceMoney" placeholder="请输入预收金额">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">会议套餐</span>
              <input class="inputs" type="text" v-model="detailData.MeetPackage" @input="inputMeetPackage" placeholder="请输入会议套餐">
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="more" v-else>
      <div class="title" @click.stop="showMore=!showMore">
        <p :class="{'noneBb':!showMore}">
          <span>更多</span>
        </p>
        <i class="iconfont icon" :class="showMore?'icon-zhankai1':'icon-zhankai'"></i>
      </div>
      <transition name="slide-bottom">
        <div class="more-msg" v-show="showMore">
          <div class="msg1">
            <div class="selectItem clearfix">
              <span class="name">会议形式</span>
              <span class="value textLeft">{{detailData.MeetFormName}}</span>
            </div>
            <div class="selectItem clearfix">
              <span class="name">会议用途</span>
              <span class="value textLeft">{{detailData.MeetUseName}}</span>
            </div>
            <div class="selectItem clearfix">
              <span class="name">参会人数</span>
              <span class="value textLeft">{{detailData.MeetNumber}}</span>
            </div>
            <div class="selectItem clearfix noneBb">
              <span class="name">使用部门</span>
              <span class="value textLeft">{{detailData.UserDepartments}}</span>
            </div>
          </div>
          <div class="msg2">
            <div class="selectItem clearfix">
              <span class="name">会议联系人</span>
              <span class="value textLeft">{{detailData.MeetPerson}}</span>
            </div>
            <div class="selectItem clearfix">
              <span class="name">联系人电话</span>
              <span class="value textLeft">{{detailData.Phone}}</span>
            </div>
            <div class="selectItem clearfix noneBb">
              <span class="name">联系人邮箱</span>
              <span class="value textLeft">{{detailData.Email}}</span>
            </div>
          </div>
          <div class="msg3">
            <div class="selectItem clearfix">
              <span class="name">单价</span>
              <span class="value textLeft">{{detailData.UnitPrice}}</span>
            </div>
            <div class="selectItem clearfix">
              <span class="name">预收金额</span>
              <span class="value textLeft">{{detailData.AdvanceMoney}}</span>
            </div>
            <div class="selectItem clearfix noneBb">
              <span class="name">会议套餐</span>
              <span class="value textLeft">{{detailData.MeetPackage}}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
/*eslint-disable */
export default {
  name: 'more',
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          BookStatus: '',
          MeetFormName: '',
          MeetUseName: '',
          MeetNumber: '',
          UserDepartments: '',
          MeetPerson: '',
          Phone: '',
          Email: '',
          UnitPrice: '',
          AdvanceMoney: '',
          MeetPackage: ''
        }
      }
    }
  },
  data () {
    return {
      showMore: false,
      selectData: {
        title: '',
        type: '',
        list: []
      }
    }
  },
  methods: {
    inputMeetNumber (e) {
      let num = e.target.value + ''
      num = this.inputInt(num)
      // num = num.replace(/[^\d]/g, '') - 0
      this.upNewData('MeetNumber', num)
    },
    inputUserDepartments (e) {
      this.upNewData('UserDepartments', e.target.value)
    },
    inputMeetPerson(e) {
      this.upNewData('MeetPerson', e.target.value)
    },
    inputPhone (e) {
      let num = e.target.value + ''
      num = this.inputInt(num)
      // num = num.replace(/[^\d]/g, '') - 0
      this.upNewData('Phone', num)
    },
    inputEmail (e) {
      let num = e.target.value + ''
      num = this.inputInt(num)
      // num = num.replace(/[^\d]/g, '') - 0
      this.upNewData('Email', num)
    },
    inputUnitPrice (e) {
      let num = e.target.value + ''
      num = this.inputFloat(num)
      // if (num.substr(0, 1) === '.') {
      //   num = ''
      // }
      // num = num.replace(/^0*(0\.|[1-9])/, '$1')
      // num = num.replace(/[^\d.]/g, '')
      // num = num.replace(/\.{2,}/g, '.')
      // num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      // if (num.indexOf('.') < 0 && num !== '') {
      //   if (num.substr(0, 1) === '0' && num.length === 2) {
      //     num = num.substr(1, num.length)
      //   }
      // }
      this.upNewData('UnitPrice', num)
    },
    inputAdvanceMoney (e) {
      let num = e.target.value + ''
      num = this.inputFloat(num)
      // if (num.substr(0, 1) === '.') {
      //   num = ''
      // }
      // num = num.replace(/^0*(0\.|[1-9])/, '$1')
      // num = num.replace(/[^\d.]/g, '')
      // num = num.replace(/\.{2,}/g, '.')
      // num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      // if (num.indexOf('.') < 0 && num !== '') {
      //   if (num.substr(0, 1) === '0' && num.length === 2) {
      //     num = num.substr(1, num.length)
      //   }
      // }
      this.upNewData('AdvanceMoney', num)
    },
    inputMeetPackage (e) {
      this.upNewData('MeetPackage', e.target.value)
    },
    // 只允许输入数字
    inputInt (value) {
      let num = value + ''
      num = num.replace(/[^\d]/g, '') - 0
      return num
    },
    // 允许输入小数点后两位
    inputFloat (value) {
      let num = value + ''
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
      return num
    },
    // 更新数据
    upNewData (type, value) {
      let obj = {}
      obj[type] = value
      this.$emit('update:detailData', Object.assign({}, this.detailData, obj))
    },
    // 获取选择列表
    async getSelectType (type) {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserRent_GetOptionList', {
        'TypeName': 'CognitiveWay'
      })
      console.log(res)
      res.data.forEach(arr => {
        if (this.detailData.CognitiveWay === arr.value) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      switch (type) {
        case 'MeetFormName':
          this.selectData.title = '会议形式'
          break
        case 'MeetUseName':
          this.selectData.title = '会议用途'
          break
      }
      this.selectData.list = res.data
      this.selectData.type = type
      this.$emit('setSelectList', this.selectData)
    }
  }
}
</script>
.<style lang="scss" scoped>
  .more{
    margin-top: .2rem;
    .title{
      padding-left: .3rem;
      background: #fff;
      position: relative;
      p{
        height: .88rem;
        line-height: .88rem;
        font-size: .32rem;
        color: #333;
        border-bottom: 1px solid #ededed;
      }
      .icon{
        position: absolute;
        right: .2rem;
        top: 0;
        display: block;
        width: .4rem;
        height: .88rem;
        line-height: .88rem;
        font-size: .4rem;
        color: #999;
      }
    }
    .more-msg{
      .msg1{
        padding-left: .3rem;
        background: #fff;
      }
      .msg2,.msg3{
        padding-left: .3rem;
        margin-top: .2rem;
        background: #fff;
      }
    }
    .slide-bottom-enter-active, .slide-bottom-leave-active {
      transition: opacity .5s;
      -webkit-transform: opacity .5s;
    }
    .slide-bottom-enter, .slide-bottom-leave-active {
      opacity: 0
    }
  }
</style>
