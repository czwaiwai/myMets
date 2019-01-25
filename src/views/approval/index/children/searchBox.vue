<template>
  <div class="searchBox clearfix">
    <div class="header-wrap clearfix">
      <div class="search clearfix" @click.stop="toSearch">
        <i class="iconfont icon-sousuo"></i>
        <span>请输入任务主题或申请人</span>
      </div>
    </div>
    <i class="iconfont icon-shaixuan" @click.stop="clickSelectBtn"></i>
    <collapse-transition>
      <div class="selectList" v-show="showBox">
        <div class="type">
          <h3 class="title">类型</h3>
          <ul class="list clearfix">
            <li class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in typesList" :key="index" @click.stop="selectType(item)">{{item.ShowText}}</li>
          </ul>
        </div>
        <div class="time">
          <h3 class="title">创建时间</h3>
          <ul class="list clearfix">
            <li class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in timesList" :key="index"  @click.stop="selectTime(item)">{{item.name}}</li>
          </ul>
        </div>
        <collapse-transition>
          <div class="timeList" v-show="showInputTime">
            <div class="selectItem clearfix"  @click.stop="openPicker('startTime')">
              <span class="name">开始时间：</span>
              <span class="value textLeft" v-if="dateTimes.startTime">{{dateTimes.startTime}}</span>
              <span class="value" v-else >请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
            <div class="selectItem clearfix"  @click.stop="openPicker('endTime')">
              <span class="name">结束时间：</span>
              <span class="value textLeft" v-if="dateTimes.endTime">{{dateTimes.endTime}}</span>
              <span class="value" v-else >请选择</span>
              <i class="iconfont icon-tubiao- icon"></i>
            </div>
          </div>
        </collapse-transition>
        <div class="btns">
          <div class="btn" @click.stop="resetAllType">重置</div>
          <div class="btn sure" @click.stop="confirm">确定</div>
        </div>
      </div>
    </collapse-transition>
    <transition name="mark">
      <div class="mark" v-show="showMark" @click.stop="clickMark" @touchmove.prevent></div>
    </transition>
    <datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      v-model="pickerValue">
    </datetime-picker>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
