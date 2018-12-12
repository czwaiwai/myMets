<template>
  <div class="page">
    <mt-header  title="切换项目">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd" style="background:#f9f9f9;">
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
      <div class="weui-cells weui-cells_radio" style="margin-top:0;">
        <label v-for="item in filterList" :key="item.projectId" class="weui-cell weui-check__label" :for="'x'+item.projectId">
          <div class="weui-cell__bd">
            <p>{{item.projectName}}</p>
          </div>
          <div class="weui-cell__ft">
            <input :id="'x'+item.projectId" @change="projectChange(item)" type="radio" v-model="currPro"  class="weui-check" name="radio1" :value="item.projectId" >
            <span class="weui-icon-checked"></span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'detail',
  data () {
    return {
      isFocus: false,
      search: '',
      currPro: '',
      list: []
    }
  },
  created () {
    this.currPro = this.user.OrgID
    this.currPositionID = this.user.PositionID
    // this.getPageData()
    this.getPageDataNet()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    filterList () {
      let list = this.list
      if (!this.search) {
        return list
      }
      return list.filter(item => item.projectName.indexOf(this.search) > -1)
    }
  },
  methods: {
    async getPageData () {
      console.log(this.user)
      let res = await this.$http.post('/ets/syswin/smd/userGetOrgIDList', {memberId: this.user.memberId})
      // this.$http.post(obj)
      console.log(res)
      this.list = res.data
    },
    async getPageDataNet () {
      let p0 = 'UserCS_GetPositionIdInfo'
      let res = await this.$xml(p0, {
        EmployeeID: this.user.memberId
      })
      if (!res.data) return
      let resData = this.$toLower(res.data)
      let subList = []
      resData.forEach(item => {
        if (item.positionId === this.currPositionID) {
          subList = item
        }
      })
      this.list = subList.areaInfo.map(item => {
        item.projectId = item.id
        item.projectName = item.organizationName
        return item
      })
    },
    projectChange (item) {
      console.log(item, ' 设置项目')
      this.$app.changeProject({
        projectId: item.projectId,
        projectName: item.projectName
      }).then(() => {
        this.$store.dispatch('getUserAction')
        this.$store.commit('setRandNum', Date.now())
        this.$root.back()
      }).catch(err => {
        console.log(err)
        if (this.$dev) {
          this.$store.commit('setRandNum', Date.now())
        }
        this.$root.back()
      })
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

<style scoped>

</style>
