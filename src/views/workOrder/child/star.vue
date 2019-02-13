<template>
  <div class="star_warp">
    <ul>
      <li v-for="(item,key) in 5" :key="key" @click="clickStar(key)">
        <i style="font-size:24px;" :class="value > (key)?' icon-star star_hot':'icon-wujiaoxingkong'" class="iconfont"></i>
      </li>
    </ul>
    <span class="dark_99 fs14" style="vertical-align:middle;">{{textArr[value-1]}}</span>
  </div>
</template>
<script>
export default {
  name: 'star',
  props: {
    value: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      textArr: ['很不满意', '不满意', '基本满意', '满意', '很满意']
    }
  },
  created () {
  },
  methods: {
    clickStar (value) {
      if (this.readonly) return
      this.$emit('input', value + 1)
    }
  }
}
</script>

<style lang="scss">
.star_warp {
  height: 30px;
  padding:0 10px;
  display:inline-block;
  vertical-align: middle;
  ul {
    display:inline-block;
    vertical-align: middle;
  }
  & li {
    color:#999;
    float:left;
    line-height:30px;
    padding: 0 3px;
  }
}
.star_hot {
  color: #fc4e02;
}
</style>
