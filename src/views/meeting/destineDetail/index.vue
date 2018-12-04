<template>
  <div class="page destineDetail">
    <div class="content page_bd">
      <!-- <swiper style="width:100vw; height:3.2rem;" :loop="true" :auto="true" dots-position="center">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in baseList" :key="index">
          <img class="pics" :src="item.img">
        </swiper-item>
      </swiper> -->
      <div class="msg">
        <div class="build-wrap">
          <div class="build clearfix">
            <i class="iconfont icon-dizhi icon"></i>
            <span class="name">吾悦科技之关大厦</span>
            <span class="steps">11楼</span>
          </div>
          <div class="people clearfix">
            <i class="iconfont icon-duorenyonghu icon"></i>
            <span class="num">20人</span>
            <span class="tip" @click.stop="toPicDetail">平面位置图</span>
          </div>
        </div>
        <div class="articles">
          <span v-for="(item, index) in 10" :key="index">八爪鱼</span>
        </div>
        <div class="selectItem">
          <span class="name">责任人</span>
          <span class="value textLeft">李中华  18923898333</span>
        </div>
        <div class="selectItem noneBb" @click.stop="toOtherDetail">
          <span class="name">其他详情</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
      </div>
      <div class="dates">
        <div class="selectItem">
          <span class="name">日期</span>
          <span class="value textRight">2018年10月18日  周四</span>
          <i class="iconfont icon-tubiao- icon"></i>
        </div>
        <div class="tips">
          <p class="name">请选择预订时间</p>
          <span class="showTip" @click.stop="toHasReserve">已预定情况</span>
        </div>
        <div class="status clearfix">
          <div class="items clearfix">
            <div class="bgColor1"></div>
            <p class="name">可预订</p>
          </div>
          <div class="items clearfix">
            <div class="bgColor2"></div>
            <p class="name">确认中</p>
          </div>
          <div class="items clearfix">
            <div class="bgColor3"></div>
            <p class="name">已预订</p>
          </div>
          <div class="items clearfix">
            <div class="bgColor4"></div>
            <p class="name">使用中</p>
          </div>
        </div>
        <ul class="times">
          <li class="items clearfix" v-for="(item, index) in 12" :key="index">
            <span class="name">{{com_name(index)}}</span>
            <div class="btns"></div>
            <div class="btns"></div>
            <div class="btns"></div>
            <div class="btns"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <div class="btn" @click.stop="clickBtn">立即预订</div>
    </div>
    <transition name="_dialog">
      <div class="_dialog" v-if="dialogShow">
        <div class="mark" @click.stop="dialogShow=false"></div>
        <div class="main">
          <p class="title">请确定您所选择的会议时间</p>
          <p class="date">2018年10月18日  星期四</p>
          <p class="time">16:30 — 18:00</p>
          <div class="btns clearfix">
            <div class="btn _left" @click.stop="toReserve">确定</div>
            <div class="btn _right" @click.stop="dialogShow=false">取消</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
// import { Swiper, SwiperItem } from 'vux'
export default {
  name: 'destineDetail',
  // components: {Swiper, SwiperItem},
  data () {
    return {
      baseList: [
        {
          url: 'javascript:',
          img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
          title: '送你一辆车'
        },
        {
          url: 'javascript:',
          img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
          title: '送你一辆车'
        },
        {
          url: 'javascript:',
          img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
          title: '送你一辆车'
        }
      ],
      dialogShow: false
    }
  },
  methods: {
    toPicDetail () {
      this.$router.push('/picDetail/132')
    },
    toOtherDetail () {
      this.$router.push('/otherDetail/132')
    },
    toHasReserve () {
      this.$router.push('/hasReserve/123')
    },
    com_name (index) {
      let num = index - 0 + 8
      if (num > 9) {
        return num + ':00'
      } else {
        return '0' + num + ':00'
      }
    },
    clickBtn () {
      this.dialogShow = true
    },
    toReserve () {
      this.$router.push(`/reserve/213`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .destineDetail{
    .content{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 1.2rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .pics{
        display: block;
        width: 100vw;
        height: 3.2rem;
      }
      .msg{
        padding-left: .3rem;
        background: #fff;
        .build-wrap{
          padding: .3rem .3rem .3rem 0;
          border-bottom: 1px solid #ededed;
          .build{
            position: relative;
            .icon{
              float: left;
              width: .54rem;
              height: .4rem;
              font-size: .34rem;
              color: #0DC88C;
              line-height: .4rem;
              text-align: left;
            }
            .name{
              float: left;
              max-width: 4rem;
              font-size: .3rem;
              color: #333;
              line-height: .4rem;
            }
            .steps{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .4rem;
              line-height: .4rem;
              font-size: .28rem;
              color: #999;
            }
          }
          .people{
            position: relative;
            margin-top: .26rem;
            .icon{
              float: left;
              width: .54rem;
              height: .4rem;
              font-size: .34rem;
              color: #0DC88C;
              line-height: .4rem;
              text-align: left;
            }
            .num{
              float: left;
              max-width: 4rem;
              font-size: .3rem;
              color: #333;
              line-height: .4rem;
            }
            .tip{
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              height: .4rem;
              line-height: .4rem;
              font-size: .3rem;
              color: #3395FF;
            }
          }
        }
        .articles{
          padding-bottom: .3rem;
          border-bottom: 1px solid #ededed;
          span{
            display: inline-block;
            font-size: .3rem;
            color: #333;
            margin: .3rem .7rem 0 0;
            line-height: 1.2;
          }
        }
      }
      .dates{
        padding-left: .3rem;
        margin-top: .2rem;
        background: #fff;
        .tips{
          position: relative;
          height: .88rem;
          .name{
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #999;
          }
          .showTip{
            position: absolute;
            top: 0;
            right: .3rem;
            display: block;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            color: #3395FF;
          }
        }
        .status{
          padding: .1rem 0 .3rem;
          .items{
            float: left;
            margin-right: .38rem;
            .name{
              float: left;
              height: .4rem;
              line-height: .4rem;
              margin-left: .1rem;
              font-size: .3rem;
              color: #333;
            }
            .bgColor1{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #E8E8E8;
            }
            .bgColor2{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #FEBBBB;
            }
            .bgColor3{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #FC5A5A;
            }
            .bgColor4{
              float: left;
              width: .4rem;
              height: .4rem;
              background: #0DC88C;
            }
          }
        }
        .times{
          padding-top: .2rem;
          .items{
            padding-bottom: .3rem;
            .name{
              float: left;
              height: .6rem;
              width: 1rem;
              line-height: .6rem;
              font-size: .3rem;
              color: #333;
              text-align: left;
            }
            .btns{
              float: left;
              margin-right: .36rem;
              width: 1.15rem;
              height: .6rem;
              background: #E8E8E8;
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
      .main{
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 11;
        width: 80vw;
        white-space:nowrap;
        transform: translate(-50%,-50%);
        background: #fff;
        overflow: hidden;
        padding: .3rem;
        overflow: hidden;
        border-radius: 3px;
        .title{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #333;
          text-align: center;
        }
        .date{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #3395FF;
          text-align: center;
        }
        .time{
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #3395FF;
          text-align: center;
        }
        .btns{
          padding: .3rem .8rem 0;
          .btn{
            width: 1.6rem;
            height: .68rem;
            font-size: .32rem;
            text-align: center;
            line-height: .68rem;
            &._left{
              float: left;
              color: #fff;
              background: #0DC88C;
              border-radius: 3px;
            }
            &._right{
              float: right;
              color: #0DC88C;
              border: 1px solid #0DC88C;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
</style>
