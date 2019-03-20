<template>
  <div class="page_modal">
    <div class="page">
      <nav-title title="选择人员"></nav-title>
      <div class="pro_title" v-show="!isMeeting">
        <i class="iconfont icon-building-automation padding-right"></i>{{orgName}}
      </div>
      <search v-model="search"></search>
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
import Search from '@/components/search'
import indexList from '@/components/indexList'
export default {
  name: 'responsibleChoose',
  data () {
    return {
      search: '',
      orgId: '',
      list: [],
      isMeeting: false
    }
  },
  created () {
    this.isMeeting = this.$parent.isMeeting || false
    if (this.isMeeting) {
      this.orgId = ''
      this.orgName = ''
    } else {
      this.orgId = this.$parent.nav.orgId
      this.orgName = this.$parent.nav.orgName
    }
  },
  components: {
    Search,
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
      await this.$message.confirm(`确定选择＂${item.EmployeeName}＂吗？`)
      this.$parent.setPerson(item, this.$route.query)
      this.$root.back()
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
  color: #3395ff;
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
