<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header title="查找添加">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="查找添加"></nav-title>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <search v-model="search" placeholder="输入物料名称、型号或规格"></search>
      </div>
      <div @click="searchClick" class=" weui-search-bar" style="background:#EFEFF4;padding:0 10px 0 0 ;">
        <i class="main_color icon-sousuo iconfont" style="font-size: 18px; line-height: 43px;"></i>
      </div>
    </div>
    <div class="top_result padding15-h">
        <p>查找结果:  {{list.length}}条</p>
    </div>
    <div class="page_bd">
      <div class="light_bg">
        <ul>
          <li class="padding15-h padding-v border-top-half" v-for="(item,key) in list" :key="key" >
            <p>
              <span>{{item.materialName}}</span>
              <span class="dark_99 float_right">库存: {{item.storeAmount}}</span>
            </p>
            <p class="fs12">
              <span class="prop_bl dark_99">型号: {{item.model}}</span>
              <span class="prop_bl dark_99">规格: {{item.specification}}</span>
            </p>
            <div class="weui-flex">
              <div class="weui-flex__item">
                <p class="error_color weui-flex__item" style="line-height:32px;">￥ {{item.planPrice | formatMoney}}</p>
                <p class="dark_99">物料编码:{{item.materialNo}}</p>
              </div>
              <div><mat-number v-model="item.num" @input="numChange" :max="item.storeAmount-0"></mat-number></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="page_ft weui-flex light_bg border-top-half" style="position:relative;z-index:3;">
       <div @click="popupToggle" class="padding-h relative">
         <i class="iconfont icon-xuqiu-hui" style="font-size:32px;"></i>
         <span v-show="allNum>0" class="weui-badge" style="position: absolute;top:4px;right: 4px;">{{allNum}}</span>
       </div>
       <div v-if="chooseList.length > 0" class="padding-h fs16" style="line-height:45px;">
         合计: <span class="error_color">￥{{allPrice | formatMoney}}</span>
       </div>
       <div class="weui-flex__item text-right padding-right15">
         <button class="mat_submit_btn" v-if="chooseList.length > 0" @click="submit">提交申请</button>
         <p v-else class="dark_99 " style="line-height:44px;">请添加材料</p>
       </div>
    </div>
    <div class="popup_bottom_wrap">
      <transition name="fade">
        <div v-if="popupShow" @click.stop="popupShow=false" class="popup_mask"></div>
      </transition>
      <transition name="popup-bottom">
        <div v-if="popupShow" class="popup_modal">
          <div class="page">
            <div class="page_hd border-bottom-half weui-flex padding15-h" style="height:40px;line-height:40px;">
              <div class="weui-flex__item">已选材料</div>
              <a @click="clearChoose">清空</a>
            </div>
            <div class="page_bd">
              <div class="light_bg" style="margin-top:-1px;">
                <ul>
                  <li class="padding15-h padding-v border-top-half" v-for="(item,key) in chooseShowList" :key="key" >
                    <p>
                      <span>{{item.materialName}}</span>
                      <span class="dark_99 float_right">库存: {{item.storeAmount}}</span>
                    </p>
                    <p class="fs12">
                      <span class="prop_bl dark_99">型号: {{item.model}}</span>
                      <span class="prop_bl dark_99">规格: {{item.specification}}</span>
                    </p>
                    <div class="weui-flex">
                      <p class="error_color weui-flex__item" style="line-height:32px;">￥ {{item.planPrice | formatMoney}}</p>
                      <mat-number v-model="item.num" :max="item.storeAmount-0"></mat-number>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</div>
