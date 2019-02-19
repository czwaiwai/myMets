<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header  title="切换项目">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="切换项目"></nav-title>
    <div class="page_bd" style="background:#f9f9f9;">
      <search v-model="search"></search>
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
</div>
</template>
<script>
import {mapGetters} from 'Vuex'
import Search from '@/components/search'
import qs from 'qs'
import navTitle from '@/components/navTitle'
export default {
  name: 'detail',
  components: {navTitle, Search},
  data () {
    return {
      search: '',
      currPro: '',
      list: []
    }
  },
  created () {
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.currPro = searchObj.projectID || this.user.OrgID
    this.currPositionID = searchObj.PositionId || this.user.PositionID
    this.memberId = searchObj.memberId || this.user.memberId
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
    // 原java接口
    // async getPageData () {
    //   console.log(this.user)
    //   let res = await this.$http.post('/ets/syswin/smd/userGetOrgIDList', {memberId: this.memberId})
    //   // this.$http.post(obj)
    //   console.log(res)
    //   this.list = res.data
    // },
    async getPageDataNet () {
      let p0 = 'UserCS_GetPositionIdInfo'
      let res = await this.$xml(p0, {
        EmployeeID: this.memberId
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
      this.$parent.projectChange(item)
      this.$root.back()
    }
  }
}
</script>
