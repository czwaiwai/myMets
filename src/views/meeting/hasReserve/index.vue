<template>
  <div class="page_modal">
    <div class="page hasReserve">
      <nav-title title="已预订"></nav-title>
      <div class="header">
        <div class="icon-items clearfix">
          <i class="iconfont icon-dizhi icon"></i>
          <span class="name">{{room.meetName}}</span>
        </div>
        <div class="icon-items clearfix noneBb">
          <i class="iconfont icon-shijian icon"></i>
          <span class="name">{{dateTime}}</span>
        </div>
      </div>
      <div class="page_bd _content">
        <ul class="list" v-if="room.bookList && room.bookList.length > 0">
          <li class="items" v-for="(item) in room.bookList" :key="item.iD">
            <p class="times">{{item.startTime}} — {{item.endTime}}</p>
            <p class="title">{{item.meetName}}</p>
            <div class="msg">
              <i class="iconfont icon-yonghu icon"></i>
              <span class="name">{{item.bookName}}</span>
              <span class="phone">{{item.bookPhone}}</span>
            </div>
          </li>
        </ul>
        <none-page title="还没有人预订我！" v-else></none-page>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import nonePage from '../components/nonePage/index.vue'
import dateChange from '@/mixins/dateChange'
export default {
  name: 'hasReserve',
  components: {navTitle, nonePage},
  mixins: [dateChange],
  data () {
    return {
      dateTime: '',
      room: {},
      bookList: []
    }
  },
  created () {
    this.room = this.$parent.room
    this.dateTime = this.com_date(this.$parent.dateTime)
    this.bookList = this.room.bookList.map(item => {
      item.startTime = item.startTime.substring(11, 16)
      item.endTime = item.endTime.substring(11, 16)
      return item
    })
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
          color: #3395ff;
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
            color: #3395ff;
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
              color: #3395ff;
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
