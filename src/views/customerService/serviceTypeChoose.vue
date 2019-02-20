<template>
  <div class="page_modal">
    <div class="page">
        <!-- <mt-header title="类型">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header> -->
        <nav-title title="类型"></nav-title>
        <div class="page_bd ">
          <div class="type_nav_bar">
            <div class="weui-cells" style="margin-top:0;">
              <a @click="typeChoose(item)" :class="item.ID === currType.ID?'active':''"  v-for="item in list" :key="item.ID" class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                  <p> {{item.Name}}</p>
                </div>
                <div class="weui-cell__ft">
                </div>
              </a>
            </div>
          </div>
          <div class="right_content">
            <ul v-if="currType && currType.ProblemList" class="type_ul">
              <li v-for="(item, index) in currType.ProblemList" :key="item.ID">
                <div class="title weui-flex">
                  <div  @click="resChoose(item)"  class="weui-flex__item ">{{item.Name}}</div>
                  <span  style="display:block;width: 40px;text-align: right;padding-right:15px;" @click="itemChoose(item, index)"  class="float_right"><i class="iconfont  " :class="index === currIndex?'icon-shouqi':'icon-xiala1'"></i></span>
                </div>
                <div class="sub_bottom" >
                  <ul v-show="index === currIndex" class="sub_ul clearfix">
                    <li @click="resChoose(item)" v-for="item in currSubType.ProblemList" :key="item.ID">
                      {{item.Name}}
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'serviceTypeChoose',
  components: {navTitle},
  data () {
    return {
      list: [],
      currType: {},
      currIndex: 0,
      currSubType: null
    }
  },
  created () {
    // this.orgId =11091315263400010000
    this.orgId = this.$parent.nav.orgId
    this.getPageData()
    // console.log(this.$parent.nav, '???--')
  },
  methods: {
    async getPageData () {
      // let url = '/ets/syswin/smd/userCSGetRulesNode'
      // let res = await this.$http.post(url, {orgId: this.orgId})
      let res = await this.$xml('UserCS_GetRulesNode', {
        'OrgID': this.orgId
      })
      console.log(res.data)
      this.list = res.data
      this.currType = this.list[0]
      this.currSubType = this.currType.ProblemList[0]
    },
    typeChoose (item) {
      this.currType = item
      this.currSubType = this.currType.ProblemList[0]
      this.currIndex = 0
    },
    itemChoose (item, index) {
      console.log(item, index, this.currIndex)
      if (this.currIndex === index && this.currSubType.ID === item.ID) {
        this.currIndex = -1
        return
      }
      this.currIndex = index
      this.currSubType = item
    },
    resChoose (item) {
      this.$parent.setType(item, this.currType.ID)
      this.$root.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.weui-cell_access.active  {
  background-color: #f8f8f8;
  & p {
    color: #3395ff;
  }
}
.type_nav_bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width:42%;
  width: 42vw;
  z-index: 1;
  -webkit-overflow-scrolling: touch;
  overflow-y:auto;
}
.right_content{
  padding-left: 42%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
.type_ul {
  border-left: 1px solid #e5e5e5;
}
.type_ul > li .title {
  padding: 10px 0 10px 15px ;
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
  float:left;
  width:50%;
  font-size:15px;
  height:45px;
  line-height: 45px;
  text-align:center;
  padding: 0 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
