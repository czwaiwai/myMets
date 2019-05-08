<template>
  <div class="page page_bg">
    <nav-title title="租赁房源"></nav-title>
      <div class="weui-cells">
          <a class="weui-cell weui-cell_access" href="javascript:;">
              <div class="weui-cell__hd">
                <div class="cir_text_tag">{{currentBuildLetter}}</div>
              </div>
              <div class="weui-cell__bd" >
                  <p class="padding-left15"  @click="openBuild">{{currentBuildName}}</p>
                   <popup ref="buildPop" style="width:100%"
                    v-model="popupBuildVisible"
                    position="bottom">
                    <!-- <div class="picker-toolbar">
                      <span class="mint-datetime-action mint-datetime-cancel" @click="popupBuildVisible=false">取消</span>
                      <span class="mint-datetime-action mint-datetime-confirm" @click="selectBuildValue()">确定</span>
                    </div> -->
                    <picker ref='buildPicker' valueKey='buildingName' show-toolbar :slots="buildSlots">
                      <mt-button class="mint-datetime-action mint-datetime-cancel weui-picker__action gray_color" @click="popupBuildVisible=false">取消</mt-button>
                      <mt-button class="mint-datetime-action mint-datetime-confirm weui-picker__action blue_color" @click="selectBuildValue">确认</mt-button>
                    </picker>
                  </popup>
              </div>
              <div class="weui-cell__ft" >
              </div>
          </a>
          <div class="weui-cell" >
              <div class="weui-cell__bd">
                 <label class="tag_status_txt"><i class="sale_color can_sale"></i><span>可售</span></label>
                 <label class="tag_status_txt"><i class="sale_color not_can_sale"></i><span>不可售</span></label>
              </div>
          </div>
          <div class="weui-cell" >
              <div class="weui-cell__bd" style="width:100%;">
                <div class="build_nav_bar">
                  <ul class="nav_list">
                    <li v-for="(item ,index) in this.houseInfo" :key="index" @click="navClick(item.nodeName)" :class="selectedUnitNo===item.nodeName?'active':'noActive'">{{item.nodeName}}</li>
                  </ul>
                </div>
              </div>
          </div>
      </div>
      <div class="area_wrap weui-panel weui-panel_access" v-for="(item,index) in this.houseUnitList" :key="index">
            <div class="weui-panel__hd"><span class="title_h_line">{{item.nodeId}} 层</span></div>
            <div class="weui-panel__bd">
              <ul class="area_item_list clearfix">
                <li  v-for="(itemHouse,indexH) in item.childList" :key="indexH" :class="isAllowSales(itemHouse.salesStatus,itemHouse.simulateSalesStatus)?'':'un_sale'">
                  <span @click="clickHouse(itemHouse.salesStatus,itemHouse.simulateSalesStatus,itemHouse.nodeArg1)" class="over-flow">{{itemHouse.nodeId}}</span></li>
                <!-- <li><span @click="$router.push('/houseDetail')">102</span></li>
                <li><span @click="$router.push('/houseDetail')">103</span></li>
                <li><span @click="$router.push('/houseDetail')">104</span></li>
                <li><span @click="$router.push('/houseDetail')">105</span></li>
                <li><span @click="$router.push('/houseDetail')">106</span></li>
                <li class="un_sale"><span>107</span></li> -->
              </ul>
            </div>
        </div>
        <div style="padding-top:30px;"></div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import counttime from '@/components/countTime'
