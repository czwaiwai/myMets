<template>
  <div class="location">
    <div class="header clearfix">
      <!-- <div class="icon"></div> -->
      <span class="orgName">{{title}}</span>
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
</template>
<script>
export default {
  name: 'meterLocation',
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
    getBudInfo (id) {
      // this.$vux.loading.show()
      let data = {
        grpId: id
      }
      this.$fetch.myPost(this.$api.getBudInfo, data).then((res) => {
        // console.log(res)
        if (res.code === '200') {
          if (res.data.length) {
            res.data.forEach(arr => {
              arr.isSelect = false
            })
          }
          this.items = res.data
          // this.$vux.loading.hide()
          // if (res.)
        } else {
          // this.$vux.loading.hide()
          // this.$vux.toast.text(res.desc)
        }
      })
    },
    toWorkList (item, index) {
      this.$store.commit('updateDateTime', {initTime: item.strCurrFnPer, thisTime: item.strCurrFnPer})
      if (item.isSelect) {
        this.$router.push(`/workList`)
      } else {
        this.items.forEach(arr => {
          arr.isSelect = false
        })
        item.isSelect = true
        this.loactionData.budItem = item
        this.$store.commit('updateLocationData', this.loactionData)
        this.$router.push(`/workList`)
      }
    },
    getListData () {
      // this.$vux.loading.show()
      let data = {
        orgId: '11091315263400010000'// this.$route.query.orgId
      }
      this.$fetch.myPost(this.$api.getGrpInfo, data).then((res) => {
        // console.log(res)
        if (res.code === '200') {
          if (res.data.length) {
            res.data.forEach(arr => {
              arr.isSelect = false
            })
          }
          this.listData = res.data
          // this.$vux.loading.hide()
          // if (res.)
        } else {
          // this.$vux.loading.hide()
          // this.$vux.toast.text(res.desc)
        }
      })
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
    this.getListData()
    this.title = this.$route.query.orgName
    this.loactionData.orgData = {orgName: this.$route.query.orgName, orgId: this.$route.query.orgId}
    this.$root.$emit('keepAlive', {isKeep: true, name: 'location'})
  }
}
</script>
<style lang="scss" scoped>
  .location{
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
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
        color: #333;
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
              // color: #0dc88c;
              border: 1px solid #0dc88c;
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
              color: #0dc88c;
              border: 1px solid #0dc88c;
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
