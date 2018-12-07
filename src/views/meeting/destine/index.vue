<template>
  <div class="destine page page_bg">
    <nav-title title="会议室"></nav-title>
    <div class="org clearfix">
      <i class="iconfont icon-loudong"></i>
      <span class="orgName">银河世纪花园</span>
      <i class="iconfont icon-tubiao-"></i>
    </div>
    <div class="date"></div>
    <div class="searchBox clearfix">
      <div class="searchWrap clearfix">
        <i class="iconfont icon icon-sousuo"></i>
        <input class="search-input" placeholder="请输入会议室名称或所在位置">
      </div>
      <i class="iconfont icon-shaixuan" @click.stop="dialogShow=true"></i>
    </div>
    <div class="page_bd _content">
      <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li class="items" :class="{'lastItem':index+1==list.length}" v-for="(item,index) in list" :key="index" @click.stop="toDesitineDetial(item)">
          <div class="top clearfix">
            <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1543821465&di=e3ad1277bf7c91696edb3cd5bf3749e5&src=http://imgsrc.baidu.com/imgad/pic/item/0b55b319ebc4b745317003c2c5fc1e178b821579.jpg" class="pic">
            <div class="msg">
              <div class="name">
                <p class="title">沟通厅</p>
                <div class="people clearfix">
                  <i class="iconfont icon icon-duorenyonghu"></i>
                  <span>20人</span>
                </div>
              </div>
              <div class="location clearfix">
                <i class="iconfont icon icon-dizhi"></i>
                <span class="build">吾悦科技之关大厦</span>
                <span class="steps">11楼</span>
              </div>
              <div class="label">
                <span v-for="(item,index) in 3" :key="index">投影</span>
              </div>
            </div>
          </div>
          <div class="bottom">
            <span v-for="(item, index) in 12" :key="index" :class="{'isSelect':index>6&&index<9}">{{item + 7}}</span>
          </div>
        </li>
        <li class="load-tip" v-show="showLoadTip">加载中···</li>
      </ul>
    </div>
    <transition name="_dialog">
      <div class="_dialog" v-if="dialogShow">
        <div class="mark" @click.stop="dialogShow=false"></div>
        <div class="_d-content">
          <ul class="_d-list">
            <li class="_d-items" v-for="(item,index) in 6" :key="index">
              <div class="title">
                <span class="name">类型</span>
                <span class="status">不限 <i class="iconfont icon-zhankai icon"></i></span>
              </div>
              <div class="_d-box clearfix">
                <span class="_d-btns" v-for="(it,i) in 5" :key="i">会议室</span>
              </div>
            </li>
          </ul>
          <div class="_d-footer clearfix">
            <div class="btn">重置</div>
            <div class="btn">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
