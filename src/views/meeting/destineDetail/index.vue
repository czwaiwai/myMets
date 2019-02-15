<template>
  <div class="page destineDetail">
    <nav-title :title="room.meetName"></nav-title>
    <div class="_content page_bd">
      <div  class="_swipe-wrap">
        <template v-if="imgReay">
          <swipe v-if="roomImgs.length > 0" :auto="4000">
            <swipe-item  v-for="(item,index) in roomImgs" :key="index">
              <img :src="item.path" class="pics">
            </swipe-item>
          </swipe>
          <swipe v-else  :auto="4000">
            <swipe-item >
              <img src="../../../assets/img/meeting/banner_detail.jpg">
            </swipe-item>
          </swipe>
        </template>
      </div>
      <div class="msg">
        <div class="build-wrap">
          <div class="build clearfix">
            <i class="iconfont icon-dizhi icon"></i>
            <span class="name">{{room.location}}</span>
            <span class="steps">{{room.floor}}楼</span>
          </div>
          <div class="people clearfix">
            <i class="iconfont icon-duorenyonghu icon"></i>
            <span class="num">{{room.capacity}}人</span>
            <span class="tip" @click.stop="routeTo('picDetail')">平面位置图</span>
          </div>
        </div>
        <div class="articles">
          <span v-for="(item, index) in room.facilities" :key="index">{{item.materialsnName}}<small>({{item.quantity}})</small></span>
        </div>
        <div class="selectItem">
          <span class="name">责任人：</span>
          <span class="value textLeft">{{room.responsible}}  {{room.phone}}</span>
        </div>
        <div class="selectItem noneBb" @click.stop="routeTo('otherDetail')">
          <span class="name">其他详情</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
      </div>
      <div class="dates">
        <div class="selectItem" @click.stop="openPicker">
          <span class="name">日期</span>
          <span class="value textRight">{{com_date(dateTime)}}</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="tips">
          <p class="name">请选择预订时间</p>
          <span class="showTip" @click.stop="routeTo('hasReserve')">已预定情况</span>
        </div>
        <div class="status clearfix" style="padding:.1rem 0 .1rem;">
          <div v-for="item in colorStatus" :key="item.iD" class="items clearfix">
            <div class="bgColor1" :style="'background:' + item.color.toLowerCase()"></div>
            <p class="name">{{item.names}}</p>
          </div>
        </div>
        <subscribe v-if="room.meetName" ref="subscribe" :dateStr="dateTime" :item="room" :bookList="room.bookList"  @sendRes='setSubscribe'></subscribe>
      </div>
    </div>
    <div class="_footer">
      <div class="btn" @click.stop="clickBtn">立即预订</div>
    </div>
    <transition name="page">
      <keep-alive exclude="reserve">
        <router-view/>
      </keep-alive>
    </transition>
    <datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="new Date()"
      @confirm="handleConfirm"
      v-model="pickerValue">
    </datetime-picker>
    <transition name="_dialog">
      <div class="_dialog" v-if="dialogShow">
        <div class="mark" @click.stop="dialogShow=false"></div>
        <div class="main">
          <p class="title">请确定您所选择的会议时间</p>
          <p class="date">{{com_date(dateTime)}}</p>
          <p class="time">{{subDate.start}} — {{subDate.end}}</p>
          <div class="btns clearfix">
            <div class="btn _left" @click.stop="dialogShow=false">取消</div>
            <div class="btn _right" @click.stop="toReserve">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import { Swipe, SwipeItem, DatetimePicker } from 'mint-ui'
