<template>
<div class="page">
  <nav-title title="收款"></nav-title>
  <div class="page_bd location">
    <h1 class="room-project_name">{{orgName}}</h1>
    <div v-if="list.length > 0" class="one" style="overflow:hidden;">
      <div class="title">分期</div>
      <ul class="list_ul clearfix">
        <li @click="clickItem(item, index)"  :class="listIndex === index? 'active':''" v-for="(item, index) in list" :key="item.Id">
          {{item.GrpName}}
        </li>
      </ul>
    </div>
    <div class="two"  v-if="subItem.length"  style="overflow:hidden;">
      <div class="title">楼栋</div>
      <ul  class="list_ul clearfix">
        <li @click="clickSubItem(item, index)"  :class="subItemIndex === index? 'active':''" v-for="(item, index) in this.subItem"  :key="item.Id" >
          {{item.BudName}}
        </li>
      </ul>
    </div>
    <!-- <div class="three" v-if="smallItem && smallItem.Unitdata && smallItem.Unitdata.length > 0"  style="overflow:hidden;" >
      <div class="title">{{smallItem.Unitdata[0].HouesType}}</div>
      <ul class="list_ul clearfix">
        <li class="small" @click="chooseItemUnit(item, index)" :class="unitItemIndex === index? 'active':''"  v-for="(item, index) in this.smallItem.Unitdata"  :key="index" >
          {{item.Unitno}}
        </li>
      </ul>
      <div class="three" v-if="smallItem && smallItem.Unitdata && unitItem && unitItem.ResData && unitItem.ResData.length > 0" >
        <div class="title">{{unitItem.ResData[0].HouesType}}</div>
        <ul class="list_ul clearfix">
          <li class="small" @click="chooseSubItemUnit(item, index)" :class="unitSubItemIndex === index? 'active':''"  v-for="(item, index) in this.unitItem.ResData"  :key="item.BudID" >
            {{item.ResName}}
          </li>
        </ul>
      </div>
    </div> -->
    <div class="three" v-if="smallItem.length > 0"  style="overflow:hidden;">
      <div class="title">房号</div>
      <ul class="list_ul clearfix">
        <li class="small" @click="chooseItem(item, index)" :class="smallItemIndex === index? 'active':''"  v-for="(item, index) in this.smallItem"  :key="item.Id" >
          {{item.ResName}}
        </li>
      </ul>
    </div>
  </div>
  <transition name="page">
      <router-view/>
  </transition>
</div>
</template>
<script>
import {mapGetters} from 'vuex'
import navTitle from '@/components/navTitle'
export default {
  name: 'getCash',
  components: {navTitle},
  data () {
    return {
      orgId: '',
      orgName: '',
      userId: '',
      memberId: '',
      roomName: '',
      list: [],
      listIndex: -1,
      subItem: [],
      subItemIndex: -1,
      smallItem: [],
      smallItemIndex: -1,
      unitItem: null,
      unitItemIndex: -1,
      unitSubItem: null,
      unitSubItemIndex: -1,
      choosePersonCash: null,
      choosePersonMoney: ''
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  created () {
    // console.log(this.$parent.nav, 'this.$parent.nav')
    this.orgId = this.user.OrgID
    this.orgName = this.user.OrgName
    this.userId = this.user.UserID
    this.memberId = this.user.memberId
    if (!this.$isPos) {
      this.$app.paymentData().then(res => {
        this.orgId = res.projectID
        this.orgName = res.projectName
        this.memberId = res.memberID
        this.userId = res.userID
        this.roomName = ''
        this.getPageDataNet()
      }).catch(err => {
        console.log(err)
        this.roomName = ''
        this.getPageDataNet()
      })
    } else { // pos机
      this.roomName = ''
      this.getPageDataNet()
    }
  },
  methods: {
    // async getPageData () {
    //   let reqBudHouse = '/ets/syswin/smd/imagetGrpBudHouseInfo'
    //   let res = await this.$http.post(reqBudHouse, {projectId: this.orgId})
    //   console.log(res.data)
    //   this.list = res.data
    // },
    async getPageDataNet () {
      let p0 = 'UserCS_GetGrpInfo'
      let res = await this.$xml(p0, {
        OrgID: this.orgId
      })
      // let data = this.$toLower(res.data)
      console.log(res.data)
      this.list = res.data
    },
    async clickItem (item, index) {
      if (this.listIndex === index) {
        return
      }
      this.listIndex = index
      let p0 = 'UserCS_GetBudInfo'
      let res = await this.$xml(p0, {
        GrpID: item.Id
      })
      // let data = this.$toLower(res.data)
      console.log(res.data)
      this.subItem = res.data

      this.subItemIndex = -1
      this.smallItemIndex = -1
      this.unitItemIndex = -1
      this.unitSubItemIndex = -1
      this.smallItem = []
    },
    async clickSubItem (item, index) {
      if (this.subItemIndex === index) {
        return
      }
      this.subItemIndex = index

      let p0 = 'UserCS_GetHouesInfo'
      let res = await this.$xml(p0, {
        BudID: item.Id
      })
      // let data = this.$toLower(res.data)
      console.log(res.data)
      this.smallItem = res.data

      // this.smallItem = item
      // this.unitItemIndex = -1
      // this.unitSubItemIndex = -1
      // this.unitItem = null
    },
    async chooseItem (item, index) {
      this.smallItemIndex = index
      this.unitItem = null
      let data = {
        ...item,
        name: this.list[this.listIndex]['GrpName'] + this.subItem[this.subItemIndex]['BudName'] + item['ResName']
      }
      console.log(item, 'room--')
      this.goRoom(data)
      // let res = await this.defUser(data['ResID'])
      // this.$parent.setLocation(Object.assign({}, data, res))
      // this.$root.back()
    },
    chooseItemUnit (item, index) {
      this.unitItem = item
      this.unitItemIndex = index
      this.unitSubItemIndex = -1
    },
    async chooseSubItemUnit (item, index) {
      this.unitSubItem = item
      this.unitSubItemIndex = index
      let data = {
        ...item,
        name: this.subItem['GrpName'] + this.smallItem['BudName'] + this.unitItem['Unitno'] + item['ResName']
      }
      console.log(item, 'room')
      this.goRoom(data)
      // let res = await this.defUser(data['ResID'])
      // this.$parent.setLocation(Object.assign({}, data, res))
      // this.$root.back()
    },
    goRoom (item) {
      this.roomName = item.name
      this.$router.forward({
        name: 'customerList',
        params: {
          roomId: item['ResID']
        }
      })
    }
    // async defUser (resID) {
    //   let url = '/ets/payment/house/getArrearsCost'
    //   this.$http.post(url, {
    //     orgID: this.orgId,
    //     resID: resID
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
  .room-project_name {
    padding: 10px 15px;
    line-height: 1.5;
  }
  .location .title {
    padding-left: 15px;
    font-size:16px;
    color:#999;
  }
  ul.list_ul {
    padding: 15px;
    margin-right: -15px;
    display: block;
    overflow:hidden;
  }
  .list_ul li {
    width: 28%;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    float: left;
    margin-right: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    text-overflow: ellipsis;
    /*display: -webkit-box;*/
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .list_ul li.active {
    border: 1px solid  #3395ff;
  }
  .list_ul li.small {
    word-break: break-all;
    word-wrap: break-word;
    line-height:1.5;
    height:auto;
  }
</style>
