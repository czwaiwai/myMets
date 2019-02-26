<template>
<div class="ins_radio_group">
  <div v-if="!readonly">
    <label class="ins_radio clearfix" :class="checkClass(item)" v-for="(item, key) in list" :key="key">
      <input v-model="radio" @input="$emit('input',$event.target.value)" :name="name" type="radio" :value="item">
      <i class="iconfont   icon-ico2 float_left" style="font-size:20px;"></i>
      <span class="vertical-middle" >{{item}}</span>
    </label>
  </div>
  <div v-else >
    <span :class="value === defaultVal?'right_text_color':'wrong_text_color'">{{value}}</span>
  </div>
</div>
</template>
<script>
export default {
  name: 'navbar',
  props: {
    value: String,
    defaultVal: String,
    optionStr: {
      type: String,
      default: '通过|不通过'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      radio: this.value,
      name: 'radio_' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  computed: {
    // defaultClass () {
    //   return this.value === this.defaultVal ? 'right_text_color' : 'wrong_text_color'
    // },
    list () {
      return this.optionStr.split('|')
    }
  },
  methods: {
    checkClass (item) {
      if (item === this.defaultVal) {
        if (this.value === item) return 'right_text_color'
      } else {
        if (this.value === item) return 'wrong_text_color'
      }
    }
  }
}
</script>
<style lang="scss" scoped >
// .ins_radio_group .right_text_color {
//   color:#3395FF;
// }
// .ins_radio_group .wrong_text_color {
//   color: #f00404;
// }
.ins_radio {
  display:inline-block;
  padding-right:10px;
  font-size:16px;
}
.ins_radio input:checked + i.iconfont:before{
  content: "\E610"
}
</style>
