<template>
    <ul class="typeList">
      <li class="items" v-for="(item,index) in list" :key="index"  @click="$emit('input', item.id)">
        <span class="name" :class="{'isSelect':value === item.id}">
          {{item.name}}
          <small class="main_color">{{(item.badge-0)>99?'+99':item.badge}}</small>
        </span>
      </li>
    </ul>
</template>
<script>
export default {
  name: 'navbar',
  props: {
    value: String,
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped >
  .typeList{
    display: flex;
    height: .88rem;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .items{
      flex: 1;
      text-align: center;
      .name{
        display: inline-block;
        height: .88rem;
        line-height: .88rem;
        font-size: .3rem;
        color: #333;
        &.isSelect{
          color: #3395FF;
          border-bottom: 3px solid #3395FF;
        }
      }
    }
  }
</style>
