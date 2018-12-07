<template>
  <div class="page hasReserve">
    <nav-title title="已预订"></nav-title>
    <div class="header">
      <div class="icon-items clearfix">
        <i class="iconfont icon-dizhi icon"></i>
        <span class="name">高效厅</span>
      </div>
      <div class="icon-items clearfix noneBb">
        <i class="iconfont icon-shijian icon"></i>
        <span class="name">2018年10月18日 星期四</span>
      </div>
    </div>
    <div class="page_bd _content">
      <ul class="list">
        <li class="items" v-for="(item,index) in 20" :key="index">
          <p class="times">09:30 — 11:00</p>
          <p class="title">会议室预订系统APP产品预上线动员大会</p>
          <div class="msg">
            <i class="iconfont icon-yonghu icon"></i>
            <span class="name">五彩缤纷</span>
            <span class="phone">15012345678</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'hasReserve',
  components: {navTitle},
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .hasReserve{
    .header{
      position: relative;
      z-index: 10;
      padding-left: .3rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .icon-items{
        height: .88rem;
        border-bottom: 1px solid #ededed;
        .icon{
          float: left;
          width: .5rem;
          height: .88rem;
          line-height: .88rem;
          font-size: .34rem;
          color: #0DC88C;
        }
        .name{
          float: left;
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          color: #333;
        }
      }
    }
    ._content{
      .list{
        padding-left: .3rem;
        background: #fff;
        .items{
          position: relative;
          padding: .2rem .3rem;
          border-bottom: 1px solid #ededed;
          &:first-child{
            margin-top: .2rem;
          }
          &:last-child{
            border-bottom: none;
          }
          .times{
            position: relative;
            height: .5rem;
            margin-bottom: .1rem;
            font-size: .3rem;
            color: #0DC88C;
            line-height: .5rem;
            &::before{
              position: absolute;
              left: -.3rem;
              top: .18rem;
              display: block;
              width: 6px;
              height: 6px;
              background: #FC5A5A;
              border-radius: 50%;
              content: '';
            }
          }
          .title{
            font-size: .3rem;
            color: #333;
          }
          .msg{
            position: relative;
            height: .5rem;
            margin-top: .1rem;
            line-height: .5rem;
            font-size: .3rem;
            color: #999;
            .icon{
              color: #0DC88C;
              font-size: .34rem;
            }
            .phone{
              position: absolute;
              right: 0;
              bottom: 0;
              display: block;
              height: .5rem;
              font-size: .3rem;
              color: #999;
              line-height: .5rem;
            }
          }
        }
      }
    }
  }
</style>
