<template>
<div class="ins_number_group">
  <template v-if="!readonly">
    <a class="mul" @click="mul">
      <i class="iconfont icon-jian1"></i>
    </a><div class="input_wrap">
      <input class="ins_input" :name="name" :class="defaultClass" :value="value"  @input="input" type="text">
      </div><a class="add" @click="add">
      <i class="iconfont icon-jia"></i>
    </a>
  </template>
  <template v-else >
    <span :class="defaultClass">{{value}} {{unit}}</span>
  </template>
</div>
</template>
<script>
export default {
  name: 'insNumber',
  props: {
    value: String,
    min: String,
    max: String,
    unit: String,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      name: 'number' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  computed: {
    defaultClass () {
      let val = this.value - 0
      let min = this.min - 0
      let max = this.max - 0
      if (min > val || val > max) {
        return 'wrong_text_color'
      } else {
        return 'right_text_color'
      }
    }
  },
  methods: {
    input ($event) {
      let value = $event.target.value
      if (/^-?(\d+)?(\.\d{0,2})?$/.test(value)) {
        this.$emit('input', $event.target.value)
      } else {
        this.$emit('input', this.value)
        this.$forceUpdate() // 强制渲染试图
      }
    },
    mul () {
      let value = this.value || 0
      this.$emit('input', Math.round((value - 1) * 100) / 100 + '')
    },
    add () {
      let value = this.value || 0
      this.$emit('input', Math.round((value - 0 + 1) * 100) / 100 + '')
    }
  }
}
</script>
<style lang="scss" scoped >

.ins_number_group {
  padding-top: 5px;
  height: 30px;
  padding-bottom: 5px;
}
.ins_number_group .mul,.ins_number_group .add{
  background:#eaeaea;
  color:#999;
  padding:5px;
  height:30px;
  width:30px;
  line-height:30px;
  vertical-align: top;
}
.input_wrap {
  display:inline-block;
    vertical-align: top;
    height: 30px;
    overflow: hidden;
}
.ins_number_group .ins_input{
  width:60px;
  height:30px;
  background:#FFF;
  border:none;
  line-height:30px;
  font-size:16px;
  text-align:center;
  outline: none;
  // vertical-align: middle;
}
</style>
