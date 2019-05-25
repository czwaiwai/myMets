<template>
  <div class="page">
    <nav-title title="测试"></nav-title>
    <div ref="pageBD" class="page_bd">
      <div>
        <img :src="imgBase" style="width:200px;height:200px;">
        <img src="http://172.31.118.201:8092/version/test.png" style="width:200px;height:200px;">
      </div>
      <div class="padding">
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="imgClick" >base64图片</button>
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="urlImgClick">url图片点击</button>
      </div>
      <div class="padding">
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="download('docx')">下载docx</button>
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="download('xls')">下载xls</button>
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="download('pdf')">下载pdf</button>
      </div>
      <div class="padding">
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="thirdOpen('docx')">第三方docx</button>
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="thirdOpen('xls')">第三方xls</button>
        <button class="weui-btn weui-btn_mini weui-btn_primary" @click="thirdOpen('pdf')">第三方pdf</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'test2',
  data () {
    return {
      resData: {},
      imgBase: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=`
    }
  },
  created () {
    // this.$nextTick(() => {
    //   let longClick = 0;
    //   let touch = 0;
    //   let touchY = 0;
    //   let timeOutEvent = 0;
    //   this.$refs.pageBD.addEventListener('touchstart', function (e) {
    //     if (e.target.tagName === 'IMG') {
    //       console.log('被点击了')
    //       longClick=0;
    //       timeOutEvent = setTimeout(function(){
    //           //此处为长按事件-----在此显示遮罩层及删除按钮
    //           longClick=1;//假如长按，则设置为1
    //       },500);
    //       touch = e.touches[0];
    //       touchY = touch.clientY;
    //     }
    //   })
    //   this.$refs.pageBD.addEventListener('touchmove', function (e) {
    //     if (e.target.tagName === 'IMG') {
    //       console.log('我执行了', e)
    //       clearTimeout(timeOutEvent);
    //       timeOutEvent = 0;
    //       touch = e.touches[0]
    //       if(Math.abs(touch.clientY - touchY) < 10){
    //           e.preventDefault();
    //       }
    //     }
    //   })
    //   this.$refs.pageBD.addEventListener('touchend', function (e) {
    //     if (e.target.tagName === 'IMG') {
    //       console.log('我结束了')
    //       clearTimeout(timeOutEvent);
    //       console.log(timeOutEvent,longClick)
    //       if(timeOutEvent!=0 && longClick === 0){//点击
    //         //此处为点击事件----在此处添加跳转详情页
    //         console.log('处理长按事件')
    //       }
    //       return false;
    //     }
    //   })
    // })
  },
  methods: {
    imgClick () {
      this.$app.longClick({
        img:this.imgBase,
        type: 'base64'
      }).then(res => {
        console.log(res)
        this.resData = res
        this.$toast('操作成功')
      })
    },
    urlImgClick () {
      this.$app.longClick({
        img:'http://172.31.118.201:8092/version/test.png',
        type: 'url'
      }).then(res => {
          this.resData = res
          this.$toast('操作成功' + 'http://172.31.118.201:8092/version/test.png')
        })
    },
    download(doc) {
      let file= 'http://172.31.118.201:8092/version/test.'+doc
      this.$app.download({
        file:file
      }).then((res) => {
          this.resData = res
          this.$toast('下载成功' + file)
        })
    },
    thirdOpen (doc) {
      let file= 'http://172.31.118.201:8092/version/test.'+doc
      this.$app.openThird({
        file:file,
      }).then((res) => {
          this.resData = res
          this.$toast('下载成功' + file)
        })
    }
  }
}
</script>

<style lang="scss">

</style>
