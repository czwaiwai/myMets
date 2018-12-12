<template>
  <div class="destine page page_bg">
    <nav-title title="会议室"></nav-title>
    <div class="org clearfix">
      <i class="iconfont icon-loudong"></i>
      <span class="orgName">银河世纪花园</span>
      <i class="iconfont icon-tubiao-"></i>
    </div>
    <div class="date clearfix">
      <div class="month" @click.stop="clickMonth">
        <span>{{monthDate.month}}月</span>
        <i class="iconfont icon-xiala icon"></i>
      </div>
      <div class="day-wrap">
        <div class="days">
          <div class="items" :class="{'isSelect':item.isSelect}" @click.stop="selectDate(item,index)" v-for="(item,index) in dateList" :key="index">
            <span class="name">{{item.name}}</span>
            <span class="value">{{item.value}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="searchBox clearfix">
      <form class="searchWrap clearfix" action="" onsubmit="return false;">
          <i class="iconfont icon-sousuo icon"></i>
          <input class="search-input" placeholder="请输入会议室名称或所在位置" type="search" v-model="searchKey" @keydown.13="searchList">
          <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
      </form>
      <i class="iconfont icon-shaixuan" @click.stop="dialogShow=true"></i>
    </div>
    <div class="page_bd _content">
      <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        v-if="list.length">
        <li class="items" :class="{'lastItem':index+1==list.length}" v-for="(item,index) in list" :key="index" @click.stop="toDesitineDetial(item)">
          <div class="top clearfix">
            <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1543821465&di=e3ad1277bf7c91696edb3cd5bf3749e5&src=http://imgsrc.baidu.com/imgad/pic/item/0b55b319ebc4b745317003c2c5fc1e178b821579.jpg" class="pic">
            <div class="msg">
              <div class="name">
                <p class="title">{{item.MeetName}}</p>
                <div class="people clearfix">
                  <i class="iconfont icon icon-duorenyonghu"></i>
                  <span>{{item.Capacity}}人</span>
                </div>
              </div>
              <div class="location clearfix">
                <i class="iconfont icon icon-dizhi"></i>
                <span class="build">{{item.Location}}</span>
                <span class="steps">{{item.Floor}}楼</span>
              </div>
              <div class="label">
                <span v-for="(it,i) in item.Facilities" :key="i">{{it.MaterialsnName}}</span>
              </div>
            </div>
          </div>
          <div class="bottom">
            <span v-for="(item, index) in 12" :key="index" :class="{'isSelect':index>6&&index<9}">{{item + 7}}</span>
          </div>
        </li>
        <li class="load-tip" v-show="showLoadTip">加载中···</li>
      </ul>
      <none-page title="暂无会议室~" v-else></none-page>
    </div>
    <transition name="dateLog">
      <div class="_datelog" v-show="showMonth">
        <div class="mark" @click.stop="showMonth=false"></div>
        <div class="dateLog">
          <div class="items" :class="{'isSelect':item.isSelect}" @click.stop="selectMonth(item,index)" v-for="(item,index) in monthList" :key="index">{{item.year}}年{{item.month}}月</div>
        </div>
      </div>
    </transition>
    <transition name="_dialog">
      <div class="_dialog" v-if="dialogShow">
        <div class="mark" @click.stop="closeDialog"></div>
        <div class="_d-content">
          <ul class="_d-list">
            <li class="_d-items" v-for="(item,index) in typeList" :key="index">
              <div class="title">
                <span class="name">{{item.name}}</span>
                <span class="status" @click.stop="clickSelect(item)">{{item.selectType.showText}} <i class="iconfont icon" :class="item.isSelect?'icon-zhankai1':'icon-zhankai'"></i></span>
              </div>
              <transition name="_d-box">
                <div class="_d-box clearfix" v-show="item.isSelect">
                  <span class="_d-btns" :class="{'isSelect':it.isSelect}" @click.stop="selectType(item,it)" v-for="(it,i) in item.list" :key="i">{{it.showText}}</span>
                </div>
              </transition>
            </li>
          </ul>
          <div class="_d-footer clearfix">
            <div class="btn" @click.stop="selectListRest">重置</div>
            <div class="btn" @click.stop="selectListConfirm">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import { Indicator } from 'mint-ui'
import { setTimeout } from 'timers'
import dateChange from '@/mixins/dateChange'
import nonePage from '../components/nonePage/index.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'destine',
  components: {navTitle, Indicator, nonePage},
  mixins: [dateChange],
  data () {
    return {
      monthDate: {year: '', month: '', day: ''},
      monthList: [],
      dateList: [],
      searchKey: '',
      showMonth: false,
      dialogShow: false,
      allLoaded: false,
      list: [],
      showLoadTip: false,
      page: 1,
      pageSize: 10,
      typeList: []
    }
  },
  computed: {
    ...mapGetters({
      dateDate: 'getDate',
      key: 'getSearchKey'
    })
  },
  beforeRouteLeave (to, from, next) {
    // this.$store.commit('setSearchKey', this.searchKey)
    // this.$store.commit('setDate', {year: this.monthDate.year, month: this.monthDate.month, day: this.monthDate.day})
    next()
  },
  methods: {
    clearKey () {},
    searchList () {},
    loadMore () {
      // this.getList()
    },
    toDesitineDetial (item) {
      this.$router.push({
        name: 'destineDetail',
        params: {
          id: item.ID
        },
        query: {
          title: item.MeetName
        }
      })
    },
    // 关闭筛选
    closeDialog () {
      this.dialogShow = false
      this.typeList.forEach(arr => {
        arr.selectType = arr.initType
        arr.isSelect = false
        arr.list.forEach(a => {
          if (a.id === arr.selectType.id) {
            a.isSelect = true
          } else {
            a.isSelect = false
          }
        })
      })
    },
    // 重置筛选
    selectListRest () {
      this.typeList.forEach(arr => {
        arr.selectType = arr.list[0]
        arr.list.forEach((a, index) => {
          if (index === 0) {
            a.isSelect = true
          } else {
            a.isSelect = false
          }
        })
      })
    },
    // 确定筛选条件
    selectListConfirm () {
      this.typeList.forEach(arr => {
        arr.initType = arr.selectType
        arr.isSelect = false
      })
      this.dialogShow = false
    },
    // 点选筛选类型
    selectType (item, it) {
      if (it.isSelect) {
        return
      }
      this.typeList[item.type].selectType = it
      this.typeList[item.type].list.forEach(arr => {
        arr.isSelect = false
      })
      it.isSelect = true
      if (item.type === 0) {
        this.typeList[3].isSelect = false
        let list = []
        console.log('in...')
        this.typeList[3].list[0].isSelect = true
        list.push(this.typeList[3].list[0])
        this.typeList[3].list = list
        this.typeList[3].selectType = this.typeList[4].list[0]
      }
    },
    // 点击筛选展开收起按钮
    async clickSelect (item) {
      if (item.isSelect) {
        item.isSelect = false
        return
      }
      if (item.type === 1 || item.type === 2) {
        item.isSelect = true
        return
      }
      if (item.list.length > 1) {
        item.isSelect = true
        return
      }
      this.getSelectList(item)
    },
    // 获取筛选下拉列表
    async getSelectList (item) {
      if (item.type === 3 && this.typeList[0].selectType.value === '') {
        this.$toast('请先选择类型！')
        return
      }
      Indicator.open({spinnerType: 'fading-circle'})
      let params = {}
      let httpUrl = ''
      switch (item.type) {
        case 0: params = {'TypeName': 'MeetType'}; httpUrl = 'UserRent_GetOptionList'
          break
        case 3: params = {'OrgID': '11091315263400010000', 'MeetType': this.typeList[0].selectType.value}; httpUrl = 'UserCS_MeetingFloor'
          break
        case 4: params = {'OrgID': '11091315263400010000'}; httpUrl = 'UserCS_MeetingEquipMatching'
          break
      }
      let res = await this.$xml(httpUrl, params)
      let arr = []
      let list = []
      arr.push(this.typeList[item.type].list[0])
      if (item.type === 0) {
        res.data.Table.forEach(arr => {
          let obj = {
            showText: arr.showText, id: arr.id, value: arr.value, isSelect: false
          }
          list.push(obj)
        })
      } else if (item.type === 3) {
        res.data.forEach((arr) => {
          let obj = {
            showText: arr.Floor + '楼', id: arr.Floor, value: arr.Floor, isSelect: false
          }
          list.push(obj)
        })
      } else if (item.type === 4) {
        res.data.forEach(arr => {
          let obj = {
            showText: arr.MaterialsnName, id: arr.ID, value: arr.Specification, isSelect: false
          }
          list.push(obj)
        })
      }
      this.typeList[item.type].list = arr.concat(list)
      Indicator.close()
      item.isSelect = true
    },
    // 点击月份选中
    clickMonth () {
      this.showMonth = !this.showMonth
    },
    // 选择月份
    selectMonth (item, index) {
      if (!item.isSelect) {
        this.monthList.forEach(arr => {
          arr.isSelect = false
        })
        item.isSelect = true
        this.monthDate = {
          year: item.year,
          month: item.month,
          day: 1
        }
        let init = this.getDateNum()
        let month = init.month
        if (month - 0 === item.month - 0) {
          this.monthDate.day = init.day
          console.log(this.monthDate)
          this.getDateList()
        } else {
          this.setDateList()
        }
        this.$el.querySelector('.days').scrollLeft = 0
      }
      this.showMonth = false
    },
    // 点击选中日期
    selectDate (item, index) {
      if (!item.isSelect) {
        this.dateList.forEach(arr => {
          if (arr.value === item.value) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      }
      this.monthDate.day = item.value
    },
    // 获取月份下拉列表
    getMonthList () {
      let monthList = []
      let init = this.getDateNum()
      let index = 0
      let month = init.month - 0
      let year = init.year - 0
      while (index < 6) {
        index++
        let obj = {
          year: year,
          month: month,
          isSelect: false
        }
        if (this.monthDate.month) {
          if (month === this.monthDate.month) {
            obj.isSelect = true
          }
        } else if (month === init.month) {
          obj.isSelect = true
        }
        monthList.push(obj)
        if (month === 12 || month === '12') {
          month = 1
          year += 1
        } else {
          month += 1
        }
      }
      this.monthList = monthList
    },
    // 除了本月，其他月份日期列表
    setDateList () {
      let dateList = []
      let weekWorks = ['日', '一', '二', '三', '四', '五', '六']
      let init = this.getDateNum(this.monthDate.year + '/' + this.monthDate.month + '/1')
      let dayNum = init.day
      let index = init.week
      let maxDay = this.getLastDay(this.monthDate.year, this.monthDate.month)
      while (dayNum < maxDay + 1) {
        if (index > 6) {
          index = 0
        }
        let obj = {
          name: weekWorks[index],
          value: dayNum,
          isSelect: false
        }
        if (this.dateDate.day) {
          if (dayNum - 0 === this.monthDate.day - 0) {
            obj.isSelect = true
            this.monthDate.day = dayNum
            setTimeout(() => {
              this.$el.querySelector('.days').scrollLeft = (this.monthDate.day - 1) * 32
            }, 500)
          }
        } else if (dayNum === init.day) {
          obj.isSelect = true
          this.monthDate.day = dayNum
        }
        dayNum++
        index++
        dateList.push(obj)
      }
      this.dateList = dateList
    },
    // 本月日期列表
    getDateList () {
      let dateList = []
      let weekWorks = ['日', '一', '二', '三', '四', '五', '六']
      let init = this.getDateNum()
      let dayNum = init.day
      let index = init.week
      let maxDay = this.getLastDay(init.year, init.month)
      while (dayNum < maxDay + 1) {
        if (index > 6) {
          index = 0
        }
        let obj = {
          name: weekWorks[index],
          value: dayNum,
          isSelect: false
        }
        if (dayNum === init.day) {
          obj.name = '今'
        }
        if (this.monthDate.day) {
          if (dayNum - 0 === this.monthDate.day - 0) {
            obj.isSelect = true
            setTimeout(() => {
              console.log(this.monthDate.day)
              this.$el.querySelector('.days').scrollLeft = (this.monthDate.day - init.day) * 30
            }, 500)
          }
        } else if (dayNum - 0 === init.day - 0) {
          obj.isSelect = true
          this.monthDate = {year: init.year, month: init.month, day: dayNum}
        }
        dayNum++
        index++
        dateList.push(obj)
      }
      this.dateList = dateList
    },
    // 设置筛选初始值
    setInitType () {
      this.typeList = [
        {
          type: 0,
          name: '类型',
          isSelect: false,
          selectType: {showText: '不限', id: '', value: ''},
          initType: {showText: '不限', id: '', value: ''},
          list: [{showText: '不限', id: '', value: '', isSelect: true}]
        },
        {
          type: 1,
          name: '空闲',
          isSelect: false,
          selectType: {showText: '不限', id: '', value: ''},
          initType: {showText: '不限', id: '', value: ''},
          list: [
            {showText: '不限', id: '', value: '', isSelect: true},
            {showText: '1小时', id: '1', value: '1', isSelect: false},
            {showText: '2小时', id: '2', value: '2', isSelect: false},
            {showText: '3小时', id: '3', value: '3', isSelect: false},
            {showText: '4小时以上', id: '4', value: '4', isSelect: false}
          ]
        },
        {
          type: 2,
          name: '大小',
          isSelect: false,
          selectType: {showText: '不限', id: '', value: ''},
          initType: {showText: '不限', id: '', value: ''},
          list: [
            {showText: '不限', id: '', value: '', isSelect: true},
            {showText: '2-3人', id: '1', value: '1', isSelect: false},
            {showText: '4-6人', id: '2', value: '2', isSelect: false},
            {showText: '7-9人', id: '3', value: '3', isSelect: false},
            {showText: '10人以上', id: '4', value: '4', isSelect: false}
          ]
        },
        {
          type: 3,
          name: '楼层',
          isSelect: false,
          selectType: {showText: '不限', floor: ''},
          initType: {showText: '不限', id: '', value: ''},
          list: [
            {showText: '不限', id: '', isSelect: true}
          ]
        },
        {
          type: 4,
          name: '设备',
          isSelect: false,
          selectType: {showText: '不限', id: ''},
          initType: {showText: '不限', id: '', value: ''},
          list: [
            {showText: '不限', id: '', isSelect: true}
          ]
        }
      ]
    },
    async getList () {
      Indicator.open({spinnerType: 'fading-circle'})
      let res = await this.$xml('UserCS_MeetingList', {
        'OrgID': '11091315263400010000', // '11091315263400010000',
        'MeetType': '',
        'CapacityMin': '',
        'CapacityMax': '',
        'Floor': '',
        'MaterialName': ''
      })
      console.log('res:', res)
      this.isLoading = false
      if (res.data) {
        this.list = res.data || []
      }
      Indicator.close()
      // this.showLoadTip = true
    }
  },
  created () {
    this.searchKey = this.key
    this.setInitType()
    console.log('dateDate', this.dateDate)
    if (this.dateDate.day) {
      this.monthDate = {year: this.dateDate.year, month: this.dateDate.month, day: this.dateDate.day}
      let init = this.getDateNum()
      if (init.month === this.dateDate.month) {
        this.getDateList()
      } else {
        this.setDateList()
      }
    } else {
      this.getDateList()
    }
    this.getMonthList()
    this.getList()
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  .destine{
    .org{
      position: relative;
      z-index: 10;
      width: 100vw;
      height: .88rem;
      padding: 0 .3rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .icon-loudong{
        float: left;
        width: .6rem;
        height: .88rem;
        line-height: .8rem;
        text-align: left;
        color: #000;
        font-size: .46rem;
      }
      .orgName{
        float: left;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
      }
      .icon-tubiao-{
        position: absolute;
        right: .2rem;
        top: 0;
        display: block;
        width: .4rem;
        height: .88rem;
        line-height: .88rem;
        text-align: right;
        font-size: .4rem;
        color: #999;
      }
    }
    .date {
      position: relative;
      z-index: 11;
      width: 100vw;
      height: 1.06rem;
      border-bottom: 1px solid #ededed;
      padding-left: .3rem;
      .month{
        float: left;
        width: .8rem;
        height: 1.06rem;
        span{
          display: block;
          width: .8rem;
          height: .6rem;
          line-height: .8rem;
          text-align: center;
          color: #333;
          font-size: .3rem;
        }
        .icon{
          display: block;
          width: .8rem;
          height: .46rem;
          line-height: .36rem;
          text-align: center;
          color: #333;
          font-size: .3rem;
        }
      }
      .day-wrap{
        float: left;
        width: 6.14rem;
        overflow: hidden;
        .days{
          width: auto;
          height: 1.06rem;
          padding: .09rem 0;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          .items{
            display: inline-block;
            width: .8rem;
            height: .88rem;
            color: #333;
            &.isSelect{
              color: #fff;
              background: #0DC88C;
              border-radius: .44rem;
            }
            .name{
              display: block;
              width: .8rem;
              height: .46rem;
              line-height: .5rem;
              text-align: center;
              // color: #333;
              font-size: .3rem;
            }
            .value{
              display: block;
              width: .8rem;
              height: .34rem;
              line-height: .34rem;
              text-align: center;
              // color: #333;
              font-size: .3rem;
            }
          }
        }
      }
    }
    .searchBox{
      position: relative;
      z-index: 10;
      width: 100vw;
      height: 1.06rem;
      padding: .2rem .3rem;
      border-bottom: 1px solid #ededed;
      .searchWrap {
        float: left;
        width: 6.08rem;
        height: 0.68rem;
        background: #fff;
        border-radius: 0.2rem;
        line-height: 0.68rem;
        .icon {
          float: left;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: .34rem;
          text-align: right;
          color: #999;
        }
        .search-input{
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
        color: #0dc88c;
      }
    }
    ._content{
      .list{
        .items{
          padding: .2rem .3rem;
          background: #fff;
          margin-bottom: .2rem;
          &.lastItem{
            margin-bottom: 0;
          }
          .top{
            position: relative;
            height: 1.46rem;
            .pic{
              float: left;
              width: 1.46rem;
              height: 1.46rem;
              margin-right: .5rem;
            }
            .msg{
              float: left;
              height: 1.46rem;
              width: 4.94rem;
              .name{
                position: relative;
                height: .4rem;
                .title{
                  font-size: .34rem;
                  color: #333;
                  line-height: .4rem;
                }
                .people{
                  position: absolute;
                  top: 0;
                  right: 0;
                  .icon{
                    float: left;
                    width: .4rem;
                    height: .4rem;
                    line-height: .4rem;
                    text-align: left;
                    color: #0DC88C;
                  }
                  span{
                    float: left;
                    font-size: .3rem;
                    color: #999;
                    line-height: .4rem;
                  }
                }
              }
              .location{
                position: relative;
                height: .4rem;
                margin: .13rem 0;
                .icon{
                  float: left;
                  width: .4rem;
                  height: .4rem;
                  color: #0DC88C;
                  font-size: .36rem;
                  text-align: center;
                  line-height: .4rem;
                  margin-right: .1rem;
                }
                .build{
                  float: left;
                  height: .4rem;
                  max-width: 4rem;
                  line-height: .4rem;
                  color: #999;
                  font-size: .3rem;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .steps{
                  position: absolute;
                  right: 0;
                  top: 0;
                  height: .4rem;
                  line-height: .4rem;
                  font-size: .28rem;
                  color: #999;
                }
              }
              .label{
                position: relative;
                height: .4rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                span{
                  float: left;
                  font-size: .28rem;
                  color: #999;
                  margin-right: .3rem;
                  line-height: .4rem;
                }
              }
            }
          }
          .bottom{
            position: relative;
            height: .5rem;
            width: 6.9rem;
            overflow-y: hidden;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
            margin-top: .25rem;
            span{
              display: inline-block;
              width: .5rem;
              height: .5rem;
              margin-right: .08rem;
              background: #E8E8E8;
              color: #fff;
              text-align: center;
              line-height: .5rem;
              &.isSelect{
                background: #0dc88c;
              }
              &:last-child{
                margin-right: 0;
              }
            }
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
    ._d-content{
      position: absolute;
      top: 0;
      right: 0;
      width: 5.76rem;
      height: 100vh;
      background: #fff;
      z-index: 11;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      ._d-list{
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 100%;
        padding-left: .3rem;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translateZ(0px);
        transform: translate(0px);
        ._d-items{
          padding-top: .2rem;
          padding-bottom: .2rem;
          border-bottom: 1px solid #ededed;
          &:last-child{
            border-bottom: none;
          }
          .title{
            position: relative;
            height: .44rem;
            line-height: .44rem;
            font-size: .28rem;
            color: #777E8C;
            .status{
              position: absolute;
              right: .3rem;
              top: 0;
              display: block;
              font-size: .28rem;
              color: #0DC88C;
              .icon{
                color: #999;
              }
            }
          }
          ._d-box{
            padding-bottom: .2rem;
            ._d-btns{
              float: left;
              width: 1.58rem;
              height: .56rem;
              font-size: .24rem;
              color: #333;
              text-align: center;
              background: #F2F2F4;
              border-radius: .28rem;
              margin-right: .2rem;
              margin-top: .2rem;
              line-height: .56rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &.isSelect{
                color: #0DC88C;
                border: 1px solid #0DC88C;
                background: #F1FEFA;
                box-sizing: border-box;
              }
            }
          }
        }
      }
      ._d-footer{
        height: 1rem;
        width: 5.76rem;
        border-top: 1px solid #ededed;
        .btn{
          float: left;
          width: 2.88rem;
          height: 1rem;
          line-height: 1rem;
          font-size: .34rem;
          color: #7E7D7D;
          text-align: center;
          &:last-child{
            color: #fff;
            background: #0DC88C;
          }
        }
      }
    }
  }
  ._d-box-enter-active, ._d-box-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  ._d-box-enter, ._d-box-leave-active {
    opacity: 0
  }
  .dateLog-enter-active, .dateLog-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .dateLog-enter, .dateLog-leave-active {
    opacity: 0
  }
  ._datelog{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 9999;
    .mark{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #fff;
      opacity: 0;
      z-index: 9;
    }
    .dateLog{
      position: absolute;
      top: 2.82rem;
      left: 0;
      z-index: 10;
      width: 2.8rem;
      background: #fff;
      box-shadow: 2px 0px 2px #888888;
      .items{
        width: 2.8rem;
        height: .88rem;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
        text-align: center;
        border-bottom: 1px solid #ededed;
        &:last-child{
          border-bottom: none;
        }
        &.isSelect{
          color: #0DC88C;
        }
      }
    }
  }
</style>
