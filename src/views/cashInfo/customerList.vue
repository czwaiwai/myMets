<template>
  <div class="page_modal">
    <div class="page">
      <mt-header title="收款">
        <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
      </mt-header>
      <div class="page_sub_hd padding15-h light_bg"  style="background: #FFF;">
        <i class="iconfont icon-shouye-copy main_color padding-right"></i>{{roomName}}
      </div>
      <div class="page_bd">
        <div v-if="noCash === false">
          <div class="weui-cells__title">请选择下方要收款的客户</div>
          <div class="weui-cells">
            <div @click="jumpExpenseList(item)" v-for="item in userList" :key="item.cstID" class="weui-cell weui-cell_access">
              <div class="weui-cell__bd">
                <p>{{item.cstName}}</p>
              </div>
              <div class="weui-cell__ft"></div>
            </div>
          </div>
        </div>
        <div v-if="noCash === true" class="text-center padding-top15">
          <p class="main_color padding-bottom">没有欠款</p>
          <img style="width: 18vw;" src="../../assets/img/cash/clearCash.png">
          <div class="padding15">
            <button class="back_btn_plain" @click="$root.back()">返回</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'customerList',
  data () {
    return {
      orgId: '',
      roomName: '',
      noCash: '',
      userList: []
    }
  },
  created () {
    this.orgId = this.$parent.orgId
    this.roomName = this.$parent.roomName
    // this.getPageData()
    this.getPageDataNet()
  },
  methods: {
    // async getPageData () {
    //   let url = '/ets/payment/house/getArrearsCost'
    //   let res = await this.$http.post(url, {
    //     orgID: this.orgId,
    //     resID: this.$route.params.roomId
    //   })
    //   if (res.data) {
    //     console.log(res.data, '我去')
    //     this.noCash = false
    //     this.userList = res.data
    //   } else {
    //     this.noCash = true
    //   }
    // },
    async getPageDataNet () {
      let p0 = 'UserAppFn_GetArrearsCost'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        resID: this.$route.params.roomId
      })
      if (res.data) {
        let data = this.$toLower(res.data)
        console.log(data, 'data========')
        this.noCash = false
        this.userList = data
      } else {
        this.noCash = true
      }
    },
    jumpExpenseList (item) {
      console.log(item)
      this.$parent.choosePersonCash = item
      // this.$parent.costData = item
      this.$router.forward({name: 'expenseList',
        params: {
          roomId: this.$route.params.roomId
        }
      })
      // var oMessage = {
      //   aCost: oDict.costData,
      //   sName: oDict.cstName,
      //   sTitle: allData.title
      // }
      // T.AllData.pay_expenseList.goExpenseListView(oMessage)
    }
  }
}
</script>

<style lang="scss" scoped>
.back_btn_plain {
  background: transparent;
  border: 1px solid #3395FF;
  border-radius: 20px;
  height: 36px;
  width: 100px;
  font-size: 16px;
  color: #3395FF;
  line-height: 34px;
  margin-top: 10px;
  outline: none;
}
</style>
