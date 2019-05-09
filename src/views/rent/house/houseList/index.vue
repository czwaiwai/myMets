<template>
  <div class="page page_bg">
    <nav-title title="租赁房源"></nav-title>
    <div class="page_bd houseList">
      <div class="header">
        <p class="orgMsg" @click.stop="toSelectLocation">{{locationData.orgData.orgName}}<span v-if="locationData.grpItem">>{{locationData.grpItem.GrpName}}>{{locationData.budItem.BudName}}</span></p>
        <i class="iconfont pageIcon" :class="pageStatus.pageType===1?'icon-loupan1':(pageStatus.pageType===0?'icon-xiangmu':'icon-xiangmu1')" @click.stop="tabChange"></i>
      </div>
      <transition name="gridsc">
      <div class="grids-content clearfix" v-show="pageStatus.pageType===0">
        <div class="items" @click.stop="changeList(0)">
          <i class="iconfont icon-loupan icon"></i>
          <p class="nums color1">{{gridsData.Total}}</p>
          <p class="name">全部</p>
        </div>
        <div class="items" @click.stop="changeList(2)">
          <i class="iconfont icon-fangyuan icon"></i>
          <p class="nums color2">{{gridsData.CanRent}}</p>
          <p class="name">可出租</p>
        </div>
        <div class="items" @click.stop="changeList(1)">
          <i class="iconfont icon-fangpan icon"></i>
          <p class="nums color3">{{gridsData.NTray}}</p>
          <p class="name">未放盘</p>
        </div>
        <div class="items" @click.stop="changeList(4)">
          <i class="iconfont icon-yunayiliuzhu icon"></i>
          <p class="nums color4">{{gridsData.Reserve}}</p>
          <p class="name">已保留</p>
        </div>
        <div class="items" @click.stop="changeList(3)">
          <i class="iconfont icon-banli3 icon"></i>
          <p class="nums color5">{{gridsData.Pprocess}}</p>
          <p class="name">办理中</p>
        </div>
        <div class="items" @click.stop="changeList(5)">
          <i class="iconfont icon-yuding icon"></i>
          <p class="nums color6">{{gridsData.Decide}}</p>
          <p class="name">已预定</p>
        </div>
        <div class="item" @click.stop="changeList(6)">
          <p class="name">已出租</p>
          <p class="nums">{{gridsData.AlrRent}}</p>
          <i class="iconfont icon-chuzufangyuan icon"></i>
        </div>
      </div>
      </transition>
      <transition name="listc">
      <div class="list-content" v-show="pageStatus.pageType===1">
        <div class="searchBox clearfix">
          <div class="header-wrap clearfix">
            <div class="search clearfix" @click.stop="toSearchHouse">
              <i class="iconfont icon-sousuo"></i>
              <span>请输入资源编码</span>
            </div>
          </div>
          <i class="iconfont icon-shaixuan" @click.stop="showFilterBox"></i>
        </div>
        <div class="list-wrap">
          <ul class="listType" ref="listType">
            <li class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in listType" :key="index" @click.stop="selectType(item,index)">{{item.name}}</li>
          </ul>
        </div>
        <div class="content">
          <load-view ref="list">
            <!-- <div class="none" v-show="dataList.length==0">
              <img src="../../../styles/images/none.png">
              <p class="tip">无数据~</p>
            </div> -->
            <none-page title="无数据~" v-show="dataList.length==0"></none-page>
            <ul class="c-list" v-show="dataList.length">
              <li class="c-items" v-for="(item,index) in dataList" :key="index" @click.stop="toHouseDetail(item,index)" v-show="(pageStatus.listTypeNum==1&&item.RentStatus=='Lease_NTray')||(pageStatus.listTypeNum==2&&item.RentStatus=='Lease_CanRent')||(pageStatus.listTypeNum!=1&&pageStatus.listTypeNum!=2)">
                <div class="tip" :class="com_color(item.RentStatus)">{{com_tipName(item.RentStatus)}}</div>
                <div class="top clearfix">
                  <div class="_left">
                    <p class="title">{{item.ResCode}}</p>
                    <p class="desc"><span v-if="item.RentalArea">{{com_point(item.RentalArea)}}㎡/</span><span v-show="item.FloorNum">{{item.FloorNum}}层/</span><span v-show="item.ResType">{{item.ResType}}</span></p>
                    <p class="name">{{item.GrpName}}{{item.BudName}}<span v-show="item.UnitNO">{{item.UnitNO}}单元</span><span v-show="item.ResNO">{{item.ResNO}}号</span></p>
                  </div>
                  <!-- <div class="_right"></div> -->
                </div>
                <div class="bottom bt" v-show="item.RentStatus!='Lease_Pprocess'">
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_CanRent'">
                    <div class="btn b_right green" @click.stop="toSaveRes(item,1)">预定</div>
                    <div class="btn b_right green" @click.stop="toSaveRes(item,0)">保留</div>
                    <div class="btn b_right orange" @click.stop="cancelMsg(item)">取消放盘</div>
                  </div>
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_Reserve'">
                    <div class="btn b_right green" @click.stop="toClearRes(item,0)">取消保留</div>
                  </div>
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_Decide'">
                    <div class="btn b_right green" @click.stop="toClearRes(item,1)">取消预定</div>
                  </div>
                  <div class="btns clearfix" v-show="item.RentStatus=='Lease_NTray'">
                    <div class="btn b_right green" @click.stop="confireMsg(item)">放盘</div>
                  </div>
                  <div class="times bt red" v-show="item.RentStatus=='Lease_AlrRent'">{{com_Date(item.ExpireTime)}} 到期</div>
                </div>
              </li>
            </ul>
            <div class="load-tip" v-show="showLoadTip">加载中···</div>
          </load-view>
        </div>
      </div>
      </transition>
      <transition name="housepropertylist">
        <div class="propertycontent" v-show="pageStatus.pageType===2">
            <none-page title="无数据~" v-show="propertylist.length==0"></none-page>
            <ul class="c-list" v-show="propertylist.length">
              <li class="c-items" v-for="(item,index) in propertylist" :key="index">

                <div class="top clearfix">
                  <div class="_left">
                    <p class="desc">{{item.FloorNum}}层</p>
                  </div>
                  <ul class="area_item_list clearfix">
                    <li v-for="(houseItem,index) in item.DetaList" :key="index"><span @click="toHouseDetail(houseItem,index)" :class="com_color(houseItem.RentStatus)">{{houseItem.ResNo}}</span></li>
                    <!-- <li><span @click="$router.push('/houseDetail')">102</span></li>
                    <li><span @click="$router.push('/houseDetail')">103</span></li>
                    <li><span @click="$router.push('/houseDetail')">104</span></li>
                    <li><span @click="$router.push('/houseDetail')">105</span></li>
                    <li><span @click="$router.push('/houseDetail')">106</span></li>
                    <li><span>107</span></li> -->
                  </ul>
                </div>
              </li>
            </ul>
        </div>
      </transition>
    </div>
    <transition name="filerType">
      <div class="filerType" v-show="showFilter">
        <div class="mark" @click.stop="showFilter=!showFilter"></div>
        <div class="f-content clearfix">
          <div class="btns">
            <div class="btn" :class="{'isSelect':item.isSelect}" v-for="(item,index) in filerType.data" :key="index" @click.stop="selectFilterType(item)">{{item.name}}</div>
          </div>
          <div class="inputs">
            <div class="floors" v-show="filerType.type==0">
              <input type="text" class="inputFloors" v-model="filerType.floors" placeholder="请输入楼层">
            </div>
            <div class="area clearfix" v-show="filerType.type==1">
              <input type="text" class="inputAreaStart" @input="inputSetVal('areaStart')" v-model="filerType.areaStart" placeholder="请输入">
              <p>至</p>
              <input type="text" class="inputAreaEnd" @input="inputSetVal('areaEnd')" v-model="filerType.areaEnd" placeholder="请输入">
            </div>
          </div>
          <div class="footer">
            <div class="reset" @click.stop="resetFilter">重置</div>
            <div class="sure" @click.stop="confireFilter">确定</div>
          </div>
        </div>
      </div>
    </transition>
    <dialog-confire
      :title="dialogData.title"
      ref="dialog"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
    ></dialog-confire>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import loadView from '@/components/ref/ref.vue'
