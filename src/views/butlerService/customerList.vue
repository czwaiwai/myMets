<template>
  <div class="page_modal">
    <div class="page">
      <nav-title title="选择客户"></nav-title>
      <div class="page_sub_hd padding15-h light_bg"  style="background: #FFF;">
        <i class="iconfont icon-shouye-copy main_color padding-right"></i>{{roomName}}
      </div>
      <div class="page_bd">
          <div class="weui-cells__title">请选择下方要报事的客户</div>
          <div class="weui-cells">
            <div @click="jumpExpenseList(item)" v-for="item in userList" :key="item.cstID" class="weui-cell weui-cell_access">
              <div class="weui-cell__bd">
                <p>{{item.cstName}}</p>
              </div>
              <div class="weui-cell__ft"></div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import {mapGetters} from 'Vuex'
import local from '@/utils/local'
export default {
  name: 'customerList',
  components: {navTitle},
  data () {
    return {
      orgId: '',
      roomName: '',
      orderBy: '0',
      userList: []
    }
  },
  computed: {
    ...mapGetters({
      getResInfo: 'getResInfo'
    })
  },
  created () {
    this.orgId = this.$parent.orgId
    this.roomName = this.getResInfo.name
    // this.getPageData()
    let orderBy = local.get('cash_orderby')
    if (orderBy) {
      this.orderBy = orderBy
    }
    this.getPageDataNet()
  },
  methods: {
    async getPageDataNet () {
      let p0 = 'UserAppFn_GetArrearsCost'
      let res = await this.$xml(p0, {
        orgID: this.orgId,
        resID: this.$route.params.roomId,
        OrderBy: this.orderBy
      })
      if (res.data) {
        let data = this.$toLower(res.data)
        console.log(data, 'data========')
        this.userList = data
      }
    },
    jumpExpenseList (item) {
      console.log(item, 'aaa')
      this.$router.forward({name: 'butlerCstDetail',
        params: {
          cstId: item.cstID
        },
        query: {
          resID: this.$route.params.roomId,
          resName: this.roomName
        }
      })
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
