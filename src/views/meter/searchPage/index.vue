<template>
  <div class="page">
    <nav-title title="搜索仪表"></nav-title>
    <div class="searchBox clearfix">
      <form class="searchWrap clearfix" action="" onsubmit="return false;">
          <i class="iconfont icon-saoyisao" @click.stop="callCamera"></i>
          <input class="search-input" placeholder="扫码或输入表号" type="search" v-model="searchKey" @keydown.13="search">
          <i class="iconfont icon-input_clear" v-show="searchKey.length" @click.stop="clearKey"></i>
      </form>
      <span class="searachBtn" v-if="searchKey.length" @click.stop="search">搜索</span>
      <span class="searachBtn" v-else @click.stop="$router.go(-1)">取消</span>
    </div>
    <div class="page_bd searchPage">
      <div class="list-wrap">
        <Myref ref="searchList">
          <ul class="list" v-show="dataList.length&&hasFetch">
            <li class="item" v-for="(item,index) in dataList" :key="index">
              <div class="item1 clearfix">
                <span class="left">{{item.ImaCode}}</span>
                <span class="right" v-show="item.contentType==1">{{item.TMRD}}</span>
              </div>
              <div class="item2 clearfix">
                <span class="left">资源：{{item.ResCode}}</span>
                <span class="right">{{item.contentType==0?'请输入本次读数':'本次读数'}}</span>
              </div>
              <div class="item3 clearfix">
                <span class="left">上次读数：{{item.LMR}}</span>
                <input
                  type="text"
                  class="right"
                  v-model="item.TMR"
                  :placeholder="item.LMR"
                  :class="{'grade':item.Lock==='True'}"
                  @input="inputSetVal(item,index)"
                  @blur="inputBlur(item,index)"
                  @focus="inputFocus(item, index)"
                  :disabled="item.Lock==='True'?'disabled':false"
                  :readonly="item.Lock==='True'?'disabled':false"
                />
              </div>
              <div class="item4 clearfix">
                <span class="left">上次用量：{{item.LCIAmount}}</span>
                <span class="right" :class="pointColorClass(item, index)">本次用量：{{item.CIAmount||''}}</span>
              </div>
            </li>
          </ul>
          <p class="loadTip" v-show="showLoadTip">加载中···</p>
        </Myref>
      </div>
      <div class="list-none" v-if="!dataList.length&&hasFetch">
        <p class="tip">暂无满足条件的仪表~</p>
      </div>
    </div>
    <div class="submit" @click.stop="submitList" :class="{'hasCheck':hasCheck}" v-if="dataList.length">提交</div>
    <dialog-confire
      :title="dialogData.title"
      :leftName="dialogData.leftName"
      :rightName="dialogData.rightName"
      ref="dialog"
      @clickMark="clickMark"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
      @clickOneBtn="clickOneBtn"
      :oneBtn="dialogData.type===2"
    ></dialog-confire>
  </div>