import dialogConfire from '@/components/dialogConfire.vue'
import comPoint from '@/mixins/comPoint'
import changeDate from '@/mixins/changeDate/index.js'
import navTitle from '@/components/navTitle'
import nonePage from '@/views/meeting/components/nonePage/index.vue'
export default {
  name: 'houseList',
  mixins: [comPoint, changeDate],
  components: {navTitle, loadView, dialogConfire, nonePage},
  data () {
    return {
      gridsData: {},
      locationData: {},
      listType: [
        {name: '全部', type: 0, isSelect: false},
        {name: '未放盘', type: 1, isSelect: false},
        {name: '可出租', type: 2, isSelect: false},
        {name: '办理中', type: 3, isSelect: false},
        {name: '已保留', type: 4, isSelect: false},
        {name: '已预定', type: 5, isSelect: false},
        {name: '已出租', type: 6, isSelect: false}
      ],
      dataList: [],
      propertylist: {},
      searchKey: '',
      showFilter: false,
      floors: '',
      areaStart: '',
      areaEnd: '',
      filerType: {
        type: 0,
        floors: '',
        areaStart: '',
        areaEnd: '',
        data: [
          {name: '楼层', type: 0, isSelect: true},
          {name: '出租面积', type: 1, isSelect: false}
        ]
      },
      dialogData: {
        type: 0,
        title: '',
        data: {}
      },
      page: 1,
      pageSize: 20,
      showLoadTip: false,
      isLoading: true,
      typeFlag: ''
    }
  },
  computed: {
    ...mapGetters({
      pageStatus: 'getPageStatus'
    })
  },
  methods: {
    toSearchHouse () {
      this.$store.commit('updateRentSearchKey', {key: ''})
      this.$router.push(`/searchHouse`)
    },
    showFilterBox () {
      this.showFilter = true
      // this.$nextTick(() => {
      //   if (this.filerType.type) {
      //     this.$el.querySelector('.inputAreaStart').focus()
      //   } else {
      //     this.$el.querySelector('.inputFloors').focus()
      //   }
      // })
    },
    /*eslint-disable*/
    inputSetVal (itemName) {
      let num = this.filerType[itemName]
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
      this.filerType[itemName] = num
    },
    // 选择类型
    selectFilterType (item) {
      if (item.isSelect) {
        return
      }
      this.filerType.data.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.filerType.type = item.type
      this.$nextTick(() => {
        if (this.filerType.type) {
          this.$el.querySelector('.inputAreaStart').focus()
        } else {
          this.$el.querySelector('.inputFloors').focus()
        }
      })
    },
    // 重置筛选
    resetFilter () {
      this.filerType.floors = ''
      this.filerType.areaStart = ''
      this.filerType.areaEnd = ''
    },
    // 筛选确定
    confireFilter () {
      this.showFilter = false
      this.init()
    },
    // 到选择地址
    toSelectLocation () {
      this.$router.push(`/selectLocation`)
    },
    tabChange () {
      
      switch (this.pageStatus.pageType){
        case 0:
          this.$store.commit('updatePageStatus', {pageType: 1, listType: this.pageStatus.listType, listTypeNum: this.pageStatus.listTypeNum})
          this.init()
          break;
        case 1:
          this.$store.commit('updatePageStatus', {pageType: 2, listType: this.pageStatus.listType, listTypeNum: this.pageStatus.listTypeNum})
          if (!this.locationData.grpItem){
            this.toSelectLocation()
          }
          else{
            this.initPropertyList()
          }
          break;
        case 2:
          this.$store.commit('updatePageStatus', {pageType: 0, listType: this.pageStatus.listType, listTypeNum: this.pageStatus.listTypeNum})
          this.getGridsData()
          break;
      }
      // if (this.pageStatus.pageType) {
      //   this.$store.commit('updatePageStatus', {pageType: 0, listType: this.pageStatus.listType, listTypeNum: this.pageStatus.listTypeNum})
      //   this.getGridsData()
      // } else {
      //   this.$store.commit('updatePageStatus', {pageType: 1, listType: this.pageStatus.listType, listTypeNum: this.pageStatus.listTypeNum})
      //   this.init()
      // }
    },
    // 点击图形项
    async changeList (type) {
      this.listType.forEach(arr => {
        if (arr.type === type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.searchKey = ''
      await this.com_type(type)
      this.$store.commit('updatePageStatus', {pageType: 1, listType: this.typeFlag, listTypeNum: type})
      this.$nextTick(() => {
        if (type > 3) {
          this.$refs.listType.scrollLeft = 200
        } else {
          this.$refs.listType.scrollLeft = 1
        }
        this.init()
      })
    },
    init () {
      this.typeFlag = this.pageStatus.listType
      this.listType.forEach(arr => {
        if (this.pageStatus.listTypeNum === arr.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      if (this.$refs.list) {
        this.$refs.list.setTop(1)
      }
      this.page = 1
      this.showLoadTip = false
      this.isLoading = true
      this.getListData()
      this.$nextTick(() => {
        if (this.pageStatus.listTypeNum > 3) {
          this.$refs.listType.scrollLeft = 200
        } else {
          this.$refs.listType.scrollLeft = 1
        }
      })
    },
    async initPropertyList(){
      let res = await this.$xml('UserCS_GetHouseView', {
        'OrgId': this.locationData.orgData.orgId,
        'BudId': this.locationData.budItem ? this.locationData.budItem.Id : ''
      })
      console.log(res)
      // this.$vux.loading.hide()
      if (res.status === 200 || res.status === '200') {
        this.propertylist = res.data
      } else {
        this.$toast(res.msg)
      }

    },
    com_type (type) {
      if (type === 0) {
        this.typeFlag = ''
      } else if (type === 1) {
        this.typeFlag = 'Lease_NTray'
      } else if (type === 2) {
        this.typeFlag = 'Lease_CanRent'
      } else if (type === 3) {
        this.typeFlag = 'Lease_Pprocess'
      } else if (type === 4) {
        this.typeFlag = 'Lease_Reserve'
      } else if (type === 5) {
        this.typeFlag = 'Lease_Decide'
      } else if (type === 6) {
        this.typeFlag = 'Lease_AlrRent'
      }
      return ''
    },
    search () {
      this.init()
      this.$el.querySelector('.search-input').blur()
    },
    clearKey () {
      this.searchKey = ''
      this.$el.querySelector('.search-input').focus()
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
    com_tipName (status) {
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
    // 选择列表类型
    selectType: async function (item, index) {
      this.listType.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.searchKey = ''
      await this.com_type(item.type)
      this.$store.commit('updatePageStatus', {pageType: 1, listType: this.typeFlag, listTypeNum: item.type})
      this.init()
    },
    // 跳详情
    toHouseDetail (item, index) {
      this.$router.push(`/houseDetail/${item.Id}`)
    },
    // 保留或预定
    toSaveRes (item, type) {
      this.$store.commit('updateHouseDetail', item)
      this.$router.push({
        name: 'saveRes',
        params: {
          id: item.Id
        },
        query: {
          type: type
        }
      })
    },
    // 取消保留或预定
    toClearRes (item, type) {
      this.$store.commit('updateHouseDetail', item)
      this.$router.push({
        name: 'clearRes',
        params: {
          id: item.Id
        },
        query: {
          type: type
        }
      })
    },
    // 取消放盘
    cancelMsg (item) {
      this.dialogData = {
        type: 0,
        title: '确认取消放盘？取消后该资源将变为未放盘状态。',
        data: item
      }
      this.$refs.dialog.show()
    },
    // 放盘
    confireMsg (item) {
      this.dialogData = {
        type: 1,
        title: '确认将该资源放盘？放盘后该资源将变为可出租状态。',
        data: item
      }
      this.$refs.dialog.show()
    },
    async submitMsg () {
      let res = await this.$xml('UserAppHouse_UpdateHouseStatus', {
        'HouseID': this.dialogData.data.Id,
        'StatusKey': this.dialogData.type === 0 ? '-3' : '3',
        'Stime': '',
        'Etime': '',
        'Memo': '',
        'EmployeeID': this.locationData.employeeData.employeeId
      })
      console.log('res', res)
      this.$toast(res.msg || '')
      if (res.status === 200 || res.status === '200') {
        if (this.dialogData.data.RentStatus === 'Lease_NTray') {
          this.dialogData.data.RentStatus = 'Lease_CanRent'
        } else if (this.dialogData.data.RentStatus === 'Lease_CanRent') {
          this.dialogData.data.RentStatus = 'Lease_NTray'
        }
      }
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
    getListData: async function () {
      let res = await this.$xml('UserCS_GetHouse', {
        'OrgId': this.locationData.orgData.orgId,
        'BudId': this.locationData.budItem ? this.locationData.budItem.Id : '',
        'RentStatus': this.typeFlag,
        'ResCode': this.searchKey,
        'ResName': '',
        'RentalAreaStart': (this.filerType.areaEnd - 0) > (this.filerType.areaStart - 0) ? this.filerType.areaStart : this.filerType.areaEnd,
        'RentalAreaEnd': (this.filerType.areaEnd - 0) > (this.filerType.areaStart - 0) ? this.filerType.areaEnd : this.filerType.areaStart,
        'FloorNum': this.filerType.floors,
        'Page': this.page,
        'PageSize': this.pageSize
      })
      console.log(res)
      if (res.data.length === this.pageSize) {
        this.showLoadTip = true
      } else {
        this.showLoadTip = false
      }
      if (this.page === 1) {
        this.dataList = res.data
      } else {
        this.dataList = this.dataList.concat(res.data)
      }
      this.isLoading = false
      setTimeout(() => {
        // this.$vux.loading.hide()
      }, 200)
      // // this.$vux.loading.hide()
    },
    async getGridsData () {
      let res = await this.$xml('UserCS_RentView', {
        'OrgId': this.locationData.orgData.orgId,
        'BudId': this.locationData.budItem ? this.locationData.budItem.Id : ''
      })
      console.log(res)
      // this.$vux.loading.hide()
      if (res.status === 200 || res.status === '200') {
        this.gridsData = res.data[0]
      } else {
        this.$toast(res.msg)
      }
    }
  },
  created () {
    if (localStorage.locationData) {
      this.locationData = JSON.parse(localStorage.locationData)
    }
    console.log(this.pageStatus)
    if (this.pageStatus.pageType===1) {
      this.init()
    } else {
      if (this.pageStatus.pageType===0) {
        this.getGridsData()
      }
      else {
        this.initPropertyList()
      }
    }
    // this.$root.$emit('keepAlive', {isKeep: true, name: 'houseList'})
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
        if (this.showLoadTip && !this.isLoading && this.pageStatus.pageType!==2) {
          this.isLoading = true
          this.page++
          this.getListData()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .houseList{
    // position: relative;
    // flex: 1;
    // overflow: hidden;
    .header{
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
    .list-wrap{
      position: relative;
      width: 100vw;
      height: .88rem;
      border-bottom: 1px solid #ededed;
      overflow: hidden;
      background: #fff;
      z-index: 9;
      .listType{
        height: .88rem;
        padding: 0 .3rem;
        white-space: nowrap;
        width: auto;
        overflow-y: hidden;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        .items{
          display: inline-block;
          min-width: 16vw;
          height: .88rem;
          line-height: .88rem;
          font-size: .28rem;
          text-align: center;
          color: #333;
          margin-right: .4rem;
          &:last-child{
            margin-right: 0;
          }
          &.isSelect{
            color: #3395FF;
            border-bottom: 3px solid #3395FF;
          }
        }
      }
    }
    .searchBox {
      position: relative;
      top: 0;
      left: 0;
      z-index: 9;
      // height: 1.05rem;
      padding: 0.2rem 0.3rem;
      // background: #fff;
      border-bottom: 1px solid #e9e9e9;
      .header-wrap{
        float: left;
        width: 6.08rem;
        height: .68rem;
        // background: #fff;
        .search{
          height: 0.68rem;
          background: #fff;
          border-radius: 0.2rem;
          font-size: .3rem;
          line-height: 0.68rem;
          color: #999;
          .icon-sousuo{
            float: left;
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
      .searchWrap {
        float: left;
        width: 6.08rem;
        // width: 6.9rem;
        height: 0.68rem;
        background: #EFEFEF;
        border-radius: 0.1rem;
        line-height: 0.68rem;
        .icon-sousuo {
          float: left;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: 0.34rem;
          text-align: center;
          color: #999;
        }
        input {
          float: left;
          width: 4.6rem;
          // width: 5.4rem;
          height: 0.68rem;
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
      .icon-shaixuan {
        float: left;
        width: 0.68rem;
        height: 0.68rem;
        margin-left: 0.14rem;
        font-size: 0.6rem;
        line-height: 0.68rem;
        text-align: right;
        color: #3395FF;
      }
      .filter {
        position: absolute;
        top: 1rem;
        left: 0;
        width: 100vw;
        height: 0;
        overflow: hidden;
        background: #fff;
        transition: all 0.5s ease;
        &.filterHight{
          height: 3rem;
          border-top: 1px solid #ededed;
          border-bottom: 1px solid #ededed;
          box-shadow: 0px 0px 3px #aaa;
        }
        .typeWrap{
          padding: 0 .3rem;
          height: .8rem;
          line-height: .8rem;
          font-size: .3rem;
          color: #333;
          span{
            display: inline-block;
            margin-right: .3rem;
            &.isSelect{
              color: #3395FF;
            }
          }
        }
        .floors{
          padding: .1rem .3rem;
          input{
            width: 6.9rem;
            height: .6rem;
            color: #333;
            font-size: .3rem;
            text-indent: .2rem;
            border: 1px solid #ededed;
            border-radius: 3px;
            &::placeholder{
              color: #999;
            }
          }
        }
        .area{
          padding: .1rem .3rem;
          input,span{
            float: left;
            font-size: .3rem;
            color: #333;
          }
          input{
            width: 3rem;
            height: .6rem;
            text-indent: .2rem;
            border: 1px solid #ededed;
            border-radius: 3px;
            &::placeholder{
              color: #999;
            }
          }
          span{
            width: .9rem;
            height: .6rem;
            line-height: .6rem;
            text-align: center;
          }
        }
        .btns{
          padding: .1rem .3rem;
          .cancel{
            float: left;
            width: 3.35rem;
            height: .6rem;
            font-size: .3rem;
            line-height: .6rem;
            color: #333;
            text-align: center;
            border: 1px solid #ededed;
            border-radius: 3px;
            margin-right: .2rem;
          }
          .confirm{
            float: left;
            width: 3.35rem;
            height: .6rem;
            font-size: .3rem;
            line-height: .6rem;
            color: #3395FF;
            text-align: center;
            border: 1px solid #3395FF;
            border-radius: 3px;
          }
        }
      }
    }    
    .propertycontent{
      position: absolute;
      top: 0.9rem;
      bottom: 0;
      left: 0;
      right: 0;
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
    .content{
      position: absolute;
      top: 1.96rem;
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
        .tip{
          font-size: .28rem;
          color: #999;
          line-height: 1.2;
          text-align: center;
        }
      }
      .c-list{
        .c-items{
          position: relative;
          margin-bottom: .2rem;
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
            padding: .2rem .3rem;
            ._left{
              float: left;
              // height: 2rem;
              width: 5.6rem;
              .title{
                width: 5.6rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: .34rem;
                color: #333;
                line-height: 1.5;
              }
              .desc,.name{
                margin-top: .1rem;
                font-size: .28rem;
                color: #999;
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
    .listc-enter,
    .listc-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .list-content{
      position: absolute;
      top: .88rem;
      left: 0;
      right: 0;
      bottom: 0;
      transition: all 0.5s ease;
    }
    .gridsc-enter,
    .gridsc-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .grids-content{
      position: absolute;
      top: .88rem;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
      transition: all 0.5s ease;
      padding: 0 .3rem;
      .items{
        float: left;
        width: 3.3rem;
        height: 2.4rem;
        padding-top: .32rem;
        margin-right: .3rem;
        margin-top: .3rem;
        background: #fff;
        border-radius: .1rem;
        &:nth-child(2n){
          margin-right: 0;
        }
        .icon{
          display: block;
          width: 100%;
          height: .5rem;
          line-height: .5rem;
          font-size: .56rem;
          text-align: center;
          color: #999;
        }
        .nums{
          margin-top: .16rem;
          font-size: .46rem;
          text-align: center;
          &.color0{
            color: #00B3F6;
          }
          &.color1{
            color: #F00017;
          }
          &.color2{
            color: #ECB700;
          }
          &.color3{
            color: #FD8815;
          }
          &.color4{
            color: #954EED;
          }
          &.color5{
            color: #3395FF;
          }
        }
        .name{
          font-size: .34rem;
          color: #333;
          text-align: center;
        }
      }
      .item{
        position: relative;
        float: left;
        width: 6.9rem;
        height: 1.9rem;
        margin-top: .3rem;
        background: #fff;
        border-radius: .1rem;
        .name{
          position: absolute;
          top: 0;
          left: 1rem;
          z-index: 10;
          height: 1.9rem;
          line-height: 1.9rem;
          font-size: .34rem;
          color: #333;
          text-align: left;
        }
        .icon{
          position: absolute;
          top: 0;
          right: 1rem;
          z-index: 10;
          height: 1.9rem;
          line-height: 1.9rem;
          font-size: .7rem;
          color: #999;
          text-align: right;
        }
        .nums{
          position: absolute;
          top: 0;
          left: 0;
          width: 6.9rem;
          height: 1.9rem;
          z-index: 9;
          font-size: .46rem;
          color: #155CFD;
          line-height: 1.9rem;
          text-align: center;
        }
      }
    }
  }
  .filerType-enter,
  .filerType-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .filerType{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 1000000;
    transition: all 0.5s ease;
    .mark{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 9;
      background: #000;
      opacity: .5;
    }
    .f-content{
      position: absolute;
      top: 0;
      right: 0;
      width: 5.4rem;
      height: 100vh;
      z-index: 10;
      background: #fff;
      .btns{
        float: left;
        width: 1.66rem;
        height: 100vh;
        background: #F2F2F4;
        .btn{
          width: 1.66rem;
          height: .88rem;
          font-size: .3rem;
          line-height: .88rem;
          color: #777E8C;
          text-align: center;
          &.isSelect{
            background: #fff;
            color: #000;
          }
          &:last-child{
            border-top: 1px solid #DDDEE3;
          }
        }
      }
      .inputs{
        float: right;
        width: 3.74rem;
        height: 100vh;
        background: #fff;
        .floors{
          padding: .3rem;
          input{
            width: 3.1rem;
            height: .6rem;
            margin: 0 auto;
            color: #000;
            font-size: .3rem;
            text-indent: .2rem;
            border-radius: 3px;
            background: #EEEEEE;
            &::placeholder{
              color: #777E8C;
            }
          }
        }
        .area{
          padding: .3rem;
          input,p{
            float: left;
            font-size: .3rem;
            color: #000;
          }
          input{
            width: 3.1rem;
            height: .6rem;
            text-indent: .2rem;
            border-radius: 3px;
            background: #EEEEEE;
            &::placeholder{
              color: #777E8C;
            }
          }
          p{
            width: .9rem;
            height: .68rem;
            line-height: .68rem;
          }
        }
      }
      .footer{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 5.4rem;
        height: 1.16rem;
        background: #fff;
        border-top: 1px solid #DDDEE3;
        padding: .18rem .4rem;
        .reset{
          float: left;
          width: 2rem;
          height: .8rem;
          border: 1px solid #3397FF;
          line-height: .8rem;
          color: #3397FF;
          text-align: center;
          font-size: .34rem;
          border-radius: 3px;
        }
        .sure{
          float: right;
          width: 2rem;
          height: .8rem;
          line-height: .8rem;
          color: #fff;
          text-align: center;
          background: #3397FF;
          font-size: .34rem;
          border-radius: 3px;
        }
      }
    }
  }
</style>
