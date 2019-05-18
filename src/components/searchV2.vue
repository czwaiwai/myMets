<template>
<div>
  <div  class="weui-search-bar search-bar " :class="isFocus || noFocus?'weui-search-bar_focusing':''" id="searchBar">
    <!-- <form @submit.prevent="submitSearch" class="weui-search-bar__form" style="background-color:#1B9BFE"> -->
      <div class="weui-search-bar__box" style="background-color:#1B9BFE;padding-left:0px">
        <!-- v-model="search" -->
        <input ref="search" :value="value" @input="searchInput"  type="search" :placeholder="placeholder"  @focus="inputFocus"  @blur="inputBlur"
          class="weui-search-bar__input" style="width:75%;background-color:#fff;padding: 4px 5px 4px 10px;-webkit-appearance: none;" id="searchInput"  >
        <a v-show="value" @click="searchClear" href="javascript:" class="weui-icon-clear" id="searchClear" style="right: 23%;"></a>
        <div class="right-position" @click.stop="toSearch"><slot name="icon"><i class="weui-icon-search "></i></slot></div>
      </div>
      <label @click="$refs.search.focus()" class="weui-search-bar__label" id="searchText">
        <i class="weui-icon-search"></i>
        <span>{{placeholder}}</span>
      </label>
    <!-- </form> -->
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
        this.$emit('searchRes', this.value)
        if (this.url) this.getSearchList(this.value)
      }
    },
    toSearch () {
      this.$emit('searchData')
    },
    searchClear () {
      this.$emit('input', '')
      this.$emit('searchCancel')
      if (!this.noFocus) {
        this.$refs.search.focus()
      }
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
    color: #3395FF;
  }

  .search_list {
    position: absolute;
    /* width: 84%; */
    left: 8%;
    left: 0.6rem;
    right: 0.6rem;
    background: #FFF;
    top: 2.25rem;
    z-index: 2;
    box-shadow: 0px 1px 6px -1px rgba(51, 51, 51, 0.4);
  }
  .search-bar{
    padding: 0 0;
    /* margin: 40px 30px; */
    margin: 0.8rem 0.6rem;
    border-radius: 10px;
    overflow: auto;
    box-shadow: 2px 2px 3px #666;
  }
  .weui-icon-search:before {
    color: #fff !important;
  }
  .weui-search-bar__box{
    padding:0 5px;
    /* border-radius: 10px 0 0 10px; */
  }
  .right-position{
    right: 10px;
    width: 15%;
    position: absolute;
    top: 0;
    line-height: 28px;
  }
  /* .right-position::after{
    color: #B2B2B2;
    font-size: 14px;
    content: "\EA0E";
    display: inline-block;
    margin-left: .2em;
    margin-right: .2em;
  } */
</style>
