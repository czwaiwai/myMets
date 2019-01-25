<template>
  <div class="otherMsg">
    <div class="_wrap" v-for="(items,index) in listMsg" :key="index">
      <div class="baseWrap" v-for="(item,_index) in items.DataFormFields" :key="_index">
        <div class="base" @click.stop="showBox(item)">
          <span class="name">{{items.FormName}}{{items.DataFormFields.length>1?_index+1:''}}</span>
          <span class="status">
            <span class="btn">{{item.show?'收起':'展开'}}</span>
            <i class="iconfont" :class="item.show?'icon-zhankai1':'icon-zhankai'"></i>
          </span>
        </div>
        <collapse-transition>
          <ul class="msg" v-show="item.show">
            <li class="item" v-for="(it,_ind) in item.Fields" :key="_ind">
              <span class="name">{{it.ShowText}}</span>
              <span class="value">：{{it.Value}}</span>
            </li>
          </ul>
        </collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
export default {
  name: 'otherMsg',
  components: {CollapseTransition},
  props: {
    listMsg: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showMsg: false
    }
  },
  methods: {
    showBox (item) {
      item.show = !item.show
    }
  }
}
</script>

<style lang="scss" scoped>
  .baseWrap{
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
      padding: .1rem .3rem;
      background: #fff;
      .item{
        display: flex;
        align-items: center;
        margin: .1rem 0;
        .name{
          width: 2rem;
          min-height: .4rem;
          font-size: .28rem;
          color: #999;
          line-height: .4rem;
        }
        .value{
          flex: 1;
          height: .4rem;
          font-size: .28rem;
          line-height: .4rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
