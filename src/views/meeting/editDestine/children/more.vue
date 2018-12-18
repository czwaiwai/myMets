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
              <span class="value textLeft" v-if="detailData.MeetUseName||detailData.MeetUse">{{detailData.MeetUseName||detailData.MeetUse}}</span>
              <span class="value" v-else >请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="inputItem clearfix">
              <span class="name">参会人数</span>
              <input class="inputs" type="text" name="MeetNumber" :value="detailData.MeetNumber" @input="inputInt" placeholder="请输入参会人数">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">使用部门</span>
              <input class="inputs" type="text" name="UserDepartments" :value="detailData.UserDepartments" @input="inputText" placeholder="请输入使用部门">
            </div>
          </div>
          <div class="msg2">
            <div class="inputItem clearfix">
              <span class="name">会议联系人</span>
              <input class="inputs" type="text" name="MeetPerson" :value="detailData.MeetPerson" @input="inputText" placeholder="请输入联系人">
            </div>
            <div class="inputItem clearfix">
              <span class="name">联系人电话</span>
              <input class="inputs" type="text" name="Phone" :value="detailData.Phone" maxlength="11" @input="inputNum" placeholder="请输入联系人电话">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">联系人邮箱</span>
              <input class="inputs" type="text" name="Email" :value="detailData.Email" @input="inputText" placeholder="请输入联系人邮箱">
            </div>
          </div>
          <div class="msg3">
            <div class="inputItem clearfix">
              <span class="name">单价</span>
              <input class="inputs" type="text" name="UnitPrice" :value="detailData.UnitPrice" @input="inputFloat" placeholder="请输入单价">
            </div>
            <div class="inputItem clearfix">
              <span class="name">预收金额</span>
              <input class="inputs" type="text" name="AdvanceMoney" :value="detailData.AdvanceMoney" @input="inputFloat" placeholder="请输入预收金额">
            </div>
            <div class="inputItem clearfix noneBb">
              <span class="name">会议套餐</span>
              <input class="inputs" type="text" name="MeetPackage" :value="detailData.MeetPackage" @input="inputText" placeholder="请输入会议套餐">
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
              <span class="value textLeft">{{detailData.MeetUseName||detailData.MeetUse}}</span>
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
          MeetUse: '',
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
    // 只允许输入数字
    inputInt (e) {
      let num = e.target.value + ''
      num = num.replace(/[^\d]/g, '') - 0 || ''
      this.upData(e.target.name, num)
    },
    // 只允许输入数字,允许首位为0
    inputNum (e) {
      let num = e.target.value + ''
      num = num.replace(/[^\d]/g, '')
      if (e.target.maxLength > 0) {
        num = num.slice(0, e.target.maxLength)
      }
      this.upData(e.target.name, num)
    },
    // 输入文本
    inputText (e) {
      let text = e.target.value + ''
      this.upData(e.target.name, text)
    },
    // 允许输入小数点后两位
    inputFloat (e) {
      let num = e.target.value + ''
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
      this.upData(e.target.name, num)
    },
    // 更新数据
    upData (name, value) {
      let obj = {}
      obj[name] = value
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