</template>
<script>
import Search from '@/components/search'
import matNumber from '../child/matNumber'
import navTitle from '@/components/navTitle'
export default {
  name: 'materialAdd',
  components: {navTitle, Search, matNumber},
  data () {
    return {
      search: '',
      popupShow: false,
      chooseList: [],
      list: []
    }
  },
  created () {
    this.work = this.$parent.work
    this.nav = this.$parent.nav
    console.log(this.work, '----')
  },
  computed: {
    chooseShowList () {
      return this.chooseList.filter(item => item.num > 0)
    },
    allNum () {
      return this.chooseList.reduce((before, item) => before + item.num, 0)
    },
    allPrice () {
      return this.chooseList.reduce((before, item) => before + Math.round(item.num * (item.planPrice - 0) * 100) / 100, 0)
    }
  },
  watch: {
    chooseShowList (val, old) {
      if (old.length > 0 && val.length === 0) {
        this.popupShow = false
      }
    }
  },
  methods: {
    async getPageData () {
      let p0 = 'UserCS_GetMaterialInfoH5'
      let res = await this.$xml(p0, {
        OrgID: this.nav.orgId,
        EmployeeID: this.nav.memberId,
        MaterialQuery: this.search
      })
      // let url = '/ets/table/list/userCSGetMaterialInfoH5'
      // let res = await this.$http.post(url, {
      //   orgID: this.nav.orgId,
      //   employeeID: this.nav.memberId,
      //   materialQuery: this.search
      // })
      if (res.data && res.data[0]) {
        this.list = this.$toLower(res.data).map(item => {
          item.num = 0
          return item
        })
      }
      console.log(res.data)
    },
    clearChoose () {
      this.list.forEach(item => {
        item.num = 0
      })
    },
    numChange () {
      this.chooseList = this.list.filter(item => item.num > 0)
    },
    popupToggle () {
      if (this.chooseShowList.length <= 0) return
      this.popupShow = !this.popupShow
    },
    searchClick () {
      this.getPageData()
    },
    async submit () {
      await this.$message.confirm('提交此次材料申请?') // ???
      let p0 = 'UserCS_GetMaterialApplyH5'
      let params = {
        'WordOrdId': this.work.WorkOrdID,
        'WordQuertionID': this.work.WorkQuestionID,
        'OrgID': this.work.OrgID,
        //   "OpUser": T.createNew.obj.userName,
        //   "EmployeeId": T.createNew.employeeID,
        'MaterialList': []
      }
      let arr = []
      console.log(this.chooseShowList, 'this.chooseShowList')
      this.chooseShowList.forEach(item => {
        arr.push({'MaterialId': item.materialID, 'GetNum': item.num, 'CollarDetID': '', 'WareHouseId': item.wareHouseId, 'WareHouseName': item.wareHouseName})
      })
      params.MaterialList = arr
      let res = await this.$xml(p0, params)
      // let params = {
      //   'wordOrdId': this.work.WorkOrdID,
      //   'wordQuertionID': this.work.WorkQuestionID,
      //   'orgID': this.work.OrgID,
      //   //   "opUser": T.createNew.obj.userName,
      //   //   "employeeId": T.createNew.employeeID,
      //   'materialList': []
      // }
      // let arr = []
      // this.chooseShowList.forEach(item => {
      //   arr.push({'materialId': item.materialID, 'getNum': item.num, 'collarDetID': '', 'wareHouseId': item.wareHouseId, 'wareHouseName': item.wareHouseName})
      // })
      // params.materialList = JSON.stringify(this.chooseShowList)
      // let res = await this.$http.post('/ets/table/list/userCSGetMaterialApplyH5', params)
      this.$root.back()
      this.$parent.getPageData()
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.top_result {
  height:25px;
  color: #9B9B9C;
  background: #F1F2F4;
  line-height:25px;
}
.prop_bl {
  width:120px;
  display:inline-block;
}
.mat_submit_btn {
  color: #FFF;
  background: #3395FF;
  padding:10px 25px;
  height:45px;
  margin-right:-15px;
}

.popup_bottom_wrap {
  & .popup_mask {
    position: absolute;
    top:0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.35);
  }
  & .popup_modal {
    position: absolute;
    left:0;
    right: 0;
    bottom: 45px;
    z-index: 2;
    height: calc(100% - 300px);
    background:#FFF;
    width:100%;
  }
}
.popup-bottom-enter-active, .popup-bottom-leave-active {
  transform: translate3d(0,0,0);
  transition: transform .3s cubic-bezier(.36,.66,.04,1);
}
.popup-bottom-enter, .popup-bottom-leave-to {
  transform: translate3d(0, 100%, 0)
}
</style>
