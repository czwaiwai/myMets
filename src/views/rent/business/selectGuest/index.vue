<template>
  <div class="page page_bg">
    <nav-title title="选择客源"></nav-title>
    <div class="page_bd selectGuest">
      <div class="searchBox clearfix">
        <form class="searchWrap clearfix" action="" onsubmit="return false;">
            <i class="iconfont icon-sousuo"></i>
            <input class="search-input" placeholder="请输入名称、电话" type="search" v-model="searchKey" @keydown.13="searchList">
            <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
        </form>
        <span class="searachBtn" v-if="searchKey.length" @click.stop="searchList">搜索</span>
        <span class="searachBtn" v-else @click.stop="$router.go(-1)">取消</span>
      </div>
      <div class="content">
        <load-view ref="list">
          <!-- <div class="none" v-show="dataList.length==0&&hasHttp">
            <img src="../../../styles/images/none.png">
            <p>暂无数据~</p>
          </div> -->
          <none-page title="暂无数据~" v-show="dataList.length==0&&hasHttp"></none-page>
          <ul class="c-list">
            <li class="c-items clearfix" v-for="(item,index) in dataList" :key="index" @click.stop="selectItem(item,index)">
              <p class="title">
                <i class="iconfont icon-renwu icon"></i>
                <span class="tn">{{item.CstName}}</span>
                <span class="tip" :class="item.CstLevel==='VIP'?'orange':'blue'" v-show="item.CstLevel">{{item.CstLevelCH}}</span>
              </p>
              <p class="desc clearfix">
                <a class="phone clearfix" :href="'tel:'+item.FirstPhone" @click.stop="" v-if="item.FirstPhone">
                  <i class="iconfont icon-dianhua icon"></i>
                  <span>{{item.FirstPhone}}</span>
                </a>
                <span v-else>
                  <i class="iconfont icon-dianhua icon"></i>
                  <span>暂无</span>
                </span>
              </p>
              <p class="name">
                <i class="iconfont icon-shijian icon"></i>
                <span>{{com_status(item)||'暂无'}}</span>
              </p>
              <i class="iconfont icon-xuanze selectIcon" v-show="item.isSelect"></i>
            </li>
          </ul>
          <div class="load-tip" v-show="showLoadTip">加载中···</div>
        </load-view>
      </div>
      <div class="footer" v-show="dataList.length">
        <div class="btn" :class="{'deepColor':isSelectItem}" @click.stop="toFinish">确 定</div>
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
  name: 'selectGuest',
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
      selectData: {}
    }
  },
  computed: {
    ...mapGetters({
      business: 'getBusiness'
    })
  },
  methods: {
    searchList () {
      this.page = 1
      this.$el.querySelector('.search-input').blur()
      if (this.$refs.list) {
        this.$refs.list.setTop(1)
      }
      this.getData()
    },
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
    },
    toFinish () {
      console.log(this.selectData)
      let selectData = {
        CstName: this.selectData.CstName,
        Sex: this.selectData.PerSex,
        CstType: this.selectData.CstType,
        ContactManner: this.selectData.FirstPhone,
        CstLevel: this.selectData.CstLevel,
        CstLevelName: this.selectData.CstLevelCH,
        LinkMan: this.selectData.LinkMan,
        CstID: this.selectData.Id
      }
      console.log(selectData)
      let business = {
        hasDetail: true,
        detail: this.business.detail,
        msg: {...this.business.msg, ...selectData}
      }
      this.$store.commit('updateBusiness', business)
      this.$router.go(-1)
    },
    selectItem (item, index) {
      this.isSelectItem = true
      this.selectData = item
      if (!item.isSelect) {
        this.dataList.forEach(arr => {
          arr.isSelect = false
        })
        item.isSelect = true
      }
    },
    com_status (item) {
      if (item.NextFollowTime) {
        let date = item.NextFollowTime.split(' ')[0].replace(/\//g, '.')
        return '最近 ' + date + ' 跟进'
      } else {
        return ''
      }
    },
    async getData () {
      // let obj = {
      //   p0: 'UserCS_CustomerSearch',
      //   p7: {
      //     'OrgId': this.locationData.orgData.orgId,
      //     'EmployeeID': this.locationData.employeeData.employeeId,
      //     'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
      //     'CstName': this.searchKey,
      //     'BusinessName': 'AllCst',
      //     'Page': this.page,
      //     'PageSize': this.pageSize
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_CustomerSearch', {
        'OrgId': this.locationData.orgData.orgId,
        'EmployeeID': this.locationData.employeeData.employeeId,
        'EmployeeJobID': this.locationData.employeeData.employeeJobId, // '11091316310300010000',
        'CstName': this.searchKey,
        'BusinessName': 'AllCst',
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
        arr.isSelect = false
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
  .selectGuest{
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
        width: 6.08rem;
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
          width: 4.4rem;
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
          font-size: .3rem;
          color: #4A4A4A;
          line-height: .4rem;
          text-align: center;
        }
      }
      .c-list{
        padding-left: .3rem;
        background: #fff;
        .c-items{
          position: relative;
          padding: .2rem .3rem .2rem 0;
          border-bottom: 1px solid #ededed;
          .selectIcon{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            width: .5rem;
            height: 2.2rem;
            line-height: 2.2rem;
            text-align: center;
            font-size: .4rem;
            color: #3395FF;
          }
          .title{
            position: relative;
            float: left;
            width: 6.9rem;
            height: .6rem;
            font-size: .34rem;
            color: #333;
            line-height: .6rem;
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              text-align: left;
              font-size: .38rem;
              color: #3395FF;
            }
            .tn{
              float: left;
              max-width: 4.8rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .tip{
              float: left;
              height: .4rem;
              margin-top: .1rem;
              margin-left: .1rem;
              padding: 0 3px;
              line-height: .38rem;
              display: block;
              font-size: .24rem;
              border-radius: 3px;
              &.orange{
                color: #FF7B33;
                border: 1px solid #FF7B33;
              }
              &.blue{
                color: #3395FF;
                border: 1px solid #3395FF;
              }
            }
          }
          .desc{
            float: left;
            height: .6rem;
            width: 6.9rem;
            font-size: .28rem;
            color: #999;
            line-height: .6rem;
            .phone{
              float: left;
            }
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              text-align: left;
              font-size: .34rem;
              color: #FF804A;
            }
            span{
              float: left;
            }
          }
          .name{
            float: left;
            height: .6rem;
            width: 6.9rem;
            font-size: .28rem;
            color: #999;
            line-height: .6rem;
            .icon{
              float: left;
              width: .5rem;
              height: .6rem;
              line-height: .6rem;
              text-align: left;
              font-size: .34rem;
              color: #FF804A;
            }
            span{
              float: left;
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
