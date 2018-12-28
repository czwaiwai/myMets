<template>
<div class="page location">
    <nav-title title="搜索仪表"></nav-title>
    <div class="page_bd _content">
      <div class="header clearfix">
        <span class="orgName">{{title}}</span>
      </div>
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
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'meterLocation',
  components: {navTitle},
  data () {
    return {
      title: '',
      listData: [],
      items: [],
      loactionData: {}
    }
  },
  methods: {
    selectList (item, index) {
      if (item.isSelect) {
        return
      }
      this.listData.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.getBudInfo(item.Id)
      this.loactionData.grpItem = item
    },
    async getBudInfo (id) {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_GetBudInfo', {
        GrpID: id
      })
      console.log('UserCS_GetGrpInfo:', res)
      if (res.data.length) {
        res.data.forEach(arr => {
          arr.isSelect = false
        })
      }
      this.items = res.data
      this.$indicator.close()
    },
    toWorkList (item, index) {
      this.$store.commit('setMeterDateTime', {initTime: item.strCurrFnPer, thisTime: item.strCurrFnPer})
      this.items.forEach(arr => {
        arr.isSelect = false
      })
      console.log('item:', item)
      item.isSelect = true
      this.loactionData.budItem = item
      this.$store.commit('setMeterLocation', this.loactionData)
      this.$router.push(`/meterWorkList`)
      console.log(this.loactionData)
    },
    async getListData () {
      let res = await this.$xml('UserCS_GetGrpInfo', {
        orgId: this.loactionData.orgData.orgId
      })
      console.log('UserCS_GetGrpInfo:', res)
      if (res.data.length) {
        res.data.forEach(arr => {
          arr.isSelect = false
        })
      }
      this.listData = res.data
    }
  },
  created () {
    this.title = this.$route.query.orgName
    this.loactionData.orgData = {orgName: this.$route.query.orgName, orgId: this.$route.query.orgId}
    this.getListData()
  }
}
</script>
<style lang="scss" scoped>
  .location{
    ._content{
      padding: .3rem;
      background: #fff;
      .header{
        padding: .2rem 0;
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
          color: #333;
          line-height: 1.5;
          font-weight: bold;
        }
      }
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
              // color: #0dc88c;
              border: 1px solid #3395ff;
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
              color: #3395ff;
              border: 1px solid #3395ff;
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
