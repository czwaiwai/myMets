<template>
  <div class="page page_bg">
    <nav-title title="选择预定房屋"></nav-title>
    <div class="headTitle">
      <p class="orgMsg" @click.stop="toSelectLocation">{{locationData.orgData.orgName}}<span v-if="locationData.grpItem">>{{locationData.grpItem.GrpName}}>{{locationData.budItem.BudName}}</span></p>
       <i class="iconfont pageIcon" :class="(pageType===1?'icon-xiangmu':'icon-loupan1')" @click.stop="tabChange"></i>
    </div>
    <div class="page_bd selectSearchHouse">
      <div name="listc" v-show="pageType===0">
      <div class="searchBox clearfix">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="请输入资源号" type="search" v-model="searchKey" @keydown.13="searchList">
            <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
        </form>
        <!-- <span class="searachBtn" v-show="searchKey.length" @click.stop="searchList">搜索</span> -->
      </div>
      <div class="content" :class="{'noBottom':dataList.length}">
        <load-view ref="list">
          <!-- <div class="none" v-show="dataList.length==0&&hasHttp">
            <img src="../../../styles/images/none.png">
            <p>暂无符合条件的房屋</p>
          </div> -->
          <none-page title="暂无符合条件的房屋" v-show="dataList.length==0&&hasHttp"></none-page>
          <div class="list" v-for="(item,index) in dataList" :key="index" @click.stop="selectItem(item)">
            <div class="header clearfix">
              <i class="iconfont icon-loufang icon"></i>
              <span class="code">{{item.ResCode}}</span>
              <span class="status">{{com_status(item.RentStatus)}}</span>
            </div>
            <div class="msg">
              <div class="title clearfix">
                <i class="iconfont icon-icon- icon"></i>
                <span class="code">{{item.ResName}}</span>
                <span class="use">{{item.ResType}}</span>
              </div>
              <div class="desc clearfix">
                <i class="iconfont icon-fangwu icon"></i>
                <span class="name">
                  <span>{{item.BudName}}</span><span v-show="item.FloorNum">{{item.FloorNum}}层</span>
                </span>
                <i class="iconfont icon-haofangtuo400iconfontzhaoxiang icon ml65" v-show="item.Toward"></i>
                <span class="name">{{item.Toward}}</span>
              </div>
              <div class="area">
                <span>建筑面积：</span>
                <span v-show="item.BudArea">{{item.BudArea}}</span>
              </div>
              <div class="area">
                <span>使用面积：</span>
                <span v-show="item.UseArea">{{item.UseArea}}</span>
              </div>
              <i class="iconfont icon-xuanze selectIcon" v-show="item.isSelect"></i>
            </div>
          </div>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
      </div>
    </div>
      <div class="propertycontent" v-show="pageType===1">
          <none-page title="无数据~" v-show="propertylist.length==0"></none-page>
          <ul class="c-list" v-show="propertylist.length">
            <li class="c-items" v-for="(item,index) in propertylist" :key="index">
              <div class="top clearfix">
                <div class="_left">
                  <p class="desc">{{item.FloorNum}}层</p>
                </div>
                <ul class="area_item_list clearfix">
                  <li v-for="(houseItem,hIndex) in item.DetaList" :key="hIndex+item.FloorNum"><span @click="selectItem(houseItem)" :class="com_color(houseItem.RentStatus)">
                    <i class='iconfont icon-select-copy' v-show="houseItem.isSelect"></i> {{houseItem.ResNo}}</span></li>
                </ul>
              </div>
            </li>
          </ul>
      </div>
      <div class="footer" v-show="dataList.length || propertylist.length">
        <div class="btn cancelColor"  @click.stop="$router.go(-1)">取消</div>
        <div class="btn" :class="{'deepColor':isSelectItem}" @click.stop="tofinish">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import loadView from '@/components/ref/ref.vue'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'selectSearchHouse',
  components: {loadView, navTitle, nonePage},
  data () {
    return {
      isSelectItem: false,
      searchKey: '',
      dataList: [],
      locationData: {},
      page: 1,
      pageSize: 20,
      isLoading: true,
      showLoadTip: false,
      hasHttp: false,
      pageType: 1,
      propertylist: [],
      codeData: []
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    }),
    getPropertylist () {
      console.log('tag', this.propertylist)
      return this.propertylist
    }
  },
  watch: {
    searchKey (val) {
      this.searchList()
    }
  },
  methods: {
    searchList () {
      this.page = 1
      // this.$el.querySelector('.search-input').blur()
      if (this.$refs.list) {
        this.$refs.list.setTop(1)
      }
      this.getData()
    },
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
    },
    tabChange () {
      if (this.pageType) {
        this.pageType = 0
        this.getData()
      } else {
        this.pageType = 1
        this.initPropertyList()
      }
      this.codeData = []
      this.isSelectItem = false
      localStorage.locationPageType = this.pageType
    },
    toSelectLocation () {
      this.$router.push(`/selectResHouse`)
    },
    tofinish () {
      let houseList = []
      let houseId = []

      // let businessSelectHouse = JSON.parse(localStorage.businessSelectHouse)
      // this.houseList = businessSelectHouse.houseCode
      // this.houseId = businessSelectHouse.houseId
      houseList = this.business.msg.ReservedHouseCode ? this.business.msg.ReservedHouseCode.split(',') : []
      houseId = this.business.msg.ReservedHouse ? this.business.msg.ReservedHouse.split(',') : []
      console.log('tag', houseId)
      console.log('houseList', houseList)
      this.codeData.forEach(arr => {
        // if (houseId.indexOf(arr.ID) > -1) {
        //   houseList.splice(houseList.indexOf(arr.ResCode), 1)
        //   houseList.push(arr.ResCode)
        //   houseId.splice(houseList.indexOf(arr.ID), 1)
        //   houseId.push(arr.ID)
        // } else {
        if (houseId.indexOf(arr.ID) < 0) {
          houseList.push(arr.ResCode)
          houseId.push(arr.ID)
        }
      })
      console.log('tag', houseId)
      console.log('houseList', houseList)
      let msg = this.business.msg
      msg.ReservedHouseCode = houseList.join(',')
      msg.ReservedHouse = houseId.join(',')

      let business = {
        hasDetail: this.business.hasDetail,
        detail: this.business.detail,
        msg: msg
      }
      this.$store.commit('updateBusiness', business)
      this.$router.go(-1)
    },
    selectItem (item) {
      let resNo = item.ResNo
      item.ResNo = ''
      if (!item.isSelect) {
        item.isSelect = true
        this.codeData.push(item)
      } else {
        item.isSelect = false
        let _index = 0
        this.codeData.forEach((arr, i) => {
          if (arr.ID === item.ID) {
            _index = i
          }
        })
        // console.log(_index)
        this.codeData.splice(_index, 1)
      }
      item.ResNo = resNo
      // console.log(this.codeData)
      if (this.codeData.length) {
        this.isSelectItem = true
      } else {
        this.isSelectItem = false
      }
    },
    com_color (status) {
      if (status === 'Lease_CanRent') {
        return 'color0'
      } else if (status === 'Lease_Reserve') {
        return 'color1'
      } else if (status === 'Lease_Decide') {
        return 'color2'
      } else if (status === 'Lease_NTray') {
        return 'color3'
      } else if (status === 'Lease_AlrRent') {
        return 'color4'
      } else if (status === 'Lease_Pprocess') {
        return 'color5'
      }
    },
    com_status (status) {
      if (status === 'Lease_CanRent') {
        return '可出租'
      } else if (status === 'Lease_Reserve') {
        return '已保留'
      } else if (status === 'Lease_Decide') {
        return '已预定'
      } else if (status === 'Lease_NTray') {
        return '未放盘'
      } else if (status === 'Lease_AlrRent') {
        return '已出租'
      } else if (status === 'Lease_Pprocess') {
        return '办理中'
      }
    },
    async initPropertyList () {
      let res = await this.$xml('UserCS_GetHouseView', {
        'OrgId': this.locationData.orgData.orgId,
        'BudId': this.locationData.budItem ? this.locationData.budItem.Id : ''
      })
      if (res.status === 200 || res.status === '200') {
        this.propertylist = res.data
        this.propertylist.forEach(ele => {
          ele.DetaList.forEach(eleChild => {
            eleChild.isSelect = false
            eleChild.ID = eleChild.Id
          })
        })
      } else {
        this.$toast(res.msg)
      }
    },
    async getData () {
      // let obj = {
      //   p0: 'UserCS_OpportHouseInfo',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'BudID': this.searchKey ? '' : (this.$route.query.BudID || ''),
      //     'ResCode': this.searchKey,
      //     'page': this.page,
      //     'pageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportHouseInfo', {
        'OrgId': this.locationData.orgData.orgId,
        'BudID': this.searchKey ? '' : (this.$route.query.BudID || ''),
        'ResCode': this.searchKey,
        'page': this.page,
        'pageSize': this.pageSize
      })
      console.log(res)
      // this.$vux.loading.hide()
      this.hasHttp = true
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      this.isLoading = false
      res.data.forEach(arr => {
        arr.isSelect = false
        if (arr.UseArea > 0) {
          arr.UseArea = (arr.UseArea - 0).toFixed(2)
        }
        if (arr.BudArea > 0) {
          arr.BudArea = (arr.BudArea - 0).toFixed(2)
        }
      })
      if (this.page === 1) {
        this.dataList = res.data
        this.codeData = []
        this.isSelectItem = false
      } else {
        this.dataList = this.dataList.concat(res.data)
      }
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    if (localStorage.locationPageType) {
      this.pageType = parseInt(localStorage.locationPageType)
    }
    if (this.pageType) {
      this.initPropertyList()
    } else {
      this.getData()
    }
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
.headTitle{
      position: relative;
      height: .88rem;
      padding: 0 .3rem;
      font-size: .3rem;
      line-height: .88rem;
      color: #1B9BFE;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .orgMsg{
        width: 6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .pageIcon{
        position: absolute;
        top: 0;
        right: .3rem;
        display: block;
        width: .5rem;
        height: .88rem;
        line-height: .88rem;
        font-size: .5rem;
        color: #999;
        text-align: right;
        &.icon-xiangmu1{
          font-size: .44rem;
        }
      }
    }
  .selectSearchHouse{
    .propertycontent{
      position: absolute;
      top: 0;
      bottom: 1.2rem;
      left: 0;
      right: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .area_item_list {
        float: right;
        width: 85%;
        padding: 2px 3px 1px 8px;
      }
      .area_item_list  li{
        float:left;
        width:20%;
        height:40px;
        overflow: hidden;
        padding-right:5px;
        padding-bottom:5px;
      }
      .area_item_list  li.un_sale span{
        background:#E7EBF1;
        color:#CCCCCC;
      }
      .area_item_list  li span {
        border:1px solid #DADADA;
        display:block;
        // background:#EAF2FD;
        color: #fff;
        width:100%;
        height: 30px;
        line-height:30px;
        font-size:10px;
        text-align:center;
        &.color0{
          background: #FD4254;
        }
        &.color1{
          background: #FD8815;
        }
        &.color2{
          background: #3395FF;
        }
        &.color3{
          background: #F3C113;
        }
        &.color4{
          background: #5789FC;
        }
        &.color5{
          background: #AD70F9;
        }
      }
      .none{
        img{
          display: block;
          width: 1.6rem;
          height: 1.5rem;
          margin: 2.5rem auto .5rem;
        }
        .tip{
          font-size: .28rem;
          color: #999;
          line-height: 1.2;
          text-align: center;
        }
      }
      .c-list{
        .c-items{
          border-top: 1px solid #ededed;
          position: relative;
          // margin-bottom: .2rem;
          background: #fff;
          &:last-child{
            margin-bottom: 0;
          }
          // border-bottom: 1px solid #ededed;
          .tip{
            position: absolute;
            top: 0;
            right: .3rem;
            height: .46rem;
            width: 1.15rem;
            font-size: .28rem;
            color: #fff;
            text-align: center;
            line-height: .46rem;
            border-bottom-right-radius: .2rem;
            &.color0{
              background: #FD4254;
            }
            &.color1{
              background: #FD8815;
            }
            &.color2{
              background: #3395FF;
            }
            &.color3{
              background: #F3C113;
            }
            &.color4{
              background: #5789FC;
            }
            &.color5{
              background: #AD70F9;
            }
          }
          .top{
            padding-left: .1rem;
            padding-right: .1rem;
            padding-top: .2rem;
            ._left{
              float: left;
              // height: 2rem;
              position: absolute;
              text-align: center;
              width: 15%;
              top:30%;
              line-height: 100%;
              text-align: center;
              .desc,.name{
                margin-top: .1rem;
                font-size: 14px;
                color: #333;
                line-height: 1.2;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            // ._right{
            //   float: right;
            //   width: 1.9rem;
            //   height: 2rem;
            // }
          }
          .bottom{
            height: .88rem;
            padding: 0 .3rem;
            &.bt{
              border-top: 1px solid #ededed;
            }
            .btns{
              padding: .16rem 0;
              .btn{
                height: .56rem;
                min-width: 1.25rem;
                padding: 0 .2rem;
                line-height: .523rem;
                text-align: center;
                margin-left: .2rem;
                border-radius: 3px;
                font-size: .28rem;
                border-radius: 3px;
              }
            }
            .b_right{
              float: right;
            }
            .orange{
              color: #FB8A2C;
              border: 1px solid #FB8A2C;
            }
            .green{
              color: #3395FF;
              border: 1px solid #3395FF;
            }
            .red{
              color: #F00017;
              font-size: .28rem;
              line-height: .88rem;
              text-align: right;
            }
          }
        }
      }
    }
    .searchBox {
      position: relative;
      top: 0;
      left: 0;
      z-index: 11;
      // height: 1.05rem;
      padding: 0.2rem 0.3rem;
      // background: #fff;
      border-bottom: 1px solid #e9e9e9;
      .searchWrap {
        float: left;
        //width: 6.08rem;
        width: 100%;
        height: 0.68rem;
        background: #fff;
        border-radius: 0.2rem;
        line-height: 0.68rem;
        .icon-sousuo {
          float: left;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: 0.34rem;
          text-align: right;
          color: #999;
        }
        input {
          float: left;
          width: 5.4rem; // 4.4rem;
          height: 0.68rem;
          // line-height: 0.68rem;
          color: #333;
          font-size: 0.28rem;
          &::-webkit-input-placeholder {
            color: #999;
          }
          &::-webkit-search-cancel-button {
            display: none;
          }
        }
        .icon-quxiao1 {
          float: right;
          width: 0.48rem;
          height: 0.68rem;
          margin-right: 0.2rem;
          line-height: 0.68rem;
          font-size: 0.4rem;
          text-align: right;
          color: #999;
        }
      }
      .searachBtn {
        float: left;
        width: 0.68rem;
        height: 0.68rem;
        margin-left: 0.14rem;
        font-size: 0.3rem;
        line-height: 0.68rem;
        text-align: right;
        color: #0091FF;
      }
    }
    .content{
      position: absolute;
      top: 1.08rem;
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      .noBottom{
        bottom: 0;
      }
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
          margin: 3.5rem auto .5rem;
        }
        p{
          height: .4rem;
          line-height: .4rem;
          text-align: center;
          font-size: .3rem;
          color: #4A4A4A;
        }
      }
      .list{
        position: relative;
        padding-left: .3rem;
        background: #fff;
        margin-bottom: .2rem;
        .header{
          position: relative;
          height: .8rem;
          border-bottom: 1px solid #DDDEE3;
          .icon{
            float: left;
            width: .5rem;
            height: .8rem;
            line-height: .8rem;
            font-size: .4rem;
            color: #3395FF;
          }
          .code{
            float: left;
            height: .8rem;
            line-height: .8rem;
            font-size: .32rem;
            color: #333;
            width: 5.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .status{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            height: .8rem;
            line-height: .8rem;
            font-size: .3rem;
            color: #FF804A;
          }
        }
        .msg{
          position: relative;
          padding: .2rem 0;
          .title{
            position: relative;
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              color: #3395FF;
              font-size: .38rem;
            }
            .code{
              float: left;
              height: .6rem;
              line-height: .6rem;
              color: #333;
              font-size: .3rem;
              width: 5rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .use{
              position: absolute;
              top: 0;
              right: .3rem;
              height: .6rem;
              line-height: .6rem;
              color: #333;
              font-size: .3rem;
            }
          }
          .desc{
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              color: #3395FF;
              font-size: .38rem;
            }
            .name{
              float: left;
              height: .6rem;
              line-height: .6rem;
              color: #333;
              font-size: .3rem;
              max-width: 3rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .ml65{
              margin-left: .65rem;
            }
          }
          .area{
            height: .6rem;
            line-height: .6rem;
            font-size: .3rem;
            color: #777E8C;
          }
          .selectIcon{
            position: absolute;
            right: .3rem;
            top: 0;
            z-index: 11;
            width: .5rem;
            height: 2.8rem;
            font-size: .4rem;
            line-height: 2.8rem;
            text-align: right;
            color: #3395FF;
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
        float: left;
        width:46%;
        margin:0 2%;
        font-size: .3rem;
        line-height: .8rem;
        text-align: center;
        color: #fff;
        background:rgba(51,149,255,.5);
        border-radius: .1rem;
        &.deepColor{
          background: #3395FF;
        }
        &.cancelColor{
          border: 1px solid #3395FF;
          background: #fff;
          color: #3395FF;
        }
      }
    }
  }
</style>
