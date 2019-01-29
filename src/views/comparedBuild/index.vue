<template>
  <div class="page">
    <mt-header title="整改对比">
      <mt-button slot="left" @click="$app.close()" icon="back">返回</mt-button>
    </mt-header>
    <div class="weui-cells" style="margin:0;">
      <a class="weui-cell weui-cell_access" @click="$router.push({name: 'compared_groupInfo'})" href="javascript:;">
          <div class="weui-cell__bd">
              <p>{{groupName}}</p>
          </div>
          <div class="weui-cell__ft">
            <span v-if="!groupId">请先选择组团</span>
          </div>
      </a>
    </div>
    <template v-if="groupId">
      <navbar :list="typeList" v-model="currIndex" @input="change"></navbar>
    </template>
    <div v-if="currIndex==='BeforeRectification'" class="page_bd">
      <div class="img_list_wrap">
        <ul class="img_list_ul">
          <li v-for="(item,index) in list" :key="index">
            <div  :style="'background:url('+item.Path+') no-repeat center;background-size:cover;'">
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
            <div  :style="'background:url('+item.Path+') no-repeat center;background-size:cover;'">
              <img  preview="imgafter" :src="item.Path">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import Navbar from '@/components/navbar'
// import qs from 'qs'
export default {
  name: 'repairDetail',
  components: {Navbar},
  data () {
    return {
      orgName: '',
      currIndex: 'BeforeRectification',
      groupId: '',
      groupName: '',
      list: [],
      typeList: [
        {id: 'BeforeRectification', name: '整改前', state: '5', badge: ''},
        {id: 'AfterRectification', name: '整改后', state: '1', badge: ''}
      ]
    }
  },
  created () {
    this.orgId = this.user.OrgID
    this.orgName = this.user.OrgName
    Object.assign(this, this.getGolb)
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
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
        this.list = res.data[0].ImageList
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
