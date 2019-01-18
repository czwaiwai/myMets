<template>
  <div class="page page_bg">
    <nav-title title="选择房屋"></nav-title>
    <div class="page_bd selectHouse">
      <h3 class="title">{{locationData.orgData.orgName}}</h3>
      <p class="tip">请选择收费房屋</p>
      <div class="wrap">
        <div class="list-wrap">
          <h4 class="listTitle">分期</h4>
          <div class="list clearfix">
            <div class="listName" :class="{'isSelect': item.isSelect}" @click.stop="selectList(item)" v-for="(item, index) in listData" :key="index">
              <span>{{item.GrpName}}</span>
            </div>
          </div>
        </div>
        <div class="items-wrap" v-show="itemData.length">
          <h4 class="itemsTitle">楼栋</h4>
          <div class="items clearfix">
            <div class="itemsName" :class="{'isSelect': item.isSelect}" @click.stop="selectItem(item)" v-for="(item,index) in itemData" :key="index">
              <span>{{item.BudName}}</span>
            </div>
          </div>
        </div>
        <div class="list-wrap" v-show="dans.length">
          <h4 class="listTitle">单元</h4>
          <div class="list clearfix">
            <div class="listName" :class="{'isSelect': item.isSelect}" v-for="(item, index) in dans" :key="index">
              <span>{{item.GrpName}}</span>
            </div>
          </div>
        </div>
        <div class="list-wrap" v-show="codeData.length">
          <h4 class="listTitle">房号</h4>
          <div class="list clearfix">
            <div class="listName" :class="{'isSelect': item.isSelect}" @click.stop="selectCode(item)" v-for="(item, index) in codeData" :key="index">
              <span>{{item.ResName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import navTitle from '@/components/navTitle'
export default {
  name: 'selectHouse',
  components: {navTitle},
  data () {
    return {
      locationData: {},
      houseList: [],
      listData: [],
      itemData: [],
      dans: [],
      codeData: []
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  methods: {
    // 获取分期
    async getGrpInfo () {
      // let obj = {
      //   p0: 'UserCS_GetGrpInfo',
      //   p7: {
      //     'OrgID': this.locationData.orgData.orgId
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetGrpInfo', {
        'OrgID': this.locationData.orgData.orgId
      })
      // this.$vux.loading.hide()
      console.log(res)
      res.data.forEach(arr => {
        arr.isSelect = false
      })
      this.listData = res.data
    },
    // 选择分期
    async selectList (item) {
      if (item.isSelect) {
        return
      }
      this.listData.forEach(arr => {
        if (item.Id === arr.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.getBudInfo(item)
      this.codeData = []
    },
    // 获取楼栋列表
    async getBudInfo (item) {
      // let obj = {
      //   p0: 'UserCS_GetBudInfo',
      //   p7: {
      //     'GrpID': item.Id
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetBudInfo', {
        'GrpID': item.Id
      })
      // this.$vux.loading.hide()
      console.log(res)
      res.data.forEach(arr => {
        arr.isSelect = false
      })
      this.itemData = res.data
    },
    // 选择楼栋
    selectItem (item) {
      this.itemData.forEach(arr => {
        if (item.Id === arr.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.getHouesInfo(item)
    },
    // 获取房屋
    async getHouesInfo (item) {
      // let obj = {
      //   p0: 'UserCS_GetHouesInfo',
      //   p7: {
      //     'BudID': item.Id
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetHouesInfo', {
        'BudID': item.Id
      })
      // this.$vux.loading.hide()
      console.log(res)
      res.data.forEach(arr => {
        arr.isSelect = false
      })
      this.codeData = res.data
    },
    // 选择房屋
    selectCode (item) {
      this.codeData.forEach(arr => {
        if (item.ResID === arr.ResID) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      let msg = {
        'ResCode': item.ResCode,
        'ResName': item.ResName,
        'isChange': true
      }
      this.$store.commit('updateBusiness', {
        hasDetail: this.business.hasDetail,
        detail: this.business.detail,
        msg: {...this.business.msg, ...msg}
      })
      this.$router.go(-1)
    },
    // 删除房屋
    deleteHouse (item, index) {
      this.houseList.splice(index, 1)
      this.codes.forEach(arr => {
        arr.isSelect = false
      })
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.getGrpInfo()
  }
}
</script>
<style lang="scss" scoped>
  .selectHouse{
    .title{
      padding: .3rem .3rem 0;
      font-size: .34rem;
      color: #333;
      background: #fff;
    }
    .tip{
      padding-left: .3rem;
      height: .6rem;
      line-height: .6rem;
      font-size: .3rem;
      color: #999;
      background: #fff;
    }
    .wrap{
      padding: .3rem;
      background: #fff;
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
