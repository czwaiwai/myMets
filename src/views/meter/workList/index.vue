<template>
  <div class="page workList">
    <nav-title title="抄表工单"></nav-title>
    <div class="header clearfix">
      <i class="iconfont icon-building-automation"></i>
      <p class="title" @click.stop="showDetail=true"><span>{{locationData.orgData.orgName}}>{{locationData.grpItem.GrpName}}>{{locationData.budItem.BudName}}</span>(表数：{{count.TotalRead||0}})</p>
      <p class="downLoad" @click.stop="downLoadBtn" v-if="count.SumTobecopied - 0 > 0 || count.SumTranscribe - 0 > 0 ">离线下载</p>
    </div>
    <div class="searchBox clearfix">
      <div class="searchWrap clearfix" @click.stop="toSearch">
        <i class="iconfont icon-saoyisao"></i>
        <span class="search-input">扫码或输入表号</span>
      </div>
      <i class="iconfont icon-shaixuan" @click.stop="showFilterList = !showFilterList"></i>
    </div>
    <div class="classify-wrap" v-if="classify.length">
      <div class="classify">
        <span class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in classify" :key="index" @click.stop="setClassify(item,index)">{{item.meterName}}</span>
      </div>
    </div>
    <div class="listType clearfix">
      <div class="type" v-for="(item,index) in listTitle" :key="index" @click.stop="setListType(item,index)">
        <span :class="{'isSelect':listType===item.type}">{{item.name}}({{item.type==1?(count.Tobecopied||0):(item.type==2?(count.Transcribe||0):(count.Locked||0))}})</span>
      </div>
    </div>
    <div class="page_bd _content">
      <div class="list-wrap" :class="listType<3?'hasBottom':'noneBottom'">
        <Myref ref="list">
          <ul class="list" v-show="checkList.length">
            <li class="item" v-for="(item,index) in checkList" :key="index">
              <div class="item1 clearfix">
                <span class="left">{{filterType.contentType?(item.ExternalCode||item.ImaCode):item.ImaCode}}</span>
                <span class="right" v-show="listType>1">{{item.TMRD}}</span>
              </div>
              <div class="item2 clearfix">
                <span class="left">资源：{{item.ResCode}}</span>
                <span class="right">{{listType>1?'本次读数':'请输入本次读数'}}</span>
              </div>
              <div class="item3 clearfix">
                <span class="left">上次读数：{{item.LMR}}</span>
                <input
                  type="text"
                  class="right valInput"
                  :placeholder="item.LMR"
                  @input="inputSetVal(item,index)"
                  v-model="item.TMR"
                  @blur="inputBlur(item,index)"
                  @focus="inputFocus(item, index)"
                  :class="{'grade':listType===3}"
                  :disabled="listType===3?'disabled':false"
                  :readonly="listType===3?'disabled':false"
                />
              </div>
              <div class="item4 clearfix">
                <span class="left">上次用量：{{item.LCIAmount}}</span>
                <span class="right" :class="pointColorClass(item, index)">本次用量：<span>{{item.CIAmount||''}}</span></span>
              </div>
            </li>
          </ul>
          <div class="noneList" v-show="!checkList.length">暂无数据~</div>
          <p class="loadTip" v-show="showLoadTip">加载中···</p>
        </Myref>
      </div>
    </div>
    <div class="footer-wrap">
      <div class="footer1 clearfix" v-if="listType === 1">
        <div class="reset" @click.stop="resetVal">重置读数</div>
        <div class="submit" @click.stop="allSubmit">全部提交</div>
      </div>
      <div class="footer2" :class="{'hasCheck':allData[filterType.date][meterData.meterId].hasList2Check}" v-if="listType === 2" @click.stop="thisSubmit">提交</div>
    </div>
    <transition name="detail">
      <div class="detail" v-if="showDetail">
        <div class="mark" @click.stop="showDetail=false"></div>
        <div class="detailContent">
          <h4 class="title">当期项目<i class="iconfont icon-icon-" @click.stop="showDetail=false"></i></h4>
          <p class="orgName">{{locationData.orgData.orgName}}</p>
          <p class="fq">{{locationData.grpItem.GrpName}}</p>
          <p class="ld">{{locationData.budItem.BudName}}</p>
          <p class="all">共计表数&nbsp;&nbsp;<span>{{count.TotalRead||0}}</span></p>
          <p class="noCheck">待抄表数&nbsp;&nbsp;<span>{{count.SumTobecopied||0}}</span></p>
          <p class="hasCheck">已抄表数&nbsp;&nbsp;<span>{{count.SumTranscribe||0}}</span></p>
        </div>
      </div>
    </transition>
    <transition name="filterList">
      <div class="filterList" v-show="showFilterList">
        <div class="mark" @click.stop="hideFilterList"></div>
        <div class="filterConten clearfix">
          <ul class="filterType">
            <li class="ft-items" :class="{'isSelect':item. isSelect}" @click.stop="selectFilterType(item,index)" v-for="(item, index) in filterType.list" :key="index">{{item.name}}<i class="iconfont icon-gengduo1"></i></li>
          </ul>
          <div class="filterSort">
            <div class="setDate" v-show="filterType.type===0">
              <p class="tip">请选择</p>
              <div class="date-wrap" @click.stop="openPicker"><span class="date">{{filterType.list[0].data}}</span><i class="iconfont icon-rili"></i></div>
              <datetime-picker
                ref="picker"
                type="date"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                @confirm="filterDateChange"
                v-model="pickerValue">
              </datetime-picker>
              <!-- <datetime v-model="filterType.list[0].data" @on-change="filterDateChange" format="YYYY-MM" :max-year=3000 :min-year=1900>
                <div class="date-wrap"><span class="date">{{filterType.list[0].data}}</span><i class="iconfont icon-rili"></i></div>
              </datetime> -->
            </div>
            <ul class="filterItems" v-show="filterType.type===1">
              <li class="fl-items" :class="{'isSelect':item. isSelect}" @click.stop="selectFilterList(item,index)" v-for="(item,index) in filterType.list[1].data" :key="index">{{item.name}}</li>
            </ul>
          </div>
          <div class="fl-footer clearfix">
            <div class="reset" @click.stop="filterReset">重置</div>
            <div class="sure" @click.stop="getOtherList">确认</div>
          </div>
        </div>
      </div>
    </transition>
    <dialog-confire
      :title="dialogData.title"
      :leftName="dialogData.leftName"
      :rightName="dialogData.rightName"
      ref="dialog"
      @clickMark="clickMark"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
      @clickOneBtn="clickOneBtn"
      :oneBtn="dialogData.type===5"
    ></dialog-confire>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import dialogConfire from '@/components/dialogConfire.vue'
