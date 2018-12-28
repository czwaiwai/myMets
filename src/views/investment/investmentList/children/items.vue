<template>
  <div class="items-wrap">
    <ul class="list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li class="item clearfix" v-for="(item,index) in list" :key="index" @click.stop="toProjectDetail(item)">
        <img class="pic" src="http://pic25.nipic.com/20121110/10839717_103723525199_2.jpg">
        <div class="desc">
          <div class="title _lines">保利叶之林</div>
          <div class="name _lines">256171㎡/南山区/普通住宅</div>
          <div class="price _lines">100.36元㎡/天</div>
          <div class="time _lines">2018-12-12</div>
        </div>
      </li>
      <li class="tip">加载中···</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'items',
  data () {
    return {
      list: 20
    }
  },
  methods: {
    // 到项目详情
    toProjectDetail (item) {
      this.$router.push(`/projectDetail/123`)
    },
    // 加载更多
    loadMore () {
      this.list += 20
    }
  }
}
</script>
<style lang="scss" scoped>
  .items-wrap{
    width: 100%;
    height: 100%;
    .list{
      background: #fff;
      .item{
        padding: .3rem;
        background: #fff;
        border-bottom: 1px solid #ededed;
        &:last-child{
          border-bottom: none;
        }
        .pic{
          float: left;
          width: 2.35rem;
          height: 1.82rem;
        }
        .desc{
          float: left;
          width: 4.35rem;
          height: 1.82rem;
          margin-left: .2rem;
          ._lines{
            width: 4.35rem;
            height: .45rem;
            line-height: .45rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .title{
            height: .47rem;
            line-height: .47rem;
            font-size: .34rem;
            color: #333;
          }
          .name{
            font-size: .28rem;
            color: #7B7A7A;
          }
          .price{
            font-size: .28rem;
            color: #FC6805;
          }
          .time{
            font-size: .28rem;
            color: #7B7A7A;
          }
        }
      }
      .tip{
        height: .8rem;
        width: 100%;
        background: #fff;
        font-size: .3rem;
        color: #999;
        text-align: center;
        line-height: .8rem;
      }
    }
  }
</style>
