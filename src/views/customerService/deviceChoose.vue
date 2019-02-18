<template>
  <div class="page_modal">
    <div class="page">
        <mt-header title="选择位置">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_sub_hd">
          <ul class="sub_title_cb clearfix">
            <li @click="resetDevice">设备</li>
            <li v-for="(item, index) in navList" :key="index" @click="subDeviceSelect(item, index)">
              &nbsp;> &nbsp;<span>{{item.Name}}</span>
            </li>
          </ul>
        </div>
        <div class="page_bd">
          <ul class="type_ul">

            <li v-for="(item, index) in list" :key="index">
              <div @click="itemClick(item, index)" class="title">
                <i class="iconfont icon-wenjianjia padding-right"></i>{{item.Name}}
                <i class="iconfont float_right " :class="index === activeIndex?'icon-shouqi':'icon-xiala'"></i>
              </div>
              <div  class="sub_bottom" style="background:#FFF;">
                <ul v-if="activeIndex === index" class="sub_ul clearfix">
                  <li @click="selectSubClick(sub)" v-for="(sub, subIndex) in item.ArchivesList" :key="subIndex">
                    <i class="iconfont icon-qingdan padding-right"></i>{{sub.EquiName}}
                  </li>
                  <template v-if="item.EquiList.length > 0">
                   <li v-for="(sub, subIndex ) in item.EquiList"  @click="setSelectDevice(item)" :key="'sub'+subIndex">
                     <i class="iconfont icon-qingdan padding-right"></i>{{sub.Name}}
                     <i class="iconfont float_right icon-xiala"></i>
                   </li>
                  </template>
                </ul>
              </div>
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'deviceChoose',
  data () {
    return {
      navList: [],
      list: [],
      activeIndex: -1
    }
  },
  created () {
    console.log(this.$parent.nav, 'this.$parent.nav')
    // this.orgId = '11091315263400010000'
    this.orgId = this.$parent.nav.orgId
    this.getPageData()
  },
  methods: {
    async getPageData () {
      // let res = await this.$http.post('/ets/syswin/smd/userCSGetEquiArchives', {
      //   orgId: this.orgId
      // })
      let p0 = 'UserCS_GetEquiArchives'
      let res = await this.$xml(p0, {
        OrgID: this.orgId
      })
      this.tmpData = res.data
      this.list = res.data
      console.log(res.data)
    },
    resetDevice () {
      this.list = this.tmpData
      this.activeIndex = -1
      this.navList = []
    },
    selectSubClick (sub) {
      this.$parent.setDevice(sub)
      this.$root.back()
    },
    setSelectDevice (item) {
      this.activeIndex = -1
      this.navList.push(item)
      this.list = item.EquiList
    },
    subDeviceSelect (item, index) {
      this.navList = Array.prototype.slice.call(this.navList, 0, index + 1)
      this.activeIndex = -1
    },
    itemClick (item, index) {
      if (index === this.activeIndex) {
        this.activeIndex = -1
        return
      }
      if (item.EquiList.length === 0 && item.ArchivesList.length === 0) return
      this.activeIndex = index
    }

  }
}
</script>

<style lang="scss" scoped>
.sub_title_cb {
  padding:0 15px;
}
.sub_title_cb li{
  float:left;
  font-size:15px;
}
.type_ul {
  border-left: 1px solid #e5e5e5;
}
.type_ul > li .title {
  padding: 10px 15px;
  line-height: 25px;
  font-size: 16px;
  position: relative;
}
.type_ul > li .title:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0px;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e3e3e3;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}

.sub_ul > li {
  position:relative;
  font-size:15px;
  height:45px;
  line-height: 45px;
  text-align:left;
  padding: 0 15px 0 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sub_ul > li:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0px;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e3e3e3;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.sub_bottom {
  position:relative;
}
.sub_bottom:after{
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0px;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e3e3e3;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
</style>