import sess from '@/utils/sess'
import { popup, picker } from 'mint-ui'
export default {
  name: 'buildingChooseDetail',
  components: {counttime, popup, picker},
  data () {
    return {
      buildId: '',
      groupId: '',
      currentBuildId: '',
      currentBuildLetter: '',
      currentBuildName: '请选择楼栋',
      buildList: [
        // {name: 'A栋', value: 'A', letter: 'a'}, {name: 'B栋', value: 'B', letter: 'b'}, {name: 'C栋', value: 'C', letter: 'c'}]
      ],
      houseInfo: [],
      houseUnitList: [],
      selectedUnitNo: '',
      popupBuildVisible: false
    }
  },
  computed: {
    ...mapGetters({
      'activityInfo': 'activityInfo',
      'activitybatch': 'activitybatch'
    }),
    buildSlots () {
      let buildSlot = [{
        flex: 1,
        values: this.buildList
      }]
      return buildSlot
    }
  },
  created () {
    this.buildId = this.$route.params.buildId
    this.groupId = this.$route.params.groupId
    this.getBuildInfo()
  },
  methods: {
    navClick (unitNo) {
      this.houseInfo.forEach((ele) => {
        if (ele.nodeName === unitNo) {
          this.selectedUnitNo = unitNo
          this.houseUnitList = ele.childList
        }
      })
    },
    selectBuildValue () {
      this.currentBuildName = this.$refs.buildPicker.getValues()[0].buildingName
      this.currentBuildId = this.$refs.buildPicker.getValues()[0].buildingId
      this.currentBuildLetter = this.$refs.buildPicker.getValues()[0].buildingName.substring(0, 1)
      this.popupBuildVisible = false
      sess.remove('chooseBuildHouseInfo')
      this.getHouseTree(this.currentBuildId)
    },
    openBuild () {
      this.popupBuildVisible = true
    },
    isAllowSales (isSale, isMNSals) {
      let checkSaleState = isMNSals
      if (this.activitybatch.isZsBatch === 1) {
        checkSaleState = isSale
      }
      return (checkSaleState === 1)
    },
    clickHouse (isSale, isMNSals, houseId) {
      let checkSaleState = isMNSals
      if (this.activitybatch.isZsBatch === 1) {
        checkSaleState = isSale
      }
      if (checkSaleState === 1) {
        let chooseBuildHouseInfo = {
          buildId: this.currentBuildId,
          buildName: this.currentBuildName,
          houseId: houseId,
          unitNo: this.selectedUnitNo
        }
        sess.set('chooseBuildHouseInfo', chooseBuildHouseInfo)
        this.$router.push('/houseDetail/' + houseId)
      }
    },
    async getBuildInfo () {
      let res = await this.$http.get(this.$api.getBuildingList + '/' + this.activityInfo.projectId + '/' + this.groupId + '/' + this.activityInfo.activityId)
      if (res.isSuccess && res.data) {
        let buildData = res.data
        this.buildList = buildData
        if (this.buildList.length > 0) {
          let currentSelectedId = this.$route.params.buildId
          let chooseBuildHouseInfo = sess.get('chooseBuildHouseInfo')
          if (chooseBuildHouseInfo) {
            currentSelectedId = chooseBuildHouseInfo.buildId
          }
          let selectedBuild = this.buildList.filter(ele => {
            return ele.buildingId === currentSelectedId
          })
          if (selectedBuild && selectedBuild.length > 0) {
            this.currentBuildName = selectedBuild[0].buildingName
            this.currentBuildId = selectedBuild[0].buildingId
            this.currentBuildLetter = selectedBuild[0].buildingName.substring(0, 1)
            this.getHouseTree(this.currentBuildId)
          }
        }
      }
    },
    async getHouseTree (buildId) {
      let res = await this.$http.get(this.$api.getHouseTree + '/' + this.groupId + '/' + buildId + '/' + this.activityInfo.activityId)
      if (res.isSuccess && res.data) {
        this.houseInfo = res.data
        this.houseUnitList = []
        if (res.data.length > 0) {
          let chooseBuildHouseInfo = sess.get('chooseBuildHouseInfo')
          if (chooseBuildHouseInfo) {
            // this.currentBuildName = chooseBuildHouseInfo.buildName
            // this.currentBuildId = chooseBuildHouseInfo.buildId
            // this.currentBuildLetter = chooseBuildHouseInfo.buildName.substring(0, 1)
            this.navClick(chooseBuildHouseInfo.unitNo)
          } else {
            this.selectedUnitNo = res.data[0].nodeName
            this.houseUnitList = res.data[0].childList
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.gray_color{
  color: #999;
}
.blue_color{
  color: #4987EE;
}
.weui-cells
{
  font-size: 15px
}
.build_nav_bar {
  overflow-x: auto;
  white-space: nowrap;
}
.nav_list{
  width: 100%;
  display: block;
}
.over-flow{
  overflow: hidden;
}
.nav_list li{
  display:inline-block;
  font-size:15px;
  margin-right:15px;
  border-bottom:2px solid #FFF;
}
.nav_list li.active {
  border-bottom:2px solid #4987EE;
}
.nav_list li.noActive {
  color: #999999;;
}
.area_item_list {
  padding: 23px 5px 13px 15px;
}
.area_item_list  li{
  float:left;
  width:25%;
  height:40px;
  padding-right:10px;
  padding-bottom:10px;
}
.area_item_list  li.un_sale span{
  background:#E7EBF1;
  color:#CCCCCC;
}
.area_item_list  li span {
  display:block;
  background:#EAF2FD;
  color:#4987EE;
  width:100%;
  height: 30px;
  line-height:30px;
  font-size:17px;
  text-align:center;
}
.title_h_line {
border-left: 2px solid #4987EE;
    padding-left: 10px;
    line-height: 1;
    height: 16px;
    display: inline-block;
}
.area_wrap .weui-panel__hd{
  height: 40px;
  line-height: 28px;
  padding: 6px 15px;
  font-size:15px;
}
.cir_text_tag{
  background:#4987EE;
  height:26px;
  line-height:26px;
  font-size:15px;
  text-align:center;
  color:#FFF;
  width:26px;
  border-radius:50%;
}
.sale_color {
  width:16px;
  height:16px;
  display:inline-block;
  border-radius:1px;
  vertical-align: middle;
}
.can_sale {
  background:#EAF2FD;
}
.not_can_sale{
  background:#E7EBF1;
}
.tag_status_txt{
  color:#666666;
  font-size:15px;
  margin-right:15px;
}
.tag_status_txt span {
  padding-left:5px;
  vertical-align: middle;
}
.weui-cells{
  margin-top: 0.6em;
}
</style>
