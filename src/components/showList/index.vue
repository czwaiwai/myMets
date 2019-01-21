<template>
  <transition name="showList">
    <div class="showList" v-show="showDialog">
      <div class="mark" @click.stop="showDialog=false"></div>
      <div class="centent">
        <i class="iconfont icon-tuichu" @click.stop="showDialog=false"></i>
        <ul class="list">
          <li class="item" v-for="(item,index) in list" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'showList',
  props: {
    listData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showDialog: false,
      list: []
    }
  },
  methods: {
    show () {
      this.showDialog = true
    }
  },
  created () {
    let arr = this.listData.split(',')
    let temp = ''
    let length = 0
    let index = 0
    arr.forEach((a, i) => {
      if (index % 2 === 0 && index > 0) {
        if (length + a.length < 34) {
          temp += ', ' + a
          this.list.push(temp)
          temp = ''
          length = 0
          index = 0
        } else {
          this.list.push(temp)
          temp = a
          length = temp.length
          index = 1
          if (i === arr.length - 1) {
            this.list.push(temp)
          }
        }
      } else {
        if (length + a.length < 34) {
          if (index === 0) {
            temp = a
          } else {
            temp += ', ' + a
          }
          length = temp.length
          index++
          if (i === arr.length - 1) {
            this.list.push(temp)
          }
        } else {
          this.list.push(temp)
          temp = a
          length = temp.length
          index = 1
          if (i === arr.length - 1) {
            this.list.push(temp)
          }
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.showList-enter-active, .showList-leave-active {
    transition: opacity .5s;
    -webkit-transform: opacity .5s;
  }
  .showList-enter, .showList-leave-active {
    opacity: 0
  }
  .showList{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .mark{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: rgba(0, 0, 0, .5)
    }
    .centent{
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 11;
      width: 6.5rem;
      white-space:nowrap;
      transform: translate(-50%,-50%);
      background: #fff;
      // border-radius: .1rem;
      overflow: hidden;
      padding: .5rem .3rem;
      overflow: hidden;
      border-radius: 3px;
      .icon-tuichu{
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: .6rem;
        height: .6rem;
        line-height: .6rem;
        text-align: center;
        font-size: .34rem;
        color: #777E8C;
      }
      .list{
        max-height: 6rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .item{
          height: .6rem;
          text-align: center;
          line-height: .6rem;
          color: #999;
          font-size: .3rem;
        }
      }
    }
  }
</style>
