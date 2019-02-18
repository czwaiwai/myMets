<template>
    <div class="page">
        <mt-header title="职位">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">
          <div class="weui-cells__title">全部职位</div>
          <div class="weui-cells weui-cells_radio">
            <label v-for="item in list" class="weui-cell weui-check__label" :key="item.PositionId" :for="'x'+ item.PositionId">
              <div class="weui-cell__bd">
                <p>{{item.PositionName}}({{item.DeptName}})</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" @change="posiChange(item)" v-model="currPosi" class="weui-check" :value="item.PositionId" name="radio1" :id="'x'+ item.PositionId">
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
  name: 'positionId',
  data () {
    return {
      currPosi: '',
      list: []
    }
  },
  created () {
    this.currPosi = this.user.PositionID
    this.getPageDataNet()
    // this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    // async getPageData () {
    //   let url = '/ets/table/list/userCSGetPositionIdInfo'
    //   let res = await this.$http.post(url, {employeeId: this.user.memberId})
    //   console.log(res)
    //   this.list = res.data
    // },
    async getPageDataNet () {
      let p0 = 'UserCS_GetPositionIdInfo'
      let res = await this.$xml(p0, {
        EmployeeID: this.user.memberId
      })
      if (!res.data) return
      this.list = res.data
    },
    async posiChange (item) {
      try {
        await this.$app.changePosition({
          positionId: item.PositionId,
          positionName: item.PositionName,
          positionInfo: item.PositionInfo
        })
        await this.$app.changeProject({
          projectId: item.OrgID,
          projectName: item.OrgName
        })
        this.$store.dispatch('getUserAction')
        this.$store.commit('setRandNum', Date.now())
        this.$root.back()
      } catch (err) {
        if (this.$dev) {
          this.$store.commit('setRandNum', Date.now())
        }
        console.log(err)
        this.$root.back()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
