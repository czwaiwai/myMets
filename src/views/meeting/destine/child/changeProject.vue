<template>
<div class="page_modal">
  <div class="page">
    <nav-title title="切换项目"></nav-title>
    <search v-model="search"></search>
    <div class="page_bd" style="background:#f9f9f9;">
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
import statusColor from '../../components/statusColor'
export default {
  name: 'detail',
  data () {
    return {
      search: '',
      currPro: '',
      list: []
    }
  },
  components: {
    Search
  },
  created () {
    // this.currPro = this.user.OrgID // 项目id
    // this.currPositionID = this.user.PositionID // 职位id
    this.currPro = this.destineConfig.orgId || this.locationData.orgId
    this.currPositionID = this.locationData.employeeJobId
    this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      locationData: 'getMeetingLocation',
      destineConfig: 'destineConfig'
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
      let p0 = 'User_GetOrgIDListNew' // User_GetOrgIDListMeet
      let res = await this.$xml(p0, {}, {
        p1: this.currPositionID
      })
      this.list = res.data
      console.log(res)
    },
    projectChange (item) {
      console.log(item, ' 设置项目')
      this.$parent.setProject(item)
      this.getStatusColor(item.projectId)
      this.$root.back()
    },
    // 获取颜色列表
    async getStatusColor (projectId) {
      let res = await this.$xml('UserCS_MeetingUseStatusColor', {
        'OrgID': projectId
      })
      if (res.data) {
        let resData = this.$toLower(res.data)
        let remove = statusColor(resData)
        remove()
        statusColor(resData)
        this.$store.commit('setStatusColor', resData)
      }
    }
  }
}
</script>
