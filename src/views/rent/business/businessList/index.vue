<template>
  <div class="page page_bg">
    <nav-title title="商机"></nav-title>
    <div class="page_bd businessList">
      <i class="iconfont icon-tianxie newObj" @click.stop="toNewOrEditBusiness"></i>
      <div class="header clearfix">
        <div class="search clearfix" @click.stop="toSearchBusiness">
          <i class="iconfont icon-sousuo"></i>
          <span>客源名称、电话、跟进人名称</span>
        </div>
      </div>
      <div class="types" @click.stop="toBusinessType">
        <span>{{businessStatus.CognitivBusinessName_zheWay}}</span>
        <i class="iconfont icon-gengduo1"></i>
      </div>
      <div class="content">
        <load-view ref="list">
          <!-- <div class="none" v-show="dataList.length==0&&hasHttp">
            <img src="../../../styles/images/none.png">
            <p>暂无数据~</p>
          </div> -->
          <none-page title="暂无数据~" height="70" v-show="dataList.length==0&&hasHttp"></none-page>
          <ul class="c-list">
            <li class="c-items clearfix" v-for="(item,index) in dataList" :key="index" @click.stop="toBusinessDetail(item,index)">
              <div class="title clearfix">
                <i class="iconfont icon-renwu icon"></i>
                <span>{{item.CstName}}</span>
                <p class="status">{{com_status(item.OpportType)}}</p>
              </div>
              <div class="msg">
                <div class="phone-wrap clearfix">
                  <a class="phone" :href="'tel:'+item.ContactManner" @click.stop="">
                    <i class="iconfont icon-dianhua icon"></i>
                    <span>{{item.ContactManner}}</span>
                  </a>
                </div>
                <div class="desc clearfix">
                  <i class="iconfont icon-weibiaoti105 icon"></i>
                  <span class="steps" :class="com_degree_color(item.UrgentDegree)">{{com_degree(item.UrgentDegree)}}</span>
                  <span class="odds">概率：</span>
                  <span class="val">{{item.TradChance||0}}%</span>
                  <span class="expect">预计：</span>
                  <span class="val">￥{{item.EstimatePrice||'0.00'}}</span>
                </div>
                <div class="time clearfix">
                  <i class="iconfont icon-calendar icon"></i>
                  <p><span>{{item.STime}}</span> 至 <span>{{item.ETime}}</span></p>
                </div>
                <div class="num" v-show="item.ApplyCode||item.OpUser||item.CttCode">
                  <span v-show="item.OpportType=='2'">报价单  {{item.ApplyCode}}</span>
                  <span v-show="item.OpportType=='1'">合同编号  {{item.CttCode}}</span>
                  <p class="name">{{item.OpUser}}</p>
                </div>
              </div>
            </li>
          </ul>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
      </div>
    </div>
  </div>