</template>
<script>
/* eslint-disable */
import Myref from '@/components/ref/ref.vue'
import navTitle from '@/components/navTitle'
import dialogConfire from '@/components/dialogConfire.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'serachPage',
  components: {Myref, dialogConfire, navTitle},
  data () {
    return {
      dataList: [],
      dialogData: {
        type: 0,
        title: '',
        leftName: '',
        rightName: ''
      },
      searchKey: '',
      listType: 1,
      hasFetch: false,
      showLoadTip: false,
      isLoading: false,
      hasCheck: false,
      page: 1,
      pageSize: 20
    }
  },
  computed: {
    ...mapGetters({
      locationData: 'getMeterLocation',
      dateTimes: 'getMeterDateTime',
      userData: 'user'
    })
  },
  methods: {
    initData () {
      this.dataList = []
      this.dialogData = {
        type: 0,
        title: '',
        leftName: '',
        rightName: ''
      }
      this.searchKey = ''
      this.listType = 1
      this.hasFetch = false
      this.showLoadTip = false
      this.isLoading = false
      this.hasCheck = false
      this.page = 1
    },
    // 调用相机扫码
    callCamera () {
      this.$app.scan().then((res) => {
        console.log(res)
        this.searchKey = res
        this.search()
      }).catch(err => {
        console.log(err)
      })
      // if (window.callData) {
      //   window.callData.Native_Js_ScanPayment('scanResult')
      // } else if (window.webkit) {
      //   window.webkit.messageHandlers.Native_Js_ScanPayment.postMessage('scanResult')
      // }
      // this.callBackCamera()
    },

    // 扫码返回结果
    // callBackCamera () {
    //   window.scanResult = (scanResult) => {
    //     this.searchKey = scanResult
    //     this.search()
    //   }
    // },
    search () {
      this.hasCheck = false
      this.showLoadTip = false
      this.$refs.searchList.setTop(1)
      this.hasFetch = false
      this.dataList = []
      this.page = 1
      this.getSearchData()
      this.$el.querySelector('.search-input').blur()
    },
    async getSearchData () {
      let data = {
        'ProjectId': this.userData.OrgID,// this.locationData.orgData.orgId,
        'ImaCode': this.searchKey,
        'DataOfRead': this.$route.query.quick ? '' : this.dateTimes.thisTime,
        'BudID': '', // this.locationData.budItem.Id,
        'Page': this.page,
        'PageSize': this.pageSize
      }
      let res = await this.$xml('UserApp_GetImaReadSearch', data)
      console.log('UserCS_GetGrpInfo:', res)
      if (res.data.List.length) {
        res.data.List.forEach(arr => {
          if ((arr.TMR - 0) === 0) {
            arr.TMR = ''
            arr.contentType = 0
          } else {
            arr.contentType = 1
          }
          arr.TMRD = arr.TMRD.replace(/\//g, '-')
          arr.isCheck = false
        })
      }
      if (this.page === 1) {
        this.dataList = res.data.List
      } else {
        if (res.data.List.length) {
          this.dataList = this.dataList.concat(res.data.List)
        }
      }
      if (res.data.List.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      this.isLoading = false
      this.hasFetch = true
    },
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
    },
    submitList () {
      if (!this.hasCheck) {
        return
      }
      let objList = {
        ImaReadList: []
      }
      let list = []
      this.dataList.forEach(arr => {
        if (arr.isCheck) {
          let obj = {
            ImaReadId: arr.ImaReadId,
            TMR: arr.TMR,
            LMR: arr.LMR
          }
          list.push(obj)
          objList.ImaReadList.push(obj)
        }
      })
      let params = {
        projectId: this.locationData.orgData.orgId,
        accountDate: this.dateTimes.thisTime,
        imaReadList: objList
      }
      this.dialogData = {
        type: 1,
        title: '确认将' + list.length + '条数据提交至后台，若仪表当前月份已经录入度数，则会覆盖原度数。',
        leftName: '取消',
        rightName: '确认',
        data: params
      }
      this.$refs.dialog.show()
    },
    async submit (params) {
      console.log(params)
      let res = await this.$xml('Ima_SumbitImaReadInfo', {}, {p1: params.projectId, p2: params.accountDate, p7: JSON.stringify(params.imaReadList)})
      console.log(res)
      this.dialogData = {
        type: 2,
        title: res.data[0].info
      }
      this.$refs.dialog.show()
    },
    pointColorClass (item, index) {
      if ((item.CIAmount - 0) === 0 && item.TMR === '') {
        return ''
      }
      // if ((item.CIAmount - 0) < (item.LMR - 0)) {
      //   return ''
      // }
      if (item.dtMethods - 0 !== 0) {
        if (item.dtMin - 0 !== 0 || item.dtMax - 0 !== 0) {
          if (item.dtMethods - 0 === 1) {
            if (item.CIAmount - 0 < (item.dtMin - 0) * (item.LCIAmount - 0) / 100 || (item.CIAmount - 0) > (item.dtMax - 0) * (item.LCIAmount - 0) / 100) {
              return 'red'
            }
          } else if (item.dtMethods - 0 === 2) {
            if ((item.CIAmount - 0) > (item.dtMax - 0) || (item.CIAmount - 0) < (item.dtMin - 0)) {
              return 'red'
            }
          }
        }
      }
      return 'green'
    },
    inputBlur (item, index) {
      if (item.TMR === '') {
        item.CIAmount = '0.00'
        item.isCheck = false
        this.setHasCheck()
        return
      }
      if (item.AEMode === 'CalModeHand') {
        return
      }
      item.TMR = (item.TMR - 0).toFixed(2)
      // if (item.TMR - 0 > 0) {
      //   item.TMR = (item.TMR - 0).toFixed(2)
      // } else {
      //   item.TMR = ''
      // }
      if (item.TMR - 0 < item.LMR - 0) {
        this.dialogData = {
          type: 0,
          title: '当前录入读数小于上月读数，是否进行转表？',
          leftName: '转表',
          rightName: '取消',
          data: item
        }
        this.$refs.dialog.show()
      }
    },
    inputFocus (item, index) {
    },
    inputSetVal (item, index) {
      item.isCheck = true
      // this.hasCheck = true
      let num = item.TMR
      if (num.substr(0, 1) === '.') {
        num = ''
      }
      num = num.replace(/^0*(0\.|[1-9])/, '$1')
      num = num.replace(/[^\d.]/g, '')
      num = num.replace(/\.{2,}/g, '.')
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (num.indexOf('.') < 0 && num !== '') {
        if (num.substr(0, 1) === '0' && num.length === 2) {
          num = num.substr(1, num.length)
        }
      }
      if (num - 0 > item.ImaBaseID - 0) {
        num = item.ImaBaseID
      }
      item.TMR = num
      // console.log('num:', num)
      if (item.TMR === '') {
        item.isCheck = false
      }
      if (item.AEMode === 'CalModeAuto') {
        if (item.TMR - 0 > item.LMR - 0) {
          item.CIAmount = ((item.TMR - 0) - (item.LMR - 0)).toFixed(2)
        } else {
          item.CIAmount = '0.00'
        }
      } else if (item.AEMode === 'CalModeHand'){
        item.CIAmount = (item.TMR - 0).toFixed(2)
      }
      this.setHasCheck()
    },
    setHasCheck () {
      let flag = false
      this.dataList.forEach(arr => {
        if (arr.isCheck) {
          flag = true
        }
      })
      if (flag) {
        this.hasCheck = true
      } else {
        this.hasCheck = false
      }
    },
    // 点击弹窗蒙版
    clickMark () {
      if (this.dialogData.type === 0) {
        this.dialogData.data.TMR = ''
        this.dialogData.data.CIAmount = '0.00'
        this.dialogData.data.isCheck = false
        this.setHasCheck()
      } else if (this.dialogData.type === 2) {
        this.search()
      }
    },
    // 点击弹窗左边按钮
    clickLeftBtn () {
      if (this.dialogData.type === 0) {
        if (this.dialogData.data.ResetLargestRead === 'False') {
          this.dialogData.data.CIAmount = ((this.dialogData.data.ImaBaseID - 0) + (this.dialogData.data.TMR - 0) - (this.dialogData.data.LMR - 0) + 1).toFixed(2)
        } else {
          this.dialogData.data.CIAmount = ((this.dialogData.data.ImaBaseID - 0) + (this.dialogData.data.TMR - 0) - (this.dialogData.data.LMR - 0)).toFixed(2)
        }
      }
      this.$refs.dialog.hide()
    },
    // 点击弹窗右边按钮
    clickRightBtn () {
      if (this.dialogData.type === 0) {
        this.dialogData.data.TMR = ''
        this.dialogData.data.CIAmount = '0.00'
        this.dialogData.data.isCheck = false
        this.setHasCheck()
      } else if (this.dialogData.type === 1) {
        this.submit(this.dialogData.data)
      }
      this.$refs.dialog.hide()
    },
    // 点击弹窗一个按钮
    clickOneBtn () {
      this.search()
      this.$refs.dialog.hide()
    }
  },
  created () {
    if (this.$route.query.quick) {
      this.searchKey = this.$route.query.key
      this.getSearchData()
    }
  },
  mounted () {
    let _this = this
    // 上拉禁止
    this.$refs.searchList.items.ref = function () {
      _this.$refs.searchList.succ()
    }
    // 上拉加载更多
    this.$refs.searchList.IsLast(50, (direction, scrollTop, h) => {
      // console.log(h)
      if (h) {
        if (!this.isLoading && this.showLoadTip) {
          this.isLoading = true
          this.page++
          this.getSearchData()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .searchBox {
    position: relative;
    top: 0;
    left: 0;
    z-index: 9;
    // height: 1.05rem;
    padding: 0.2rem 0.3rem;
    background: #fff;
    border-bottom: 1px solid #e9e9e9;
    .searchWrap {
      float: left;
      width: 6.08rem;
      height: 0.68rem;
      background: #EFEFEF;
      border-radius: 0.1rem;
      line-height: 0.68rem;
      .icon-saoyisao {
        float: left;
        width: 0.68rem;
        height: 0.68rem;
        padding: 0 .1rem;
        line-height: 0.68rem;
        font-size: 0.5rem;
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
      .icon-input_clear {
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
      color: #3395FF;
    }
  }
  .searchPage{
    .list-wrap{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      -webkit-overflow-scrolling: touch;
      .loadTip{
        height: .8rem;
        width: 100%;
        background: #fff;
        font-size: .3rem;
        color: #999;
        text-align: center;
        line-height: .8rem;
      }
      .list{
        padding: .1rem .3rem 0;
        background: #fff;
        .item{
          padding: .1rem 0;
          border-bottom: 1px solid #e9e9e9;
          .item1{
            .left{
              float: left;
              height: .6rem;
              max-width: 3.5rem;
              color: #333;
              line-height: .6rem;
              font-size: .3rem;
            }
            .right{
              float: right;
              height: .6rem;
              max-width: 3.5rem;
              color: #999;
              line-height: .6rem;
              font-size: .28rem;
            }
          }
          .item2{
            .left{
              float: left;
              height: .6rem;
              max-width: 3.5rem;
              color: #999;
              line-height: .6rem;
              font-size: .28rem;
            }
            .right{
              float: right;
              height: .6rem;
              max-width: 3.5rem;
              color: #999;
              line-height: .6rem;
              font-size: .28rem;
            }
          }
          .item3{
            .left{
              float: left;
              height: .64rem;
              max-width: 3.5rem;
              color: #999;
              line-height: .64rem;
              font-size: .28rem;
            }
            .right{
              float: right;
              height: .64rem;
              width: 2.6rem;
              padding: 0 .1rem;
              color: #333;
              line-height: .64rem;
              font-size: .3rem;
              text-align: right;
              border: 1px solid #DEDEDE;
              &::-webkit-input-placeholder{
                color: #999;
              }
              &.grade{
                background: #EFEFEF;
              }
            }
          }
          .item4{
            .left{
              float: left;
              height: .6rem;
              max-width: 3.5rem;
              color: #999;
              line-height: .6rem;
              font-size: .28rem;
            }
            .right{
              position: relative;
              float: right;
              height: .6rem;
              max-width: 3.5rem;
              color: #999;
              line-height: .6rem;
              font-size: .28rem;
              &.red{
                &::before{
                  position: absolute;
                  left: -.3rem;
                  top: 50%;
                  margin-top: -5px;
                  display: block;
                  width: 8px;
                  height: 8px;
                  border-radius: 4px;
                  content: '';
                  background: #E40101;
                }
              }
              &.green{
                &::before{
                  position: absolute;
                  left: -.3rem;
                  top: 50%;
                  margin-top: -5px;
                  display: block;
                  width: 8px;
                  height: 8px;
                  border-radius: 4px;
                  content: '';
                  background: #3395FF;
                }
              }
            }
          }
        }
      }
    }
    .list-none{
      margin-top: 50vw;
      text-align: center;
      font-size: .3rem;
      color: #999;
      line-height: 1.5;
    }
    
  }
  .submit{
    width: 100vw;
    height: .8rem;
    background: #99caff;
    font-size: .3rem;
    line-height: .8rem;
    text-align: center;
    color: #fff;
    &.hasCheck{
      background: #3395FF;
    }
  }
</style>

