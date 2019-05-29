<template>
<div class="page">
  <div class="page_hd">
    <nav-title :title="$route.meta && $route.meta.title" :hasBtn="hasBtn"></nav-title>
  </div>
  <div class="page_bd">
    <mt-loadmore :auto-fill="true" style="height:100%" :top-method="loadTop"  ref="loadmore">
      <!-- <div class="weui-cells" style="margin-top:0;">
        <div @click="$app.loadView(item.url)" v-for="item in list" :key="item.GDType" class="weui-cell">
          <div class="weui-cell__hd" style="position: relative;margin-right: 10px;width:50px;height:50px;">
            <img :src="item.img" style="width: 50px;display: block">
          </div>
          <div class="weui-cell__bd">
            <p>{{item.name}}</p>
            <p style="font-size: 13px;color: #888888;">{{item.GDQuesDesc}}</p>
          </div>
          <div class="weui-cell__ft">
            <p class="fs12">{{item.GDCreateTime}}</p>
            <p class="" v-show="item.num != '0'"><span class="weui-badge" style="margin-left: 5px;">{{item.num}}</span></p>
          </div>
        </div>
      </div> -->
      <div class="back_img">
        <!-- <div class="backtitle"><span>亚洲的希望&nbsp;&nbsp;产业的未来</span></div> -->
      </div>
      <div  @click.stop="routeTo(item)" v-for="item in list" :key="item.GDType" class="weui-cells" style="margin-top:10px;">
        <div class="weui-cell">
          <div class="weui-cell__hd" :class="getIconClass(item.GDType)"
          style="position: relative;margin-right: 10px;width:50px;height:50px;border-radius: 100px;padding-top: 5px;color: #fff;text-align: center;">
            <!-- <img :src="item.img" style="width: 50px;display: block"> -->
            <i class="iconfont " :class="getIconName(item.GDType)" style="font-size: 25px;"></i>
          </div>
          <div class="weui-cell__bd">
            <p>{{item.name}}</p>
            <p style="font-size: 13px;color: #888888;">{{item.GDQuesDesc}}</p>
          </div>
          <div class="weui-cell__ft">
            <p class="fs12">{{item.GDCreateTime}}</p>
            <p class="" v-show="item.num != '0'"><span class="weui-badge" style="margin-left: 5px;">{{item.num}}</span></p>
          </div>
        </div>
      </div>
      <div v-if="list.length === 0" class="weui-loadmore">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">正在加载</span>
      </div>
    </mt-loadmore>
    <!--<router-link to="/detail">-->
      <!--这个是详情连接-->
    <!--</router-link>-->
    <!--<a @click="$router.forward('/detail')" >这个是详情连接</a>-->
  </div>
</div>
</template>

