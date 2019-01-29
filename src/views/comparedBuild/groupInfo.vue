<template>
<div class="page_modal">
  <div class="page">
    <mt-header  title="切换项目">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd" style="background:#f9f9f9;">
      <search v-model="search"></search>
      <div class="weui-cells weui-cells_radio" style="margin-top:0;">
        <label v-for="item in filterList" :key="item.id" class="weui-cell weui-check__label" :for="'x'+item.id">
          <div class="weui-cell__bd">
            <p>{{item.grpName}}</p>
          </div>
          <div class="weui-cell__ft">
            <input :id="'x'+item.id" @change="projectChange(item)" type="radio" v-model="currPro"  class="weui-check" name="radio1" :value="item.id" >
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
export default {
  name: 'groupInfo',
  data () {
    return {
      search: '',
      currPro: '',
      list: []
    }
  },
  created () {
    this.currPro = this.user.OrgID
    this.groupId = this.$parent.groupId
    this.getPageDataNet()
  },
  components: {
    Search
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
      return list.filter(item => item.grpName.indexOf(this.search) > -1)
    }
  },
  methods: {
    async getPageDataNet () {
      let p0 = 'UserCS_GetGrpInfo'
      let res = await this.$xml(p0, {
        OrgID: this.currPro
      })
      if (!res.data) return
      let resData = this.$toLower(res.data)
      this.list = resData
    },
    projectChange (item) {
      this.$parent.setGroupId(item)
      this.$root.back()
    }
  }
}
</script>
