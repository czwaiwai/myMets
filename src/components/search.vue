<template>
  <div class="weui-search-bar " :class="isFocus?'weui-search-bar_focusing':''" id="searchBar">
    <form class="weui-search-bar__form">
      <div class="weui-search-bar__box">
        <i class="weui-icon-search"></i>
        <!-- v-model="search" -->
        <input ref="search" type="search" :value="search" @input="searchInput"  @focus="isFocus=true" @blur="inputBlur" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required="">
        <a @click="searchClear" href="javascript:" class="weui-icon-clear" id="searchClear"></a>
      </div>
      <label @click="$refs.search.focus()" class="weui-search-bar__label" id="searchText">
        <i class="weui-icon-search"></i>
        <span>搜索</span>
      </label>
    </form>
    <a href="javascript:" @click="searchCancel" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    search: {
      type: String
    }
  },
  data () {
    return {
      isFocus: false
    }
  },
  methods: {
    searchInput (e) {
      this.$emit('input', e.target.value)
    },
    searchClear () {
      this.$emit('input', '')
      this.$refs.search.focus()
    },
    searchCancel () {
      this.$emit('input', '')
      this.isFocus = false
    },
    inputBlur () {
      if (!this.search) {
        this.isFocus = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
