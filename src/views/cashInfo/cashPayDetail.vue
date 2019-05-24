<template>
  <div class="page_modal">
    <div class="page">
        <nav-title title="收款详情"></nav-title>
        <div class="page_bd">
          <div class="weui-form-preview">
            <div class="weui-form-preview__bd">
              <div class="text-center">
                <p><i class="main_color iconfont icon-yonghu-copy"></i>{{detail.cstName}}</p>
                <p class="" style="font-size:30px;font-weight: bold;color:#131313;">{{detail.totalmoney}}</p>
                <p>收款成功</p>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">收款方式</label>
                <span class="weui-form-preview__value">{{detail.trading}}</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">实收时间</label>
                <span class="weui-form-preview__value">{{detail.fillDate | formatDate}}</span>
              </div>
              <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">实收编码</label>
                <span class="weui-form-preview__value">{{detail.pcode}}</span>
              </div>
            </div>
          </div>
          <div class="expense_list margin-top">
            <div class="padding15-h light_bg">
              <h2 class="border-bottom-half" style="height:40px;line-height:40px;">收款信息</h2>
              <p class="padding-top5 padding-bottom5"><i class="main_color iconfont icon-shouye-copy"></i>{{ detail.location }}</p>
            </div>

            <ul class="cash_list border-top-half" >
              <li v-for="(item, index) in detail.accountData" :key="index" >
                <div class="title_line weui-flex">
                  <div class="weui-flex__item">
                    {{item.repYears}}
                  </div>
                  <div @click="showSubClick(item)">
                    <span style="color: #e40101;">￥{{item.moneyTotal}}</span>
                    <i class="iconfont direct_icon inline-block icon-shouqi" :class="item.subShow?'icon_up':'icon_down'"></i>
                  </div>
                </div>
                <div v-if="item.subShow" style="padding: 10px 15px 10px 30px;color:#999;">
                  <ul>
                    <li class="sub_item weui-flex" :key="index"  v-for="(sub, index) in item.feeData" >
                      <div class="weui-flex__item">{{sub.ipItemName}}</div>
                      <div>￥{{sub.cvsm}}</div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
            <div v-if="showBtn"  class="weui-btn-area">
                <a @click="$router.forward($route.path + '/invoice/' + paidId +'/'+user.OrgID)" class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">开票</a>
            </div>
        </div>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import {mapGetters} from 'vuex'
export default {
  name: 'cashPayDetail',
  components: {navTitle},
  data () {
    return {
      paidId: '',
      detail: {},
      showBtn: false
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  created () {
    if (this.$parent.payDetailData) {
      this.paidId = this.$parent.payDetailData.id
      this.showBtn = this.$parent.payDetailData.billType === 0
      let data = Object.assign(this.$parent.payDetailData.customerFeeData[0])
      console.log(data, '--------------------')
      this.formatData(data)
    } else {
      // this.getPageData()
      this.paidId = this.$route.params.id
      this.getPageDataNet()
    }
  },
  methods: {
    // async getPageData () {
    //   let url = '/ets/payment/fnpaid/getFeeSingle'
    //   let res = await this.$http.post(url, {
    //     paidId: this.$route.params.id || '1706081744050001003D'
    //   })
    //   let data = res.data[0]
    //   this.formatData(data)
    // },
    async getPageDataNet () {
      let postName = 'UserAppFn_GetFeeSingle'
      console.log(this.$route.params.id, 'cashPayId')
      let res = await this.$xml(postName, {
        PaidId: this.$route.params.id || '1706081744050001003D'
      })
      let data = res.data[0]
      this.formatData(this.$toLower(data))
    },
    formatData (data) {
      console.log(data, 'data-----')
      data.accountData.forEach(item => {
        this.$set(item, 'subShow', false)
        item.subShow = false
      })
      data.accountData[0].subShow = true
      this.showBtn = data.billType === 0
      this.detail = data
    },
    showSubClick (item) {
      item.subShow = !item.subShow
    }
  }
}
</script>

<style lang="scss" scoped>
  .expense_list {
    .direct_icon {
      transform: rotateZ(0deg);
      transition: transform 0.2s linear;
      &.icon_down {
        transform: rotateZ(180deg);
      }
    }
    .cash_list > li {
      position: relative;
    }
    .cash_list > li:after {
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
    .cash_list {
      .title_line {

        height:45px;
        line-height:45px;
        background:#FFF;
        padding:0 15px
      }
      .sub_item {
        height:30px;
        line-height:30px;
      }
    }

  }
</style>