import dateChange from '@/mixins/dateChange'
import Subscribe from '@/views/meeting/components/subscribe'
import { mapGetters } from 'vuex'
export default {
  name: 'destineDetail',
  components: {navTitle, Swipe, SwipeItem, DatetimePicker, Subscribe},
  mixins: [dateChange],
  data () {
    return {
      title: '',
      dialogShow: false,
      pickerValue: '',
      dateTime: '',
      room: {},
      today: new Date(),
      roomImgs: [],
      imgReay: false,
      personName: '',
      subDate: { // 订阅的时间
        start: '',
        startVal: 0,
        end: '',
        endVal: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      dateDate: 'getDate',
      key: 'getSearchKey',
      destineConfig: 'destineConfig'
    })
  },
  methods: {
    async getPageData (isFresh) {
      console.log(this.destineConfig, 'destineConfig')
      let res = await this.$xml('UserCS_MeetingListDetail', {
        MeetID: this.roomId,
        MeetTime: this.dateTime,
        EmployeeId: this.destineConfig.employeeId
      })
      this.room = this.$toLower(res.data[0])
      console.log(this.room.bookList, '怎么回事???')
      if (isFresh) {
        // conso
        this.$nextTick(() => {
          this.$refs.subscribe.reflesh()
        })
      }
    },
    async getImgs () {
      let res = await this.$xml('UserCS_GetMeettingRoomImageInfo', {
        MeettingRoomID: this.roomId,
        TypeStr: 'Metting'
      })
      this.imgReay = true
      if (res.data && res.data.length > 0) {
        // this.roomImgs = this.$toLower(res.data[0]).imageList
        let ip = this.$store.getters.ip
        this.roomImgs = this.$toLower(res.data[0]).imageList.map(item => {
          if (ip && item.path) {
            item.path = 'http://' + ip + item.path
          }
          return item
        })
      }
    },
    // 设置预订结果
    setSubscribe (subDate) {
      this.subDate = subDate
    },
    routeTo (name) {
      this.$router.push({name})
    },
    com_name (index) {
      let num = index - 0 + 8
      if (num > 9) {
        return num + ':00'
      } else {
        return '0' + num + ':00'
      }
    },
    clickBtn () {
      if (this.subDate.start && this.subDate.end) {
        this.dialogShow = true
      } else {
        this.$toast('请选择完整的时间段')
      }
    },
    toReserve () {
      this.dialogShow = false
      this.$router.push({name: 'reserve'})
    },
    openPicker () {
      this.$refs.picker.open()
    },
    handleConfirm (date) {
      this.dateTime = date.format('yyyy-MM-dd')
      this.getPageData(true)
    }
  },
  created () {
    this.title = this.$route.query.title
    this.personName = this.destineConfig.strEmployeeName
    this.dateTime = this.destineConfig.dateStr
    console.log(this.dateTime, 'dateTime')
    this.roomId = this.$route.params.id
    this.colorStatus = [...this.$store.getters.getStatusColor.map(item => {
      if (item.names === '预定确认中') {
        item.names = '确认中'
      }
      return item
    }), {
      names: '选中',
      color: '#3395FF',
      iD: '99999999999'
    }]
    this.getPageData()
    this.getImgs()
    console.log(this.colorStatus)
  }
}
</script>
<style lang="scss" scoped>
  .destineDetail{
    ._content{
      ._swipe-wrap{
        position: relative;
        width: 100vw;
        height: 3.2rem;
        overflow: hidden;
        .pics{
          display: block;
          width: 100vw;
          height: 3.2rem;
        }
      }
      .msg{
        padding-left: .3rem;
        background: #fff;
        .build-wrap{
          padding: .3rem .3rem .3rem 0;
          border-bottom: 1px solid #ededed;
          .build{
            position: relative;
            .icon{
              float: left;
              width: .54rem;
              height: .4rem;
              font-size: .34rem;
              color: #0DC88C;
              line-height: .4rem;
              text-align: left;
            }
            .name{
              float: left;
              max-width: 4rem;
              font-size: .3rem;
              color: #333;
              line-height: .4rem;
            }
            .steps{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .4rem;
              line-height: .4rem;
              font-size: .28rem;
              color: #999;
            }
          }
          .people{
            position: relative;
            margin-top: .26rem;
            .icon{
              float: left;
              width: .54rem;
              height: .4rem;
              font-size: .34rem;
              color: #0DC88C;
              line-height: .4rem;
              text-align: left;
            }
            .num{
              float: left;
              max-width: 4rem;
              font-size: .3rem;
              color: #333;
              line-height: .4rem;
            }
            .tip{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .4rem;
              line-height: .4rem;
              font-size: .3rem;
              color: #3395FF;
            }
          }
        }
        .articles{
          padding-bottom: .3rem;
          border-bottom: 1px solid #ededed;
          span{
            display: inline-block;
            font-size: .3rem;
            color: #333;
            margin: .3rem .7rem 0 0;
            line-height: 1.2;
          }
        }
      }
      .dates{
        padding-left: .3rem;
        margin-top: .2rem;
        background: #fff;
        .tips{
          position: relative;
          height: .88rem;
          .name{
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #999;
          }
          .showTip{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #3395FF;
          }
        }
        .status{
          padding: .1rem 0 .3rem;
          .items{
            float: left;
            margin-right: .38rem;
            margin-bottom: .1rem;
            .name{
              float: left;
              height: .4rem;
              line-height: .4rem;
              margin-left: .1rem;
              font-size: .3rem;
              color: #333;
            }
            .bgColor1{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #E8E8E8;
            }
            .bgColor2{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #FEBBBB;
            }
            .bgColor3{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #FC5A5A;
            }
            .bgColor4{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #0DC88C;
            }
          }
        }
      }
    }
    ._dialog-enter-active, ._dialog-leave-active {
      transition: opacity .5s;
      -webkit-transform: opacity .5s;
    }
    ._dialog-enter, ._dialog-leave-active {
      opacity: 0
    }
    ._dialog{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 999;
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
      .main{
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 11;
        width: 80vw;
        white-space:nowrap;
        transform: translate(-50%,-50%);
        background: #fff;
        overflow: hidden;
        padding: .3rem;
        overflow: hidden;
        border-radius: 3px;
        .title{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #333;
          text-align: center;
        }
        .date{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #3395FF;
          text-align: center;
        }
        .time{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #3395FF;
          text-align: center;
        }
        .btns{
          padding: .3rem .8rem 0;
          .btn{
            width: 1.6rem;
            height: .68rem;
            font-size: .32rem;
            text-align: center;
            line-height: .68rem;
            &._left{
              float: left;
              color: #0DC88C;
              border: 1px solid #0DC88C;
              border-radius: 3px;
            }
            &._right{
              float: right;
              color: #fff;
              background: #0DC88C;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
</style>