import { mapGetters } from 'vuex'
import Myref from '@/components/ref/ref.vue'
import { DatetimePicker, Indicator } from 'mint-ui'
import dateChange from '@/mixins/dateChange'
// import { Toast, Datetime } from 'vux'
export default {
  name: 'workList',
  components: {DatetimePicker, dialogConfire, navTitle, Myref},
  mixins: [dateChange],
  data () {
    return {
      pickerValue: '',
      showDetail: false,
      ctrJump: false,
      allData: {},
      dialogData: {
        type: 0,
        title: '',
        leftName: '',
        rightName: ''
      },
      next: '',
      searchKey: '',
      showFilterList: false,
      classify: [],
      listTitle: [
        {name: '待抄录', type: 1},
        {name: '已抄录', type: 2},
        {name: '已锁定', type: 3}
      ],
      listType: 0,
      listData: [],
      filterType: {
        type: 0,
        date: '',
        contentType: 0,
        list: [
          {name: '账期选择', type: 0, isSelect: true, data: ''},
          {name: '仪表显示', type: 1, isSelect: false, data: [{name: '仪表编码', isSelect: true, type: 0}, {name: '外部编码', isSelect: false, type: 1}]}
        ]
      },
      meterData: {},
      checkList: [],
      count: {
        Tobecopied: 0,
        Transcribe: 0
      },
      page: 1,
      pageSize: 20,
      offsetHeight: 0,
      showLoadTip: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      locationData: 'getMeterLocation',
      dateTimes: 'getMeterDateTime'
    })
  },
  // 路由离开前弹窗提示
  beforeRouteLeave (to, from, next) {
    if (this.ctrJump) {
      next()
      return
    }
    let arr = []
    for (let item in this.allData[this.filterType.date]) {
      if (this.allData[this.filterType.date][item].hasList1Check || this.allData[this.filterType.date][item].hasList2Check) {
        arr.push(this.allData[this.filterType.date][item].meterName)
      }
    }
    if (!arr.length) {
      next()
    } else {
      this.dialogData = {
        type: 0,
        title: '您的 ' + arr.join('、') + ' 读数还没有提交，直接返回将会清空刚才的操作哦，请确认是否跳转？',
        leftName: '确定',
        rightName: '取消'
      }
      this.$refs.dialog.show()
      this.next = next
    }
    // next()
  },
  methods: {
    // 查看项目详情
    // showDetail () {
    // },
    // 点击离线
    downLoadBtn () {
      console.log('dateTimes', this.dateTimes)
      let date = this.dateTimes.thisTime.replace('-', '年') + '月'
      this.dialogData = {
        type: 6,
        title: ' 确认将' + date + '的账期离线吗？离线后可在离线工单中查看，若之前已有离线，则会覆盖原离线内容哦',
        leftName: '取消',
        rightName: '确定'
      }
      this.$refs.dialog.show()
    },
    // 离线下载
    async downLoad () {
      Indicator.open({
        text: '离线中···',
        spinnerType: 'fading-circle'
      })
      let meterTypeIdList = []
      this.classify.forEach(arr => {
        meterTypeIdList.push({imaTypeID: arr.meterId})
      })
      let data = {
        ProjectId: this.locationData.orgData.orgId,
        SearchType: 4,
        GrpId: this.locationData.grpItem.Id,
        BudID: this.locationData.budItem.Id,
        DataOfRead: this.filterType.date,
        ImaTypeIDs: meterTypeIdList
      }
      console.log('data:', data)
      let res = await this.$xml('UserApp_GetImaReadInfoNew', data, {}, true)
      console.log(res)
      let params = {
        OrgID: this.locationData.orgData.orgId,
        BudID: this.locationData.budItem.Id,
        ImaTypeID: '',
        DataOfRead: this.filterType.date
      }
      let count = await this.$xml('UserApp_GetImaReadCountInfo', params, {}, true)
      console.log(count)
      res.data.count = count.data
      res.data.locationData = this.locationData
      let message = {
        key: this.filterType.date + this.locationData.budItem.Id,
        data: res.data
      }
      // console.log(message)
      this.$app.addData(message)
      // if (window.webkit) {
      //   window.webkit.messageHandlers.Native_Js_addData.postMessage(message)
      // } else if (window.callData) {
      //   let json = JSON.stringify(message)
      //   window.callData.Native_Js_addData(json)
      // }
      Indicator.open({
        text: '离线成功，可在离线中心查看',
        spinnerType: 'fading-circle'
      })
      setTimeout(() => {
        this.$indicator.close()
      }, 1000)
    },
    toSearch () {
      let arr = []
      for (let item in this.allData[this.filterType.date]) {
        if (this.allData[this.filterType.date][item].hasList1Check || this.allData[this.filterType.date][item].hasList2Check) {
          arr.push(this.allData[this.filterType.date][item].meterName)
        }
      }
      if (!arr.length) {
        this.$router.push(`/meterSearch`)
      } else {
        this.dialogData = {
          type: 3,
          title: '您的 ' + arr.join('、') + ' 读数还没有提交，直接返回将会清空刚才的操作哦，请确认是否跳转？',
          leftName: '确定',
          rightName: '取消'
        }
        this.$refs.dialog.show()
      }
    },
    // 选择仪表类型
    setClassify (item, index) {
      if (item.isSelect) {
        return
      }
      this.classify.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.listType = 1
      this.meterData = item
      this.getImaReadCountInfo()
      this.loadStoreData()
    },
    // 选择仪表数据类型
    setListType (item, index) {
      if (item.type === this.listType) {
        return
      }
      // console.log(this.allData)
      this.listType = item.type
      this.loadStoreData()
    },
    // 拉取缓存数据
    loadStoreData () {
      this.showLoadTip = false
      this.$refs.list.setTop(1)
      if (this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list.length) {
        this.checkList = this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list
      } else {
        this.checkList = []
      }
      if (this.allData[this.filterType.date][this.meterData.meterId].count) {
        this.count = this.allData[this.filterType.date][this.meterData.meterId].count
      }
      this.$nextTick(() => {
        this.page = this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].page
        this.showLoadTip = !this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].allLoad
        if (!this.checkList.length) {
          this.getImaReadInfo()
        }
      })
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
          type: 2,
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
      /* eslint-disable */
      item.isCheck = true
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
      this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list.forEach(arr => {
        if (arr.isCheck) {
          flag = true
        }
      })
      if (flag) {
        this.allData[this.filterType.date][this.meterData.meterId]['hasList' + this.listType + 'Check'] = true
      } else {
        this.allData[this.filterType.date][this.meterData.meterId]['hasList' + this.listType + 'Check'] = false
      }
    },
    // 重置数据
    resetVal () {
      if (!this.allData[this.filterType.date][this.meterData.meterId]['list1'].list.length) {
        return
      }
      this.dialogData = {
        type: 1,
        title: '确认全部重置读数？重置后所有当前仪表待抄录的读数都会返回初始值哦',
        leftName: '确定',
        rightName: '取消'
      }
      this.$refs.dialog.show()
    },
    // 全部提交
    allSubmit () {
      let list = []
      let objList = {
        ImaReadList: []
      }
      this.allData[this.filterType.date][this.meterData.meterId]['list1'].list.forEach(arr => {
        let obj = {
          ImaReadId: arr.ImaReadId,
          TMR: arr.TMR || arr.LMR,
          LMR: arr.LMR
        }
        list.push(obj)
        objList.ImaReadList.push(obj)
      })
      if (!list.length) {
        return
      }
      let params = {
        projectId: this.locationData.orgData.orgId,
        accountDate: this.filterType.date,
        imaReadList: objList
      }
      this.dialogData = {
        type: 4,
        title: '确认将' + list.length + '条数据提交至后台，若仪表当前月份已经录入度数，则会覆盖原度数。',
        leftName: '取消',
        rightName: '确认',
        data: params
      }
      this.$refs.dialog.show()
    },
    // 已抄录列表提交
    thisSubmit () {
      if (!this.allData[this.filterType.date][this.meterData.meterId].hasList2Check) {
        return
      }
      let list = []
      let objList = {
        ImaReadList: []
      }
      this.allData[this.filterType.date][this.meterData.meterId]['list2'].list.forEach(arr => {
        if (arr.isCheck) {
          let obj = {
            ImaReadId: arr.ImaReadId,
            TMR: arr.TMR || arr.LMR,
            LMR: arr.LMR
          }
          list.push(obj)
          objList.ImaReadList.push(obj)
        }
      })
      console.log('objList:', objList)
      let params = {
        projectId: this.locationData.orgData.orgId,
        accountDate: this.filterType.date,
        imaReadList: objList
      }
      this.dialogData = {
        type: 4,
        title: '确认将' + list.length + '条数据提交至后台，若仪表当前月份已经录入度数，则会覆盖原度数。',
        leftName: '取消',
        rightName: '确认',
        data: params
      }
      this.$refs.dialog.show()
    },
    // 数据提交
    async submit (params) {
      // this.$vux.loading.show()
      let res = await this.$xml('Ima_SumbitImaReadInfo', {}, {p1: params.projectId, p2: params.accountDate, p7: JSON.stringify(params.imaReadList)})
      this.dialogData = {
        type: 5,
        title: res.data[0].info
      }
      this.$refs.dialog.show()
    },
    // 隐藏筛选
    hideFilterList () {
      this.filterType.type = 0
      this.filterType.list[0].data = this.filterType.date
      this.pickerValue = this.filterType.date + '-01'
      this.filterType.list[0].isSelect = true
      this.filterType.list[1].isSelect = false
      this.filterType.list[1].data.forEach(arr => {
        if (this.filterType.contentType === arr.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.showFilterList = false
    },
    // 选择筛选类型
    selectFilterType (item, index) {
      if (item.isSelect) {
        return
      }
      this.filterType.list.forEach(arr => {
        arr.isSelect = false
      })
      this.filterType.type = item.type
      item.isSelect = true
    },
    // 选择筛选列表
    selectFilterList (item, index) {
      if (item.isSelect) {
        return
      }
      this.filterType.list[1].data.forEach(arr => {
        arr.isSelect = false
      })
      // this.filterType.contentType = item.type
      item.isSelect = true
    },
    // 打开时间选择器
    openPicker () {
      this.$refs.picker.open()
    },
    // 筛选时间改变
    filterDateChange (date) {
      console.log(date.format('yyyy-MM-dd'))
      this.filterType.list[0].data = this.com_setYM(date.format('yyyy-MM-dd'))
      this.pickerValue = date.format('yyyy-MM-dd')
    },
    // 筛选重置
    filterReset () {
      this.filterType = {
        type: 0,
        date: this.dateTimes.initTime,
        contentType: 0,
        list: [
          {name: '账期选择', type: 0, isSelect: true, data: this.dateTimes.initTime},
          {name: '仪表显示', type: 1, isSelect: false, data: [{name: '仪表编码', isSelect: true, type: 0}, {name: '外部编码', isSelect: false, type: 1}]}
        ]
      }
    },
    // 筛选确定
    getOtherList () {
      this.filterType.date = this.filterType.list[0].data
      this.$store.commit('setMeterDateTime', {initTime: this.dateTimes.initTime, thisTime: this.filterType.list[0].data})
      this.filterType.list[1].data.forEach(arr => {
        if (arr.isSelect) {
          this.filterType.contentType = arr.type
        }
      })
      this.$el.querySelector('.classify').scrollLeft = '1'
      this.classify.forEach((arr, index) => {
        if (index === 0) {
          this.meterData = arr
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.showFilterList = false
      this.listType = 1
      this.getMeterList()
      this.filterType.type = 0
      this.filterType.list[0].isSelect = true
      this.filterType.list[1].isSelect = false
    },
    // 点击弹窗蒙版
    clickMark () {
      if (this.dialogData.type === 0) {
        this.$router.go(1)
      } else if (this.dialogData.type === 2) {
        this.dialogData.data.TMR = ''
        this.dialogData.data.CIAmount = '0.00'
        this.dialogData.data.isCheck = false
        this.setHasCheck()
      } else if (this.dialogData.type === 5) {
        this.allData[this.filterType.date][this.meterData.meterId] = {
          meterName: this.allData[this.filterType.date][this.meterData.meterId].meterName,
          hasList1Check: false,
          hasList2Check: false,
          list1: {page: 1, list: [], allLoad: false},
          list2: {page: 1, list: [], allLoad: false},
          list3: {page: 1, list: [], allLoad: false}
        }
        // this.listType = 1
        this.getImaReadCountInfo()
        this.loadStoreData()
        this.showLoadTip = false
        this.$refs.dialog.hide()
      }
    },
    // 点击弹窗左边按钮
    clickLeftBtn () {
      if (this.dialogData.type === 0) {
        this.$refs.dialog.hide()
        this.next()
        return
      } else if (this.dialogData.type === 1) {
        this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list.forEach(arr => {
          arr.TMR = ''
          arr.CIAmount = '0.00'
        })
        this.$refs.list.setTop(1)
        this.allData[this.filterType.date][this.meterData.meterId].hasList1Check = false
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 2) {
        if (this.dialogData.data.ResetLargestRead === 'False') {
          this.dialogData.data.CIAmount = ((this.dialogData.data.ImaBaseID - 0) + (this.dialogData.data.TMR - 0) - (this.dialogData.data.LMR - 0) + 1).toFixed(2)
        } else {
          this.dialogData.data.CIAmount = ((this.dialogData.data.ImaBaseID - 0) + (this.dialogData.data.TMR - 0) - (this.dialogData.data.LMR - 0)).toFixed(2)
        }
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 3) {
        this.ctrJump = true
        this.$refs.dialog.hide()
        this.$router.push(`/meterSearch`)
      } else if (this.dialogData.type === 4) {
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 6) {
        this.$refs.dialog.hide()
      }
    },
    // 点击弹窗右边按钮
    clickRightBtn () {
      if (this.dialogData.type === 0) {
        this.$refs.dialog.hide()
        this.$router.go(1)
      } else if (this.dialogData.type === 1) {
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 2) {
        this.dialogData.data.TMR = ''
        this.dialogData.data.CIAmount = '0.00'
        this.dialogData.data.isCheck = false
        this.setHasCheck()
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 3) {
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 4) {
        this.submit(this.dialogData.data)
        this.$refs.dialog.hide()
      } else if (this.dialogData.type === 6) {
        this.$refs.dialog.hide()
        this.downLoad()
      }
    },
    // 点击一个按钮
    clickOneBtn () {
      if (this.dialogData.type === 5) {
        this.allData[this.filterType.date][this.meterData.meterId] = {
          meterName: this.allData[this.filterType.date][this.meterData.meterId].meterName,
          hasList1Check: false,
          hasList2Check: false,
          list1: {page: 1, list: [], allLoad: false},
          list2: {page: 1, list: [], allLoad: false},
          list3: {page: 1, list: [], allLoad: false}
        }
        // this.listType = 1
        this.getImaReadCountInfo()
        this.loadStoreData()
        this.showLoadTip = false
        this.$refs.dialog.hide()
      }
    },
    // 获取仪表检查列表
    async getImaReadInfo () {
      let meterTypeIdList = []
      meterTypeIdList.push({imaTypeID: this.meterData.meterId})
      let params = {
        'ProjectId': this.locationData.orgData.orgId,
        'SearchType': this.listType,
        'GrpId': this.locationData.grpItem.Id,
        'BudID': this.locationData.budItem.Id,
        'DataOfRead': this.filterType.date,
        'Page': this.page,
        'PageSize': this.pageSize,
        'ImaTypeIDs': meterTypeIdList
      }
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserApp_GetImaReadInfoNew', params)
      console.log('UserApp_GetImaReadInfoNew:', res)
      if (res.data) {
        if (res.data.List.length) {
            res.data.List[0].ImaTypeList.forEach(arr => {
              if (arr.TMR - 0 === 0 && this.listType === 1) {
                arr.TMR = ''
              }
              arr.TMRD = arr.TMRD.replace(/\//g, '-')
              arr.isCheck = false
            })
            // console.log(this.allData)
            this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list = this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list.concat(res.data.List[0].ImaTypeList)
            this.checkList = this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list
            if (this.checkList.length && res.data.List[0].ImaTypeList.length === this.pageSize) {
              this.showLoadTip = true
              this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].allLoad = false
            } else {
              this.showLoadTip = false
              this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].allLoad = true
            }
            // console.log(this.allData)
          } else {
            this.checkList = this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].list
            this.showLoadTip = false
            this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].allLoad = true
          }
          if (this.page === 1) {
            setTimeout(() => {
              this.$refs.list.setTop(1)
            }, 200)
          }
          this.isLoading = false
      }
      this.$indicator.close()
    },
    // 获取仪表类型抄表状态的数量
    async getImaReadCountInfo () {
      if (this.allData[this.filterType.date][this.meterData.meterId].count) {
        return
      }
      let params = {
        'OrgID': this.locationData.orgData.orgId,
        'ImaTypeID': this.meterData.meterId,
        'BudID': this.locationData.budItem.Id,
        'DataOfRead': this.filterType.date
      }
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserApp_GetImaReadCountInfo', params)
      if (res.data) {
        this.allData[this.filterType.date][this.meterData.meterId].count = res.data
        this.count = res.data
      }
      this.$indicator.close()
    },
    // 获取仪表列表
    async getMeterList () {
      if (this.allData[this.filterType.date]) {
        this.loadStoreData()
        return
      }
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_GetImaTypeByOrgID', {
        'OrgID': this.locationData.orgData.orgId
      })
      console.log('UserCS_GetImaTypeByOrgID:', res)
      res.data.forEach((arr, index) => {
        arr.isSelect = false
        if (index === 0) {
          arr.isSelect = true
          this.meterData = arr
        }
      })
      if (!this.allData[this.filterType.date]) {
        this.allData[this.filterType.date] = {}
        res.data.forEach((arr, index) => {
          this.allData[this.filterType.date][arr.meterId] = {
            meterName: arr.meterName,
            hasList1Check: false,
            hasList2Check: false,
            list1: {page: 1, list: [], allLoad: false},
            list2: {page: 1, list: [], allLoad: false},
            list3: {page: 1, list: [], allLoad: false}
          }
        })
      }
      this.classify = res.data
      this.listType = 1
      this.getImaReadInfo()
      this.getImaReadCountInfo()
      // console.log('allData:', this.allData)
      this.$indicator.close()
    }
  },
  created () {
    // console.log(this.locationData)
    // console.log('dataTime', this.dateTimes)
    this.filterType.date = this.dateTimes.thisTime
    this.filterType.list[0].data = this.dateTimes.thisTime
    this.pickerValue = this.dateTimes.thisTime + '-01'
    this.getMeterList()
  },
  mounted () {
    let _this = this
    // 上拉禁止
    this.$refs.list.items.ref = function () {
      _this.$refs.searchList.succ()
    }
    // 上拉加载更多
    this.$refs.list.IsLast(50, (direction, scrollTop, h) => {
      if (h) {
        if (!this.isLoading && this.showLoadTip) {
          // console.log('in.....')
          this.isLoading = true
          this.page++
          this.allData[this.filterType.date][this.meterData.meterId]['list' + this.listType].page++
          this.getImaReadInfo()
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .workList{
    .header{
      position: relative;
      height: .84rem;
      padding: .2rem .3rem;
      background: #fff;
      border-bottom: 1px solid #E9E9E9;
      .icon-building-automation{
        float: left;
        width: .44rem;
        height: .44rem;
        font-size: .4rem;
        line-height: .44rem;
        color: #1B9BFE;
      }
      .title{
        float: left;
        max-width: 4.8rem;
        height: .44rem;
        line-height: .44rem;
        font-size: .24rem;
        color: #999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span{
          display: inline-block;
          margin-right: .1rem;
          font-size: .28rem;
          color: #1B9BFE;
        }
      }
      .downLoad{
        float: right;
        height: .44rem;
        line-height: .44rem;
        color: #3395ff;
        font-size: .28rem;
      }
    }
    .searchBox {
      position: relative;
      left: 0;
      top: 0;
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
        .search-input{
          float: left;
          width: 4.4rem;
          height: 0.68rem;
          line-height: 0.68rem;
          color: #999;
          font-size: 0.28rem;
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
      .icon-shaixuan {
        float: left;
        width: 0.68rem;
        height: 0.68rem;
        margin-left: 0.14rem;
        font-size: 0.6rem;
        line-height: 0.68rem;
        text-align: right;
        color: #3395ff;
      }
    }
    .filterList-enter,
    .filterList-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .filterList {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      transition: all 0.5s ease;
      .mark {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #000;
        opacity: 0;
      }
      .filterConten {
        position: absolute;
        top: 1.94rem;
        right: 0;
        z-index: 10;
        width: 5.7rem;
        height: calc(100vh - 1.94rem);
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background: #fff;
        box-shadow: 3px 3px 10px #999;
        .filterType{
          float: left;
          width: 2.42rem;
          height: calc(100vh - 2.74rem);
          border-right: 1px solid #E9E9E9;
          background: #fff;
          .ft-items{
            position: relative;
            height: .9rem;
            padding: 0 .3rem;
            border-bottom: 1px solid #E9E9E9;
            font-size: .3rem;
            color: #333;
            line-height: .9rem;
            &.isSelect{
              color: #3395ff;
            }
            .icon-gengduo1{
              position: absolute;
              top: .25rem;
              right: .3rem;
              width: .4rem;
              height: .4rem;
              line-height: .4rem;
              text-align: right;
              font-size: .36rem;
              color: #C7C7CC;
            }
          }
        }
        .filterSort{
          float: left;
          width: 3.28rem;
          height: calc(100vh - 2.74rem);
          background: #F8F8F8;
          .setDate{
            width: 3.28rem;
            height: calc(100vh - 2.74rem);
            padding-left: .4rem;
            padding-top: .2rem;
            .tip{
              margin-bottom: .1rem;
              font-size: .28rem;
              color: #999;
              line-height: 1.5;
            }
            .date-wrap{
              position: relative;
              width: 2.6rem;
              height: .64rem;
              padding: 0 .2rem;
              background: #fff;
              color: #999;
              font-size: .28rem;
              line-height: .64rem;
              border: #DEDEDE;
              .icon-rili{
                position: absolute;
                top: .11rem;
                right: .2rem;
                display: block;
                width: .4rem;
                height: .4rem;
                font-size: .4rem;
                line-height: .4rem;
                color: #3395ff;
              }
            }
          }
          .filterItems{
            width: 3.28rem;
            height: calc(100vh - 2.74rem);
            .fl-items{
              position: relative;
              height: .9rem;
              padding: 0 .3rem;
              border-bottom: 1px solid #E9E9E9;
              font-size: 0 .3rem;
              color: #333;
              line-height: .9rem;
              &.isSelect{
                color: #3395ff;
              }
            }
          }
        }
        .fl-footer{
          float: left;
          width: 5.7rem;
          height: .8rem;
          .reset{
            float: left;
            width: 2.85rem;
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            color: #fff;
            font-size: .32rem;
            background: #99caff;
          }
          .sure{
            float: left;
            width: 2.85rem;
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            color: #fff;
            font-size: .32rem;
            background: #3395ff;
          }
        }
        .fitem {
          // height: .9rem;
          padding: 0.3rem 0.3rem;
          line-height: 1.5;
          font-size: 0.3rem;
          color: #333;
          border-bottom: 1px solid #e9e9e9;
          &.green {
            color: #3395ff;
          }
        }
      }
    }
    .classify-wrap{
      position: relative;
      top: 0;
      left: 0;
      width: 100vw;
      height: .9rem;
      // overflow: hidden;
      background: #fff;
      border-bottom: 1px solid #e9e9e9;
      .classify{
        width: auto;
        height: .9rem;
        padding: 0 .3rem;
        white-space: nowrap;
        overflow-y: hidden;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        .items{
          display: inline-block;
          height: .6rem;
          min-width: 1.7rem;
          padding: 0 .2rem;
          font-size: .3rem;
          color: #999;
          text-align: center;
          line-height: .6rem;
          margin-top: .15rem;
          margin-right: .4rem;
          border: 1px solid #e9e9e9;
          border-radius: 3px;
          &.isSelect{
            color: #3395ff;
            border: 1px solid #3395ff;
          }
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .listType{
      position: relative;
      left: 0;
      top: 0;
      height: .88rem;
      width: 100vw;
      padding: 0 .3rem;
      margin-top: .2rem;
      overflow: hidden;
      background: #fff;
      border-bottom: 1px solid #e9e9e9;
      .type{
        float: left;
        width: calc((100vw - .6rem) / 3);
        height: .88rem;
        text-align: center;
        &:first-child{
          text-align: left;
        }
        &:last-child{
          text-align: right;
        }
        span{
          display: inline-block;
          height: .88rem;
          font-size: .3rem;
          line-height: .88rem;
          color: #999;
          &.isSelect{
            color: #3395ff;
            border-bottom: 3px solid #3395ff;
          }
        }
      }
    }
    .list-wrap{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      -webkit-overflow-scrolling: touch;
      &.hasBottom{
        bottom: .8rem;
      }
      &.noneBottom{
        bottom: 0;
      }
      .loadTip{
        height: .8rem;
        width: 100%;
        background: #fff;
        font-size: .3rem;
        color: #999;
        text-align: center;
        line-height: .8rem;
      }
      .noneList{
        width: 100%;
        height: 100%;
        line-height: 50vw;
        font-size: .3rem;
        color: #999;
        text-align: center;
        background: #fff;
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
              // min-height: .6rem;
              padding: .15rem 0;
              max-width: 3.5rem;
              color: #333;
              line-height: 1.2;
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
              padding: .15rem 0;
              max-width: 3.5rem;
              color: #999;
              line-height: 1.2;
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
              outline: none;
              resize: none;
              box-sizing: border-box;
              -webkit-appearance: none;
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
                &::after{
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
                &::after{
                  position: absolute;
                  left: -.3rem;
                  top: 50%;
                  margin-top: -5px;
                  display: block;
                  width: 8px;
                  height: 8px;
                  border-radius: 4px;
                  content: '';
                  background: #3395ff;
                }
              }
            }
          }
        }
      }
    }
    .footer-wrap{
      position: absolute;
      bottom: 0;
      left: 0;
      .footer1{
        border-top: 1px solid #e9e9e9;
        .reset{
          float: left;
          width: 50vw;
          height: .8rem;
          line-height: .8rem;
          font-size: .3rem;
          text-align: center;
          color: #fff;
          background: #99caff;
        }
        .submit{
          float: left;
          width: 50vw;
          height: .8rem;
          line-height: .8rem;
          font-size: .3rem;
          text-align: center;
          color: #fff;
          background: #3395ff;
        }
      }
      .footer2{
        width: 100vw;
        height: .8rem;
        line-height: .8rem;
        font-size: .3rem;
        text-align: center;
        color: #fff;
        background: #99caff;
        &.hasCheck{
          background: #3395ff;
        }
      }
    }
    .detail-enter-active, .detail-leave-active {
      transition: opacity .5s;
      -webkit-transform: opacity .5s;
    }
    .detail-enter, .detail-leave-active {
      opacity: 0
    }
    .detail {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 9999;
      .mark {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #000;
        opacity: .5;
      }
      .detailContent{
        background: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 11;
        transform: translate(-50%,-50%);
        width: 90%;
        padding-bottom: .3rem;
        border-radius: .1rem;
        box-sizing: border-box;
        overflow: hidden;
        .title{
          position: relative;
          color: #333;
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 0.34rem;
          padding: 0 0.3rem;
          border-bottom: 0.01rem solid #E9E9E9;
          background: #E9E9E9;
          .icon-icon-{
            position: absolute;
            top: .2rem;
            right: .2rem;
            display: block;
            width: .4rem;
            height: .4rem;
            font-size: .4rem;
            color: #333;
            line-height: .36rem;
            text-align: center;
          }
        }
        .orgName,.fq,.ld{
          padding: .2rem .3rem;
          font-size: .28rem;
          color: #333;
          line-height: 1.2;
          border-bottom: 1px solid #e9e9e9;
        }
        .all{
          position: relative;
          margin-top: .1rem;
          line-height: 1.5;
          padding-left: .5rem;
          font-size: .28rem;
          color: #999;
          span{
            color: #333;
          }
          &::before{
            position: absolute;
            left: .3rem;
            top: 50%;
            transform: translate(0,-50%);
            display: block;
            width: 5px;
            height: 5px;
            content: '';
            border-radius: 3px;
            background: #CDCDCD;
          }
        }
        .noCheck{
          position: relative;
          margin-top: .1rem;
          line-height: 1.5;
          padding-left: .5rem;
          font-size: .28rem;
          color: #999;
          span{
            color: #333;
          }
          &::before{
            position: absolute;
            left: .3rem;
            top: 50%;
            transform: translate(0,-50%);
            display: block;
            width: 5px;
            height: 5px;
            content: '';
            border-radius: 3px;
            background: #F97E48;
          }
        }
        .hasCheck{
          position: relative;
          margin-top: .1rem;
          line-height: 1.5;
          padding-left: .5rem;
          font-size: .28rem;
          color: #999;
          span{
            color: #333;
          }
          &::before{
            position: absolute;
            left: .3rem;
            top: 50%;
            transform: translate(0,-50%);
            display: block;
            width: 5px;
            height: 5px;
            content: '';
            border-radius: 3px;
            background: #3395ff;
          }
        }
      }
    }
  }
</style>

