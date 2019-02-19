<template>
  <div class="page_modal">
    <div class="page">
      <!-- <mt-header title="选择人员">
        <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
      </mt-header> -->
      <nav-title title="选择人员"></nav-title>
      <div class="pro_title" v-show="!isMeeting">
        <i class="iconfont icon-building-automation padding-right"></i>{{orgName}}
      </div>
      <search v-model="search"></search>
      <div class="page_sub_hd " style="overflow-x:auto">
        <p class="padding-left15" v-if="chooseList.length===0">暂未选择员工</p>
        <ul class="choose_person_list" v-else>
          <li @click="delChoose(item)" class="dot_line" v-for="(item, index) in chooseList" :key="index">
            {{item.EmployeeName}}
            <i class="iconfont icon-iconzhuanqu23"></i>
          </li>
        </ul>
      </div>
      <div class="page_bd" style="overflow:hidden;">
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
      <div class="page_ft light_bg padding15-h padding-top5">
        <button @click="submitPerson" class="ins_submit_btn">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import Search from '@/components/search'
import indexList from '@/components/indexList'
import navTitle from '@/components/navTitle'
export default {
  name: 'person',
  data () {
    return {
      search: '',
      orgId: '',
      list: [],
      chooseList: [],
      isMeeting: false
    }
  },
  created () {
    this.orgId = this.$parent.nav.orgId
    this.orgName = this.$parent.nav.orgName
    this.isMeeting = this.$parent.isMeeting || false
  },
  components: {
    navTitle,
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
      if (!this.chooseList.some(sub => sub.EmployeeID === item.EmployeeID)) {
        this.chooseList.unshift(item)
      }
      // await this.$message.confirm(`确定选择＂${item.EmployeeName}＂吗？`)
      // this.$parent.setPerson(item, this.$route.query)
      // this.$root.back()
    },
    submitPerson () {
      this.$root.$emit('personMulti', this.chooseList)
      this.$root.back()
    },
    delChoose (item) {
      let index = this.chooseList.indexOf(item)
      if (index > -1) {
        this.chooseList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose_person_list {
  white-space: nowrap;
  padding: 5px 15px 0 15px;
  height: 36px;
  & li {
    display:inline-block;
    width:60px;
    overflow:hidden;
    text-align:center;
    border:1px solid #3395FF;
    line-height:25px;
    margin-right:10px;
    border-radius:5px;
    position:relative;
    & i.iconfont {
      position:absolute;
      top: -8px;
      right: -3px;
      color:#f3725d;
    }
  }
}
.pro_title{
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  padding-left: 15px;
  color: #3395FF;
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
