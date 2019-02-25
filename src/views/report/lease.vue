<template>
  <div class="page">
    <!-- <mt-header  title="租赁报表">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="租赁报表"></nav-title>
    <div class="weui-cells" style="margin:0;">
      <a class="weui-cell weui-cell_access" @click="$router.push({name: 'report_lease_change'})" href="javascript:;">
          <div class="weui-cell__bd">
              <p>{{orgName}}</p>
          </div>
          <div class="weui-cell__ft"></div>
      </a>
    </div>
    <mt-popup class="search-date-popup" v-model="popupVisible"  position="top">
        <div style="font-size:0.32rem;padding-top:0.3rem;padding-bottom:0.3rem;">
          日期范围筛选
        </div>
        <!-- <datetime class="form_item" :end-date="currDate" v-model="searchForm.startDate" format="YYYY-MM-DD" :max-year=3000 :min-year=1900> </datetime> -->

          <div @click="$refs.startPicker.open()" class="form_item">
            <label>开始时间: </label>
            <div><input  v-model="searchForm.startDate"><i class="iconfont icon-calendar icon-gengduo1" ></i></div>
          </div>

        <!-- <datetime class="form_item" :start-date="searchForm.startDate" :end-date="currDate"  v-model="searchForm.endDate"  format="YYYY-MM-DD" :max-year=3000 :min-year=1900></datetime> -->
          <div @click="$refs.endPicker.open()"  class="form_item">
            <label>结束时间:</label>
            <div><input v-model="searchForm.endDate" ><i class="iconfont icon-calendar icon-gengduo1" ></i></div>
          </div>

        <div class="btn_wrap">
          <button class="btn_reset" @click="resetSearch">重置</button>
          <button class="btn_sure" @click="submitSearch">确定</button>
        </div>
    </mt-popup>
    <div  @click="showDate" class="page_sub_hd padding-h">
      <span>{{searchForm.startDate}} 至 {{searchForm.endDate}}</span>
      <a class="float_right inline-block dark_99" ><i class="iconfont icon-calendar icon-gengduo1" ></i></a>
    </div>
    <div class="page_bd report_wrap" ref="scrollMain" >
       <div >
        <div class="report_content">
          <div >
            <div class="flex re_bl_warp">
              <div class="flex_item re_bl_item">
                <dl>
                  <dt style="color:#3395FF;">{{all.CZL}}%</dt>
                  <dd>出租率</dd>
                </dl>
              </div>
              <div class="flex_item re_bl_item">
                <dl>
                  <dt style="color:#FF4E00;">{{all.KZL}}%</dt>
                  <dd>空置率</dd>
                </dl>
              </div>
            </div>
          </div>
          <div  class="re_section">
            <div class="re_title">已租统计<span class="float_right">套</span></div>
            <div class="re_content">
              <div class="flex" style="padding:0.3rem 0;">
                <div class="rent" ref="rent" style="width:106px;height:106px;">
                </div>
                <div class=" flex_item flex" >
                  <div class="flex_item item_center text-center">
                    <dl>
                      <dt class="fs17">{{all.KZSL}}</dt>
                      <dd class="fs15 dark_99">可租</dd>
                    </dl>
                  </div>
                  <div class="flex_item item_center text-center">
                    <dl>
                      <dt class="fs17">{{all.YZSL}}</dt>
                      <dd class="fs15 dark_99">已租</dd>
                    </dl>
                  </div>
                  <div class="flex_item item_center text-center">
                    <dl>
                      <dt class="fs17">{{all.WZSL}}</dt>
                      <dd  class="fs15 dark_99">未租</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div  class="re_section">
            <div class="re_title">已租分区统计
              <span class="float_right">
                <a @click="rentToggle=true" class="re_btn_link" :class="{'active':rentToggle}">分区</a><a
                @click="rentToggle=false" class="re_btn_link" :class="{'active': !rentToggle}">业态</a>
              </span>
            </div>
            <div class="re_content" style="padding-bottom:0.3rem;">
              <div ref="noRent" class="" style="height:3.4rem;"></div>
            </div>
          </div>
          <div></div>
        </div>
        <div class="slide-next ">
          <i class="iconfont icon-shangla"></i>
        </div>
      </div>
    </div>
    <transition name="slide-top">
      <div v-show="visible" class="modal report_wrap">
        <div class="re_page" >
          <div class="header">
            <ul class="re_table_detail" style="padding:0;margin: 0 -.3rem;">
              <li>
                <div class="flex hd re_detail_item">
                  <div class="flex_item ">分区</div>
                  <div class="flex_item">可租</div>
                  <div class="flex_item">已租</div>
                  <div @click="sortByRentHandler" :class="rentClass" class="flex_item icon_sort">出租率
                  </div>
                  <div @click="sortByEmptyHandler" :class="emptyClass" class="flex_item icon_sort">空置率</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="re_page_bd">
            <div ref="scrollData" class="re_scroll">
              <div class="report_content">
                <div>
                  <ul class="re_table_detail">
                    <li v-for="(item,index) in sortList" :key="index">
                      <div   @click="showDetail(index)" class="flex re_detail_item">
                        <div class="flex_item bf">{{item.GrpName}}</div>
                        <div class="flex_item">{{item.KZSL}}</div>
                        <div class="flex_item">{{item.YZSL}}</div>
                        <div class="flex_item">{{item.CZL}}%</div>
                        <div class="flex_item">{{item.KZL}}%</div>
                      </div>
                      <transition name="slide-bottom" mode="out-in">
                        <div v-show="detailShow===index" class="re_item_info">
                          <p class="text-left padding-left15">{{item.GrpName}}</p>
                          <div class="flex">
                            <dl class="flex_item">
                              <dt class="fs15">{{item.KZMJ | float2}}</dt>
                              <dd class="dark_99 fs15">可租面积</dd>
                            </dl>
                            <dl class="flex_item">
                              <dt class="fs15">{{item.YZMJ | float2}}</dt>
                              <dd class="dark_99 fs15">已租面积</dd>
                            </dl>
                            <dl class="flex_item">
                              <dt class="fs15">{{item.WZMJ | float2}}</dt>
                              <dd class="dark_99 fs15">未租面积</dd>
                            </dl>
                          </div>
                        </div>
                      </transition>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="page">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
    <mt-datetime-picker
      v-model="startDate"
      type="date"
      ref="startPicker"
      :endDate = "new Date()"
      year-format="{value} 年"
      month-format="{value} 月"
      @confirm="startHandleConfirm" >
    </mt-datetime-picker>
    <mt-datetime-picker
      v-model="endDate"
      type="date"
      ref="endPicker"
      :startDate = "startDate"
      :endDate = "new Date()"
      year-format="{value} 年"
      month-format="{value} 月"
      @confirm="endHandleConfirm" >
    </mt-datetime-picker>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
