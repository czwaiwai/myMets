<template>
  <div class="page page_bg">
    <nav-title title="筛选客户"></nav-title>
    <div class="page_bd screenType">
      <ul class="list">
        <li class="item" :class="{'isSelect':item.isSelect}" v-for="(item,index) in dataList" :key="index" @click.stop="selectType(item,index)">{{item.CognitivBusinessName_zheWay}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import navTitle from '@/components/navTitle'
export default {
  name: 'screenType',
  components: {navTitle},
  data () {
    return {
      dataList: []
    }
  },
  computed: {
    ...mapGetters({
      guestStatus: 'getGuestStatus'
    })
  },
  methods: {
    selectType (item, index) {
      this.$store.commit('updateGuestStatus', item)
      this.$router.go(-1)
    },
    async getData () {
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserCS_CustomerSearchList'
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_CustomerSearchList', {})
      res.data.forEach(arr => {
        if (this.guestStatus.BusinessKey === arr.BusinessKey) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.dataList = res.data
      // this.$vux.loading.hide()
      console.log(this.dataList)
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .screenType{
    .list{
      background: #fff;
      .item{
        height: .88rem;
        font-size: .3rem;
        color: #333;
        line-height: .88rem;
        padding: 0 .3rem;
        border-bottom: 1px solid #ededed;
        &.isSelect{
          color: #3395FF;
        }
      }
    }
  }
</style>
