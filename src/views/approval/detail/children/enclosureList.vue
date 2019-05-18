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
      <ul class="msg" v-show="showMsg">
        <li class="item" v-for="(item,index) in enclosureList" :key="index">
          <a v-bind:href="item.FilePath" target="_blank" @click="openFile(item.FilePath)">{{item.FileName}}</a>
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
    openFile (filename, filepath) {
      console.log('plus', window.plus)
      if (window.plus) { // 支持plus
        // 判断文件是否已经下载
        console.log('plus', window.plus)
        let plus = window.plus
        plus.io.resolveLocalFileSystemURL(
          '_downloads/' + filename,
          function (entry) { // 如果已存在文件，则打开文件
            if (entry.isFile) {
              this.$toast('正在打开文件...')
              plus.runtime.openFile('_downloads/' + filename)
            }
          }, function () { // 如果未下载文件，则下载后打开文件
            var dtask = plus.downloader.createDownload(filepath, { filename: '_downloads/' + filename }, function (d, status) {
              if (status === 200) {
                plus.runtime.openFile('_downloads/' + filename)
              } else {
                this.$toast('下载失败: ' + status)
              }
            })
            dtask.addEventListener('statechanged', function (task, status) {
              if (!dtask) { return }
              switch (task.state) {
                case 1:
                  this.$toast('开始下载...')
                  break
                case 2:
                  this.$toast('正在下载...')
                  break
                // case 3: // 已接收到数据
                //   var progressVal = (task.downloadedSize / task.totalSize) * 100
                //   if (hui('.progress').length > 0) {
                //     hui('.progress').html(parseInt(progressVal) + '%')
                //   }
                //   break
                case 4:
                  dtask = null
                  // if (hui('.progress').length > 0) {
                  //   hui('.progress').html('0%')
                  // }
                  this.$toast('正在打开文件...')
                  break
              }
            })
            dtask.start()
          }
        )
      } else { // 不支持plus
        window.open(filepath)
      }
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
