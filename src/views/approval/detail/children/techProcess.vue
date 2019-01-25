<template>
  <div class="baseMsg">
    <div class="base" @click.stop="showBox">
      <span class="name">审批流程</span>
      <span class="status">
        <span class="btn">{{showMsg?'收起':'展开'}}</span>
        <i class="iconfont" :class="showMsg?'icon-zhankai1':'icon-zhankai'"></i>
      </span>
    </div>
    <collapse-transition>
      <div class="msg" v-show="showMsg && techProcessList.length">
        <ul class="content">
          <li class="item" v-for="(item,index) in techProcessList" :key="index">
            <div class="icons" :class="(item.Result=='none')?'blue':'green'">
              <i class="iconfont" :class="(item.Result=='none')?'icon-zhizhen fs':'icon-wancheng'"></i>
            </div>
            <div class="point"></div>
            <p class="time">{{setDateTime(item.ExecuteTime)}}</p>
            <div class="desc clearfix">
              <div class="_left" :class="com_bg(index)">{{item.EmployeeName?item.EmployeeName.slice(-2):'暂无'}}</div>
              <div class="_right">
                <p class="title">
                  <span class="name">{{item.EmployeeName}}&nbsp;</span>
                  <span class="obj">{{item.JobName}}</span>
                </p>
                <p class="status">{{com_status(item)}}</p>
                <p class="code" v-show="item.Result!='none'">{{item.Idea||'暂无'}}</p>
              </div>
            </div>
          </li>
          <li class="item end" v-show="$parent.detailData.IsEnd==1">
            <div class="endIcon">
            </div>
            <div class="point"></div>
            <div class="tip">流程结束</div>
          </li>
        </ul>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
import dateChange from '@/mixins/dateChange'
export default {
  name: 'baseMsg',
  components: {CollapseTransition},
  mixins: [dateChange],
  props: {
    techProcessList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showMsg: true
    }
  },
  methods: {
    showBox () {
      this.showMsg = !this.showMsg
    },
    com_bg (index) {
      return 'bg' + (index % 5)
    },
    com_status (item) {
      let statusName = ''
      switch (item.Result) {
        case 'first':
          statusName = '发起'
          break
        case 'Passed':
          statusName = '通过'
          break
        case 'none':
          statusName = item.ActivityText
          break
        case 'notify':
          statusName = '知会'
          break
        case 'share':
          statusName = '共享'
          break
        case 'Back':
          statusName = '打回'
          break
        case 'Invite':
          statusName = '邀请'
          break
        case 'modify':
          statusName = '修改'
          break
        case 'Reject':
          statusName = '否决'
          break
      }
      console.log('statusName:', statusName)
      return statusName
    }
  }
}
</script>

<style lang="scss" scoped>
  .baseMsg{
    margin-bottom: .2rem;
    .base{
      position: relative;
      width: 100vw;
      height: .8rem;
      padding: 0 .3rem;
      line-height: .8rem;
      background: #fff;
      border-bottom: 1px solid #ededed;
      .name{
        font-size: .3rem;
        color: #333;
      }
      .status {
        position: absolute;
        right: .3rem;
        top: 0;
        display: block;
        height: .8rem;
        font-size: .28rem;
        color: #FA8A2C;
      }
    }
    .msg{
      width: 100vw;
      .content{
        width: 6.9rem;
        margin-left: .6rem;
        padding-top: .3rem;
        border-left: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        box-sizing: border-box;
        .item{
          position: relative;
          z-index: 9;
          width: 6rem;
          margin: 0 0 .3rem .4rem;
          padding: .2rem .3rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: #fff;
          &.end{
            .endIcon{
              position: absolute;
              left: -.65rem;
              top: .2rem;
              display: block;
              width: .4rem;
              height: .4rem;
              border-radius: 50%;
              background: #0CC88D;
            }
            .tip{
              height: .4rem;
              line-height: .4rem;
              text-align: center;
              font-size: .3rem;
              color: #333;
            }
          }
          .icons{
            position: absolute;
            left: -.65rem;
            top: .2rem;
            display: block;
            width: .4rem;
            height: .4rem;
            border-radius: 3px;
            background: #24BC15;
            font-size: 12px;
            color: #fff;
            text-align: center;
            line-height: .42rem;
            .fs{
              font-size: 20px;
            }
            &.blue{
              background: #4DA9EB;
            }
            &.green{
              background: #24BC15;
            }
          }
          .point{
            position: absolute;
            left: -.12rem;
            top: .28rem;
            display: block;
            width: .2rem;
            height: .2rem;
            background: #fff;
            border-left: 1px solid #e0e0e0;
            border-top: 1px solid #e0e0e0;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
          }
          .time{
            // height: .3rem;
            font-size: .24rem;
            line-height: .3rem;
            text-align: right;
            color: #999;
          }
          .desc {
            ._left{
              float: left;
              width: .8rem;
              height: .8rem;
              // background: #3395FF;
              font-size: .28rem;
              color: #fff;
              text-align: center;
              line-height: .8rem;
              border-radius: 4px;
              &.bg0 {background: #0CC88D;}
              &.bg1 {background: #4DA9EB;}
              &.bg2 {background: #F3725D;}
              &.bg3 {background: #F7B55E;}
              &.bg4 {background: #9B89B9;}
            }
            ._right{
              float: left;
              width: 4.4rem;
              margin-left: .1rem;
              .title{
                height: .46rem;
                line-height: .46rem;
                color: #333;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .name{
                  font-size: .3rem;
                }
                .obj{
                  font-size: .24rem;
                }
              }
              .status{
                height: .32rem;
                line-height: .32rem;
                font-size: .24rem;
                color: #24BC15;
              }
              .code{
                min-height: .4rem;
                padding-top: .16rem;
                margin-top: .16rem;
                border-top: 1px solid #e0e0e0;
                font-size: .24rem;
                line-height: .3rem;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
</style>
