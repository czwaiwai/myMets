<template>
  <div class="page">
    <nav-title title="整改对比"></nav-title>
    <template v-if="groupId">
      <div class="weui-flex">
        <div class="weui-flex__item"><navbar :list="typeList" v-model="currIndex" @input="change"></navbar></div>
        <div @click="filterVisible=true" class="padding-right padding-left5 light_bg" style="border-bottom: 1px solid #ededed;height: .88rem;"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
      </div>
      <filter-modal :form.sync='filterForm' v-model="filterVisible" @submit="filterSubmit">
        <filter-radio name="groupId" v-model="filterForm.groupId" :no-all="true" :data-list="grpListVals">组团</filter-radio>
      </filter-modal>
    </template>
    <div v-if="currIndex==='BeforeRectification'" class="page_bd">
      <div class="img_list_wrap">
        <ul class="img_list_ul">
          <li v-for="(item,index) in list" :key="index">
            <div  :style="'background:url(\''+item.Path+'\') no-repeat center;background-size:cover;'">
              <img  preview="imgbefore" :src="item.Path">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="currIndex==='AfterRectification'" class="page_bd">
      <div class="img_list_wrap">
        <ul class="img_list_ul">
          <li v-for="(item,index) in list" :key="index">
            <div  :style="'background:url(\''+item.Path+'\') no-repeat center;background-size:cover;'">
              <img  preview="imgafter" :src="item.Path">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition> -->
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import Navbar from '@/components/navbar'
import FilterModal from '@/components/filterModal'
import FilterRadio from '@/components/filter/radio'
import qs from 'qs'
export default {
  name: 'repairDetail',
  components: {Navbar, FilterModal, FilterRadio},
  data () {
    return {
      filterForm: {
        groupId: ''
      },
      filterVisible: false,
      orgName: '',
      currIndex: 'BeforeRectification',
      groupId: '',
      groupName: '',
      list: [],
      grpList: [],
      currentItem: {},
      typeList: [
        {id: 'BeforeRectification', name: '整改前', state: '5', badge: ''},
        {id: 'AfterRectification', name: '整改后', state: '1', badge: ''}
      ]
    }
  },
  created () {
    // orgId: this.$route.query.orgId,
    // orgName: this.$route.query.orgName,
    // employeeId: this.$route.query.employeeId,
    // employeeJobId: this.$route.query.employeeJobId
    let searchObj = qs.parse(location.search.replace('?', ''))
    let orgId = searchObj.orgId || this.user.OrgID
    let orgName = searchObj.orgId || this.user.OrgID
    if (localStorage.AreaSelectGrpItem) {
      this.currentItem = JSON.parse(localStorage.AreaSelectGrpItem)
      orgId = this.currentItem.OrgID
      orgName = this.currentItem.OrgName
    }
    this.nav = {
      orgId: orgId,
      orgName: orgName
    }
    Object.assign(this, this.getGolb)
    this.getPageDataNet()
  },
  computed: {
    grpListVals () {
      return this.grpList.map(item => {
        return {
          name: item.grpName,
          value: item.id
        }
      })
    },
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    async getPageDataNet () {
      let p0 = 'UserCS_GetGrpInfo'
      let res = await this.$xml(p0, {
        OrgID: this.nav.orgId
      })
      if (!res.data) return
      let resData = this.$toLower(res.data)
      console.log(resData, '--------------')
      this.groupId = this.currentItem ? this.currentItem.ID : resData[0].id
      this.filterForm.groupId = this.groupId
      this.grpList = resData
      this.getPageData()
    },
    getGolb () {
      if (this.$route.query.orgId) {
        let location = {
          orgId: this.$route.query.orgId,
          orgName: this.$route.query.orgName,
          employeeId: this.$route.query.employeeId,
          employeeJobId: this.$route.query.employeeJobId
        }
        return location
      } else {
        return {}
      }
    },
    filterSubmit (form) {
      this.groupId = form.groupId
      this.currIndex = 'BeforeRectification'
      this.getPageData()
    },
    setGroupId (item) {
      this.groupId = item.id
      this.groupName = item.grpName
      this.currIndex = 'BeforeRectification'
      this.getPageData()
    },
    change (e) {
      this.list = []
      this.getPageData()
    },
    imgClick (e) {
      let img = e.target.childNodes[0]
      if (img) {
        img.click()
      }
    },
    async getPageData () {
      let res = await this.$xml('UserCS_GetRectificationImageInfo', {
        'MeettingRoomID': this.groupId,
        'TypeStr': this.currIndex
      })
      if (res.data && res.data[0]) {
        this.list = res.data[0].ImageList.map(item => {
          if (this.$store.getters.ip) {
            item.Path = 'http://' + this.$store.getters.ip + item.Path
          }
          return item
        })
        this.$previewRefresh()
      } else {
        this.list = []
      }
    }
  }
}
</script>

<style lang="scss" scoped >
.img_list_wrap {
  padding:15px 5px;
  .img_list_ul {
    & li {
      width:33.3%;
      height: 32.41vw;
      overflow:hidden;
      background:#F0F2F4;
      float:left;
      padding:5px;
      > div {
        height: 100%;
        width: 100%;
        position:relative;
      }
      img {
        height: 100%;
        width: 100%;
        opacity:0;
        // visibility: hidden;
      }
    }
  }
}
</style>