<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'tabHome',
  data () {
    return {
      list: [],
      currRand: 0,
      currHomeRand: 0,
      hasBtn: false
    }
  },
  created () {
    // this.$store.dispatch('getUserAction').then(res => {
    //   console.log(res, '--------------getUserAction')
    // })
    console.log(this.user)
    console.log(this.ip, '---------------------')
    this.getPageData().then(() => {
      this.currHomeRand = Date.now()
      this.$store.commit('setHomeRand', this.currHomeRand)
    })
    // this.getPageData1()
  },
  activated () {
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      this.getPageData()
      this.currRand = this.rand
    } else {
      this.currRand = this.rand
      if (this.currHomeRand !== 0 || this.currHomeRand !== this.homeRand) {
        this.getPageData()
        this.currHomeRand = this.homeRand
      }
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'ip': 'ip',
      'rand': 'rand',
      'homeRand': 'homeRand'
    })
  },
  watch: {
    // $route (to, from) {
    //   if (from.path.indexOf('/workOrder') > -1) {
    //     this.getPageData()
    //   }
    // }
  },
  methods: {
    loadTop () {
      console.log('loadTop')
      this.getPageData().then(() => {
        this.$refs.loadmore.onTopLoaded()
      })
    },
    routeTo (item) {
      console.log(item)
      if (item.url.url.indexOf('http') > -1) {
        this.$app.loadView(item.url)
      } else {
        this.$router.forward(item.url.url)
      }
    },
    getIconClass (itemType) {
      let iconClass = 'iconblue'
      switch (itemType) {
        case '1':
        case '4':
          iconClass = 'iconblue'
          break
        case '2':
          iconClass = 'iconred'
          break
        case '3':
          iconClass = 'icongreen'
          break
      }
      return iconClass
    },
    getIconName (itemType) {
      let iconName = 'icon-kefuzhongxin'
      switch (itemType) {
        case '1':
          iconName = 'icon-kefuzhongxin'
          break
        case '2':
          iconName = 'icon-weixiu'
          break
        case '3':
          iconName = 'icon-xunjian1'
          break
        case '4':
          iconName = 'icon-baoyang'
          break
      }
      return iconName
    },
    // async getPageData1 () {
    //
    //   console.log(res, '----哈哈哈--')
    // },
    async getPageData () {
      try {
        let res = await this.$xml('User_Service_GetWorkordCount', '', {
          p1: this.user.OrgID,
          p2: this.user.memberId,
          p3: this.user.PositionID
        }, true)
        // let res = await this.$http.post('/ets/syswin/smd/userServiceGetWorkordCount', {
        //   projectId: this.user.OrgID,
        //   memberId: this.user.memberId,
        //   positionID: this.user.PositionID,
        //   hideLoad: true
        // })
        let nameArr = ['客服工单池', '维修工单池', '巡检工单池', '保养工单池']
        let imgArr = [
          './static/tabHome/ic_service_pool.png',
          './static/tabHome/ic_maintain_pool.png',
          './static/tabHome/msg_list_icon_inspection.png',
          './static/tabHome/msg_list_icon_maintain.png'
        ]
        let urlArr = [
        // {url: `http://${this.ip}/ETSServiceList/#page=0`, type: 'kefugongdan'},
        // {url: `http://${this.ip}/ETSServiceList/#page=0`, type: 'weixiugongdan'},
        // {url: `http://${this.ip}/ETSInspection/#page=0`, type: 'xunjian'},
        // {url: `http://${this.ip}/ETSInspection/#page=0`, type: 'baoyang'}
          {url: `/workOrder/customerService/Resource`, type: 'kefugongdan'},
          {url: `/workOrder/customerService/Equipment`, type: 'weixiugongdan'},
          {url: `/workOrder/inspection/Inspection`, type: 'xunjian'},
          {url: `/workOrder/inspection/KeepFit`, type: 'baoyang'}
        ]
        this.list = res.data.filter((item, index) => {
          if (item.GDType !== '5') {
            item.name = nameArr[index]
            item.img = imgArr[index]
            item.num = parseInt(item.GDCount) > 99 ? '99+' : item.GDCount
            item.url = urlArr[index]
            return true
          } else {
            return false
          }
        })
        console.log('tag', this.list)
        localStorage.tabHome = JSON.stringify(this.list)
      } catch (e) {
        console.log(e + 'catch')
        this.list = localStorage.tabHome ? JSON.parse(localStorage.tabHome) : []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .mint-loadmore{
    .back_img{
      height: 140px;
      // background-color: green;
      background-image: url('../assets/img/work/i_work_titlebg.png');
    }
    .weui-cells:before{
      display: none;
    }
    .weui-cell{
      height: 84px;
    }
  }
  .backtitle{
    color: #fff;
    padding-top: 30px;
    padding-left: 33px;
    font-size: 18px;
    font-weight: bold;
  }
  .iconblue{
    background-color: #2D93E9;
  }
  .iconred{
    background-color: #F85A59;
  }
  .icongreen{
    background-color: #02BD9B;
  }
</style>
