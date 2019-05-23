<template>
  <div class="page page_bg">
    <!-- <nav-title title="客户详情"></nav-title> -->
    <div class="page_bd guestDetail">
      <div class="content">
        <div class="header clearfix" @click.stop="toCustomerDetail">
          <div class="icon">
            <i class="iconfont pic" :class="detailData.CstType=='P'?'icon-geren':'icon-gongsi'"></i>
            <p class="name" v-if="detailData.CstType=='P'">个人</p>
            <p class="name" v-else-if="detailData.CstType=='C'">公司</p>
            <p class="name" v-else-if="detailData.CstType=='D'">开发商</p>
          </div>
          <div class="msg">
            <p class="name clearfix">
              <span class="title">{{detailData.CstName || ''}}
                <span v-show="detailData.CstType=='P'">{{com_sex()}}</span>
              </span>
              <!-- <span class="point" :class="detailData.CstLevel==='VIP'?'orange':'blue'" v-show="detailData.CstLevelName">{{detailData.CstLevelName}}</span> -->
            </p>
            <p class="company">
              <span class="link" v-show="detailData.CstType!='P'">联系人：{{detailData.LinkMan}}</span>
            </p>
            <p class="contact">
              <span class="link">联系方式：</span>
              <a class="phone" :href="'tel:'+detailData.FirstPhone" v-show="detailData.FirstPhone">
                <span>{{detailData.FirstPhone}}</span>
                <i class="iconfont icon-dianhua phoneIcon"></i>
              </a>
            </p>
          </div>
        </div>
        <!-- <div class="remark clearfix">
          <p class="tip">备注：</p>
          <p class="msg">{{detailData.Memo}}</p>
        </div> -->
        <div class="person">
          <p class="tip">更多信息</p>
          <div class="msg">
            <div class="items"><p class="name">客户级别：</p><span>{{detailData.CstLevelName || ''}}</span></div>
            <div class="items"><p class="name">曾&nbsp;&nbsp;用&nbsp;名：</p><span>{{detailData.OldName || ''}}</span></div>
            <div class="items"><p class="name">证件类型：</p><span>{{detailData.CerName || ''}}</span></div>
            <div class="items"><p class="name">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</p><span>{{com_sex()}}</span></div>
            <div class="items"><p class="name">出生日期：</p><span>{{convertBirthDay()}}</span></div>
            <div class="items"><p class="name">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯：</p><span>{{detailData.BirthPlace || ''}}</span></div>
            <div class="items"><p class="name">户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;籍：</p><span>{{detailData.CensusReg || ''}}</span></div>
            <div class="items"><p class="name">兴趣爱好：</p><span>{{detailData.Hobby || ''}}</span></div>
            <div class="items"><p class="name">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</p><span>{{detailData.Memo || ''}}</span></div>
          </div>
        </div>
        <div class="person">
          <p class="tip">联系方式</p>
          <div class="msg">
            <div class="items"><p class="name">手机号码：</p><span>{{detailData.FirstPhone || ''}}</span></div>
            <div class="items"><p class="name">办公电话：</p><span>{{detailData.ToWorkPhone || ''}}</span></div>
            <div class="items"><p class="name">传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;真：</p><span>{{detailData.Fax || ''}}</span></div>
          </div>
        </div>
        <!-- <div class="business">
          <p class="tip">房源信息</p>
          <div class="btn" @click.stop="toHouseMsg">
            <span>点击查看该客源下已签约房源</span>
            <i class="iconfont icon-gengduo1"></i>
          </div>
        </div>
        <div class="business">
          <p class="tip">跟进商机</p>
          <div class="btn" @click.stop="toSearchBusiness">
            <span>点击查看该客源商机</span>
            <i class="iconfont icon-gengduo1"></i>
          </div>
        </div> -->
      </div>
      <div class="footer">
        <div class="btn" @click.stop="toChangeGuest">一键报修</div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'guestDetail',
  components: {navTitle},
  data () {
    return {
      pageType: 1,
      detailData: {CstType: 'P'}
    }
  },
  methods: {
    toSearchBusiness () {
      this.$store.commit('updateRentSearchKey', {key: (this.detailData.CstName || '')})
      this.$router.push('/searchBusiness')
    },
    // // 到房源信息
    // toHouseMsg () {
    //   this.$router.push(`/houseMsg/${this.$route.params.id}`)
    // },
    com_sex () {
      if (this.detailData.Sex === 'F') {
        return '(女士)'
      } else if (this.detailData.Sex === 'M') {
        return '(先生)'
      } else {
        return ''
      }
    },
    convertBirthDay () {
      if (this.detailData) {
        if (this.detailData.Birthday < '1901-01-01') {
          return ''
        } else {
          return this.detailData.Birthday
        }
      }
      return ''
    },
    toCustomerDetail () {
      // this.$router.push(`/customerDetail`)
    },
    toChangeGuest () {
      this.$store.commit('setCstInfo', this.detailData)
      this.$router.push('/customerService?type=gjbaoshi')
    },
    async getData () {
      console.log('tag', this.$route.params)
      let res = await this.$xml('UserCS_CustomerDetailHousekeeper', {
        'CstID': this.$route.params.cstId
      })
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        this.detailData = res.data[0]
      } else {
        this.$toast(res.msg)
      }
      // this.$vux.loading.hide()
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .guestDetail{
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
        position: fixed;
        right: 0px;
        width: auto;
        line-height: .7rem;
        text-align: center;
        color: #3395FF;
        border-radius: 10px;
        font-size: 17px;
        color: #fff;
        background-color: #3395FF;
        margin: 8px 15px;
        left: 0px;
      }
    }
    .content{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 1rem;
      right: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .header{
        padding: .3rem;
        background: #fff;
        border-bottom: 1px solid #ededed;
        .icon{
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
            left: .31rem;
            z-index: 9;
            height: 18px;
            min-width: .65rem;
            line-height: 17px;
            font-size: 12px;
            text-align: center;
            border: 1px solid #FB8A2C;
            border-radius: 3px;
            color: #FB8A2C;
            background: #fff;
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
              border-radius: 3px;
              &.orange{
                color: #FF7B33;
                border: 1px solid #FF7B33;
              }
              &.blue{
                color: #3395FF;
                border: 1px solid #3395FF;
              }
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
            .link{
              float: left;
            }
            .phone{
              float: left;
              color: #3395FF;
            }
            .phoneIcon{
              color: #3395FF;
            }
          }
        }
        .icon-gengduo1{
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
      .remark{
        padding: .26rem .3rem .3rem;
        min-height: 1rem;
        background: #fff;
        .tip{
          float: left;
          width: 1rem;
          height: .4rem;
          margin-top: .03rem;
          font-size: .3rem;
          color: #333;
          line-height: .4rem;
          text-align: left;
        }
        .msg{
          float: left;
          width: 5.8rem;
          min-height: .4rem;
          font-size: .3rem;
          color: #666;
        }
      }
      .person{
        .desc,.msg{
          padding-left: .3rem;
          background: #fff;
          .items{
            height: .88rem;
            padding-right: .3rem;
            font-size: .3rem;
            border-bottom: 1px solid #ededed;
            &:last-child{
              border-bottom: none;
            }
            .name{
              float: left;
              width: 1.8rem;
              height: .88rem;
              line-height: .88rem;
              color: #777E8C;
            }
            span{
              float: left;
              height: .88rem;
              line-height: .88rem;
              color: #333;
            }
          }
        }
        .tip{
          height: .7rem;
          padding-left: .3rem;
          line-height: .7rem;
          font-size: .28rem;
          color: #999;
        }
      }
      .business{
        .tip{
          height: .7rem;
          padding-left: .3rem;
          line-height: .7rem;
          font-size: .28rem;
          color: #999;
        }
        .btn{
          position: relative;
          height: .88rem;
          padding: 0 .3rem;
          font-size: .3rem;
          color: #999;
          line-height: .88rem;
          background: #fff;
          .icon-gengduo1{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            width: .4rem;
            height: .88rem;
            line-height: .88rem;
            font-size: .34rem;
            color: #999;
          }
        }
      }
    }
  }
</style>
