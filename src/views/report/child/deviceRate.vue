<template>
<div class="page_modal">
  <div class="page">
    <mt-header  title="设备运行状态">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd" style="background:#f9f9f9;">
      <div class="weui-cells margin-bottom" style="margin-top:0;">
          <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>2018-06</p>
              </div>
              <div class="weui-cell__ft"></div>
          </div>
      </div>
      <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">设备运行状况</label>
            </div>
          </div>
          <div v-if="dataReady" class="weui-form-preview__bd fs14">
            <div class="weui-flex">
              <div class="bold weui-flex__item text-center">设备类型</div>
              <div class="bold weui-flex__item text-center">检出异常</div>
              <div class="bold weui-flex__item text-center">发起保修</div>
            </div>
            <div class="weui-flex" v-for="(item,index) in list[0]" :key="index">
              <div class="weui-flex__item text-center dark_33">{{item.EquiName}}</div>
              <div class="weui-flex__item text-center dark_33">{{item.EquiCount}}</div>
              <div class="weui-flex__item text-center dark_33">{{item.WorkCount}}</div>
            </div>
          </div>
      </div>
      <div class="weui-form-preview  margin-bottom">
          <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">设备运行状况</label>
            </div>
          </div>
          <div  v-if="dataReady" class="weui-form-preview__bd fs14">
            <div class="weui-flex">
              <div style="width:120px;" class="bold  text-center">设备类型</div>
              <div class="bold weui-flex__item text-center">巡检</div>
              <div class="bold weui-flex__item text-center">维修</div>
              <div class="bold weui-flex__item text-center">保养</div>
              <div class="bold weui-flex__item text-center">异常</div>
            </div>
            <div class="weui-flex"  v-for="(item,index) in list[1]" :key="index">
              <div style="width:120px;" class="text-center dark_33">{{item.EquiName}}</div>
              <div class="weui-flex__item text-center dark_33">{{item.XunJian}}</div>
              <div class="weui-flex__item text-center dark_33">{{item.WeiXiu}}</div>
              <div class="weui-flex__item text-center dark_33">{{item.BaoYang}}</div>
              <div class="weui-flex__item text-center dark_33">{{item.YiChang}}</div>
            </div>
          </div>
      </div>

    </div>
  </div>
</div>
</template>
<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'detail',
  data () {
    return {
      search: '',
      currPro: '',
      list: [],
      dataReady: false
    }
  },
  created () {
    this.currPro = this.user.OrgID
    this.currPositionID = this.user.PositionID
    this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    async getPageData () {
      let arr = await Promise.all([this.getData1(), this.getData2()])
      console.log(arr)
      this.list = arr
      this.dataReady = true
    },
    // 设备运行概况
    async getData1 () {
      let p0 = 'UserCS_ReportEquipmentOperation'
      let res = await this.$xml(p0, {
        orgID: this.currPro,
        financeDate: '2018-06'
      })
      return res.data
    },
    // 技术运行概况
    async getData2 () {
      let p0 = 'UserCS_ReportEquipmentTechnology'
      let res = await this.$xml(p0, {
        orgID: this.currPro,
        financeDate: '2018-06'
      })
      return res.data
    }
  }
}
</script>
<style lang="scss" scoped>
  .weui-form-preview__hd {
    padding: 5px 15px;
  }
  .weui-form-preview__label {
    font-size:16px;
    color:#333;
  }
  .weui-form-preview__value {
    font-size:16px;
  }
</style>
