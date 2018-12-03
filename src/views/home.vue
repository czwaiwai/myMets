<template>
  <div class="page">
    <!--<mt-header  title="这个是详情页">-->
      <!--<mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>-->
    <!--</mt-header>-->
    <div class="page_bd">
      <div class="home_wrap">
        <div class="weui-flex">
          <div class="img_header">
            <div @click="$router.forward('/my')" class="img_wrap">
              {{user && user.UserID.slice(-2)}}
            </div>
          </div>
          <div class="weui-flex__item" style="text-align:right;padding-top:30px;padding-right:15px;">
            <button class="pro_btn" @click="$router.forward('/changeProject')">
              {{user && user.OrgName}}
              <i class="iconfont icon-xiala-" style="font-size:14px;"></i>
            </button>
          </div>
        </div>

        <div class="change_wrap">

          <!--<button class="pro_btn" @click="$router.forward('/login')">登录</button>-->
        </div>
      </div>
      <div class="cash_wrap">
        <button @click="$router.forward('/getCash')" class="cash_btn">
          <i class="iconfont icon-shoukuan" style="font-size:40px;"></i><br />
          收款
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'detail',
  created () {
    // this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    })
  },
  methods: {
    jumpCash () {

    }
    // async getPageData () {
    //   let res = await this.$xml('UserCS_ReportLeaseRentals', {
    //     'OrgID': '11091315263400010000', // '11091315263400010000',
    //     'Stime': '2018-08-01',
    //     'Etime': '2018-10-31'
    //   })
    //   console.log(res)
    // }
  }
}
</script>

<style lang="scss"  scoped >
.home_wrap {
  height: 70vw;
  background: url('../assets/img/banner.png') no-repeat;
  background-size: 100%;
}
.home_wrap .img_header{
  padding:15px;
}
.img_wrap {
  width:54px;
  height:54px;
  /*border:2px solid #FFF;*/
  border-radius:100%;
  background: #8BC6FB;
  color:#FFF;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}
.change_wrap {
  padding-top:25%;
  text-align:center;
  & .pro_btn {

  }
}
.cash_wrap {
  padding-top:40px;
  text-align: center;
}
.page_bd {
  background: #FFF;
}
.pro_btn {
  border: 1px solid #FFF;
  border-radius: 5px;
  background: transparent;
  color: #FFF;
  padding: 2px 10px;
  outline: none;
}
.cash_btn {
  height: 109px;
  width: 109px;
  border-radius: 100%;
  border: none;
  background: #FFF;
  color:#3395FF;
  box-shadow: 0px 0px 25px 2px #3395FF;
  outline: none;
}
</style>
