<template>
  <div class="selectType clearfix">
    <div class="types" @click.stop="showSelectList" :class="{'blue':showBox}">
      <span class="name">{{selectItem.name}} ({{selectItem.num}})</span>
      <i class="iconfont" :class="showBox?'icon-zhankai1':'icon-zhankai'"></i>
    </div>
    <div class="times" @click.stop="changeTime">
      <span class="name icon_sort" :class="iconName">时间</span>
    </div>
    <collapse-transition>
      <div class="selectList" v-show="showBox">
        <div class="item" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectList" :key="index" @click.stop="select(item)">
          <span class="name">{{item.name}}</span>
          <span class="num">({{item.num}})</span>
        </div>
      </div>
    </collapse-transition>
    <transition name="mark">
      <div class="mark" v-show="showMark" @click.stop="hideBox" @touchmove.prevent></div>
    </transition>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
export default {
  name: 'selectTyep',
  components: {CollapseTransition},
  data () {
    return {
      iconName: 'bottom',
      showBox: false,
      showMark: false,
      selectItem: {
        type: 'Executing', name: '待办', num: 0, isSelect: true
      },
      selectList: [
        {type: 'Posted', name: '已发起', num: 0, isSelect: false},
        {type: 'Executing', name: '待办', num: 0, isSelect: true},
        {type: 'Executed', name: '已处理', num: 0, isSelect: false},
        {type: 'Completed', name: '已完成', num: 0, isSelect: false},
        {type: 'Share', name: '共享', num: 0, isSelect: false}
      ]
    }
  },
  methods: {
    // 选择筛选类型
    select (item) {
      if (item.isSelect) {
        return
      }
      this.selectList.forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.selectItem = item
      this.showBox = false
      this.showMark = false
      this.$emit('setStatus', item.type)
    },
    // 点击筛选类型
    showSelectList () {
      this.showBox = !this.showBox
      if (this.showBox) {
        this.showMark = true
      } else {
        this.showMark = false
      }
    },
    // 隐藏筛选列表
    hideBox () {
      this.showBox = false
      this.showMark = false
    },
    // 时间状态
    changeTime () {
      if (this.iconName === 'bottom') {
        this.iconName = 'top'
        this.$emit('setTimeStatus', 1)
      } else {
        this.iconName = 'bottom'
        this.$emit('setTimeStatus', 2)
      }
    },
    async getSelectList () {
      let res = await this.$xml('UserAudit_SubmitAuditCount', {
        'EmployeeId': this.$parent.employeeId,
        'WorkflowTypeId': this.$parent.typesData.WorkflowTypeId || '',
        'AskTimeS': this.$parent.typesData.AskTimeS || '',
        'AskTimeE': this.$parent.typesData.AskTimeE || '',
        'Subject': ''
      })
      console.log(res)
      for (let key in res.data[0]) {
        console.log(key)
        if (key === this.selectItem.type + 'Count') {
          this.selectItem.num = res.data[0][key]
        }
        this.selectList.forEach(arr => {
          if (key === arr.type + 'Count') {
            arr.num = res.data[0][key]
          }
        })
      }
    }
  },
  created () {
    this.getSelectList()
  }
}
</script>
<style lang="scss" scoped>
  .selectType {
    position: relative;
    // z-index: 8;
    display: flex;
    height: .88rem;
    padding: .2rem 0;
    border-bottom: 1px solid #ededed;
    background: #fff;
    .types{
      flex: 1;
      height: .48rem;
      line-height: .48rem;
      border-right: 1px solid #ededed;
      box-sizing: border-box;
      font-size: .3rem;
      text-align: center;
      &.blue{
        color: #3395FF;
      }
    }
    .times{
      flex: 1;
      height: .48rem;
      line-height: .48rem;
      font-size: .3rem;
      text-align: center;
      .icon_sort {
        position: relative;
        padding-right: 5px;
        &:before{
          content: "";
          border-style: solid;
          border-color: #333 transparent;
          border-width: 5px 5px 0 5px;
          position: absolute;
          top: 12px;
          right: -10px;
        }
        &:after{
          content: "";
          border-style: solid;
          border-color: #333 transparent;
          border-width: 0px 5px 5px 5px;
          position: absolute;
          bottom: 12px;
          right: -10px;
        }
      }
      .icon_sort.bottom {
        &:before {
          border-color: #3395FF transparent;
        }
      }
      .icon_sort.top {
        &:after {
          border-color: #3395FF transparent;
        }
      }
    }
  }
  .selectList{
    position: absolute;
    top: .88rem;
    left: 0;
    z-index: 99;
    background: #fff;
    .item{
      position: relative;
      height: .8rem;
      width: 100vw;
      padding: 0 .3rem 0 .6rem;
      line-height: .8rem;
      border-bottom: 1px solid #ededed;
      &.isSelect{
        .name,.num{
          color: #3395FF;
        }
      }
      .name{
        font-size: .3rem;
        color: #333;
      }
      .num{
        position: absolute;
        right: .3rem;
        top: 0;
        height: .8rem;
        line-height: .8rem;
        color: #333;
        font-size: .3rem;
      }
    }
  }
  .mark-enter-active, .mark-leave-active {
    transition: opacity .3s;
    -webkit-transform: opacity .3s;
  }
  .mark-enter, .mark-leave-active {
    opacity: 0
  }
  .mark{
    position: absolute;
    top: 0.88rem;
    left: 0;
    z-index: 6;
    width: 100vw;
    height: calc(100vh - 2.86rem);
    background: #000;
    opacity: .5;
    overflow: hidden;
  }
</style>
