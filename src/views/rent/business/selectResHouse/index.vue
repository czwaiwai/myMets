<template>
  <div class="page page_bg">
    <nav-title title="选择预定房屋"></nav-title>
    <div class="page_bd selectResHouse">
      <div class="header clearfix">
        <div class="search clearfix" @click.stop="toSelectSearchHouse">
          <i class="iconfont icon-sousuo"></i>
          <span>资源号</span>
        </div>
      </div>
      <div class="houseList" :class="houseList.length?'hasHouse':'noneHouse'">
        <ul class="list">
          <li class="item" v-for="(item,index) in houseList" :key="index">
            <span>{{item}}</span>
            <i class="iconfont icon-quxiao1" @click.stop="deleteHouse(item,index)"></i>
          </li>
        </ul>
      </div>
      <div class="content" :class="houseList.length?'hasHouse':'noneHouse'">
        <div class="wrap">
          <div class="list-wrap">
            <h4 class="listTitle">分期</h4>
            <div class="list clearfix">
              <div class="listName" :class="{'isSelect': item.isSelect}" @click.stop="selectList(item)" v-for="(item, index) in listData" :key="index"><span>{{item.GrpName}}</span></div>
            </div>
          </div>
          <div class="items-wrap" v-show="itemData.length">
            <h4 class="itemsTitle">楼栋</h4>
            <div class="items clearfix">
              <div class="itemsName" :class="{'isSelect': item.isSelect}" @click.stop="selectItem(item)" v-for="(item,index) in itemData" :key="index"><span>{{item.BudName}}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="btn" :class="{'deepColor':houseList.length}" @click.stop="tofinish">完成选定<span v-show="houseList.length">({{houseList.length}})</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import navTitle from '@/components/navTitle'
export default {
  name: 'selectResHouse',
  components: {navTitle},
  data () {
    return {
      locationData: {},
      houseList: [],
      houseId: [],
      listData: [],
      itemData: [],
      dans: [],
      codes: [],
      grpData: {},
      clickBack: false
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  // 避免不点确定直接返回
  beforeRouteLeave (to, from, next) {
    if (to.name === 'newOrEditBusiness' && !this.clickBack) {
      let detail = this.business.detail
      let msg = this.business.msg
      msg.ReservedHouseCode = detail.ReservedHouseCode
      msg.ReservedHouse = detail.ReservedHouseCode
      let business = {
        hasDetail: this.business.hasDetail,
        detail: this.business.detail,
        msg: msg
      }
      this.$store.commit('updateBusiness', business)
    }
    next()
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
        if (this.locationData.grpItem && this.locationData.grpItem.Id === arr.Id) {
          arr.isSelect = true
          this.grpData = arr
          this.getBudInfo(arr)
        } else {
          arr.isSelect = false
        }
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
      this.grpData = item
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
        if (this.locationData.budItem && this.locationData.budItem.Id === arr.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.itemData = res.data
    },
    selectItem (item) {
      this.itemData.forEach(arr => {
        if (item.Id === arr.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.locationData.grpItem = this.grpData
      this.locationData.budItem = item
      localStorage.locationData = JSON.stringify(this.locationData)
      this.$router.push({
        name: 'selectSearchHouseV2',
        query: {
          BudID: item.Id
        }
      })
    },
    // 删除房屋
    deleteHouse (item, index) {
      this.houseList.splice(index, 1)
      this.houseId.splice(index, 1)
      let msg = this.business.msg
      msg.ReservedHouseCode = this.houseList.join(',')
      msg.ReservedHouse = this.houseId.join(',')
      let business = {
        hasDetail: this.business.hasDetail,
        detail: this.business.detail,
        msg: msg
      }
      this.$store.commit('updateBusiness', business)

      let businessSelectHouse = {houseId: msg.ReservedHouse, houseCode: msg.ReservedHouseCode}
      localStorage.businessSelectHouse = JSON.stringify(businessSelectHouse)
    },
    // 新增房屋
    selectHouseCode (item, index) {
      if (item.isSelect) {
        return
      }
      this.codes.forEach(arr => {
        if (arr.code === item.code) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      if (this.houseList.indexOf(item.code) > -1) {
        this.houseList.splice(this.houseList.indexOf(item.code), 1)
      }
      this.houseList.unshift(item.code)
    },
    toSelectSearchHouse () {
      this.$router.push('/selectSearchHouse')
    },
    tofinish () {
      if (!this.houseList.length) {
        return
      }
      let msg = this.business.msg
      msg.ReservedHouseCode = this.houseList.join(',')
      msg.ReservedHouse = this.houseId.join(',')
      msg.isChange = true
      let business = {
        hasDetail: this.business.hasDetail,
        detail: this.business.detail,
        msg: msg
      }
      this.$store.commit('updateBusiness', business)
      this.clickBack = true
      this.$router.go(-1)
    }
  },
  created () {
    // if (localStorage.businessSelectHouse) {
    //   let businessSelectHouse = JSON.parse(localStorage.businessSelectHouse)
    //   this.houseList = businessSelectHouse.houseCode
    //   this.houseId = businessSelectHouse.houseId
    // }
    if (this.business.msg.ReservedHouseCode) {
      this.houseList = this.business.msg.ReservedHouseCode.split(',')
    }
    if (this.business.msg.ReservedHouse) {
      this.houseId = this.business.msg.ReservedHouse.split(',')
    }
    console.log('tag', this.business.msg)
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.getGrpInfo()
  }
}
</script>
<style lang="scss" scoped>
  .selectResHouse{
    .header{
      position: relative;
      height: 1.06rem;
      padding: .2rem .3rem;
      // background: #fff;
      border-bottom: 1px solid #ededed;
      .search{
        height: 0.66rem;
        background: #fff;
        border-radius: 0.2rem;
        font-size: .3rem;
        line-height: 0.66rem;
        color: #999;
        text-align: center;
        .icon-sousuo{
          display: inline-block;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: 0.34rem;
          text-align: right;
          color: #999;
        }
      }
    }
    .houseList{
      position: relative;
      height: 1.2rem;
      width: 100vw;
      overflow: hidden;
      background: #fff;
      &.hasHouse{
        height: 1.2rem;
        border-bottom: 1px solid #ededed;
      }
      &.noneHouse{
        height: 0;
      }
      .list{
        overflow-x: auto;
        white-space: nowrap;
        padding: .32rem .3rem;
        .item{
          position: relative;
          display: inline-block;
          min-width: 1.5rem;
          height: .56rem;
          padding: 0 .2rem;
          line-height: .56rem;
          text-align: center;
          background: #F2F2F4;
          color: #333;
          font-size: .3rem;
          border-radius: .1rem;
          margin-right: .3rem;
          &:last-child{
            margin-right: 0;
          }
          .icon-quxiao1{
            position: absolute;
            top: -.1rem;
            right: -.1rem;
            display: block;
            width: .4rem;
            height: .4rem;
            line-height: .4rem;
            text-align: center;
            font-size: .34rem;
            color: #999;
          }
        }
      }
    }
    .content{
      position: absolute;
      top: 2.26rem;
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      &.hasHouse{
        top: 2.26rem;
      }
      &.noneHouse{
        top: 1.06rem;
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
    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1.2rem;
      padding: .2rem .3rem;
      background: #fff;
      border-top: 1px solid #E9E9E9;
      .btn{
        height: .8rem;
        font-size: .3rem;
        line-height: .8rem;
        text-align: center;
        color: #fff;
        background:rgba(51,149,255,.5);
        border-radius: .1rem;
        &.deepColor{
          background: #3395FF;
        }
      }
    }
  }
</style>
