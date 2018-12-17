<template>
  <div>
    <div class="theme" v-if="detailData.BookStatus==='HB'">
      <div class="inputItem clearfix">
        <span class="name">会议主题</span>
        <input class="inputs" type="text" name="MeetName" @input="inputText" :value="detailData.MeetName" placeholder="请输入会议主题">
      </div>
      <div class="textItem clearfix">
        <span class="name">会议内容</span>
        <textarea class="areas" placeholder="请输入会议内容"></textarea>
      </div>
      <div class="selectItem clearfix" @click.stop="getSelectType('type1')">
        <span class="name">预订人</span>
        <span class="value textLeft" v-if="detailData.BookName">{{detailData.BookName}}</span>
        <span class="value" v-else >请选择</span>
        <i class="iconfont icon-tubiao- icon"></i>
      </div>
      <div class="inputItem clearfix noneBb">
        <span class="name">预订人电话</span>
        <input class="inputs" type="text" name="BookPhone" @input="inputInt" placeholder="请输入电话" :value="detailData.BookPhone">
      </div>
    </div>
    <div class="theme"  v-else>
      <div class="selectItem clearfix">
        <span class="name">会议主题</span>
        <span class="value textLeft">{{detailData.MeetName}}</span>
      </div>
      <div class="textShowItem clearfix">
        <span class="name">会议内容</span>
        <span class="value"></span>
      </div>
      <div class="selectItem clearfix">
        <span class="name">预订人</span>
        <span class="value textLeft">{{detailData.BookName}}</span>
      </div>
      <div class="selectItem clearfix noneBb">
        <span class="name">预订人电话</span>
        <span class="value textLeft">{{detailData.BookPhone}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'theme',
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          BookStatus: '',
          MeetName: '',
          BookName: '',
          BookPhone: ''
        }
      }
    }
  },
  data () {
    return {
      selectData: {
        title: '',
        type: '',
        list: []
      }
    }
  },
  methods: {
    // 输入文本
    inputText (e) {
      this.upData(e.target.name, e.target.value)
    },
    // 只允许输入数字
    inputInt (e) {
      let num = e.target.value + ''
      num = num.replace(/[^\d]/g, '') - 0
      this.upData(e.target.name, num)
    },
    // 更新数据
    upData (name, value) {
      let obj = {}
      obj[name] = value
      this.$emit('update:detailData', Object.assign({}, this.detailData, obj))
    },
    // 获取下拉列表数据
    async getSelectType () {
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
      this.selectData.title = '预订人'
      this.selectData.list = res.data
      this.selectData.type = 'BookName'
      this.$emit('setSelectList', this.selectData)
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
  .theme{
    padding-left: .3rem;
    margin-top: .2rem;
    background: #fff;
  }
</style>
