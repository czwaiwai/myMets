<template>
  <div class="page page_bg">
    <nav-title title="详情"></nav-title>
    <div class="page_bd businessDetail">
      <div class="header clearfix" @click.stop="toCustomerDetail">
        <div class="h-icon">
          <i class="iconfont pic" :class="detailData.CstType=='P'?'icon-geren':'icon-gongsi'"></i>
          <p class="name" v-if="detailData.CstType=='P'">个人</p>
          <p class="name" v-else-if="detailData.CstType=='C'">公司</p>
          <p class="name more" v-else-if="detailData.CstType=='D'">开发商</p>
        </div>
        <div class="msg">
          <p class="name clearfix"><span class="title">{{detailData.CstName}}<span v-show="detailData.CstType=='P'">{{com_sex()}}</span></span><span class="point" v-show="detailData.CstLevelName||detailData.CstLevelCH">{{detailData.CstLevelName||detailData.CstLevelCH}}</span></p>
          <p class="company"><span v-show="detailData.CstType!='P'">联系人：{{detailData.LinkMan}}<span v-show="detailData.LinkMan">{{com_sex()}}</span></span></p>
          <p class="contact"><span>联系方式：</span><a :href="'tel:'+detailData.ContactManner">{{detailData.ContactManner}}<i class="iconfont icon-dianhua" v-show="detailData.ContactManner"></i></a></p>
        </div>
        <p class="status">{{com_status(detailData.OpportType)}}</p>
      </div>
      <div class="types clearfix">
        <div class="type" @click.stop="selectType(item)" v-for="(item,index) in types.list" :key="index">
          <span :class="{'isSelect': item.isSelect}">{{item.name}}</span>
        </div>
      </div>
      <div class="content" :class="{'noFooter':detailData.OpportType<4}">
        <div class="busuness" v-if="businessDetailType.type===0">
          <div class="top">
            <div class="b-items clearfix">
              <span class="key">业务员：</span>
              <span class="value" :class="{'grad':!detailData.OpUser}">{{detailData.OpUser || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">紧急程度：</span>
              <span class="value" :class="com_degree_color(detailData.UrgentDegree)">{{com_degree(detailData.UrgentDegree)}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">客户来源：</span>
              <span class="value" :class="{'grad':!detailData.CognitiveWayName}">{{detailData.CognitiveWayName || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">预定房间：</span>
              <span class="value" :class="{'grad':!detailData.ReservedHouseCode}" @click.stop="showCodesList">{{detailData.ReservedHouseCode || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">预定面积：</span>
              <span class="value" :class="{'grad':!detailData.ReserveArea}">{{detailData.ReserveArea || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">成交几率：</span>
              <span class="value">
                <span>{{detailData.TradChance || 0}} %</span>
              </span>
            </div>
            <div class="b-items clearfix">
              <span class="key">开始日期：</span>
              <span class="value" :class="{'grad':!detailData.STime}">{{detailData.STime || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">结束日期：</span>
              <span class="value" :class="{'grad':!detailData.ETime}">{{detailData.ETime || '暂无'}}</span>
            </div>
          </div>
          <p class="tip">更多信息</p>
          <div class="bottom">
            <div class="b-items clearfix">
              <span class="key">租赁用途：</span>
              <span class="value" :class="{'grad':!detailData.RentUseFor}">{{detailData.RentUseFor || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">预定单价：</span>
              <span class="value" :class="{'grad':!detailData.ReservePrice}">{{detailData.ReservePrice || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">预估成交单价：</span>
              <span class="value" :class="{'grad':!detailData.EstimatePrice}">{{detailData.EstimatePrice || '暂无'}}</span>
            </div>
            <div class="b-items clearfix">
              <span class="key">免租天数：</span>
              <span class="value" :class="{'grad':!detailData.RentFreeDay}">{{detailData.RentFreeDay || '暂无'}}</span>
            </div>
            <div class="b-items clearfix" v-show="detailData.OpportType<3">
              <span class="key">报价单编号：</span>
              <span class="value">{{detailData.ApplyCode}}</span>
            </div>
            <div class="b-items clearfix" v-show="detailData.OpportType==1">
              <span class="key">合同编号：</span>
              <span class="value">{{detailData.CttCode}}</span>
            </div>
            <p class="remarks">
              <span>备注：</span>
              <span class="remark" :class="{'grad':!detailData.Memo}">{{detailData.Memo || '暂无'}}</span>
            </p>
          </div>
        </div>
        <div class="needs" v-else-if="businessDetailType.type===1">
          <div class="n-items" v-for="(item,index) in needsData" :key="index">
            <div class="title clearfix">
              <i class="iconfont icon-dingdan icon"></i>
              <span>需求{{index+1}}：{{item.ResTypeName}}({{item.RequSubmitEmplName}})</span>
              <p class="time">{{item.RegisterDate}}</p>
            </div>
            <ul class="list">
              <li class="item clearfix">
                <span class="left">字段名称</span>
                <span class="middle">连接符</span>
                <span class="right">字段值</span>
              </li>
              <li class="items clearfix" v-for="(it,_index) in item.CstRequDetaList" :key="_index">
                <span class="left">{{it.ColumnNameInfo || '--'}}</span>
                <span class="middle">{{it.Connector || '--'}}</span>
                <span class="right">{{it.ValueStartName || '--'}}</span>
              </li>
            </ul>
            <div class="btns clearfix" v-show="detailData.OpportType==4">
              <span class="revise" @click.stop="toNewOrEditNeeds(item)">修改</span>
              <span class="del" @click.stop="deleteItem(item, 'needs')">删除</span>
            </div>
          </div>
        </div>
        <div class="order" v-else-if="businessDetailType.type===2">
          <div class="o-items" v-for="(item,index) in orderData" :key="index">
            <div class="title clearfix">
              <i class="iconfont icon-dingdan icon"></i>
              <span>意向  {{item.RegisterDate}} 至 {{item.Validity}}</span>
            </div>
            <div class="msg">
              <p class="res">
                <span>房产资源</span>
                <span :class="{'grad':!item.ResCode}">{{item.ResCode || '暂无'}}</span>
              </p>
              <p class="list clearfix">
                <span class="name">意向用途：</span>
                <span class="req" :class="{'grad':!item.IntenUse}">{{item.IntenUse || '暂无'}}</span>
              </p>
              <p class="list clearfix">
                <span class="name">配套要求：</span>
                <span class="req" :class="{'grad':!item.MatcRequ}">{{item.MatcRequ || '暂无'}}</span>
              </p>
              <p class="list clearfix">
                <span class="name">价格上限：</span>
                <span class="price">{{item.IntenPriceLimit || 0}}元</span>
                <span class="name ml58">关注度：</span>
                <span class="status" :class="com_degree_color(item.IntenAttention)">{{com_degree(item.IntenAttention)}}</span>
              </p>
            </div>
            <div class="btns clearfix" v-show="detailData.OpportType==4">
              <span class="revise" @click.stop="toNewOrEditOrder(item)">修改</span>
              <span class="del" @click.stop="deleteItem(item, 'order')">删除</span>
            </div>
          </div>
        </div>
        <div class="follow" v-else-if="businessDetailType.type===3">
          <div class="f-items" v-for="(item,index) in followData" :key="index">
            <div class="title clearfix">
              <i class="iconfont icon-shijian icon"></i>
              <span>{{item.FollowDate}}</span>
            </div>
            <div class="msg">
              <p class="list clearfix">
                <span class="name">跟进方式：</span>
                <span :class="{'grad':!item.ModeName}">{{item.ModeName || '暂无'}}</span>
              </p>
              <p class="list clearfix">
                <span class="name">跟进情况：</span>
                <span class="req" v-if="item.Situation">{{item.Situation}}</span>
                <span v-else class="grad">暂无</span>
              </p>
              <p class="list clearfix">
                <span class="name">客户反馈：</span>
                <span class="req" v-if="item.Feedback">{{item.Feedback}}</span>
                <span v-else class="grad">暂无</span>
              </p>
              <p class="list clearfix">
                <span class="name">跟进人：</span>
                <span :class="{'grad':!item.FollowPeo}">{{item.FollowPeo}}</span>
              </p>
            </div>
            <div class="btns clearfix" v-show="detailData.OpportType==4">
              <span class="revise" @click.stop="toNewOrEditFollow(item)">修改</span>
              <span class="del" @click.stop="deleteItem(item, 'follow')">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" v-if="detailData.OpportType==4">
        <div class="btn" @click.stop="toNewOrEditBusiness" v-if="businessDetailType.type===0">编辑</div>
        <div class="btn" v-else @click.stop="toNewObj">新增</div>
      </div>
    </div>
    <dialog-confire
      :title="dialogData.title"
      ref="dialog"
      @clickLeftBtn="clickLeftBtn"
      @clickRightBtn="clickRightBtn"
    ></dialog-confire>
    <show-list ref="showCodes" :listData="detailData.ReservedHouseCode"></show-list>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import dialogConfire from '@/components/dialogConfire.vue'
import showList from '@/components/showList'
import businessCom from '@/mixins/businessCom/index.js'
import changeDate from '@/mixins/changeDate/index.js'
import navTitle from '@/components/navTitle'
export default {
  name: 'guestDetail',
  components: {dialogConfire, showList, navTitle},
  mixins: [businessCom, changeDate],
  data () {
    return {
      detailData: {},
      types: {
        type: 0,
        list: [
          {name: '商机', type: 0, isSelect: true},
          {name: '需求', type: 1, isSelect: false},
          {name: '意向', type: 2, isSelect: false},
          {name: '跟进', type: 3, isSelect: false}
        ]
      },
      busunessData: {
        topList: [],
        bottomList: [],
        remarks: ''
      },
      needsData: [],
      orderData: [],
      followData: [],
      dialogData: {
        title: '',
        type: 0,
        data: {}
      }
    }
  },
  computed: {
    ...mapGetters({
      businessDetailType: 'getBusinessDetailType',
      business: 'getBusiness'
    })
  },
  methods: {
    com_sex () {
      if (this.detailData.Sex === 'F') {
        return '(女士)'
      } else if (this.detailData.Sex === 'M') {
        return '(先生)'
      } else {
        return ''
      }
    },
    com_status (status) {
      let name = ''
      switch (status) {
        case '1': name = '已签约'; break
        case '2': name = '报价中'; break
        case '3': name = '无效'; break
        case '4': name = '跟进中'; break
      }
      return name
    },
    showCodesList () {
      if (this.detailData.ReservedHouseCode) {
        this.$refs.showCodes.show()
      }
    },
    toCustomerDetail () {
      // this.$router.push(`/customerDetail`)
    },
    selectType (item) {
      if (!item.isSelect) {
        this.types.list.forEach(arr => {
          if (item.type === arr.type) {
            arr.isSelect = true
          } else {
            arr.isSelect = false
          }
        })
      }
      this.types.type = item.type
      this.$el.querySelector('.content').scrollTop = 1
      this.$store.commit('updateBusinessDetailType', {type: item.type})
      this.getBusinessData()
    },
    async getBusinessData () {
      if (this.types.type === 0) {
        return
      }
      // let obj = {
      //   p0: 'UserCS_OpportOtherInfo',
      //   p7: {
      //     'OpportId': this.detailData.Id,
      //     'OpportType': this.types.type
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_OpportOtherInfo', {
        'OpportId': this.detailData.Id,
        'OpportType': this.types.type
      })
      console.log(res)
      // this.$vux.loading.hide()
      if (res.status === 200 || res.status === '200') {
        if (this.types.type === 1) {
          res.data.forEach(arr => {
            arr.RegisterDate = this.com_Date(arr.RegisterDate)
          })
          this.needsData = res.data
        } else if (this.types.type === 2) {
          res.data.forEach(arr => {
            arr.RegisterDate = this.com_Date(arr.RegisterDate)
            arr.Validity = this.com_Date(arr.Validity)
          })
          this.orderData = res.data
        } else if (this.types.type === 3) {
          res.data.forEach(arr => {
            arr.FollowDate = this.com_Date(arr.FollowDate)
          })
          this.followData = res.data
        }
        this.$el.querySelector('.content').scrollTop = 1
      } else {
        // this.$vux.toast.text(res.Syswin[0].msg)
      }
    },
    // 编辑商机
    toNewOrEditBusiness () {
      let businessData = {
        hasDetail: true,
        detail: this.business.detail,
        msg: {...this.business.detail, ...{isChange: false}}
      }
      this.$store.commit('updateBusiness', businessData)
      this.$router.push({
        name: 'newOrEditBusiness',
        params: {
          id: this.$route.params.id
        },
        query: {
          type: 1
        }
      })
    },
    // 修改跟进
    toNewOrEditFollow (item) {
      this.$store.commit('updateBusiness', {
        hasDetail: true,
        detail: this.business.detail,
        msg: item
      })
      this.$router.push({
        name: 'newOrEditFollow',
        params: {
          id: item.Id
        },
        query: {
          type: 1
        }
      })
    },
    // 修改意向
    toNewOrEditOrder (item) {
      this.$store.commit('updateBusiness', {
        hasDetail: true,
        detail: this.business.detail,
        msg: item
      })
      this.$router.push({
        name: 'newOrEditOrder',
        params: {
          id: item.Id
        },
        query: {
          type: 1
        }
      })
    },
    // 修改需求
    toNewOrEditNeeds (item) {
      this.$store.commit('updateBusiness', {
        hasDetail: true,
        detail: this.business.detail,
        msg: item
      })
      this.$router.push({
        name: 'newOrEditNeeds',
        params: {
          id: item.Id
        },
        query: {
          type: 1
        }
      })
    },
    // 新增
    toNewObj () {
      this.$store.commit('updateBusiness', {
        hasDetail: true,
        detail: this.business.detail,
        msg: {}
      })
      if (this.types.type === 1) {
        this.$router.push(`/newOrEditNeeds/${this.$route.params.id}`)
      } else if (this.types.type === 2) {
        this.$router.push(`/newOrEditOrder/${this.$route.params.id}`)
      } else if (this.types.type === 3) {
        this.$router.push(`/newOrEditFollow/${this.$route.params.id}`)
      }
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.delete()
    },
    // 删除
    deleteItem (item, type) {
      this.dialogData = {
        type: type,
        data: item
      }
      if (type === 'needs') {
        this.dialogData.title = '确定删除该需求？'
      } else if (type === 'order') {
        this.dialogData.title = '确定删除该意向？'
      } else if (type === 'follow') {
        this.dialogData.title = '确定删除该跟进？'
      }
      this.$refs.dialog.show()
    },
    async delete () {
      let obj = {
        p0: 'UserCS_OpportOtherDelete',
        p7: {
          'ID': this.dialogData.data.Id
        }
      }
      if (this.dialogData.type === 'needs') {
        obj.p7.OpportType = '1'
      } else if (this.dialogData.type === 'order') {
        obj.p7.OpportType = '2'
      } else if (this.dialogData.type === 'follow') {
        obj.p7.OpportType = '3'
      }
      // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml(obj.p0, obj.p7)
      console.log(res)
      // this.$vux.toast.text(res.Syswin[0].msg)
      // this.$vux.loading.hide()
      if (res.status === 200 || res.status === '200') {
        this.getBusinessData()
      }
    },
    async getData () {
      // let obj = {
      //   p0: 'UserCS_CustomerDetail',
      //   p7: {
      //     'CstID': this.$route.params.id
      //   }
      // }
      // // this.$vux.loading.show()
      // let res = await this.$http.post(obj)
      let res = await this.$xml('UserCS_CustomerDetail', {
        'CstID': this.$route.params.id
      })
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        this.detailData = res.data
      } else {
        // this.$vux.toast.text(res.Syswin[0].msg)
      }
      // this.$vux.loading.hide()
    }
  },
  created () {
    this.types.list.forEach(arr => {
      if (arr.type === this.businessDetailType.type) {
        arr.isSelect = true
      } else {
        arr.isSelect = false
      }
    })
    this.detailData = this.business.detail
    this.types.type = this.businessDetailType.type
    this.getBusinessData()
    // this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .businessDetail{
    .footer{
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 10;
      width: 100vw;
      height: 1rem;
      background: #fff;
      border-top: 1px solid #ededed;
      .btn{
        position: absolute;
        top: .15rem;
        right: .3rem;
        width: 1.55rem;
        height: .7rem;
        line-height: .7rem;
        text-align: center;
        color: #3395FF;
        border: 1px solid #3395FF;
        border-radius: 3px;
        font-size: .3rem;
      }
    }
    .header{
      position: relative;
      height: 2.06rem;
      padding: .3rem;
      overflow: hidden;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .status{
        position: absolute;
        top: .1rem;
        left: 0;
        z-index: 11;
        width: .9rem;
        height: .38rem;
        color: #fff;
        font-size: .24rem;
        text-align: center;
        line-height: .38rem;
        background: #3395FF;
        border-bottom-right-radius: 3px;
        border-top-right-radius: 3px;
      }
      .h-icon{
        position: relative;
        float: left;
        width: 1.27rem;
        height: 1.4rem;
        .pic{
          display: block;
          width: 1.27rem;
          height: 1.27rem;
          font-size: .56rem;
          color: #fff;
          background: #FB8A2C;
          text-align: center;
          line-height: 1.27rem;
          border-radius: .635rem;
        }
        .name{
          position: absolute;
          bottom: 0;
          left: .32rem;
          z-index: 9;
          height: 18px;
          min-width: .65rem;
          padding: 0 .05rem;
          line-height: 17px;
          font-size: 12px;
          text-align: center;
          border: 1px solid #FB8A2C;
          border-radius: 3px;
          color: #FB8A2C;
          background: #fff;
          &.more{
            left: .22rem;
          }
        }
      }
      .msg{
        float: left;
        margin-left: .2rem;
        width: 5.4rem;
        .name{
          height: .5rem;
          font-size: .4rem;
          color: #333;
          line-height: .5rem;
          .title{
            float: left;
            max-width: 3.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .point{
            float: left;
            height: .4rem;
            padding: 0 3px;
            margin-left: .1rem;
            margin-top: .05rem;
            font-size: .28rem;
            line-height: .4rem;
            color: #3395FF;
            border: 1px solid #3395FF;
            border-radius: 3px;
          }
        }
        .company{
          font-size: .3rem;
          color: #333;
          margin-top: .06rem;
          min-height: .2rem;
        }
        .contact{
          font-size: .3rem;
          color: #333;
          margin-top: .06rem;
          span{
            display: inline-block;
          }
          .icon-dianhua{
            display: inline-block;
            margin-left: .1rem;
            font-size: .34rem;
            color: #3395FF;
          }
        }
      }
      .icon-gengduo{
        position: absolute;
        top: .8rem;
        right: .3rem;
        display: block;
        width: .4rem;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
        font-size: .34rem;
        color: #999;
      }
    }
    .types{
      position: relative;
      height: .88rem;
      width: 100vw;
      padding: 0 .3rem;
      border-bottom: 1px solid #ededed;
      background: #fff;
      .type{
        float: left;
        width: 25%;
        height: .88rem;
        text-align: center;
        span{
          display: inline-block;
          height: .88rem;
          padding: 0 .2rem;
          line-height: .88rem;
          color: #333;
          font-size: .3rem;
          &.isSelect{
            color: #3395FF;
            border-bottom: 2px solid #3395FF;
          }
        }
      }
    }
    .content{
      position: absolute;
      top: 2.94rem;
      left: 0;
      bottom: 1rem;
      right: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &.noFooter{
        bottom: 0;
      }
      .btns{
        height: .74rem;
        border-top: 1px solid #DDDEE3;
        span{
          float: right;
          height: .74rem;
          margin-right: .3rem;
          font-size: .3rem;
          color: #3395FF;
          line-height: .74rem;
        }
      }
      .b-items{
        border-bottom: 1px solid #E9E9E9;
        .key{
          float: left;
          width: 2rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          color: #999;
          text-align: left;
        }
        .value{
          float: left;
          width: 4.9rem;
          height: .88rem;
          line-height: .88rem;
          color: #333;
          font-size: .3rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &.red{
            color: #FF6262;
          }
        }
      }
      .busuness{
        .top{
          margin-top: .2rem;
          padding-left: .3rem;
          background: #fff;
          .b-items{
            &:last-child{
              border-bottom: none;
            }
          }
        }
        .tip{
          padding-left: .3rem;
          height: .66rem;
          line-height: .66rem;
          font-size: .28rem;
          color: #777E8C;
        }
        .bottom{
          padding-left: .3rem;
          background: #fff;
          .remarks{
            padding: .2rem .3rem .2rem 0;
            line-height: .4rem;
            font-size: .3rem;
            color: #999;
            .remark{
              color: #333;
            }
          }
        }
      }
      .needs{
        .n-items{
          margin-top: .2rem;
          padding-left: .3rem;
          background: #fff;
          .title{
            position: relative;
            height: .8rem;
            border-bottom: 1px solid #DDDEE3;
            .icon{
              float: left;
              width: .5rem;
              height: .8rem;
              font-size: .34rem;
              color: #3395FF;
              line-height: .8rem;
            }
            span{
              float: left;
              height: .8rem;
              line-height: .8rem;
              font-size: .32rem;
              color: #333;
              width: 4.8rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .time{
              position: absolute;
              top: 0;
              right: .3rem;
              height: .8rem;
              line-height: .8rem;
              font-size: .3rem;
              color: #777E8C;
            }
          }
          .list{
            padding: .1rem .3rem .1rem 0;
            .item{
              .left,.middle,.right{
                float: left;
                width: 2.3rem;
                height: .6rem;
                line-height: .6rem;
                color: #777E8C;
                font-size: .28rem;
              }
            }
            .items{
              .left,.middle,.right{
                float: left;
                width: 2.3rem;
                height: .66rem;
                line-height: .66rem;
                color: #333;
                font-size: .3rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .left{
              text-align: left;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .middle{
              text-align: center;
            }
            .right{
              text-align: right;
            }
          }
        }
      }
      .order{
        .o-items{
          margin-top: .2rem;
          padding-left: .3rem;
          background: #fff;
          .title{
            border-bottom: 1px solid #DDDEE3;
            .icon{
              float: left;
              width: .5rem;
              height: .8rem;
              font-size: .34rem;
              line-height: .8rem;
              color: #3395FF;
            }
            span{
              float: left;
              height: .8rem;
              font-size: .28rem;
              color: #777E8C;
              line-height: .8rem;
            }
          }
          .msg{
            padding: .15rem .3rem .15rem 0;
            .res{
              height: .6rem;
              font-size: .34rem;
              color: #333;
              line-height: .6rem;
            }
            .list{
              font-size: .3rem;
              color: #333;
              .name{
                float: left;
                color: #999;
                height: .54rem;
                line-height: .54rem;
              }
              span{
                float: left;
                line-height: .54rem;
                &.req{
                  width: 5.2rem;
                  padding: .1rem 0;
                  line-height: .34rem;
                }
              }
              .ml58{
                margin-left: .58rem;
              }
            }
          }
        }
      }
      .follow{
        .f-items{
          margin-top: .2rem;
          padding-left: .3rem;
          background: #fff;
          .title{
            border-bottom: 1px solid #DDDEE3;
            .icon{
              float: left;
              width: .5rem;
              height: .8rem;
              font-size: .34rem;
              line-height: .8rem;
              color: #3395FF;
            }
            span{
              float: left;
              height: .8rem;
              font-size: .28rem;
              color: #777E8C;
              line-height: .8rem;
            }
          }
          .msg{
            padding: .15rem .3rem .15rem 0;
            .list{
              font-size: .3rem;
              color: #333;
              .name{
                float: left;
                width: 1.6rem;
                color: #999;
                height: .54rem;
                line-height: .54rem;
              }
              span{
                float: left;
                line-height: .54rem;
                &.req{
                  width: 5.2rem;
                  padding: .1rem 0;
                  line-height: .34rem;
                }
              }
            }
          }
        }
      }
    }
    .blue{
      color: #57A7FE !important;
    }
    .yellow{
      color: #EDC905 !important;
    }
    .degreeRed{
      color: #FF6262 !important;
    }
    .grad{
      color: #999 !important;
    }
  }
</style>
