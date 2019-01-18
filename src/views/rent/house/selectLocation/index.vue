<template>
  <div class="page page_bg">
    <nav-title title="选择范围"></nav-title>
    <div class="page_bd selectLocation">
      <div class="header clearfix">
        <!-- <div class="icon"></div> -->
        <span class="orgName" @click.stop="selectOrg">{{title}}</span>
      </div>
      <div class="content">
        <div class="list-wrap">
          <h4 class="listTitle">分期</h4>
          <div class="list clearfix">
            <div class="listName" :class="{'isSelect': item.isSelect}" v-for="(item, index) in listData" :key="index" @click.stop="selectList(item,index)"><span>{{item.GrpName}}</span></div>
          </div>
        </div>
        <div class="items-wrap" v-show="items.length">
          <h4 class="itemsTitle">楼栋</h4>
          <div class="items clearfix">
            <div class="itemsName" :class="{'isSelect': item.isSelect}" v-for="(item,index) in items" :key="index" @click.stop="toWorkList(item,index)"><span>{{item.BudName}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'location',
  components: {navTitle},
  data () {
    return {
      title: '',
      listData: [],
      items: [],
      locationData: {},
      grpData: {}
    }
  },
  methods: {
    selectOrg () {
      let locationData = {
        orgData: this.locationData.orgData,
        employeeData: this.locationData.employeeData
      }
      localStorage.locationData = JSON.stringify(locationData)
      this.items = []
      this.listData.forEach(arr => {
        arr.isSelect = false
      })
      this.$router.go(-1)
    },
    selectList (item, index) {
      if (item.isSelect) {
        return
      }
      this.listData.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.getBudInfo(item.Id)
      this.grpData = item
    },
    getBudInfo: async function (id) {
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserCS_GetBudInfo',
      //   p7: {
      //     'GrpID': id
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetBudInfo', {
        'GrpID': id
      })
      console.log(res)
      res.data.forEach(arr => {
        if (this.locationData.budItem && this.locationData.budItem.Id === arr.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.items = res.data
      // this.$vux.loading.hide()
    },
    toWorkList (item, index) {
      // this.$store.commit('updateDateTime', {initTime: item.strCurrFnPer, thisTime: item.strCurrFnPer})
      if (item.isSelect) {
        this.$router.go(-1)
      } else {
        this.items.forEach(arr => {
          arr.isSelect = false
        })
        item.isSelect = true
        this.locationData.grpItem = this.grpData
        this.locationData.budItem = item
        localStorage.locationData = JSON.stringify(this.locationData)
        this.$root.$emit('keepAlive', {isKeep: false, name: 'houseList'})
        this.$router.go(-1)
      }
    },
    getListData: async function () {
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserCS_GetGrpInfo',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetGrpInfo', {
        'OrgId': this.locationData.orgData.orgId
      })
      console.log(res)
      res.data.forEach(arr => {
        if (this.locationData.grpItem && this.locationData.grpItem.Id === arr.Id) {
          arr.isSelect = true
          this.grpData = arr
          this.getBudInfo(arr.Id)
        } else {
          arr.isSelect = false
        }
      })
      this.listData = res.data
      // this.$vux.loading.hide()
    },
    initDate () {
      let date = new Date()
      let month = date.getMonth() + 1
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      return date.getFullYear() + '-' + month
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
      this.title = this.locationData.orgData.orgName
    }
    this.getListData()
    // this.title = this.$route.query.orgName
    // this.locationData.orgData = {orgName: this.$route.query.orgName, orgId: this.$route.query.orgId}
    // this.$root.$emit('keepAlive', {isKeep: true, name: 'selectLocation'})
  }
}
</script>
<style lang="scss">
  .selectLocation{
    background: #fff;
    -webkit-overflow-scrolling: touch;
    .header{
      padding: .2rem .3rem;
      background: #fff;
      .icon{
        float: left;
        width: .44rem;
        height: .44rem;
        background: #333;
      }
      .orgName{
        float: left;
        width: 6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: .32rem;
        color: #3395FF;
        line-height: 1.5;
        font-weight: bold;
      }
    }
    .content{
      padding: .3rem;
      .list-wrap{
        padding-bottom: .5rem;
        .listTitle{
          width: 6.9rem;
          line-height: 1.3;
          font-size: .28rem;
          color: #999;
        }
        .list{
          .listName{
            float: left;
            padding: 0 .1rem;
            width: 2.16rem;
            height: .7rem;
            margin-right: .2rem;
            margin-top: .3rem;
            line-height: .7rem;
            border: 1px solid #E9E9E9;
            border-radius: .1rem;
            box-sizing: border-box;
            font-size: .28rem;
            color: #333;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &.isSelect{
              // color: #3395FF;
              border: 1px solid #3395FF;
            }
            &:nth-child(3n){
              margin-right: 0;
            }
          }
        }
      }
      .items-wrap{
        padding-bottom: .5rem;
        .itemsTitle{
          width: 6.9rem;
          line-height: 1.3;
          font-size: .28rem;
          color: #999;
        }
        .items{
          .itemsName{
            float: left;
            padding: 0 .1rem;
            width: 2.16rem;
            height: .8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: .2rem;
            margin-top: .3rem;
            line-height: 1.2;
            border: 1px solid #E9E9E9;
            border-radius: .1rem;
            box-sizing: border-box;
            &.isSelect{
              color: #3395FF;
              border: 1px solid #3395FF;
            }
            span{
              font-size: .28rem;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            &:nth-child(3n){
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>
