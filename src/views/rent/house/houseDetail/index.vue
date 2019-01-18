<template>
  <div class="page page_bg">
    <nav-title title="房源详情"></nav-title>
    <div class="page_bd houseDetail" v-if="showPage">
      <div class="header">
        <i class="iconfont icon" :class="com_icon(pageData.RentStatus)"></i>
        <span class="type">{{com_status(pageData.RentStatus)}}</span>
        <span class="times" v-if="pageData.RentStatus=='Lease_Reserve'||pageData.RentStatus=='Lease_Decide'">{{com_time()}}</span>
        <span class="times red" v-else-if="pageData.RentStatus=='Lease_AlrRent'">{{com_Date(pageData.ExpireTime)}} 到期</span>
      </div>
      <div class="content" :class="{'noFooter':!(pageData.RentStatus=='Lease_NTray'||pageData.RentStatus=='Lease_CanRent'||pageData.RentStatus=='Lease_Reserve'||pageData.RentStatus=='Lease_Decide')}">
        <div class="location">
          <p class="title">{{pageData.ResCode}}</p>
          <p class="name"><span v-if="pageData.RentalArea">{{com_point(pageData.RentalArea)}}㎡/</span><span v-show="pageData.FloorNum">{{pageData.FloorNum}}层/</span><span v-show="pageData.ResType">{{pageData.ResType}}</span></p>
          <p class="building">{{pageData.GrpName}}{{pageData.BudName}}<span v-show="pageData.UnitNO">{{pageData.UnitNO}}单元</span><span v-show="pageData.ResNO">{{pageData.ResNO}}号</span></p>
          <!-- <p class="tip">已入住</p> -->
          <div class="contract clearfix" @click.stop="toContractMsg">
            <span>合同信息</span>
            <i class="iconfont icon-gengduo1"></i>
          </div>
        </div>
        <div class="desc">
          <p class="items">建筑面积：<span v-if="pageData.BudArea">{{com_point(pageData.BudArea)}}㎡</span></p>
          <p class="items">出租面积：<span v-if="pageData.RentalArea">{{com_point(pageData.RentalArea)}}㎡</span></p>
          <p class="items">收费面积：<span v-if="pageData.FeeArea">{{com_point(pageData.FeeArea)}}㎡</span></p>
          <p class="items">使用面积：<span v-if="pageData.UseArea">{{com_point(pageData.UseArea)}}㎡</span></p>
          <p class="items">分摊面积：<span v-if="pageData.AvgArea">{{com_point(pageData.AvgArea)}}㎡</span></p>
          <!-- <p class="items">租赁费月单价：<span v-show="pageData.RentGuidUnitPrice.length">{{pageData.RentGuidUnitPrice}}</span></p>
          <p class="items">租金月单价：<span v-show="pageData.RentGuidUnitPrice.length">{{pageData.RentGuidUnitPrice}}</span></p>
          <p class="items">租金年金额：<span v-show="pageData.RentGuidPrice.length">{{pageData.RentGuidPrice}}</span></p> -->
          <p class="remarks clearfix"><span class="name">备注：</span><span class="remark">{{pageData.Memo}}</span></p>
        </div>
        <div class="matching">
          <h3 class="title"><span>配套</span></h3>
          <p class="list" v-for="(item,index) in list" :key="index">
            <span class="name">{{item.ItemName}}</span>
            <span class="num"><span v-show="item.TotaSum">{{com_num(item.TotaSum)}} {{item.Units}}</span></span>
          </p>
          <p class="noList" v-show="list.length==0">无配套</p>
        </div>
      </div>
      <div class="footer1 clearfix" v-show="pageData.RentStatus=='Lease_NTray'||pageData.RentStatus=='Lease_CanRent'||pageData.RentStatus=='Lease_Reserve'||pageData.RentStatus=='Lease_Decide'">
        <div class="btn1" @click.stop="changeStatus(1)" v-show="pageData.RentStatus=='Lease_NTray'">放盘</div>
        <div class="btn1" @click.stop="toSaveRes(1)" v-show="pageData.RentStatus=='Lease_CanRent'">预定</div>
        <div class="btn1" @click.stop="toSaveRes(0)" v-show="pageData.RentStatus=='Lease_CanRent'">保留</div>
        <div class="btn2" @click.stop="changeStatus(0)" v-show="pageData.RentStatus=='Lease_CanRent'">取消放盘</div>
        <div class="btn1" @click.stop="toClearRes(0)" v-show="pageData.RentStatus=='Lease_Reserve'">取消保留</div>
        <div class="btn1" @click.stop="toClearRes(1)" v-show="pageData.RentStatus=='Lease_Decide'">取消预定</div>
      </div>
      <dialog-confire
        :title="dialogData.title"
        ref="dialog"
        @clickLeftBtn="clickLeftBtn"
        @clickRightBtn="clickRightBtn"
      ></dialog-confire>
    </div>
  </div>
