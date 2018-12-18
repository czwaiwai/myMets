<template>
  <div class="page reserve">
    <nav-title title="预订详情"></nav-title>
    <div class="page_bd _content">
      <div class="date">
        <div class="selectItem clearfix" @click.stop="toArchives">
          <span class="name">会议室</span>
          <span class="value textLeft textColor">{{detailData.Meet}}</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="selectItem clearfix">
          <span class="name">会议日期</span>
          <span class="value textLeft">{{com_date(detailData.MeetTime)}}</span>
        </div>
        <div class="selectItem noneBb">
          <span class="name">预订时段</span>
          <span class="value textLeft">{{detailData.STime}} — {{detailData.ETime}}</span>
        </div>
      </div>
      <theme :detailData.sync="detailData" @setSelectList="setSelectList"></theme>
      <attendee :detailData.sync="detailData" @setSelectList="setSelectList"></attendee>
      <facilities :detailData.sync="detailData" :equipMatchingList.sync="equipMatchingList"></facilities>
      <service :detailData.sync="detailData" :serviceList.sync="serviceList"></service>
      <remark :detailData.sync="detailData"></remark>
      <more :detailData.sync="detailData" @setSelectList="setSelectList"></more>
    </div>
    <div class="_footer" v-if="detailData.BookStatus==='HB'">
      <div class="btn" @click.stop="confirm">保存</div>
    </div>
    <select-list ref="selectList" :selectData="selectData" @selectItem="selectItem"></select-list>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import selectList from '@/components/selectList'
import dateChange from '@/mixins/dateChange'
import theme from './children/theme.vue'
import attendee from './children/attendee.vue'
import facilities from './children/facilities.vue'
import service from './children/service.vue'
import remark from './children/remark.vue'
import more from './children/more.vue'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
export default {
  name: 'reserve',
  components: {navTitle, selectList, theme, attendee, facilities, service, remark, more},
  mixins: [dateChange],
  data () {
    return {
      showMore: false,
      detailData: {
        BookStatus: '',
        Participants: [],
        BookName: '',
        CognitiveWayName: ''
      },
      equipMatchingList: [],
      serviceList: [],
      selectData: {
        title: '',
        type: '',
        list: []
      },
      isHttping: false
    }
  },
  computed: {
    ...mapGetters({
      locationData: 'getMeetingLocation'
    })
  },
  methods: {
    // 到会议室详情
    toArchives () {
      this.$router.push({
        name: 'archives',
        params: {
          id: this.detailData.MeetID
        },
        query: {
          title: this.detailData.Meet
        }
      })
    },
    // 修改保存
    async confirm () {
      console.log('detailData:', this.detailData)
      if (this.isHttping) {
        return
      }
      this.isHttping = true
      let obj = this.getHttpObj()
      console.log(obj)
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingMyBookedDetailUpdate', obj)
      console.log('confirm', res)
      if (res.status === 200 || res.status === '200') {
        this.$toast('修改预订成功')
        setTimeout(() => {
          this.isHttping = false
          this.$router.go(-1)
        }, 2000)
      } else {
        this.$toast('修改预订失败')
        this.isHttping = false
      }
      this.$indicator.close()
    },
    // 获取保存参数
    getHttpObj () {
      let participants = []
      let facilities = []
      let service = []
      this.detailData.Participants.forEach(arr => {
        let obj = {
          ID: arr.ID,
          Names: arr.Names
        }
        participants.push(obj)
      })
      this.equipMatchingList.forEach(arr => {
        if (arr.isSelect) {
          let obj = {
            ID: arr.ID,
            MaterialsnName: arr.MaterialsnName
          }
          facilities.push(obj)
        }
      })
      this.serviceList.forEach(arr => {
        if (arr.isSelect) {
          let obj = {
            ID: arr.ID,
            Service_Code: arr.ServiceDesc
          }
          service.push(obj)
        }
      })
      let obj = {
        ID: this.detailData.ID,
        MeetNumber: this.detailData.MeetNumber,
        MeetUse: this.detailData.MeetUse,
        MeetName: this.detailData.MeetName,
        BookName: this.detailData.BookName,
        BookID: this.detailData.BookID,
        BookPhone: this.detailData.BookPhone,
        Memo: this.detailData.Memo,
        MeetForm: this.detailData.MeetForm,
        UserDepartments: this.detailData.UserDepartments,
        MeetPerson: this.detailData.MeetPerson,
        Phone: this.detailData.Phone,
        Email: this.detailData.Email,
        UnitPrice: this.detailData.UnitPrice,
        AdvanceMoney: this.detailData.AdvanceMoney,
        MeettingContent: this.detailData.MeettingContent,
        OtherMeettingPerson: this.detailData.OtherMeettingPerson,
        MeetPackage: this.detailData.MeetPackage,
        EmployeeID: this.locationData.employeeId,
        Participants: participants,
        Facilities: facilities,
        Service: service
      }
      return obj
    },
    // 初始化选择列表
    setSelectList (listData) {
      this.selectData = listData
      this.$refs.selectList.show()
    },
    // 在列表中选择某选项
    selectItem (item) {
      if (this.selectData.type === 'Participants') {
        let flag = false
        let _index = 0
        this.detailData.Participants.forEach((arr, index) => {
          if (arr.Id === item.value) {
            flag = true
            _index = index
          }
        })
        if (flag) {
          this.detailData.Participants.splice(_index, 1)
        }
        let obj = {
          Names: item.showText,
          ID: item.value
        }
        this.detailData.Participants.push(obj)
      } else {
        this.detailData[this.selectData.type] = item.showText
      }
    },
    // 获取会议室设备配套
    async getEquipMatching () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetFileEquip', {
        'MeetID': this.detailData.MeetID
      })
      console.log('Facilities', res)
      res.data.forEach((arr, index) => {
        let flag = false
        this.detailData.Facilities.forEach(a => {
          if (a.ID === arr.ID) {
            flag = true
          }
        })
        arr.isSelect = flag
      })
      this.equipMatchingList = res.data
      this.$indicator.close()
    },
    // 获取服务清单
    async getFileService () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetFileService', {
        'MeetID': this.detailData.MeetID
      })
      console.log('getFileService', res)
      res.data.forEach((arr, index) => {
        let flag = false
        this.detailData.Service.forEach(a => {
          if (a.ID === arr.ID) {
            flag = true
          }
        })
        arr.isSelect = flag
      })
      this.serviceList = res.data
      this.$indicator.close()
    },
    // 获取预定详情数据
    async getData () {
      this.$indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingMyBookedDetail', {
        'MeetID': this.$route.params.id
      })
      this.detailData = res.data[0]
      this.com_num('UnitPrice')
      this.com_num('AdvanceMoney')
      console.log('res:', this.detailData)
      if (this.detailData.BookStatus === 'HB') {
        this.getEquipMatching()
        this.getFileService()
      }
      this.$indicator.close()
    },
    // 多位小数处理
    com_num (name) {
      if (this.detailData[name].length) {
        this.detailData[name] = (this.detailData[name] - 0).toFixed(2)
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
  ._content{
    .date{
      padding-left: .3rem;
      background: #fff;
    }
  }
  ._footer{
    .btn{
      height: .8rem;
      font-size: .34rem;
      color: #fff;
      background: #0DC88C;
      border-radius: 3px;
      text-align: center;
      line-height: .8rem;
    }
  }
  .textColor{
    color: #3395FF !important;
  }
</style>
