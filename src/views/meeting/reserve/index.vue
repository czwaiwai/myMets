<template>
<div class="page_modal">
  <div class="page reserve">
    <nav-title title="预订"></nav-title>
    <div class="page_bd _content">
      <div class="date">
        <div class="selectItem">
          <span class="name">会议室</span>
          <span class="value textLeft">{{room.meetName}}</span>
        </div>
        <div class="selectItem">
          <span class="name">会议日期</span>
          <span class="value textLeft">{{com_date(dateTime)}}</span>
        </div>
        <div class="selectItem noneBb">
          <span class="name">预订时段</span>
          <span class="value textLeft">{{subDate.start}} — {{subDate.end}}</span>
        </div>
      </div>
      <div class="theme">
        <div class="inputItem clearfix">
          <span class="name">会议主题</span>
          <input class="inputs" v-model="formObj.meetName" type="text" placeholder="请输入会议主题">
        </div>
        <div class="textItem clearfix">
          <span class="name">会议内容</span>
          <textarea class="areas" v-model="formObj.meettingContent" placeholder="请输入会议内容"></textarea>
        </div>
        <div class="selectItem clearfix" @click.stop="routeTo">
          <span class="name">预订人</span>
          <span class="value textLeft" v-if="formObj.meetPerson">{{formObj.meetPerson}}</span>
          <span class="value" v-else >请选择</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="inputItem clearfix noneBb">
          <span class="name">预订人电话</span>
          <input class="inputs" type="text" v-model="formObj.bookPhone" placeholder="请输入电话">
        </div>
      </div>
      <div class="attendee">
        <div class="btnItem">
          <p class="title">参会人（已选{{formObj.participants.length}}人）</p>
          <div class="box-wrap clearfix">
            <div class="btnBox" v-for="(item,index) in formObj.participants" :key="index">
              <span>{{item.Names}}</span>
              <i @click="delPart(item.ID)" class="iconfont icon-jianshanchu-yuankuang icon"></i>
            </div>
            <div class="addBox" @click="routeTo({type: 'parti'})">+</div>
          </div>
        </div>
        <div class="inputItem clearfix noneBb">
          <span class="name">其他参会人</span>
          <input class="inputs" type="text" placeholder="请输入其他参会人">
        </div>
      </div>

      <!--
      <div class="listBtn">
        <p class="title">配套设施</p>
        <div class="box-wrap clearfix">
          <div class="btnBox" :class="{'isSelect':index%2==0}" v-for="(item,index) in 10" :key="index">
            <span>詹小小</span>
          </div>
        </div>
      </div>
      <div class="listBtn">
        <p class="title">服务清单</p>
        <div class="box-wrap clearfix">
          <div class="btnBox" :class="{'isSelect':index%2==0}" v-for="(item,index) in 10" :key="index">
            <span>詹小小</span>
          </div>
        </div>
      </div>
      <div class="remark">
        <div class="textItem clearfix noneBb">
          <span class="name">预订备注</span>
          <textarea class="areas" placeholder="请输入备注内容"></textarea>
        </div>
      </div>
      <div class="more">
        <div class="title" @click.stop="showMore=!showMore">
          <p :class="{'noneBb':!showMore}">
            <span>更多</span>
          </p>
          <i class="iconfont icon" :class="showMore?'icon-zhankai1':'icon-zhankai'"></i>
        </div>
        <transition name="slide-bottom">
          <div class="more-msg" v-show="showMore">
            <div class="msg1">
              <div class="selectItem clearfix">
                <span class="name">会议形式</span>
                <span class="value textLeft" v-if="false"></span>
                <span class="value" v-else >请选择</span>
                <i class="iconfont icon-tubiao- icon"></i>
              </div>
              <div class="selectItem clearfix">
                <span class="name">会议用途</span>
                <span class="value textLeft" v-if="false"></span>
                <span class="value" v-else >请选择</span>
                <i class="iconfont icon-tubiao- icon"></i>
              </div>
              <div class="inputItem clearfix">
                <span class="name">参会人数</span>
                <input class="inputs" type="text" placeholder="请输入参会人数">
              </div>
              <div class="inputItem clearfix noneBb">
                <span class="name">使用部门</span>
                <input class="inputs" type="text" placeholder="请输入使用部门">
              </div>
            </div>
            <div class="msg2">
              <div class="inputItem clearfix">
                <span class="name">联系人电话</span>
                <input class="inputs" type="text" placeholder="请输入联系人电话">
              </div>
              <div class="inputItem clearfix noneBb">
                <span class="name">联系人邮箱</span>
                <input class="inputs" type="text" placeholder="请输入联系人邮箱">
              </div>
            </div>
            <div class="msg3">
              <div class="inputItem clearfix">
                <span class="name">单价</span>
                <input class="inputs" type="text" placeholder="请输入单价">
              </div>
              <div class="inputItem clearfix noneBb">
                <span class="name">预收金额</span>
                <input class="inputs" type="text" placeholder="请输入预收金额">
              </div>
            </div>
          </div>
        </transition>
      </div>
      -->
    </div>
    <div class="_footer">
      <div class="btn1" @click.stop="$router.go(-1)">取消</div>
      <div class="btn2" @click.stop="submitAdd">确定</div>
    </div>
    <select-list ref="selectList" :selectData="selectData" @selectItem="selectItem"></select-list>
    <transition name="page">
      <keep-alive >
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</div>
</template>
<script>
import navTitle from '@/components/navTitle'
import selectList from '@/components/selectList'
import dateChange from '@/mixins/dateChange'
import { Indicator } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'reserve',
  mixins: [dateChange],
  components: {navTitle, selectList, Indicator},
  data () {
    return {
      showMore: false,
      detailData: {
        CognitiveWay: '',
        CognitiveWayName: ''
      },
      selectData: {
        title: '',
        type: '',
        list: []
      },
      formObj: {
        meetName: '', // 会议主题
        employeeID: '', // 预定责任人id
        meetPerson: '', // 预定责任人
        bookPhone: '', // 预定人电话
        meettingContent: '', // 会议内容
        participants: [], // 参会人合集
        userDepartments: '', // 使用部门
        otherMeettingPerson: '' // 其他参会人
      },
      subDate: {}
    }
  },
  created () {
    this.room = this.$parent.room
    this.dateTime = this.$parent.dateTime
    this.nav = {
      orgId: this.destineConfig.orgId,
      orgName: this.destineConfig.orgName
    }
    this.subDate = this.$parent.subDate
  },
  computed: {
    ...mapGetters({
      destineConfig: 'destineConfig'
    })
  },
  methods: {
    routeTo (query) {
      if (query.target) {
        this.$router.push({name: 'meetResponsibleChoose'})
      } else {
        this.$router.push({name: 'meetResponsibleChoose', query})
      }
    },
    delPart (id) {
      let index = this.formObj.participants.findIndex(item => item.ID === id)
      this.formObj.participants.splice(index, 1)
    },
    setPerson (item, query) {
      if (query.type === 'parti') {
        this.formObj.participants.push({
          ID: item['EmployeeID'],
          Names: item['EmployeeName']
        })
      } else {
        this.formObj.employeeID = item['EmployeeID']
        this.formObj.meetPerson = item['EmployeeName']
        this.formObj.bookPhone = item['Mobile']
      }
    },
    async getSelectType (type1) {
      Indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserRent_GetOptionList', {
        'TypeName': 'CognitiveWay'
      })
      console.log(res)
      res.data.forEach(arr => {
        if (this.detailData.CognitiveWay === arr.value) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.selectData.title = '预订人'
      this.selectData.list = res.data
      this.$refs.selectList.show()
    },
    selectItem (item) {
      this.detailData.CognitiveWay = item.value
      this.detailData.CognitiveWayName = item.showText
    },
    async submitAdd () {
      let res = await this.$xml('UserCS_MeetingBookedAdd', {
        'Meet': this.room.meetName, // 会议室
        'MeetTime': this.dateTime, // 会议日期
        'MeetUse': '', // 会议用途
        'MeetNumber': this.formObj.participants.length, // 参会人数
        'MeetName': this.formObj.meetName, // 会议主题
        'BookPhone': this.formObj.bookPhone, // 预定人电话
        'Memo': '', // 备注
        'MeetForm': '', // 会议形式
        'UserDepartments': '', // 使用部门
        'MeetPerson': this.formObj.meetPerson, // 预定联系人
        'Phone': this.room.phone, // 联系人电话
        'Email': '', // 联系人邮箱
        'UnitPrice': this.room.unitPrice, // 单价
        'AdvanceMoney': '0', // 预收金额
        'MeetPackage': '', // 会议套餐
        'MeetPackageID': '', // 会议套餐外键
        'MeettingContent': this.formObj.meettingContent, // 会议内容
        'OtherMeettingPerson': this.formObj.otherMeettingPerson, // 相关参与人员
        'EmployeeID': this.formObj.employeeID, // 员工ID
        'OrgID': this.nav.orgId, // 项目ID
        'ETime': this.subDate.end, // 结束时间
        'MeetID': this.room.iD, // 会议室ID
        'STime': this.subDate.start, // 开始时间
        'BookEndDate': '', // 预定结束时间
        'Participants': this.formObj.participants, // 参会人合集
        'Facilities': [], // 配套清单合集
        'Service': [] // 服务清单合集
      })
      console.log(res)
      await this.$message.alert('预定会议成功')
      this.$root.back()
      this.$parent.getPageData(true)
    }
  }
}
</script>
<style lang="scss" scoped>
  ._content{
    .date{
      padding-left: .3rem;
      background: #fff;
    }
    .theme,.attendee,.listBtn,.remark{
      padding-left: .3rem;
      margin-top: .2rem;
      background: #fff;
    }
    .attendee{
      .btnItem{
        padding: .2rem 0 .3rem;
        border-bottom: 1px solid #ededed;
        .title{
          height: .44rem;
          line-height: .44rem;
          font-size: .3rem;
          color: #999;
        }
        .box-wrap{
          .btnBox{
            position: relative;
            float: left;
            width: 1.34rem;
            height: .6rem;
            border: 1px solid #0DC88C;
            color: #0DC88C;
            font-size: .3rem;
            border-radius: 3px;
            margin-right: .3rem;
            margin-top: .3rem;
            text-align: center;
            line-height: .6rem;
            .icon{
              position: absolute;
              right: -.2rem;
              top: -.2rem;
              display: block;
              width: .4rem;
              height: .4rem;
              color: #FC5A5A;
              font-size: .4rem;
              line-height: .4rem;
              background: #fff;
              border-radius: 50%;
            }
          }
          .addBox{
            float: left;
            width: 1.34rem;
            height: .6rem;
            border: 1px dashed #0DC88C;
            color: #0DC88C;
            font-size: .34rem;
            border-radius: 3px;
            margin-right: .3rem;
            margin-top: .3rem;
            text-align: center;
            line-height: .54rem;
          }
        }
      }
    }
    .listBtn{
      padding: .2rem 0 .3rem .3rem;
      .title{
        height: .44rem;
        line-height: .44rem;
        font-size: .3rem;
        color: #999;
      }
      .box-wrap{
        .btnBox{
          position: relative;
          float: left;
          width: 1.34rem;
          height: .6rem;
          border: 1px solid #999;
          color: #999;
          font-size: .3rem;
          border-radius: 3px;
          margin-right: .3rem;
          margin-top: .3rem;
          text-align: center;
          line-height: .6rem;
          &.isSelect{
            border: 1px solid #0DC88C;
            color: #0DC88C;
          }
        }
      }
    }
    .more{
      margin-top: .2rem;
      .title{
        padding-left: .3rem;
        background: #fff;
        position: relative;
        p{
          height: .88rem;
          line-height: .88rem;
          font-size: .32rem;
          color: #333;
          border-bottom: 1px solid #ededed;
        }
        .icon{
          position: absolute;
          right: .2rem;
          top: 0;
          display: block;
          width: .4rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .4rem;
          color: #999;
        }
      }
      .more-msg{
        .msg1{
          padding-left: .3rem;
          background: #fff;
        }
        .msg2,.msg3{
          padding-left: .3rem;
          margin-top: .2rem;
          background: #fff;
        }
      }
    }
  }
  ._footer{
    .btn1{
      float: left;
      width: 3.3rem;
      height: .8rem;
      font-size: .34rem;
      color: #0DC88C;
      border: 1px solid #0DC88C;
      border-radius: 3px;
      text-align: center;
      line-height: .8rem;
    }
    .btn2{
      float: right;
      width: 3.3rem;
      height: .8rem;
      font-size: .34rem;
      color: #fff;
      background: #0DC88C;
      border-radius: 3px;
      text-align: center;
      line-height: .8rem;
    }
  }
  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .slide-bottom-enter, .slide-bottom-leave-active {
    opacity: 0
  }
</style>