</template>
<script>
import dialogConfire from '@/components/dialogConfire.vue'
import comPoint from '@/mixins/comPoint'
import changeDate from '@/mixins/changeDate/index.js'
import navTitle from '@/components/navTitle'
export default {
  name: 'houseDetail',
  mixins: [comPoint, changeDate],
  components: {dialogConfire, navTitle},
  data () {
    return {
      showPage: false,
      pageData: {},
      list: [],
      locationData: {},
      isHttp: false,
      dialogData: {
        title: '',
        type: 0
      }
    }
  },
  methods: {
    com_icon (status) {
      if (status === 'Lease_NTray') {
        return 'icon-loucengfenbu'
      } else if (status === 'Lease_CanRent') {
        return 'icon-fangyuan'
      } else if (status === 'Lease_AlrRent') {
        return 'icon-fangwu'
      } else if (status === 'Lease_Pprocess') {
        return 'icon-daichuli'
      } else if (status === 'Lease_Reserve') {
        return 'icon-yudingbaoliu'
      } else if (status === 'Lease_Decide') {
        return 'icon-ding'
      }
    },
    com_status (status) {
      if (status === 'Lease_NTray') {
        return '未放盘'
      } else if (status === 'Lease_CanRent') {
        return '可出租'
      } else if (status === 'Lease_AlrRent') {
        return '已出租'
      } else if (status === 'Lease_Pprocess') {
        return '办理中'
      } else if (status === 'Lease_Reserve') {
        return '已保留'
      } else if (status === 'Lease_Decide') {
        return '已预定'
      }
    },
    com_time () {
      let st = ''
      let et = ''
      if (this.pageData.AppEndTime) {
        et = this.pageData.AppEndTime.split(' ')[0].replace(/\//g, '-')
      }
      if (this.pageData.AppStartTime) {
        st = this.pageData.AppStartTime.split(' ')[0].replace(/\//g, '-')
      }
      if (st && et) {
        return st + ' 至 ' + et
      } else {
        return ''
      }
    },
    com_num (str) {
      return str - 0
    },
    async submitMsg () {
      this.isHttp = true
      let res = await this.$xml('UserAppHouse_UpdateHouseStatus', {
        'HouseID': this.pageData.ID,
        'StatusKey': this.dialogData.type === 0 ? '-3' : '3',
        'Stime': '',
        'Etime': '',
        'Memo': '',
        'EmployeeID': this.locationData.employeeData.employeeId
      })
      console.log('res', res)
      this.$toast(res.msg)
      this.isHttp = false
      if (res.status === 200 || res.status === '200') {
        setTimeout(() => {
          this.$router.go(-1)
        }, 2000)
      }
    },
    changeStatus (type) {
      if (this.isHttp) {
        return
      }
      if (type) {
        this.dialogData = {
          title: '确认将该资源放盘？放盘后该资源将变为可出租状态。',
          type: 1
        }
      } else {
        this.dialogData = {
          title: '确认取消放盘？取消后该资源将变为未放盘状态。',
          type: 0
        }
      }
      this.$refs.dialog.show()
    },
    toContractMsg () {
      this.$store.commit('updateHouseDetail', this.pageData)
      this.$router.push(`/contractMsg/${this.pageData.ID}`)
    },
    toSaveRes (type) {
      this.$store.commit('updateHouseDetail', this.pageData)
      this.$router.push({
        name: 'saveRes',
        query: {
          type: type
        }
      })
    },
    toClearRes (type) {
      this.$store.commit('updateHouseDetail', this.pageData)
      this.$router.push({
        name: 'clearRes',
        query: {
          type: type
        }
      })
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.submitMsg()
    },
    getData: async function () {
      // this.$vux.loading.show()
      // let obj = {
      //   p0: 'UserCS_GetHouseDetail',
      //   p7: {
      //     'ResID': this.$route.params.id
      //   }
      // }
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_GetHouseDetail', {
        'ResID': this.$route.params.id
      })
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        this.pageData = res.data[0]
        this.showPage = true
      } else {
        this.$toast(res.msg)
      }
      // let listObj = {
      //   p0: 'UserCS_GetHouseDetailHouseArd',
      //   p7: {
      //     'ResID': this.$route.params.id,
      //     'OrgID': this.locationData.orgData.orgId
      //   }
      // }
      let resq = await this.$xml('UserCS_GetHouseDetailHouseArd', {
        'ResID': this.$route.params.id,
        'OrgID': this.locationData.orgData.orgId
      })
      console.log('resq', resq)
      this.list = resq.data
      // this.$vux.loading.hide()
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .houseDetail{
    // position: relative;
    // flex: 1;
    // overflow: hidden;
    .header{
      position: relative;
      height: 1.02rem;
      padding-left: 1rem;
      background: #3395FF;
      font-size: .32rem;
      color: #fff;
      line-height: 1.02rem;
      .icon{
        position: absolute;
        top: 0;
        left: .3rem;
        width: .6rem;
        height: 1.02rem;
        font-size: .56rem;
        color: #fff;
        line-height: 1.02rem;
        text-align: left;
      }
      .times{
        position: absolute;
        right: .3rem;
        font-size: .28rem;
      }
    }
    .content{
      position: absolute;
      top: 1rem;
      bottom: 1rem;
      left: 0;
      right: 0;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &.noFooter{
        bottom: 0;
      }
      .location{
        position: relative;
        padding: .2rem .3rem;
        margin: .2rem 0;
        background: #fff;
        .title{
          height: .5rem;
          line-height: .5rem;
          font-size: .34rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .name, .building{
          max-width: 5rem;
          margin-top: .1rem;
          line-height: 1.2;
          font-size: .28rem;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .tip{
          position: absolute;
          top: .2rem;
          right: .3rem;
          padding: 2px;
          font-size: .3rem;
          color: #333;
          border: 1px solid #333;
          border-radius: 3px;
        }
        .contract{
          position: absolute;
          bottom: .2rem;
          right: .54rem;
          font-size: .3rem;
          height: .4rem;
          line-height: .4rem;
          color: #3395FF;
          span{
            float: left;
          }
          .icon-gengduo1{
            position: absolute;
            top: 0;
            right: -.24rem;
            display: block;
            width: .34rem;
            height: .4rem;
            line-height: .4rem;
            text-align: right;
            font-size: .34rem;
            color: #3395FF;
          }
        }
      }
      .desc{
        margin-top: .2rem;
        padding: .2rem .3rem;
        background: #fff;
        .items{
          height: .6rem;
          line-height: .6rem;
          font-size: .3rem;
          color: #999;
          span{
            color: #333;
          }
        }
        .remarks{
          .name{
            float: left;
            min-width: 1rem;
            line-height: .6rem;
            font-size: .3rem;
            color: #999;
          }
          .remark{
            float: left;
            width: 5.8rem;
            font-size: .3rem;
            color: #333;
            line-height: 1.5;
            padding-top: .1rem;
          }
        }
      }
    }
    .matching{
      .title{
        height: .8rem;
        line-height: .8rem;
        text-align: center;
        font-size: .3rem;
        color: #999;
        span{
          position: relative;
          display: inline-block;
          height: .8rem;
          &::before{
            position: absolute;
            left: -1.2rem;
            top: .4rem;
            display: block;
            content: '';
            width: 1rem;
            height: 1px;
            background: #999;
          }
          &::after{
            position: absolute;
            right: -1.2rem;
            top: .4rem;
            display: block;
            content: '';
            width: 1rem;
            height: 1px;
            background: #999;
          }
        }
      }
      .list{
        position: relative;
        height: .8rem;
        padding: 0 .3rem;
        font-size: .3rem;
        color: #333;
        line-height: .8rem;
        background: #fff;
        border-bottom: 1px solid #ededed;
        .num{
          position: absolute;
          right: .3rem;
        }
      }
      .noList{
        height: .88rem;
        padding: 0 .3rem;
        font-size: .3rem;
        line-height: .88rem;
        color: #999;
        background: #fff;
      }
    }
    .footer1{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1rem;
      padding: .15rem .3rem .15rem 0;
      background: #fff;
      border-top: 1px solid #ededed;
      .btn1{
        float: right;
        min-width: 1.55rem;
        height: .7rem;
        padding: 0 .18rem;
        margin-left: .2rem;
        font-size: .3rem;
        color: #3395FF;
        text-align: center;
        line-height: .7rem;
        border: 1px solid #3395FF;
        border-radius: 3px;
      }
      .btn2{
        float: right;
        min-width: 1.55rem;
        height: .7rem;
        padding: 0 .18rem;
        margin-left: .2rem;
        font-size: .3rem;
        color: #908F8F;
        text-align: center;
        line-height: .7rem;
        border: 1px solid #908F8F;
        border-radius: 3px;
      }
    }
  }
</style>
