<template>
  <div class="selectTypes">
    <ul class="list">
      <li class="items" :class="{'isSelect': item.isSelect}" @click.stop="selectType(item,index)" v-for="(item,index) in typeList" :key="index">
        <span class="name">{{item.name}}</span>
        <i class="iconfont" :class="item.isSelect?'icon-zhankai1':'icon-zhankai'"></i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'selectTypes',
  data () {
    return {
      typeList: [
        {name: '区域', isSelect: false, type: 0},
        {name: '业态', isSelect: false, type: 1},
        {name: '租金', isSelect: false, type: 2},
        {name: '面积', isSelect: false, type: 3}
      ]
    }
  },
  methods: {
    selectType (item, index) {
      if (item.isSelect) {
        item.isSelect = false
        return
      }
      this.typeList.forEach(arr => {
        if (arr.type === item.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .selectTypes{
    height: .88rem;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .list{
      display: flex;
      .items{
        flex: 1;
        border-right: 1px solid #ededed;
        font-size: .3rem;
        color: #333;
        text-align: center;
        line-height: .88rem;
        &:last-child {
          border-right: none;
        }
        &.isSelect{
          color: #0DC88C;
        }
      }
    }
  }
</style>
