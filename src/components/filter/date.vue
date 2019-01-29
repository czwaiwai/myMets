<template>
  <div @click="dateShow">
    <dl class="date_wrap border-bottom-half">
      <dt class="padding-bottom">
        <label :for="dateId" ><slot></slot></label>
      </dt>
      <dd>
        <div class="date_input clearfix">
          <input  :id="dateId" readonly  :value="value">
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
  },
  computed: {
    dateId () {
      return 'date_' + Date.now() + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  methods: {
    dateShow () {
      this.$parent.dateOpen(this.name)
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
      width:80%;
      padding-left: 5px;
      line-height: 28px;
      vertical-align: top;
    }
  }
}
</style>