import { DatetimePicker } from 'mint-ui'
import setDate from '@/mixins/setDate'
export default {
  name: 'searchBox',
  mixins: [setDate],
  components: {CollapseTransition, DatetimePicker},
  data () {
    return {
      showBox: false,
      showMark: false,
      typesList: [
        {
          Id: '',
          ShowText: '全部',
          isSelect: true
        }
      ],
      typesData: {
        Id: '',
        ShowText: '全部',
        isSelect: true
      },
      timesList: [],
      showInputTime: false,
      pickerValue: '',
      dateTimes: {
        type: 0,
        name: '',
        startTime: '',
        endTime: ''
      },
      selectData: {
        typesData: {
          Id: '',
          ShowText: '全部',
          isSelect: true
        },
        timesData: {
          type: 0,
          name: '',
          startTime: '',
          endTime: ''
        }
      }
    }
  },
  methods: {
    // 重置筛选
    resetAllType () {
      this.typesList.forEach(arr => {
        if (arr.Id === '') {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.timesList.forEach(arr => {
        if (arr.type === 0) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.showInputTime = false
      this.typesData = {
        Id: '',
        ShowText: '全部',
        isSelect: true
      }
      this.dateTimes = {
        type: 0,
        name: '',
        startTime: '',
        endTime: ''
      }
    },
    // 确定选择
    confirm () {
      this.selectData.typesData = this.typesData
      this.selectData.timesData = this.dateTimes
      console.log('selectData:', this.selectData)
      this.showBox = false
      this.showMark = false
      this.$emit('setSelectType', this.selectData)
    },
    // 选择类型
    selectType (item) {
      if (item.isSelect) {
        return
      }
      this.typesList.forEach(arr => {
        if (arr.Id === item.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.typesData = item
    },
    // 选择时间
    async selectTime (item) {
      if (item.isSelect) {
        return
      }
      this.timesList.forEach(arr => {
        if (arr.type === item.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      let times = {}
      if (item.type === 5) {
        this.showInputTime = true
        this.dateTimes = {
          type: 5,
          name: '',
          startTime: '',
          endTime: ''
        }
      } else {
        this.showInputTime = false
        times = await this.typeToTime(item.type)
        this.dateTimes = {
          type: item.type,
          name: '',
          startTime: times.startTime,
          endTime: times.endTime
        }
      }
      console.log('dateTimes:', this.dateTimes)
    },
    // 时间类型转具体时间
    async typeToTime (type) {
      let startTime = ''
      let endTime = ''
      switch (type) {
        case 0:
          startTime = ''
          endTime = ''
          break
        case 1:
          startTime = await this.getWeekStartDate()
          endTime = await this.getWeekEndDate()
          break
        case 2:
          startTime = await this.getMonthStartDate()
          endTime = await this.getMonthEndDate()
          break
        case 3:
          startTime = await this.getQuarterStartDate()
          endTime = await this.getQuarterEndDate()
          break
        case 4:
          startTime = await this.getYearStartDate()
          endTime = await this.getYearEndDate()
          break
      }
      return {
        startTime: startTime,
        endTime: endTime
      }
    },
    // 确定时间
    handleConfirm (date) {
      this.dateTimes[this.dateTimes.name] = date.format('yyyy-MM-dd')
      console.log('dateTimes:', this.dateTimes)
    },
    // 打开时间选择器
    openPicker (type) {
      this.$refs.picker.open()
      this.dateTimes.type = 5
      this.dateTimes.name = type
      this.pickerValue = this.dateTimes[type] || new Date()
    },
    // 点击筛选按钮
    async clickSelectBtn () {
      this.showBox = !this.showBox
      if (this.showBox) {
        if (this.typesList.length === 1) {
          this.setInitTimesList()
          await this.getListData()
          console.log('typeslist:', this.typesList)
        } else {
          await this.setInitData()
        }
        this.$nextTick(() => {
          this.showMark = true
          this.$emit('isShow')
        })
      } else {
        this.showMark = false
      }
    },
    // 获取类型列表
    async getListData () {
      let res = await this.$xml('UserAudit_GetWorkflowTypes', {})
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        res.data.Syswin.forEach(arr => {
          arr.isSelect = false
        })
        this.typesList = this.typesList.concat(res.data.Syswin)
      }
      return true
    },
    // 设置上次选择数据
    async setInitData () {
      this.typesList.forEach(arr => {
        if (arr.Id === this.selectData.typesData.Id) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.timesList.forEach(arr => {
        if (arr.type === this.selectData.timesData.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.dateTimes = this.selectData.timesData
      if (this.selectData.timesData.type === 5) {
        this.showInputTime = true
      }
      return true
    },
    // 点击蒙层关闭
    clickMark () {
      this.showBox = false
      this.showMark = false
    },
    // 到搜索
    toSearch () {
      this.$router.push({
        name: `approvalSearch`
      })
    },
    // 设置时间列表
    setInitTimesList () {
      this.timesList = [
        {
          name: '全部',
          type: 0,
          isSelect: true
        },
        {
          name: '本周',
          type: 1,
          isSelect: false
        },
        {
          name: '本月',
          type: 2,
          isSelect: false
        },
        {
          name: '本季',
          type: 3,
          isSelect: false
        },
        {
          name: '本年',
          type: 4,
          isSelect: false
        },
        {
          name: '自定义',
          type: 5,
          isSelect: false
        }
      ]
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
  .searchBox {
    position: relative;
    top: 0;
    left: 0;
    z-index: 9;
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid #e9e9e9;
    .header-wrap{
      float: left;
      width: 6.08rem;
      height: .68rem;
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
  }
  .selectList{
    position: absolute;
    top: 1.08rem;
    left: 0;
    width: 100vw;
    z-index: 999;
    background: #fff;
    .type, .time{
      padding-left: .3rem;
      border-bottom: 1px solid #ededed;
      .title{
        height: .8rem;
        font-size: .3rem;
        color: #333;
        line-height: .8rem;
      }
      .list{
        .items{
          float: left;
          margin-right: .2rem;
          margin-bottom: .2rem;
          width: 1.58rem;
          height: .58rem;
          border: 1px solid #ededed;
          border-radius: 4px;
          font-size: .22rem;
          line-height: .58rem;
          text-align: center;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:nth-child(4n) {
            margin-right: 0;
          }
          &.isSelect{
            border-color: #3395FF;
            background-color: #E9F4FF;
            color: #3395FF;
          }
        }
      }
    }
    .timeList{
      .selectItem{
        padding-left: .3rem;
      }
    }
    .btns{
      display: flex;
      width: 100vw;
      height: .88rem;
      .btn{
        flex: 1;
        font-size: .3rem;
        color: #333;
        line-height: .88rem;
        text-align: center;
        &.sure{
          color: #fff;
          background: #3395FF;
        }
      }
    }
  }
  .mark-enter-active, .mark-leave-active {
    transition: opacity .3s;
    -webkit-transform: opacity .3s;
  }
  .mark-enter, .mark-leave-active {
    opacity: 0
  }
  .mark{
    position: absolute;
    top: 1.08rem;
    left: 0;
    z-index: 998;
    width: 100vw;
    height: calc(100vh - 1.96rem);
    background: #000;
    opacity: .5;
    overflow: hidden;
  }
</style>