import { Indicator } from 'mint-ui'
import { setTimeout } from 'timers'
export default {
  name: 'destine',
  components: {navTitle, Indicator},
  data () {
    return {
      dialogShow: false,
      allLoaded: false,
      list: [],
      showLoadTip: false,
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    loadMore () {
      if (this.page < 10) {
        this.getList()
      }
    },
    toDesitineDetial (item) {
      this.$router.push({
        name: 'destineDetail',
        params: {
          id: '123'
        },
        query: {
          title: '高效厅'
        }
      })
    },
    getList () {
      Indicator.open({spinnerType: 'fading-circle'})
      for (let i = 0; i < 10; i++) {
        this.list.push(i)
      }
      this.page++
      setTimeout(() => {
        this.isLoading = false
        Indicator.close()
        if (this.page < 10) {
          this.showLoadTip = true
        } else {
          this.showLoadTip = false
        }
      }, 1000)
    }
  },
  created () {
    this.getList()
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  .destine{
    .org{
      position: relative;
      z-index: 10;
      width: 100vw;
      height: .88rem;
      padding: 0 .3rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .icon-loudong{
        float: left;
        width: .6rem;
        height: .88rem;
        line-height: .8rem;
        text-align: left;
        color: #000;
        font-size: .46rem;
      }
      .orgName{
        float: left;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
      }
      .icon-tubiao-{
        position: absolute;
        right: .2rem;
        top: 0;
        display: block;
        width: .4rem;
        height: .88rem;
        line-height: .88rem;
        text-align: right;
        font-size: .4rem;
        color: #999;
      }
    }
    .date {
      position: relative;
      z-index: 10;
      width: 100vw;
      height: 1.06rem;
      border-bottom: 1px solid #ededed;
    }
    .searchBox{
      position: relative;
      z-index: 10;
      width: 100vw;
      height: 1.06rem;
      padding: .2rem .3rem;
      border-bottom: 1px solid #ededed;
      .searchWrap {
        float: left;
        width: 6.08rem;
        height: 0.68rem;
        background: #fff;
        border-radius: 0.2rem;
        line-height: 0.68rem;
        .icon {
          float: left;
          width: 0.68rem;
          height: 0.68rem;
          padding: 0 .1rem;
          line-height: 0.68rem;
          font-size: .34rem;
          text-align: right;
          color: #999;
        }
        .search-input{
          float: left;
          width: 4.4rem;
          height: 0.68rem;
          // line-height: 0.68rem;
          color: #333;
          font-size: 0.28rem;
          &::-webkit-input-placeholder {
            color: #999;
          }
          &::-webkit-search-cancel-button {
            display: none;
          }
        }
        .icon-input_clear {
          float: right;
          width: 0.48rem;
          height: 0.68rem;
          margin-right: 0.2rem;
          line-height: 0.68rem;
          font-size: 0.4rem;
          text-align: right;
          color: #999;
        }
      }
      .icon-shaixuan {
        float: left;
        width: 0.68rem;
        height: 0.68rem;
        margin-left: 0.14rem;
        font-size: 0.6rem;
        line-height: 0.68rem;
        text-align: right;
        color: #0dc88c;
      }
    }
    ._content{
      .list{
        .items{
          padding: .2rem .3rem;
          background: #fff;
          margin-bottom: .2rem;
          &.lastItem{
            margin-bottom: 0;
          }
          .top{
            position: relative;
            height: 1.46rem;
            .pic{
              float: left;
              width: 1.46rem;
              height: 1.46rem;
              margin-right: .5rem;
            }
            .msg{
              float: left;
              height: 1.46rem;
              width: 4.94rem;
              .name{
                position: relative;
                height: .4rem;
                .title{
                  font-size: .34rem;
                  color: #333;
                  line-height: .4rem;
                }
                .people{
                  position: absolute;
                  top: 0;
                  right: 0;
                  .icon{
                    float: left;
                    width: .4rem;
                    height: .4rem;
                    line-height: .4rem;
                    text-align: left;
                    color: #0DC88C;
                  }
                  span{
                    float: left;
                    font-size: .3rem;
                    color: #999;
                    line-height: .4rem;
                  }
                }
              }
              .location{
                position: relative;
                height: .4rem;
                margin: .13rem 0;
                .icon{
                  float: left;
                  width: .4rem;
                  height: .4rem;
                  color: #0DC88C;
                  font-size: .36rem;
                  text-align: center;
                  line-height: .4rem;
                  margin-right: .1rem;
                }
                .build{
                  float: left;
                  height: .4rem;
                  max-width: 4rem;
                  line-height: .4rem;
                  color: #999;
                  font-size: .3rem;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .steps{
                  position: absolute;
                  right: 0;
                  top: 0;
                  height: .4rem;
                  line-height: .4rem;
                  font-size: .28rem;
                  color: #999;
                }
              }
              .label{
                position: relative;
                height: .4rem;
                span{
                  float: left;
                  font-size: .28rem;
                  color: #999;
                  margin-right: .44rem;
                  line-height: .4rem;
                }
              }
            }
          }
          .bottom{
            position: relative;
            height: .5rem;
            width: 6.9rem;
            overflow-y: hidden;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
            margin-top: .25rem;
            span{
              display: inline-block;
              width: .5rem;
              height: .5rem;
              margin-right: .08rem;
              background: #E8E8E8;
              color: #fff;
              text-align: center;
              line-height: .5rem;
              &.isSelect{
                background: #0dc88c;
              }
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
  ._dialog-enter-active, ._dialog-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  ._dialog-enter, ._dialog-leave-active {
    opacity: 0
  }
  ._dialog{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 999;
    .mark{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 9;
      background: #000;
      opacity: .5;
    }
    ._d-content{
      position: absolute;
      top: 0;
      right: 0;
      width: 5.76rem;
      height: 100vh;
      background: #fff;
      z-index: 11;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      ._d-list{
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 100%;
        padding-left: .3rem;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translateZ(0px);
        transform: translate(0px);
        ._d-items{
          padding-top: .2rem;
          border-bottom: 1px solid #ededed;
          &:last-child{
            border-bottom: none;
          }
          .title{
            position: relative;
            height: .44rem;
            line-height: .44rem;
            font-size: .28rem;
            color: #777E8C;
            .status{
              position: absolute;
              right: .3rem;
              top: 0;
              display: block;
              font-size: .28rem;
              color: #0DC88C;
              .icon{
                color: #999;
              }
            }
          }
          ._d-box{
            padding-bottom: .2rem;
            ._d-btns{
              float: left;
              width: 1.58rem;
              height: .56rem;
              font-size: .24rem;
              color: #333;
              text-align: center;
              background: #F2F2F4;
              border-radius: .28rem;
              margin-right: .2rem;
              margin-top: .2rem;
              line-height: .56rem;
            }
          }
        }
      }
      ._d-footer{
        height: 1rem;
        width: 5.76rem;
        border-top: 1px solid #ededed;
        .btn{
          float: left;
          width: 2.88rem;
          height: 1rem;
          line-height: 1rem;
          font-size: .34rem;
          color: #7E7D7D;
          text-align: center;
          &:last-child{
            color: #fff;
            background: #0DC88C;
          }
        }
      }
    }
  }
</style>
