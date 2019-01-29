<template>
<div>
  <div class="weui-search-bar " :class="isFocus || noFocus?'weui-search-bar_focusing':''" id="searchBar">
    <form @submit.prevent="submitSearch" class="weui-search-bar__form">
      <div class="weui-search-bar__box">
        <i class="weui-icon-search"></i>
        <!-- v-model="search" -->
        <input ref="search" :value="value" @input="searchInput" type="search" :placeholder="placeholder"  @focus="inputFocus"  @blur="inputBlur" class="weui-search-bar__input" id="searchInput"  >
        <a v-show="value" @click="searchClear" href="javascript:" class="weui-icon-clear" id="searchClear"></a>
      </div>
      <label @click="$refs.search.focus()" class="weui-search-bar__label" id="searchText">
        <i class="weui-icon-search"></i>
        <span>搜索</span>
      </label>
    </form>
    <a v-show="!noFocus" href="javascript:" @click="searchCancel" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>
  </div>
  <div v-if="valueTrim" class="search_list">
    <ul v-show="showList">
      <li class="padding15 text-center" v-if="noData">
        没有查询到数据
      </li>
      <li class="padding15-h padding5-v border-top-half" v-for="(item,index) in searchList" :key="index"  @click="searchItem(item)" >
        {{item.GrpName}} <span class="padding-left15 dark_99"> {{item.OrgName}}</span>
      </li>
    </ul>
  </div>
</div>

</template>

<script>
export default {
  name: 'search',
  props: {
    url: String,
    params: {
      type: Object,
      default: () => {}
    },
    searchName: {
      type: String,
      default: 'search'
    },
    isXml: {
      type: Boolean,
      default: true
    },
    value: {
      type: String
    },
    noFocus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  data () {
    return {
      searchList: [],
      noData: false,
      showList: false,
      isFocus: false
    }
  },
  computed: {
    valueTrim () {
      return this.value ? this.value.trim() : ''
    }
  },
  methods: {
    async getSearchList (name) {
      let p0 = this.url || 'UserCS_GetRectificationGrpInfo'
      let param = this.params || {}
      param[this.searchName] = name
      let res = await this.$xml(p0, param, {}, true)
      this.searchList = res.data
      this.showList = true
      if (this.searchList.length === 0) {
        this.noData = true
      } else {
        this.noData = false
      }
    },
    searchInput (e) {
      this.noData = false
      let value = e.target.value
      this.$emit('input', value)
      if (!this.url) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (value && value.trim()) {
          this.getSearchList(value)
        }
      }, 500)
    },
    submitSearch () {
      if (!this.value) {
        this.$emit('searchCancel')
      } else {
        if (this.url) this.getSearchList(this.value)
      }
    },
    searchClear () {
      this.$emit('input', '')
      this.$emit('searchCancel')
      this.$refs.search.focus()
    },
    searchCancel () {
      this.$emit('input', '')
      this.$emit('searchCancel')
      this.isFocus = false
    },
    searchItem (item) {
      this.showList = false
      this.$emit('input', item[this.searchName])
      this.$emit('searchConfirm', item)
    },
    inputFocus (e) {
      if (!this.noFocus) {
        this.isFocus = true
      }
    },
    inputBlur (e) {
      if (!this.value) {
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
a {
  color: #42b983;
}
.search_list {
  position: absolute;
  width: 100%;
  background: #FFF;
  top: 84px;
  z-index: 2;
  box-shadow: 0px 1px 6px -1px rgba(51, 51, 51, 0.4);
}

</style>