</template>
<script>
import loadView from '@/components/ref/ref.vue'
import changeDate from '@/mixins/changeDate/index.js'
import businessCom from '@/mixins/businessCom/index.js'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
import navTitle from '@/components/navTitle'
import { mapGetters } from 'vuex'
export default {
  name: 'businessList',
  components: {loadView, nonePage, navTitle},
  mixins: [changeDate, businessCom],
  data () {
    return {
      dataList: [],
      locationData: {},
      page: 1,
      pageSize: 20,
      isLoading: true,
      showLoadTip: false,
      hasHttp: false
    }
  },
  computed: {
    ...mapGetters({
      businessStatus: 'getBusinessStatus'
    })
  },
  methods: {
    com_status (status) {
      let name = ''
      switch (status) {
        case '1': name = '已签约'; break
        case '2': name = '报价中'; break
        case '3': name = '无效'; break
        case '4': name = '跟进中'; break
      }
      return name
    },
    // 新增商机
    toNewOrEditBusiness () {
      let detail = {
        'ReservedHouseCode': '',
        'ReservedHouse': '',
        'ReserveArea': '',
        'CstName': '',
        'STime': '',
        'Theme': '',
        'ETime': '',
        'Source': '',
        'CognitiveWay': '',
        'CstType': '',
        'CstLevel': '',
        'LinkMan': '',
        'UrgentDegree': '',
        'TradChance': 0,
        'TradMoney': '',
        'Memo': '',
        'ContactType': '',
        'ContactManner': '',
        'EmployeeJobID': '',
        'EmployeeID': '',
        'RentUseFor': '',
        'EstimatePrice': '',
        'RentFreeDay': '',
        'ReservePrice': '',
        'isChange': false
      }
      let businessData = {
        hasDetail: false,
        detail: detail,
        msg: detail
      }
      this.$store.commit('updateBusiness', businessData)
      this.$router.push('/newOrEditBusiness')
    },
    // 搜索商机
    toSearchBusiness () {
      this.$store.commit('updateRentSearchKey', {key: ''})
      this.$router.push(`/searchBusiness`)
    },
    // 筛选类型
    toBusinessType () {
      this.$router.push(`/businessType`)
    },
    // 到详情
    toBusinessDetail (item, index) {
      this.$store.commit('updateBusinessDetailType', {type: 0})
      this.$store.commit('updateBusiness', {hasDetail: true, detail: item, msg: {}})
      this.$router.push(`/businessDetail/${item.Id}`)
    },
    async getData () {
      // let obj = {
      //   p0: 'UserCS_OpportSearchInfo',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'EmployeeID': this.locationData.employeeData.employeeId,
      //     'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
      //     'CstName': '',
      //     'BusinessName': this.businessStatus.BusinessKey,
      //     'Page': this.page,
      //     'PageSize': this.pageSize
      //   }
      // }
      // console.log('getData:', obj)
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportSearchInfo', {
        'OrgId': this.locationData.orgData.orgId,
        'EmployeeID': this.locationData.employeeData.employeeId,
        'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
        'CstName': '',
        'BusinessName': this.businessStatus.BusinessKey,
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      this.isLoading = false
      res.data.forEach(arr => {
        arr.STime = this.com_Date(arr.STime)
        arr.ETime = this.com_Date(arr.ETime)
        arr.TradChance = arr.TradChance - 0
      })
      if (this.page === 1) {
        this.dataList = res.data
        this.hasHttp = true
      } else {
        this.dataList = this.dataList.concat(res.data)
      }
      // this.$vux.loading.hide()
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.getData()
  },
  mounted () {
    let _this = this
    // 上拉禁止
    this.$refs.list.items.ref = function () {
      _this.$refs.list.succ()
    }
    // 上拉加载更多
    this.$refs.list.IsLast(50, (direction, scrollTop, h) => {
      if (h) {
        if (!this.isLoading && this.showLoadTip) {
          // console.log('in.....')
          this.isLoading = true
          this.page++
          this.getData()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .businessList{
    .newObj{
      position: absolute;
      right: .44rem;
      bottom: 1.32rem;
      z-index: 99999;
      display: block;
      width: 1rem;
      height: 1rem;
      background: #3395FF;
      border-radius: 1rem;
      font-size: .6rem;
      color: #fff;
      text-align: center;
      line-height: 1rem;
    }
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
    .types{
      position: relative;
      height: .88rem;
      padding: 0 .3rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      line-height: .88rem;
      font-size: .3rem;
      color: #3395FF;
      .icon-gengduo1{
        position: absolute;
        right: .3rem;
        top: 0;
        width: 1rem;
        height: .88rem;
        display: block;
        text-align: right;
        line-height: .88rem;
        font-size: .4rem;
        color: #999;
      }
    }
    .content{
      position: absolute;
      top: 1.94rem;
      bottom: 0;
      left: 0;
      right: 0;
      -webkit-overflow-scrolling: touch;
      .load-tip{
        height: .68rem;
        width: 100vw;
        font-size: .3rem;
        text-align: center;
        line-height: .68rem;
        color: #999;
      }
      .none{
        img{
          display: block;
          width: 1.6rem;
          height: 1.5rem;
          margin: 2.5rem auto .5rem;
        }
        p{
          color: #4a4a4a;
          font-size: .3rem;
          text-align: center;
          line-height: 1.2;
        }
      }
      .c-list{
        .c-items{
          position: relative;
          padding-left: .3rem;
          padding-bottom: .1rem;
          margin-bottom: .2rem;
          background: #fff;
          &:last-child{
            margin-bottom: 0;
          }
          .title{
            position: relative;
            height: .8rem;
            font-size: .34rem;
            color: #333;
            line-height: .8rem;
            border-bottom: 1px solid #DDDEE3;
            .icon{
              float: left;
              width: .4rem;
              height: .8rem;
              font-size: .42rem;
              color: #3395FF;
              line-height: .8rem;
              text-align: left;
              margin-right: .1rem;
            }
            span{
              float: left;
              line-height: .8rem;
              font-size: .32rem;
              color: #333;
              width: 5.2rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .status{
              position: absolute;
              right: .3rem;
              top: 0;
              height: .8rem;
              font-size: .3rem;
              color: #FF804A;
              line-height: .8rem;
            }
          }
          .msg{
            padding-top: .1rem;
            .phone-wrap{
              .phone{
                float: left;
              }
              .icon{
                float: left;
                width: .5rem;
                height: .6rem;
                font-size: .38rem;
                line-height: .6rem;
                color: #3395FF;
              }
              span{
                float: left;
                height: .6rem;
                line-height: .6rem;
                font-size: .32rem;
                color: #333;
              }
            }
            .desc{
              .icon{
                float: left;
                height: .6rem;
                width: .5rem;
                font-size: .38rem;
                line-height: .6rem;
                color: #FF804A;
                text-align: left;
              }
              .steps{
                float: left;
                height: .6rem;
                line-height: .6rem;
                color: #FF6262;
                font-size: .32rem;
                &.blue{
                  color: #57A7FE;
                }
                &.yellow{
                  color: #EDC905;
                }
                &.degreeRed{
                  color: #FF6262;
                }
                &.grad{
                  color: #999;
                }
              }
              .odds,.expect{
                float: left;
                height: .6rem;
                line-height: .6rem;
                margin-left: .2rem;
                font-size: .28rem;
                color: #777E8C;
              }
              .val{
                float: left;
                height: .6rem;
                line-height: .6rem;
                color: #333;
                font-size: .32rem;
              }
            }
            .time{
              .icon{
                float: left;
                height: .6rem;
                width: .5rem;
                line-height: .6rem;
                font-size: .34rem;
                color: #777E8C;
                text-align: left;
              }
              p{
                float: left;
                height: .6rem;
                line-height: .6rem;
                font-size: .28rem;
                color: #777E8C;
              }
            }
            .num{
              position: relative;
              height: .6rem;
              line-height: .6rem;
              font-size: .28rem;
              color: #777E8C;
              .name{
                position: absolute;
                top: 0;
                right: .3rem;
                height: .6rem;
                line-height: .6rem;
                font-size: .3rem;
                color: #333;
              }
            }
          }
        }
        .btn{
          position: absolute;
          top: .55rem;
          right: .3rem;
          height: .6rem;
          padding: 0 .1rem;
          line-height: .6rem;
          border: 1px solid #3395FF;
          border-radius: 3px;
          color: #3395FF;
          text-align: center;
        }
      }
    }
  }
</style>
