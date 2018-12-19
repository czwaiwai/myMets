<template>
  <div class="destine page page_bg">
    <nav-title title="会议室"></nav-title>
    <div @click="$router.forward({name: 'destineChangeProject'})" class="org clearfix">
      <i class="iconfont icon-loudong"></i>
      <span class="orgName">{{this.orgName}}</span>
      <i class="iconfont icon-tubiao-"></i>
    </div>
    <line-date :date="dateStr" @change="changeDate"></line-date>
    <search-and-filter :orgId="orgId" :filterObj="filterObj" @filter="filterSearch"></search-and-filter>
    <div class="page_bd _content">
      <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        v-if="list.length">
        <li class="items" :class="{'lastItem':index+1==list.length}" v-for="(item,index) in list" :key="item.ID" @click.stop="toDesitineDetial(item)">
          <div class="top clearfix">
            <img :src="item.Url || ''" class="pic">
            <div class="msg">
              <div class="name">
                <p class="title">{{item.MeetName}}</p>
                <div class="people clearfix">
                  <i class="iconfont icon icon-duorenyonghu"></i>
                  <span>{{item.Capacity}}人</span>
                </div>
              </div>
              <div class="location clearfix">
                <i class="iconfont icon icon-dizhi"></i>
                <span class="build">{{item.Location}}</span>
                <span class="steps">{{item.Floor}}楼</span>
              </div>
              <div class="label">
                <span v-for="(it,i) in item.Facilities" :key="i">{{it.MaterialsnName}}</span>
              </div>
            </div>
          </div>
          <subscribe-show :item="item" :bookList="item.BookList"  ></subscribe-show>
        </li>
        <li class="load-tip" v-show="showLoadTip">加载中···</li>
      </ul>
      <none-page title="暂无会议室~" v-else></none-page>
    </div>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import { Indicator } from 'mint-ui'
