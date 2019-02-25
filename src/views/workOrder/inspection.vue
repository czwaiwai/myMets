<template>
    <div class="page">
      <!-- <mt-header :title="typeTxt+'工单'">
        <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
      </mt-header> -->
      <nav-title :title="typeTxt+'工单'"></nav-title>
      <div class="weui-flex">
        <div class="weui-flex__item">
          <search v-model="searchKey"  placeholder="扫码或输设备号、设备名"  :noFocus="true" @searchRes="searchRes" >
            <i slot="icon" @click="scanHandle" class="weui-icon-search iconfont icon-scancode"></i>
          </search>
        </div>
        <div @click="filterVisible = true" class="search_border padding-right padding-left5"><i class="main_color iconfont icon-shaixuan" style="font-size: 23px; line-height: 43px;"></i></div>
      </div>
      <filter-modal :form.sync='filterForm' :validate="filterValidate" v-model="filterVisible" @submit="filterSubmit">
          <filter-radio name="timeTag" v-model="filterForm.timeTag" :data-list="radioList">时间筛选</filter-radio>
          <filter-date-end v-if="filterForm.timeTag==='cus'" name="dateEnd" v-model="filterForm.dateEnd" >自定义<span class="dark_99">(最多可查询7天)</span></filter-date-end>
        <!--  <filter-radio name="group" v-model="filterForm.group">合同状态</filter-radio>
          <filter-checkbox name="group1" v-model="filterForm.group1">多选</filter-checkbox> -->
      </filter-modal>
      <div  v-if="currNav.state==='2' && downloadEdit" class="download_ft">
        <div class="weui-flex">
          <div class="weui-flex__item item_center download_check_all">
            <a @click="checkAllHandle" class="check main_color"><i class="iconfont icon-Ellipse" style="font-size:20px;" :class="isCheckAll?'icon-select-copy':'icon-Ellipse'"></i>  全选</a>
          </div>
          <div @click="downloadAll"  class="download_all_btn">全部离线({{currNav.badge}})</div>
          <div @click="downloadChoose" class="download_choose_btn">离线选中({{checkNums}})</div>
        </div>
      </div>
        <div>
          <navbar :list="typeList" v-model="currIndex"></navbar>
          <div class="page_sub_hd weui-flex padding15-h">
            <div class="weui-flex__item">{{searchTxt}}</div>
            <a @click="downloadEdit = !downloadEdit" v-if="currNav.state==='2'" href="javascript:void(0)" class="main_color">{{downloadEdit? '取消':'离线下载'}}</a>
          </div>
        </div>
        <component ref="inslist" :params="currConfig.params" @listDone="listDone"  :is="currIndex" :config="currConfig" >
          <template slot-scope="scope" >
            <div class="weui-panel weui-panel_access margin-bottom">
              <div @click="routeTo(scope.item)"   class="weui-panel__hd">
                <a v-if="currNav.state==='2' && downloadEdit" @click.stop="checkItem(scope.item)" class="padding-right main_color" href="javascript:void(0)"><i class="iconfont" style="font-size:20px;line-height:16px;" :class="scope.item.check?'icon-select-copy':'icon-Ellipse'"></i></a>
                <i class="iconfont icon-building-automation padding-right5 "></i>{{nav.orgName}}
                <span class="float_right">
                  <span class="main_color" v-if="scope.item.WorkState === '2'">请{{typeTxt}}</span>
                  <span class="main_color" v-if="scope.item.WorkState === '3'">{{typeTxt}}人已提交</span>
                  <span class="dark_99" v-if="scope.item.WorkState === '4'">完成</span>
                </span>
              </div>
              <div @click="routeTo(scope.item)"  class="weui-panel__bd" >
                <div class="weui-media-box weui-media-box_text" style="padding-bottom:5px">
                  <h4 class="weui-media-box__title">{{scope.item.PlanName}}</h4>
                  <p><span class="dark_99">巡 检 人:</span> {{scope.item.Principal}}</p>
                  <p><span class="dark_99">开始时间:</span> {{scope.item.PlanStartTime}}</p>
                </div>
              </div>
              <div class="weui-panel__ft text-right padding-right15 padding-bottom">
                <!--hasTransferOrder//不知道怎么来的 item.WorkState==='2' && hasTransferOrder==='true' -->
                <button @click="covertOrder(scope.item)" class="ins_btn ins_btn_plain_default"  v-if="com_status(scope.item.WorkState)">转单</button>
                <button @click="routeTo(scope.item)"   class="ins_btn ins_btn_plain_primary" v-if="scope.item.WorkState==='2'">{{typeTxt}}</button>
                <button @click="closeOrder(scope.item)"  class="ins_btn ins_btn_plain_primary"   v-if="scope.item.WorkState==='3'">关闭</button>
              </div>
            </div>
          </template>
        </component>
        <transition name="page">
          <!-- <keep-alive > -->
            <router-view/>
          <!-- </keep-alive> -->
        </transition>
        <div v-if="progressMask" class="progress_mask">
          <div style="padding:60vw 15px">
            <mt-progress :value="offlineRate" :bar-height="10"></mt-progress>
            <p class="light text-center">(已完成{{offlineRate}}%)正在离线请耐心等待...</p>
          </div>
        </div>
    </div>
