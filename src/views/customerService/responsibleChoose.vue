<template>
  <div class="page_modal">
    <div class="page">
        <mt-header title="选择人员">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="pro_title">
          <i class="iconfont icon-building-automation padding-right"></i>{{orgName}}
        </div>
        <div class="weui-search-bar " :class="isFocus?'weui-search-bar_focusing':''" id="searchBar">
          <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
              <i class="weui-icon-search"></i>
              <input ref="search" type="search" v-model="search" @focus="isFocus=true" @blur="inputBlur" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required="">
              <a @click="searchClear" href="javascript:" class="weui-icon-clear" id="searchClear"></a>
            </div>
            <label @click="$refs.search.focus()" class="weui-search-bar__label" id="searchText">
              <i class="weui-icon-search"></i>
              <span>搜索</span>
            </label>
          </form>
          <a href="javascript:" @click="searchCancel" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>
        </div>
        <div class="page_bd">
          <index-list :proId="orgId" @setList="setList" @itemClick="indexListClick"></index-list>
          <div v-show="search && search.length > 0" class="search_list_wrap">
            <div class="weui-cells" style="margin-top:0;">
              <a v-for="(item,index) in filterList" :key="index"  @click="indexListClick(item)" class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                  <p>{{item.EmployeeName}} <span class="float_right " style="color:#999;">{{item.PositionName}}</span></p>
                </div>
              </a>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import indexList from '@/components/indexList'
export default {
  name: 'responsibleChoose',
  data () {
    return {
      isFocus: false,
      search: '',
      orgId: '',
      list: [],
    }
  },
  created () {
    this.orgId = this.$parent.nav.orgId
    this.orgName = this.$parent.nav.orgName
  },
  components: {
    indexList
  },
  computed: {
    filterList () {
      if (this.search === '') {
        return []
      }
      let list = this.list
      if (!this.search) {
        return list
      }
      return list.filter(item => item.EmployeeName.indexOf(this.search) > -1)
    }
  },
  methods: {
    setList (list) {
      this.list = list
    },
    async indexListClick (item) {
      console.log(item)
      let action = await this.$message.confirm(`确定选择＂${item.EmployeeName}＂吗？`)
      this.$parent.setPerson(item)
      this.$root.back()
    },
    searchClear () {
      this.search = ''
      this.$refs.search.focus()
    },
    searchCancel () {
      this.search = ''
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

<style lang="scss" scoped>
.pro_title{
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  padding-left: 15px;
  color: #0fc98d;
  background: #FFF;
}
.search_list_wrap {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #FFF;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y:auto;
}
</style>
