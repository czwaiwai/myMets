<template>
  <div class="enclosureList">
    <div class="base" @click.stop="showBox">
      <span class="name">单据附件</span>
      <span class="status">
        <span class="btn">{{showMsg?'收起':'展开'}}</span>
        <i class="iconfont" :class="showMsg?'icon-zhankai1':'icon-zhankai'"></i>
      </span>
    </div>
    <collapse-transition>
      <ul v-if="$app.isAndroid" class="msg" v-show="showMsg">
        <li class="item" v-for="(item,index) in enclosureList" :key="index">
          <a v-if="isImg(item.FileName)" v-bind:href="item.FilePath" target="_blank">{{item.FileName}}</a>
          <a v-else href="javascript:void(0)" target="_blank" @click="openAndroidFile(item.FilePath)">{{item.FileName}}</a>
        </li>
      </ul>
       <ul v-if="$app.isIOS" class="msg" v-show="showMsg">
         <li class="item" v-for="(item,index) in enclosureList" :key="index">
          <a v-bind:href="item.FilePath" target="_blank">{{item.FileName}}</a>
        </li>
      </ul>
    </collapse-transition>
  </div>
</template>
<script>
import CollapseTransition from '@/utils/collapseTransition.js'
export default {
  name: 'enclosureList',
  components: {CollapseTransition},
  props: {
    enclosureList: {
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
    showBox () {
      this.showMsg = !this.showMsg
    },
    isImg (fileName) {
      let suffix = ''
      try {
        let flieArr = fileName.split('.')
        suffix = flieArr[flieArr.length - 1]
      } catch (err) {
        suffix = ''
      }
      // fileName无后缀返回 false
      if (!suffix) {
        return false
      }
      // 图片格式
      var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
      // 进行图片匹配
      let result = imglist.some(function (item) {
        return item === suffix
      })
      return result
    },
    openAndroidFile (file) {
      console.log('file', file)
      this.$app.openThird({
        file: file
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .enclosureList{
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
      .item {
        min-height: .4rem;
        margin: .1rem 0;
        font-size: .26rem;
        line-height: .4rem;
        a {
          color: #3395FF;
          text-decoration: underline;
        }
      }
    }
  }
</style>