// import { setTimeout } from 'timers'
import dateChange from '@/mixins/dateChange'
import nonePage from '../components/nonePage/index.vue'
import { mapGetters } from 'vuex'
import SubscribeShow from '@/views/meeting/components/subscribeShow'
import LineDate from './child/lineDate'
import SearchAndFilter from './child/searchAndFilter'
import sleep from '@/utils/sleep'
let isClear = true
export default {
  name: 'destine',
  components: {navTitle, Indicator, nonePage, SubscribeShow, LineDate, SearchAndFilter},
  mixins: [dateChange],
  data () {
    return {
      allLoaded: false,
      list: [],
      showLoadTip: false,
      page: 1,
      pageSize: 10,
      filterObj: {
        'MeetType': '',
        'CapacityMin': '',
        'CapacityMax': '',
        'Floor': '',
        'MeetName': '',
        'MaterialName': ''
      },
      dateStr: (new Date()).format('yyyy-MM-dd')
    }
  },
  computed: {
    ...mapGetters({
      dateDate: 'getDate',
      key: 'getSearchKey',
      navData: 'getMeetingLocation',
      destineConfig: 'destineConfig'
    })
  },
  beforeRouteEnter (to, from, next) {
    console.log(from.name, '??---')
    if (from.name === 'meeting') {
      isClear = true
    } else {
      isClear = false
    }
    next()
  },
  // beforeRouteLeave (to, from, next) {
  //   // this.$store.commit('setSearchKey', this.searchKey)
  //   // this.$store.commit('setDate', {year: this.monthDate.year, month: this.monthDate.month, day: this.monthDate.day})
  //   next()
  // },
  methods: {
    loadMore () {
      // this.getList()
    },
    // 修改日期
    changeDate (dateStr) {
      console.log(dateStr, '日期被修改了')
      this.dateStr = dateStr
      this.updateConfig()
      this.getList()
    },
    // 更新过滤
    filterSearch (obj) {
      this.filterObj = obj
      this.updateConfig()
      this.getList()
    },
    // 更新临时配置
    updateConfig () {
      this.$store.commit('setDestineConfig', {
        orgId: this.orgId,
        orgName: this.orgName,
        dateStr: this.dateStr,
        filterObj: this.filterObj
      })
    },
    // 更改项目
    setProject (item) {
      this.orgId = item.projectId
      this.orgName = item.projectName
      this.updateConfig()
      this.getList()
      // console.log(item, '---')
      // this.orgId: this.orgId,
      // orgName: this.orgName,
    },
    toDesitineDetial (item) {
      this.$router.push({
        name: 'destineDetail',
        params: {
          id: item.ID
        },
        query: {
          title: item.MeetName
        }
      })
    },
    async getList (isSleep) {
      // Indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingList', {
        ...this.filterObj,
        'OrgID': this.orgId, // '11091315263400010000',
        'MeetTime': this.dateStr
      })
      if (isSleep) {
        await sleep(300) // 延时300毫秒降低动画卡顿
      }
      console.log('res:', res)
      this.isLoading = false
      if (res.data) {
        this.list = res.data || []
      }
      // Indicator.close()
      // this.showLoadTip = true
    }
  },
  created () {
    this.searchKey = this.key
    this.orgId = this.navData.orgId
    this.orgName = this.navData.orgName
    console.log('是否需要清除缓存对象', isClear)
    if (isClear) { // 采用默认的设置
      this.$store.commit('setDestineConfig', {
        orgId: this.orgId,
        orgName: this.orgName,
        dateStr: this.dateStr,
        filterObj: this.filterObj
      })
    } else { // 采用缓存的设置
      // this.destineConfig
      this.dateStr = this.destineConfig.dateStr
      this.filterObj = this.destineConfig.filterObj
      this.orgId = this.destineConfig.orgId
      this.orgName = this.destineConfig.orgName
    }
    this.getList(true)
  }
}
</script>
<style lang="scss" scoped>
  .destine{
    .org{
      position: relative;
      width: 100vw;
      height: .88rem;
      padding: 0 .3rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .icon-loudong{
        float: left;
        width: .6rem;
        height: .88rem;
        line-height: .8rem;
        text-align: left;
        color: #000;
        font-size: .46rem;
      }
      .orgName{
        float: left;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
      }
      .icon-tubiao-{
        position: absolute;
        right: .2rem;
        top: 0;
        display: block;
        width: .4rem;
        height: .88rem;
        line-height: .88rem;
        text-align: right;
        font-size: .4rem;
        color: #999;
      }
    }
    ._content{
      .list{
        .items{
          padding: .2rem .3rem;
          background: #fff;
          margin-bottom: .2rem;
          &.lastItem{
            margin-bottom: 0;
          }
          .top{
            position: relative;
            height: 1.46rem;
            .pic{
              float: left;
              width: 1.46rem;
              height: 1.46rem;
              margin-right: .5rem;
            }
            .msg{
              float: left;
              height: 1.46rem;
              width: 4.94rem;
              .name{
                position: relative;
                height: .4rem;
                .title{
                  font-size: .34rem;
                  color: #333;
                  line-height: .4rem;
                }
                .people{
                  position: absolute;
                  top: 0;
                  right: 0;
                  .icon{
                    float: left;
                    width: .4rem;
                    height: .4rem;
                    line-height: .4rem;
                    text-align: left;
                    color: #0DC88C;
                  }
                  span{
                    float: left;
                    font-size: .3rem;
                    color: #999;
                    line-height: .4rem;
                  }
                }
              }
              .location{
                position: relative;
                height: .4rem;
                margin: .13rem 0;
                .icon{
                  float: left;
                  width: .4rem;
                  height: .4rem;
                  color: #0DC88C;
                  font-size: .36rem;
                  text-align: center;
                  line-height: .4rem;
                  margin-right: .1rem;
                }
                .build{
                  float: left;
                  height: .4rem;
                  max-width: 4rem;
                  line-height: .4rem;
                  color: #999;
                  font-size: .3rem;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .steps{
                  position: absolute;
                  right: 0;
                  top: 0;
                  height: .4rem;
                  line-height: .4rem;
                  font-size: .28rem;
                  color: #999;
                }
              }
              .label{
                position: relative;
                height: .4rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                span{
                  float: left;
                  font-size: .28rem;
                  color: #999;
                  margin-right: .3rem;
                  line-height: .4rem;
                }
              }
            }
          }
          .bottom{
            position: relative;
            height: .5rem;
            width: 6.9rem;
            overflow-y: hidden;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
            margin-top: .25rem;
            span{
              display: inline-block;
              width: .5rem;
              height: .5rem;
              margin-right: .08rem;
              background: #E8E8E8;
              color: #fff;
              text-align: center;
              line-height: .5rem;
              &.isSelect{
                background: #0dc88c;
              }
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
