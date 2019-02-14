<template>
  <div class="page_modal">
    <div class="otherDetail page">
      <nav-title title="其他详情"></nav-title>
      <div class="page_bd _content">
        <div class="top">
          <div class="selectItem">
            <span class="name">会议室编号：</span>
            <span class="value textLeft">{{room.meetNumber}}</span>
          </div>
          <div class="selectItem">
            <span class="name">参与座位数：</span>
            <span class="value textLeft">{{room.involvSeats}}</span>
          </div>
          <div class="selectItem">
            <span class="name">主席台座位：</span>
            <span class="value textLeft">{{room.rostrumSeats}}</span>
          </div>
          <div class="selectItem">
            <span class="name">需提前天数：</span>
            <span class="value textLeft">{{room.advanceDay}}天</span>
          </div>
          <div class="selectItem">
            <span class="name">所属部门：</span>
            <span class="value textLeft">{{room.department}}</span>
          </div>
          <div class="selectItem">
            <span class="name">单价：</span>
            <span class="value textLeft">{{room.unitPrice}}元</span>
          </div>
          <div class="selectItem noneBb">
            <span class="name">计费方式：</span>
            <span class="value textLeft">{{room.billing}}</span>
          </div>
        </div>
        <div class="bottom clearfix">
          <span class="name">备注：</span>
          <p class="value">{{room.memo}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'otherDetail',
  components: {navTitle},
  data () {
    return {}
  },
  created () {
    this.room = this.$parent.room
    console.log('in....', this.$parent.dateTime)
  }
}
</script>
<style lang="scss" scoped>
  .otherDetail{
    ._content{
      .top{
        padding-left: .3rem;
        background: #fff;
      }
      .bottom{
        margin-top: .2rem;
        padding: .2rem 0 .2rem .3rem;
        background: #fff;
        .name{
          float: left;
          width: 1rem;
          line-height: 1.5;
          font-size: .3rem;
          color: #999;
        }
        .value{
          float: left;
          width: 5.9rem;
          min-height: 1.8rem;
          font-size: .3rem;
          color: #333;
          line-height: 1.5;
          word-break: break-all;
        }
      }
    }
  }
</style>
