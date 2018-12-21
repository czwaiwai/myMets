<template>
    <div class="ref-warp">
        <div class="ref-move" ref="touchM">
            <div class="ref-top">
                <bou class="top-tip"></bou>
            </div>
            <div class="ref-data" ref="move">
                <!-- 该div下面放自个的组件或列ajax数据 -->
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * 功能 该组件实现了下拉刷新及提供到底部函数
 * props 里面有可配置参数 另有三个重要方法 this.succ() 下拉复原  this.IsLast(h,fuc)为提供的到底方法默认容器为下拉组件fuc接收三个参数一为 方向 二个为scrollTop 三为离底部的距离是否小于h(到底部刷新使用)
 * this.setTop() 复原滑动位置或指定位置（当传数值时），与activated钩子函数配合使用
 * 使用示例
 * import Myref from '@/components/ref/ref.vue';// 引用模板
 *
 *  <Myref ref="sf">
            <ul class="list-warp">
                <li v-for="(li,n) in items.mydata" :key="n">{{li}}</li>
            </ul>
        </Myref>

       //定位到之前滑动条的位置
       activated () {this.$refs.sf.setTop();},

       可以在mounted 里面这样写
         var that = this.$refs.sf;
        that.items.ref = function () {
            console.log('可以调数据了');
            setTimeout(function () {
                that.succ();
                console.log('数据回来了');
            }, 2000);
        };
        that.IsLast(50, function () {
            console.log('到底了');
        });
 *
 * @Author: lizuping
 * @Date: 2018-00-00
 * @Last Modified by: lizuping
 * @Last Modified time: 2018-07-12 14:22:03
 */
import t from './ref.js'
// 组件模块
export default {
  name: 'list',
  components: { bou: t.bou },
  data () {
    return t.data
  },
  methods: t.methods,
  // 数据接口 type:String Number Boolean Function Object Array Symbol
  props: {
    items: {
      type: Object,
      default () {
        return {
          ref: function () {
            console.log('可以调数据了')
          }, // 暂停留回调的接口
          h: 68, // 顶部暂停留的高
          a: 0.3 // 放手后动画的加速度

        }
      }
    }
  },
  // 组件渲染完成勾子只执行一次
  mounted () {
    t.met(this)
  }
}
</script>
<style scoped>
@import './ref.css';
</style>
