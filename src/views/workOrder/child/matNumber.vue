<template>
<div class="ins_number_group">
  <a class="mul" @click="mul">
    <i class="iconfont icon-jian1"></i>
  </a><input class="ins_input" :name="name" :value="value" :readonly="readonly"  @input="input" type="text"><a class="add" @click="add">
    <i class="iconfont icon-jia"></i>
  </a>
</div>
</template>
<script>
export default {
  name: 'matNumber',
  props: {
    value: Number,
    min: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      defalut: false
    },
    max: {
      type: Number,
      default: 99999
    }
  },
  data () {
    return {
      name: 'matNumber_' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  methods: {
    input ($event) {
      let value = $event.target.value - 0
      if (/^\d+$/.test(value)) {
        this.$emit('input', $event.target.value - 0)
      } else {
        this.$emit('input', this.value - 0)
        this.$forceUpdate() // 强制渲染试图
      }
    },
    mul () {
      let value = this.value || 0
      this.$emit('input', value - 1 < this.min ? this.min : value - 1)
    },
    add () {
      let value = this.value || 0
      this.$emit('input', value + 1 > this.max ? this.max : value + 1)
    }
  }
}
</script>

<style lang="scss">

.ins_number_group {
  display: inline-block;
  vertical-align: middle;
  border:1px solid #e3e3e3;
}
.ins_number_group .mul,.ins_number_group .add{
  background:#FFF;
  color:#999;
  padding:5px;
  height:30px;
  width:30px;
  vertical-align: middle;
}
.ins_number_group .mul {
  border-right:1px solid #e3e3e3;
}
.ins_number_group .add {
  border-left:1px solid #e3e3e3;
}
.ins_number_group .ins_input{
  width:60px;
  height:30px;
  background:#FFF;
  line-height:30px;
  font-size:16px;
  text-align:center;
  vertical-align: middle;
}
</style>
