<template>
  <div class="_listWrap">
    <div class="_listBox" v-show="list.length"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <div class="items" v-for="(item,index) in list" :key="index" @click.stop="toDetail(item)">
        <p class="title">{{item.Subject}}</p>
        <div class="msg">
          <p class="name">{{item.AskerName}}</p>
          <span class="time">{{setDateTime(item.AskTime)}}</span>
        </div>
      </div>
      <p class="load-tip" v-show="showTip">加载中···</p>
    </div>
    <none-page v-show="!list.length&&hasHttp"></none-page>
  </div>
</template>
<script>
import dateChange from '@/mixins/dateChange'
import nonePage from '@/components/nonePage/index.vue'
export default {
  name: 'listBox',
  mixins: [dateChange],
  components: {nonePage},
  data () {
    return {
      list: [],
      isHttp: false,
      showTip: false,
      hasHttp: false,
      page: 1,
      pageSize: 20
    }
  },
  methods: {
    toDetail (item) {
      this.$store.commit('setSelectItemData', item)
      this.$router.push({
        name: 'approvalDetail',
        params: {
          id: item.Id
        }
      })
    },
    loadMore () {
      if (!this.isHttp && this.showTip) {
        this.page++
        this.getListData()
      }
    },
    async getListData () {
      this.isHttp = true
      let res = await this.$xml('UserAudit_GetAuditTasks', {
        'EmployeeId': this.$parent.employeeId,
        'Status': this.$parent.statusName,
        'WorkflowTypeId': this.$parent.typesData.WorkflowTypeId || '',
        'Subject': '',
        'AskerJobId': '', // this.$parent.employeeJobId,
        'AskTimeS': this.$parent.typesData.AskTimeS || '',
        'AskTimeE': this.$parent.typesData.AskTimeE || '',
        'Sort': this.$parent.timeType,
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (this.page === 1) {
        this.list = res.data
      } else {
        this.list = this.list.concat(res.data)
      }
      if (res.data.length === this.pageSize) {
        this.showTip = true
      } else {
        this.showTip = false
      }
      this.isHttp = false
      this.hasHttp = true
    },
    getInitList () {
      this.hasHttp = false
      this.page = 1
      this.list = []
      this.getListData()
    }
  },
  created () {
    this.getListData()
  }
}
</script>
<style lang="scss" scoped>
  ._listWrap{
    width: 100%;
    height: 100%;
  }
  ._listBox{
    // width: 100%;
    // height: 100%;
    .items{
      padding: .2rem .3rem;
      background: #fff;
      border-top: 1px solid #ededed;
      border-bottom: 1px solid #ededed;
      margin-bottom: .2rem;
      &:first-of-type{
        border-top: 0;
      }
      &:last-of-type{
        margin: 0;
      }
      .title{
        font-size: .3rem;
        color: #333;
        line-height: 1.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .msg{
        position: relative;
        height: .4rem;
        margin-top: .1rem;
        .name{
          line-height: .4rem;
          color: #999;
          font-size: .28rem;
          max-width: 4.8rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time{
          position: absolute;
          right: 0;
          top: 0;
          display: block;
          height: .4rem;
          line-height: .4rem;
          font-size: .28rem;
          color: #999;
        }
      }
    }
  }
</style>
