<template>
  <input  v-bind:value="value"  v-on:input="onInput($event.target.value)" v-on:focus="selectAll" v-on:blur="onBlur">
</template>
<script>
// var accounting = require('@/utils/accounting')
export default {
  name: 'moneyInput',
  props: {
    value: {
      type: String,
      default: '0',
      desc: '数值'
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    onInput: function (value) {
      if (/^-?(\d+)?(\.\d{0,2})?$/.test(value)) {
        this.$emit('input', value)
      } else {
        this.$emit('input', this.value)
        this.$forceUpdate() // 强制渲染试图
      }
    },
    onBlur: function ($event) {
      this.$emit('input', $event.target.value)
    },
    selectAll: function (event) {
      setTimeout(function () {
        event.target.select()
      }, 0)
    }
  }
}
</script>

<style lang="scss">

</style>
