<template>
  <div>
    <dl class="date_wrap border-bottom-half">
      <dt class="padding-bottom">
        <label><slot></slot></label>
      </dt>
      <dd class="weui-flex padding-bottom5">
        <div @click="dateShow(dateArr[0], 'start')"  class="date_input clearfix">
          <input readonly  :value="dateArr[0]" placeholder="开始时间">
          <i class="float_right padding-right iconfont icon-calendar icon-gengduo1"></i>
        </div>
        <div class="padding5"></div>
        <div @click="dateShow(dateArr[1], 'end')"  class="date_input clearfix">
          <input readonly  :value="dateArr[1]" placeholder="结束时间">
          <i class="float_right padding-right iconfont icon-calendar icon-gengduo1"></i>
        </div>
      </dd>
    </dl>
  </div>
</template>
<script>
export default {
  name: 'filterDate',
  props: {
    value: String,
    date: String,
    name: String
  },
  data () {
    return {
      pickerValue: new Date()
    }
  },
  created () {
    this.formItemId = this.dateId
    this.saveVal = this.value
  },
  computed: {
    dateArr () {
      if (this.value) {
        let res = this.value.split(',')
        return res
      } else {
        return ['', '']
      }
    },
    dateId () {
      return 'date_' + Date.now() + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  methods: {
    filterReset () {
      this.$emit('input', this.saveVal)
    },
    validateFilterItem () {
      if (this.dateArr[0] && !this.dateArr[1]) {
        return '请填写结束日期'
      }
      if (!this.dateArr[0] && this.dateArr[1]) {
        return '请填写开始日期'
      }
      if (new Date(this.dateArr[0]) > new Date(this.dateArr[1])) {
        return '开始日期不能大于结束日期'
      }
    },
    dateShow (date, type) {
      if (type === 'start') {
        this.$parent.dateStartOpen(this.name, date || new Date())
      } else {
        this.$parent.dateEndOpen(this.name, date || new Date())
      }
      // this.$parent.dateOpen(this.name, date || new Date())
    }
  }
}
</script>

<style lang="scss" scoped>
.date_wrap {
  background:#FFF;
  padding:10px 15px;
  & .date_input {
    background:#ECECEC;
    line-height:28px;
    height:28px;
    text-align:center;
    border-radius:28px;
    & input {
      height:28px;
      font-size:14px;
      width:70%;
       padding-left: 5px;
      line-height: 28px;
      vertical-align: top;
    }
  }
}
</style>