import {Popup} from 'mint-ui'
import ready from '@/utils/getEchars'
import qs from 'qs'
import navTitle from '@/components/navTitle'
export default {
  name: 'lease',
  data () {
    return {
      orgName: '',
      href: '',
      startDate: '',
      endDate: '',
      searchForm: {
        startDate: '',
        endDate: ''
      },
      visible: false,
      popupVisible: false,
      dateTimes: '',
      detailShow: -1,
      all: {},
      list: [],
      rentToggle: true, // 分区或业态
      sortMain: 'rent',
      sortByRent: false,
      sortByEmpty: true
    }
  },
  components: {
    navTitle,
    MtPopup: Popup
  },
  created () {
    console.log(this.user, 'user--')
    this.endDate = this.startDate = new Date()
    let searchObj = qs.parse(location.search.replace('?', ''))
    this.orgId = searchObj.projectID || this.user.OrgID
    this.orgName = searchObj.projectName || this.user.OrgName
    if (this.srcollRmove) {
      // 如果存在事件监听移除事件
      this.srcollRmove()
    }
    this.resetSearch()
    ready().then(echarts => {
      this.$nextTick(() => {
        this.rentChart = echarts.init(this.$refs.rent)
        this.noRentChart = echarts.init(this.$refs.noRent)
        this.srcollRmove = this.scrollListen()
        this.getPageData()
      })
    })
  },
  watch: {
    rentToggle (val, oldVal) {
      if (typeof val === 'boolean') {
        console.log(val, '切换了')
        this.setBigPie(this.noRentChart)
      }
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    currDate () {
      return (new Date()).format('yyyy-MM-dd')
    },
    beforeDate () {
      let date = new Date()
      date.setMonth(date.getMonth() - 2)
      return date.format('yyyy-MM-dd')
    },
    rentClass () {
      if (this.sortMain === 'rent') {
        return this.sortByRent ? 'top' : 'bottom'
      }
      return ''
    },
    emptyClass () {
      if (this.sortMain === 'empty') {
        return this.sortByEmpty ? 'top' : 'bottom'
      }
      return ''
    },
    sortList () {
      let list = this.list.concat()
      console.log(list, '??????')
      if (this.rentToggle) {
        return this.sort01List(list, this.sortMain) // 分区
      } else {
        return this.sort02List(list, this.sortMain) // 业态
      }
    }
  },
  methods: {
    // 分区
    sort01List (list, sortMain) {
      if (list.length === 0) {
        return list
      }
      let allItem = list.pop()
      if (sortMain === 'rent') {
        list.sort((a, b) => {
          if (this.sortByRent) {
            return a.CZL - b.CZL
          } else {
            return b.CZL - a.CZL
          }
        })
      }
      if (sortMain === 'empty') {
        list.sort((a, b) => {
          if (this.sortByEmpty) {
            return a.KZL - b.KZL
          } else {
            return b.KZL - a.KZL
          }
        })
      }
      list.push(allItem)
      return list
    },
    // 业态
    sort02List (list, sortMain) {
      let arr = []
      if (list.length === 0) {
        return list
      }
      let all = list.pop()
      arr = list.reduce((before, item) => {
        let obj = before.find(sub => sub.ResType === item.ResType)
        if (obj) {
          obj.YZSL = parseInt(obj.YZSL) + parseInt(item.YZSL)
          obj.KZSL = parseInt(obj.KZSL) + parseInt(item.KZSL)
          obj.KZMJ = parseFloat(obj.KZMJ || 0) + parseFloat(item.KZMJ || 0)
          obj.YZMJ = parseFloat(obj.YZMJ || 0) + parseFloat(item.YZMJ || 0)
          obj.WZMJ = parseFloat(obj.WZMJ || 0) + parseFloat(item.WZMJ || 0)
        } else {
          before.push({
            ...item,
            GrpName: item.ResType + ' '
          })
        }
        return before
      }, [])
      arr.forEach(item => {
        item.CZL = (item.KZSL - 0) ? ((item.YZSL / item.KZSL) * 100).toFixed(2) : 0
        item.KZL = (item.KZSL - 0) ? (((item.KZSL - item.YZSL) / item.KZSL) * 100).toFixed(2) : 0
      })
      if (sortMain === 'rent') {
        arr.sort((a, b) => {
          if (this.sortByRent) {
            return a.CZL - b.CZL
          } else {
            return b.CZL - a.CZL
          }
        })
      }
      if (sortMain === 'empty') {
        arr.sort((a, b) => {
          if (this.sortByEmpty) {
            return a.KZL - b.KZL
          } else {
            return b.KZL - a.KZL
          }
        })
      }
      arr.push({
        GrpName: '总计',
        ...all
      })
      return arr
    },
    startHandleConfirm (date) {
      this.searchForm.startDate = date.format('yyyy-MM-dd')
    },
    endHandleConfirm (date) {
      this.searchForm.endDate = date.format('yyyy-MM-dd')
    },
    projectChange (item) {
      this.orgId = item.projectId
      this.orgName = item.projectName
      this.getPageData()
    },
    // 按出租率排序
    sortByRentHandler () {
      this.sortMain = 'rent'
      this.sortByRent = !this.sortByRent
      console.log('排序')
    },
    // 按空置率排序
    sortByEmptyHandler () {
      this.sortMain = 'empty'
      this.sortByEmpty = !this.sortByEmpty
      console.log('排序')
    },
    scrollListen () {
      let removeMain = this.listenBottom(this.$refs.scrollMain)
      let removeData = this.listenTop(this.$refs.scrollData)
      return function () {
        // 移除事件监听
        removeMain()
        removeData()
      }
    },
    listenBottom (el) {
      let that = this
      let canFoward = false
      let y = 0
      let distance = 0
      function start (e) {
        distance = 0
        y = e.touches[0].pageY
        if ((el.scrollHeight - (el.scrollTop + el.clientHeight)) < 10) {
          canFoward = true
        }
      }
      function move (e) {
        distance = e.touches[0].pageY - y
      }
      function end (e) {
        if (canFoward && distance < -50) {
          that.visible = true
        }
        canFoward = false
      }
      el.addEventListener('touchstart', start)
      el.addEventListener('touchmove', move)
      el.addEventListener('touchend', end)
      return function () {
        el.removeEventListener('touchstart', start)
        el.removeEventListener('touchmove', move)
        el.removeEventListener('touchend', end)
      }
    },
    listenTop (ele) {
      let that = this
      let canBack = false
      let y = 0
      let distance = 0
      function start (e) {
        y = e.touches[0].pageY
        distance = 0
        if (ele.scrollTop < 5) {
          canBack = true
        }
      }
      function move (e) {
        distance = e.touches[0].pageY - y
      }
      function end (e) {
        if (canBack && distance > 50) {
          that.visible = false
        }
        canBack = false
      }
      ele.addEventListener('touchstart', start)
      ele.addEventListener('touchmove', move)
      ele.addEventListener('touchend', end)
      return function () {
        ele.removeEventListener('touchstart', start)
        ele.removeEventListener('touchmove', move)
        ele.removeEventListener('touchend', end)
      }
    },
    // goBack () {
    //   if (window.webkit) {
    //     window.webkit.messageHandlers.Native_Js_tabbar.postMessage('true')
    //   }
    //   window.location.href = 'javascript:window.history.back()'
    // },
    // 重置日期选择
    resetSearch () {
      this.searchForm = {
        startDate: this.beforeDate,
        endDate: this.currDate
      }
    },
    submitSearch () {
      this.popupVisible = false
      this.getPageData()
    },
    showDate () {
      this.popupVisible = !this.popupVisible
    },
    async getPageData () {
      let res = await this.$xml('UserCS_ReportLeaseRentals', {
        'OrgID': this.orgId, // '11091315263400010000',
        'Stime': this.searchForm.startDate,
        'Etime': this.searchForm.endDate
      })
      this.list = res.data
      this.all = this.list[this.list.length - 1]
      this.setSmallPie(this.rentChart)
      this.setBigPie(this.noRentChart)
      return this.list
    },
    showDetail (index) {
      if (index === this.detailShow) {
        this.detailShow = -1
      } else {
        this.detailShow = index
      }
    },
    getSmallPieData () {
      var arr = []
      arr[0] = {
        value: this.all.YZSL,
        name: '已租',
        itemStyle: {
          color: '#FD8550'
        }
      }
      arr[1] = {
        value: this.all.WZSL,
        name: '未租',
        itemStyle: {
          color: '#FECEB9'
        }
      }
      return arr
    },
    setSmallPie (rentChart) {
      let data = this.getSmallPieData()
      let option = {
        title: {
          text: data[0].value,
          itemGap: 5,
          textStyle: {
            color: '#333333',
            fontSize: '17'
          },
          subtext: '当前已租',
          subtextStyle: {
            color: '#999',
            fontSize: '14'
          },
          bottom: '30%',
          left: 'center'
        },
        series: [
          {
            name: '已租统计',
            type: 'pie',
            radius: ['80%', '100%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: data
          }
        ]
      }
      rentChart.setOption(option)
    },
    // 分区
    getBigPieData () {
      let arr = []
      let other = {
        name: '其他',
        value: 0,
        kzsl: 0,
        czl: 0
      }
      let list = this.list.concat()
      if (list.length === 0) {
        return {
          all: {
            YZSL: 0
          },
          arr: [other]
        }
      }
      let all = list.pop()
      list.sort((a, b) => {
        return b.CZL - a.CZL
      })
      list.forEach((item, index) => {
        if (index < 5) {
          arr.push({
            name: item.GrpName,
            value: item.YZSL, // 已租
            kzsl: item.KZSL, // 可租
            czl: item.CZL // CZL 出租率 KZL空置率
          })
        } else {
          other.kzsl += parseInt(item.KZSL)
          other.value += parseInt(item.YZSL)
        }
      })
      if (other.kzsl !== 0) {
        other.czl = parseFloat(other.value / other.kzsl).toFixed(2)
      }
      arr.push(other)
      return {
        all,
        arr
      }
    },
    // 业态
    getBigPieData02 () {
      let arr = []
      let tmp = []
      let other = {
        name: '其他',
        value: 0,
        kzsl: 0,
        czl: 0
      }
      let list = this.list.concat()
      if (list.length === 0) {
        return {
          all: {
            YZSL: 0
          },
          arr: [other]
        }
      }
      let all = list.pop()
      console.log(list, 'wo cao')
      tmp = list.reduce((before, item) => {
        let obj = before.find(sub => sub.ResType === item.ResType)
        if (obj) {
          obj.value += parseInt(item.YZSL)
          obj.kzsl += parseInt(item.KZSL)
        } else {
          before.push({
            name: item.ResType + ' ',
            value: parseInt(item.YZSL),
            kzsl: parseInt(item.KZSL),
            // czl: item.CZL, // CZL出租率
            // kzl: item.KZL, //  KZL空置率
            ...item
          })
        }
        return before
      }, [])
      tmp.sort((a, b) => {
        return b.value - a.value
      })
      tmp.forEach((item, index) => {
        if (index < 5) {
          arr.push({
            name: item.name,
            value: item.value, // 已租
            kzsl: item.kzsl // 可租
            // czl: item.CZL // CZL 出租率 KZL空置率
          })
        } else {
          other.kzsl += parseInt(item.kzsl)
          other.value += parseInt(item.value)
        }
      })
      arr.push(other)
      arr.forEach(item => {
        item.czl = item.kzsl ? ((item.value / item.kzsl) * 100).toFixed(2) : 0
        item.kzl = (((item.value - item.kzsl) / item.value) * 100).toFixed(2)
      })
      return {
        all,
        arr
      }
    },
    setBigPie (noRentChart) {
      let all = ''
      let data = []
      if (this.rentToggle) {
        let res = this.getBigPieData()
        all = res.all
        data = res.arr
      } else {
        let res = this.getBigPieData02()
        all = res.all
        data = res.arr
      }
      let nameArr = data.map(item => item.name)
      let option = {
        title: {
          text: all.YZSL,
          itemGap: 5,
          textStyle: {
            color: '#333333',
            fontSize: 18,
            align: 'center'
          },
          verticalAlign: 'middle',
          subtext: '房源(套)',
          subtextStyle: {
            color: '#999',
            fontSize: 14,
            align: 'center'
          },
          bottom: '32%',
          right: '22%'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 'center',
          itemWidth: 14,
          itemHeight: 7,
          textStyle: {
            color: '#999',
            rich: {
              a: {
                color: '#333'
              },
              b: {
                color: '#999',
                fontSize: 11
              }
            }
          },
          formatter: function (name) {
            let obj = data.find(item => item.name === name)
            return '{a|' + obj.name + '}' + ' {b|出租率' + obj.czl + '%}'
          },
          data: nameArr
        },
        series: [
          {
            name: '已租分区统计',
            color: ['#F2637B', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', '#FB9365', '#9C8CFD', '#DC81D2', '#96BFFF'],
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['68%', '55%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                formatter: function (obj) {
                  return obj.data.name + '' + obj.data.value
                },
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: data
          }
        ]
      }
      noRentChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
  .slide-top-enter, .slide-top-leave-to {
    opacity: 0;
    transform:translate3d(0,100%,0);
  }
  .slide-top-enter-active, .slide-top-leave-active {
    transition: all .3s ease;
  }
  .slide-top-enter-to, .slide-top-leave {
    opacity: 1;
    transform:translate3d(0,0,0);
  }

  .slide-bottom-enter, .slide-bottom-leave-to {
    opacity: 0;
    transform:translate3d(0,-100%,0);
  }
  .slide-bottom-enter-active, .slide-bottom-leave-active {
    transition: all .3s ease;
  }
  .slide-bottom-enter-to, .slide-bottom-leave {
    opacity: 1;
    transform:translate3d(0,0,0);
  }
  /*.fade-enter-active, .fade-leave-active {*/
    /*transition: opacity .5s*/
  /*}*/
  /*.fade-enter, .fade-leave-active {*/
    /*opacity: 0*/
  /*}*/
  .slide-next {
    height: 18px;
    overflow: hidden;
    text-align: center;
  }
  .icon_sort {
    position: relative;
    padding-right: 5px;
    &:before{
      content: "";
      border-style: solid;
      border-color: #333 transparent;
      border-width: 5px 5px 0 5px;
      position: absolute;
      bottom: 13px;
      right: 5px;
    }
    &:after{
      content: "";
      border-style: solid;
      border-color: #333 transparent;
      border-width: 0px 5px 5px 5px;
      position: absolute;
      top: 13px;
      right: 5px;
    }
  }
  .icon_sort.top {
    &:before {
      border-color: #ff4e00 transparent;
    }
  }
  .icon_sort.bottom {
    &:after {
      border-color: #ff4e00 transparent;
    }
  }
  .re_page {
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction: column;
  }
  .re_page_bd {
    flex:1;
    overflow:hidden;
  }
  .re_scroll {
    height:100%;
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
  .modal {
    position: absolute;
    top: 88px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow:hidden;
    background:#FFF;
    /*height:100%;*/
    /*width:100%;*/
  }
  .modal .re_page {
    height:100%;
  }
  .back{
    color:#FFF;
    position:absolute;
    left:0.2rem;
  }
  .back .vux-x-icon {
    fill: #FFF;
    vertical-align: middle;
    margin-top: -0.05rem;
  }
  .re_header {
    height: 0.88rem;
    background-color: #303642;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
    font-size: 0.34rem;
    color: #fff;
    line-height: 0.88rem;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    top: 0;
    z-index: 510;
  }
  .text-center{
    text-align:center;
  }
  .flex {
    display:flex;
  }
  .flex_item {
    flex:1;
  }
  .item_center{
    align-self: center;
  }
  .float_right {
    float:right;
  }
  .fs17 {
    font-size:17px;
  }
  .fs15 {
    font-size:15px;
  }
  .dark_99 {
    color:#999999;
  }
  .report_wrap{
    // position: relative;
    // width: 100vw;
    // height: 100vh;
    // overflow: hidden;
    // color:#333;
    // -webkit-overflow-scrolling: touch;
    .header{
      position: relative;
      height: 0.8rem;
      padding: 0 .3rem;
      font-size: .3rem;
      line-height: 0.8rem;
      color: #333;
      background: #fff;
      border-bottom: 1px solid #ededed;
      overflow: hidden;
      .icon-gengduo1{
        position: absolute;
        top: .2rem;
        right: .3rem;
        display: block;
        width: .4rem;
        height: .4rem;
        line-height: .4rem;
        font-size: 0.4rem;
        color: #999;
        text-align: right;
      }
    }
    .re_title {
      position:relative;
      overflow: hidden;
      height:0.96rem;
      font-size:17px;
      line-height:0.96rem;
      padding:0 15px;
    }
    .re_title:after {
      content:"";
      bottom:0;
      position:absolute;
      left:15px;
      width: 100%;
      border-bottom: 1px solid #e3e3e3;
    }
    .re_content {
      padding:0 0.3rem;
    }
    .re_bl_warp {
      padding:15px;
      .re_bl_item {
        text-align:center;
        background:#FFF;
        border-radius:5px;
        height:1.9rem;
      }
      .re_bl_item dl {
        padding-top:0.4rem;
      }
      .re_bl_item dt{
        font-size:24px;
        padding-bottom:5px;
      }
      .re_bl_item dd {
        font-size:17px;
      }
      .re_bl_item + .re_bl_item {
        margin-left:15px;
      }
    }
    .re_section {
      background:#FFF;
      margin-bottom:0.2rem;
    }
    .re_item_info {

      background:#F8F8F8;
      padding:0.2rem 0.3rem;
      margin:0 -0.3rem;
      text-align:center;
      & dt {
        padding-bottom: 0.1rem;
      }
    }
    .re_table_detail {
      background:#FFF;
      padding-bottom:0.3rem;
      overflow: hidden;
      & .hd {
        color:#999999;
        font-size:0.3rem;
      }
      & li .re_detail_item{
        text-align:center;
        font-size:0.3rem;
        height:0.80rem;
        line-height:0.80rem;
        position: relative;
        z-index: 1;
        background: #FFF;
        .bf {
          color:#0095FD;
          overflow:hidden;
        }

      }
    }

  }
  .search-date-popup {
      background:#FFF;
      width: 100%;
      padding:0.2rem 0.3rem;
      .form_item {
        height:0.8rem;
        line-height:0.8rem;
        display:flex;
        margin-bottom:0.3rem;
      }
      .form_item label {
        font-size:0.3rem;
        margin-right:0.2rem;
      }
      .form_item > div  {
        flex:1;
        position:relative;
        border:1px solid #e3e3e3;
      }
      .form_item  input {
        padding-left:0.3rem;
        height:0.76rem;
        line-height:0.76rem;
        font-size:0.3rem;
        width:100%;
      }
      .form_item i {
        position:absolute;
        font-size: 0.4rem;
        right:0.1rem;
        color:#666;
      }
      .btn_wrap {
        text-align:center;
        .btn_reset {
          width:2.5rem;
          border:1px solid #3395FF;
          color:#3395FF;
          border-radius:0.2rem;
          height:0.66rem;
        }
        .btn_sure{
          margin-left:20px;
          width:2.5rem;
          background:#3395FF;
          border:1px solid #3395FF;
          color:#FFF;
          border-radius:0.2rem;
          height:0.66rem;
        }
      }
    }
.re_btn_link {
  border:1px solid #3395FF;
  font-size:14px;
  padding:3px 5px;
  color:#3395FF;
}
.re_btn_link.active {
  background:#3395FF;
  color:#FFF;
}
.re_btn_link + .re_btn_link{
  margin-left:-1px;
}
</style>