</template>
<script>
import { Progress } from 'mint-ui'
import Search from '@/components/search'
import FilterModal from '@/components/filterModal'
import FilterDate from '@/components/filter/date'
import FilterDateEnd from '@/components/filter/dateEnd'
import FilterRadio from '@/components/filter/radio'
// import FilterCheckbox from '@/components/filter/checkbox'

import {mapGetters} from 'Vuex'
import navbar from '@/components/navbar'
import PageList from '@/components/pageList'
import navTitle from '@/components/navTitle'
/*
          @param arr Array
          @param cut int
          @param function
          @return Promise
          asyncForEach (arr, cut ,function (marr, index, next))
       */
function asyncForEach (arr, cut, fn) {
  var asyncList = listSlice()
  // 拆分数组异步执行
  function listSlice () {
    var cutIndex = 0
    var realCut = 0
    // var i = 0
    return function cut (arr, cut, fn, success, error) {
      fn(getMArr(), next, cutIndex)
      function next (isBool) {
        // i++
        if (isBool) {
          cutIndex = realCut
          if (cutIndex === arr.length) {
            return success && success(cutIndex)
          }
          fn(getMArr(), next, cutIndex)
        } else {
          return error && error(cutIndex)
        }
      }
      function getMArr () {
        realCut = cutIndex + cut
        if (realCut >= arr.length) {
          realCut = arr.length
        }
        console.log(cutIndex, realCut)
        return arr.slice(cutIndex, realCut)
      }
    }
  }
  return new Promise(function (resolve, reject) {
    asyncList(arr, cut, fn, resolve, reject)
  })
}
export default {
  name: 'inspection',
  components: {
    navTitle,
    MtProgress: Progress,
    Search,
    FilterModal,
    FilterDate,
    FilterDateEnd,
    FilterRadio,
    navbar,
    all: PageList,
    waiting: PageList,
    closing: PageList,
    closed: PageList
  },
  data () {
    return {
      typeTxt: '巡检',
      currIndex: 'all',
      title: '',
      searchKey: '',
      searchTxt: '全部工单',
      filterVisible: false,
      filterForm: {
        timeTag: '',
        dateEnd: ''
      },
      radioList: [{name: '本日', value: '1'}, {name: '本周', value: '2'}, {name: '最近7天', value: '3'}, {name: '自定义', value: 'cus'}],
      downloadEdit: false,
      search: {
        startTime: '',
        endTime: ''
      },
      currList: [],
      progressMask: false, // 进度条遮罩
      offlineRate: 0,
      workItem: {},
      typeList: [
        {id: 'all', name: '全部', state: '1', badge: ''},
        {id: 'waiting', name: '待巡检', state: '2', badge: ''},
        {id: 'closing', name: '待关闭', state: '3', badge: ''},
        {id: 'closed', name: '已关闭', state: '4', badge: ''}
      ]
    }
  },
  created () {
    // Inspection：巡检 KeepFit：保养
    this.orderType = this.$route.query.orderType || 'Inspection'
    if (this.orderType === 'KeepFit') {
      this.typeTxt = '保养'
      this.typeList[1].name = '待' + this.typeTxt
    }
    this.nav = {
      orgId: this.user.OrgID || '11091315263400010000',
      orgName: this.user.OrgName,
      userName: this.user.UserID,
      memberId: this.user.memberId || '30'
    }
    this.getThreeMouth()
    this.getStatus()
    // this.configList = this.typeList.map(item => {
    //   return this.createListConfig(item.id, {orderState: item.state})
    // })
    this.configList = this.typeList.map(item => {
      return this.createListConfigNet(item.id, {eventStateId: item.state})
    })
    console.log(this.configList, 'configList')
  },
  computed: {
    ...mapGetters({
      'auth': 'auth',
      'user': 'user'
    }),
    currNav () {
      return this.typeList.find(item => item.id === this.currIndex) || {}
    },
    currConfig () {
      return this.configList.find(item => item.name === this.currIndex) || {}
    },
    // 是否是全选
    isCheckAll: function () {
      return this.checkNums === this.currList.length
    },
    // 当前选中数量
    checkNums: function () {
      return this.currList.reduce((before, item) => {
        if (item.check) {
          before++
        }
        return before
      }, 0)
    },
    // 所有选中项对象
    chooseList: function () {
      return this.currList.filter(item => item.check)
    }
  },
  watch: {
    currNav (val) {
      if (val) {
        this.downloadEdit = false
      }
    }
  },
  methods: {
    // 转单按钮
    com_status (workState) {
      if (workState === '2') {
        if (this.$route.query.orderType && this.auth.APP_Maintain_SwitchSingle) {
          return true
        } else if (this.auth.APP_Inspection_SwitchSingle) {
          return true
        }
      }
      return false
    },
    // 扫一扫
    async scanHandle () {
      let res = await this.$app.scan()
      this.searchKey = res
      this.searchRes()
      console.log(res)
    },
    searchRes () {
      this.currConfig.params.PCode = this.searchKey
      this.currConfig.params.QueryStarTime = this.search.startTime
      this.currConfig.params.QueryEndTime = this.search.endTime
      this.configList = this.typeList.map(item => {
        return this.createListConfigNet(item.id, {
          // orderState: item.state,
          // pageSize: 15,
          // code: this.searchKey,
          // queryStarTime: this.search.startTime,
          // queryEndTime: this.search.endTime
          eventStateId: item.state,
          'PCode': this.searchKey,
          pageSize: 15,
          'QueryStarTime': this.search.startTime,
          'QueryEndTime': this.search.endTime
        })
      })
      this.refresh()
    },
    filterValidate (form) {
      if (form.timeTag === 'cus') {
        if (!form.dateEnd) {
          this.$toast('请输入自定义查询范围')
          return false
        }
        let dateArr = form.dateEnd.split(',')
        var end = new Date(dateArr[1])
        var before = new Date(dateArr[0])
        before.setDate(before.getDate() + 6)
        if (end.valueOf() > before.valueOf()) {
          this.$toast('最多只能查询7天内的数据')
          return false
        }
      }
      return true
    },
    filterSubmit (form) {
      if (!form.timeTag) {
        form.dateEnd = ''
      }
      switch (form.timeTag) {
        case '1': this.searchTxt = '本日工单'; this.getDayObj(); break
        case '2': this.searchTxt = '本周工单'; this.getWeek(); break
        case '3': this.searchTxt = '最近7天'; this.getLastSevenDay(); break
        case 'cus':
          this.searchTxt = '自定义:' + form.dateEnd.replace(',', '-')
          this.cusDate(form.dateEnd); break
        default:this.searchTxt = '全部工单'; this.getThreeMouth(); break
      }
      this.searchRes()
    },
    // 离线相关 ----------------------------------
    listDone (list) {
      this.currList = list
    },
    checkAllHandle () {
      if (this.isCheckAll) {
        this.currList.forEach(item => {
          item.check = false
        })
      } else {
        this.currList.forEach(item => {
          item.check = true
        })
      }
    },
    checkItem (item) {
      this.currList = this.$refs.inslist.getList()
      item.check = !item.check
    },
    // 全部离线
    async downloadAll () {
      if (this.currList.length === 0) {
        return this.$toast('没有可离线的数据')
      }
      await this.$message.confirm('确定要离线所有么?')
      let p0 = 'EquipBase_GetInspectionInfoH5'
      let res = await this.$xml(p0, {
        'strOrgID': this.nav.orgId,
        'strCstID': this.nav.memberId,
        'strAppWordType': this.orderType,
        'PCode': this.searchKey,
        'eventStateId': '2',
        'QueryStarTime': this.search.startTime,
        'QueryEndTime': this.search.endTime,
        'STID': ''
      })
      // var param = {
      //   projId: this.nav.orgId,
      //   memberId: this.nav.memberId,
      //   orderState: '2',
      //   orderType: this.orderType,
      //   code: this.searchKey,
      //   stid: '',
      // }
      // param.queryStarTime = this.search.startTime
      // param.queryEndTime = this.search.endTime
      // let res = await this.$http.post('/ets/table/list/equipBaseGetInspectionInfoH5', param)
      if (res.data && res.data[0]) {
        let list = res.data[0].EquiInfo
        if (list.length > 0) {
          this.offlineProcess(list)
        } else {
          this.$toast('没有可离线的数据')
        }
      }
    },
    // 获取巡检设备检查项信息
    async getOfflineDetail (param) {
      let p0 = 'EquipBase_GetInspectionEquipmentH5'
      let res = await this.$xml(p0, param)
      // let url = '/ets/table/list/equipBaseGetInspectionEquipmentH5'
      // let res = await this.$http.post(url, param)
      if (res.data && res.data[0]) {
        return res.data
      }
    },
    // 离线选中
    async downloadChoose () {
      if (this.chooseList.length > 0) {
        await this.$message.confirm('确定离线选中的' + this.chooseList.length + '项么?')
        this.offlineProcess(this.chooseList)
      } else {
        return this.$toast('请先选择要离线的工单')
      }
    },
    async offlineProcess (list) {
      try {
        var resList = []
        var len = 4
        this.progressMask = true
        this.offlineRate = 0
        var index = await asyncForEach(list, len, (arr, next, cutIndex) => {
          var i = 0
          this.offlineRate = parseFloat((parseFloat(cutIndex / list.length) * 100).toFixed(2))
          arr.forEach((item) => {
            resList.push(item)
            setTimeout(async () => {
              try {
                let data = await this.getOfflineDetail({
                  'OrgID': this.nav.orgId,
                  'BillID': item.WorkID,
                  'CaseID': item.CaseID,
                  'IsCase': item.IsCase
                  // projId: this.nav.orgId,
                  // workID: item.WorkID,
                  // caseID: item.CaseID,
                  // isCase: item.IsCase
                })
                i++
                if (data.length > 0) {
                  if (item.IsCase === '1') {
                    item['LuXianInfo'] = data
                  } else {
                    item['LuXianInfo'] = [
                      {
                        AddressID: '',
                        AddressName: '',
                        Memo: '',
                        OrgID: this.nav.orgId,
                        SortOrder: '',
                        EquiInfo: data || []
                      }
                    ]
                  }
                }
                if (i === arr.length) {
                  next(true)
                }
              } catch (err) {
                next(false)
              }
            }, 300)
          })
        })
        if (index) {
          console.log('统计完成调用api离线')
          let isBool = await this.$app.addXJBYData({
            callback: 'androidNativeOffline',
            data: {
              orgId: this.nav.orgId,
              orgName: this.nav.orgName,
              GongDanInfo: resList,
              memberId: this.nav.memberId,
              Totalcount: resList.length
            }
          })
          if (isBool) {
            this.$toast('离线成功')
            setTimeout(() => this.$app.jumpOffline(), 1500)
          }
          this.offlineRate = 100
          this.progressMask = false
        }
      } catch (error) {
        this.$toast('离线出错了,请稍后再试~')
        console.log(error)
        this.progressMask = false
        this.offlineRate = 0
      }
    },
    // 离线相关结束----------------------------
    // 刷新当前列表页
    refresh () {
      this.getStatus()
      this.$refs.inslist.refresh()
    },
    routeTo (item) {
      if (this.downloadEdit) return
      console.log(item)
      this.workItem = item
      this.$router.push({path: this.$route.path + '/detail/' + item.WorkID})
    },
    // 转单
    covertOrder (obj) {
      console.log(obj, 'order')
      this.$router.push({path: this.$route.path + '/personSelector', query: {workId: obj.WorkID}})
    },
    // 转单结果
    async setPerson (item, query) {
      let p0 = 'EquipBase_SingleBill'
      await this.$xml(p0, {
        'OrgID': item.PositionID,
        'WorkOrdID': query.workId,
        'WorkType': this.orderType,
        'OrdersID': item.EmployeeID,
        'Orders': item.EmployeeName
      }, {
        p1: this.nav.userName
      })
      // let url = '/ets/syswin/smd/equipBaseSingleBill'
      // await this.$http.post(url, {
      //   orgID: item.PositionID,
      //   workOrdID: query.workId,
      //   workType: this.orderType,
      //   ordersID: item.EmployeeID,
      //   orders: item.EmployeeName
      // })
      // 刷新当前列表
      this.refresh()
      // 发送消息
      try {
        await this.sendMsg(item, query.workId)
        // 提示
        this.$toast('转单成功并推送消息')
      } catch (e) {
        console.log(e)
        this.$toast('转单成功但推送失败')
      }
    },
    // 推送消息
    async sendMsg (data, workId) {
      let params = {
        'ID': workId,
        'Type': 'E_' + this.orderType,
        'Title': this.typeTxt + '工单',
        'Content': '您有一个新的转单工单，请及时处理',
        'Tag': data.UserId,
        'Status': '1',
        'FromTag': ''
      }
      let p0 = 'AppWeChat_JGWorkPush'
      let res = await this.$xml(p0, params)
      return res
      // let url = '/ets/message/getMessage'
      // await this.$http.post(url, { // 暂无.net接口
      //   id: workId,
      //   type: 'E_' + this.orderType, // [E_Inspection, E_KeepFit]
      //   title: this.typeTxt + '工单', // [巡检工单, 保养工单]
      //   content: '您有一个新的转单工单，请及时处理',
      //   tag: data.UserId,
      //   status: '1'
      // })
    },
    createListConfigNet (name, params) {
      return {
        name: name,
        // url: '/ets/table/list/equipBaseGetInspectionInfoH5',
        url: 'EquipBase_GetInspectionInfoH5',
        xml: true,
        params: {
          'strOrgID': this.nav.orgId,
          'strCstID': this.nav.memberId,
          'strAppWordType': this.orderType,
          'PCode': this.searchKey,
          pageSize: 15,
          'QueryStarTime': this.search.startTime,
          'QueryEndTime': this.search.endTime,
          'STID': '',

          // projectID: this.nav.orgId,
          // EmployeeID: this.nav.memberId,
          // WorkPosFrom: this.orderType,
          // starTime: '1', // 1为升序其他都为降序
          // code: '', // search 筛选
          // pageSize: 15,
          // stid: '',
          ...params
        },
        format: function (res) {
          let data = res[0]
          return data.EquiInfo.map(item => {
            item.check = false
            return item
          })
        }
      }
    },
    // createListConfig (name, params) {
    //   return {
    //     name: name,
    //     url: '/ets/table/list/equipBaseGetInspectionInfoH5',
    //     params: {
    //       projId: this.nav.orgId,
    //       memberId: this.nav.memberId,
    //       orderType: this.orderType,
    //       starTime: '1', // 1为升序其他都为降序
    //       code: '', // search 筛选
    //       pageSize: 15,
    //       queryStarTime: this.search.startTime,
    //       queryEndTime: this.search.endTime,
    //       stid: '',
    //       ...params
    //     },
    //     format: function (data) {
    //       return data.EquiInfo.map(item => {
    //         item.check = false
    //         return item
    //       })
    //     }
    //   }
    // },
    async getStatus () {
      let p0 = 'EquipBase_GetInspectionCount'
      let res = await this.$xml(p0, {
        strOrgID: this.nav.orgId,
        strCstID: this.nav.memberId,
        strAppWordType: this.orderType,
        QueryStarTime: this.search.startTime,
        QueryEndTime: this.search.endTime
      })

      // let url = '/ets/syswin/smd/equipBaseGetInspectionCount'
      // let res = await this.$http.post(url, {
      //   strOrgId: this.nav.orgId,
      //   strCstId: this.nav.memberId,
      //   strAppWordType: this.orderType,
      //   queryStarTime: this.search.startTime,
      //   queryEndTime: this.search.endTime
      // })
      res.data.map((item, index) => {
        this.typeList[index].name = item['GDName']
        this.typeList[index].badge = item['GDCount']
        this.typeList[index].state = item['State']
      })
    },
    // 获取3个月的时间
    getThreeMouth: function () {
      let before = new Date()
      let end = new Date()
      before.setMonth(before.getMonth() - 1)
      before.setDate(1)
      end.setMonth(end.getMonth() + 2)
      end.setDate(0)
      this.search = {
        startTime: before.format('yyyy-MM-dd') + ' 00:00:00',
        endTime: end.format('yyyy-MM-dd') + ' 23:59:59'
      }
    },
    // 获取本日的时间
    getDayObj: function () {
      var curr = new Date()
      this.search = {
        startTime: curr.format('yyyy-MM-dd') + ' 00:00:00',
        endTime: curr.format('yyyy-MM-dd') + ' 23:59:59'
      }
    },
    // 获取本周的时间
    getWeek: function () {
      var before = new Date()
      var end = new Date()
      var weekDay = before.getDay()
      weekDay = weekDay - 1
      before.setDate(before.getDate() - weekDay)
      end.setDate(end.getDate() + (7 - (weekDay + 1)))
      this.search = {
        startTime: before.format('yyyy-MM-dd') + ' 00:00:00',
        endTime: end.format('yyyy-MM-dd') + ' 23:59:59'
      }
    },
    // 获取最近7天的时间
    getLastSevenDay: function () {
      var before = new Date()
      var end = new Date()
      before.setDate(before.getDate() - 3)
      end.setDate(end.getDate() + 3)
      this.search = {
        startTime: before.format('yyyy-MM-dd') + ' 00:00:00',
        endTime: end.format('yyyy-MM-dd') + ' 23:59:59'
      }
    },
    // 自定义时间
    cusDate (dateEnd) {
      let dateArr = dateEnd.split(',')
      var end = new Date(dateArr[1])
      var before = new Date(dateArr[0])
      this.search = {
        startTime: before.format('yyyy-MM-dd') + ' 00:00:00',
        endTime: end.format('yyyy-MM-dd') + ' 00:00:00'
      }
    },
    // 关闭工单
    async closeOrder (obj) {
      await this.$message.confirm('确定关闭该' + this.typeTxt + '工单？')
      let p0 = 'EquipBase_WorkCompletionColse'
      let res = await this.$xml(p0, {}, {
        p1: obj.WorkID,
        p2: obj.WordType,
        p3: obj.WorkState,
        p4: this.nav.memberId
      })
      // let url = '/ets/syswin/smd/equipBaseWorkCompletionColse'
      // let res = await this.$http.post(url, {
      //   wordId: obj.WorkID,
      //   wordType: obj.WordType,
      //   workState: obj.WorkState,
      //   opUserId: this.nav.memberId
      // })
      this.refresh()
      this.$toast('关闭' + this.typeTxt + '成功')
      console.log(res)
    }
  }
}
</script>

<style lang="scss">
.progress_mask {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.35);
}
.ins_btn + .ins_btn {
  margin-left:5px;
}
.ins_btn_plain_default{
  border-radius:5px;
  border:1px solid #999;
  padding:5px 10px;
  color:#999;
}
.ins_btn_plain_primary {
  border-radius:5px;
  border:1px solid #3395FF;
  padding:5px 10px;
  color:#3395FF;
}
.download_ft {
    position: fixed;
    width: 100%;
    padding-left: 0.3rem;
    z-index: 1;
    background: #FFF;
    border-top: 1px solid #E9E9E9;
    height: 0.98rem;
    bottom: 0;
}
.download_all_btn {
    width: 2.2rem;
    background: #FD8815;
    line-height: 0.98rem;
    color: #FFF;
    text-align: center;
}
.download_choose_btn {
    width: 2.2rem;
    background: #3395FF;
    line-height: 0.98rem;
    color: #FFF;
    text-align: center;
}
</style>
