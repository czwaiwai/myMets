<template>
  <div class="page">
    <nav-title title="测试pos打印"></nav-title>
    <div class="page_bd">
      <div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">图片地址</label></div>
                <div class="weui-cell__bd">
                    <input v-model="imgUrl" class="weui-input" type="text"  placeholder="请输入图片地址">
                </div>
            </div>
            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">图片格式</label>
                </div>
                <div class="weui-cell__bd">
                    <select  v-model="imgType" class="weui-select" name="select2">
                        <option value="jpeg">jpeg</option>
                        <option value="png">png</option>
                    </select>
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">图片地址</label></div>
                <div class="weui-cell__bd">
                    <input v-model="imgUrl2" class="weui-input" type="text"  placeholder="请输入图片地址">
                </div>
            </div>
            <!-- <qrcode-vue ref="qrcode" :value="imgUrl" :size="300" ></qrcode-vue> -->
            <vue-qrcode  ref="qrcode" :value="imgUrl" :options="{ width: 200 }"></vue-qrcode>

            <div class="weui-btn-area">
              <a @click="useBase64" href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary">使用base64图片</a>
              <a @click="posPrint" class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">确定</a>
              <div class="padding-top"></div>
              <a @click="posPrint2" class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">打印url图片</a>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import QrcodeVue from 'qrcode.vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
function convertImageToBase64 (canvas, imgType) {
  // var canvas = document.getElementById('canvas')
  // var ctx = canvas.getContext('2d')
  // var imgObj = new Image()
  // // 先设置图片跨域属性
  // imgObj.setAttribute('crossOrigin', 'anonymous')
  // // 再给image赋值src属性，先后顺序不能颠倒
  // imgObj.src = image
  // // 当图片加载完成后，绘制图片到canvas
  // imgObj.onload = function () {
  //   // 设置canvas宽高等于图片实际宽高
  //   canvas.width = this.width
  //   canvas.height = this.height
  //   ctx.drawImage(this, 0, 0)
  // 将图片转成base64格式
  var img = canvas.toDataURL('image/' + imgType, 0.5) // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
  // document.getElementById('img').setAttribute('src', img) // 将base64格式图片显示到页面上
  // }
  return img
}
export default {
  name: 'testPos',
  data () {
    return {
      imgType: 'jpeg',
      imgUrl2: 'http://172.31.118.201:8092/version/test.png',
      imgUrl: 'https://mobl-test.chinaums.com/fapiao-portal/pos_issue.do?id=20190518ae91b18c79cc463789786d1b9ab1fcc1&checkCode=544D80E4',
      imgBase: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=`
    }
  },
  components: {
    VueQrcode
  },
  created () {
  },
  methods: {
    useBase64 () {
      this.imgUrl = this.imgBase
    },
    posPrint () {
      console.log(this.$refs.qrcode)
      // https://mobl-test.chinaums.com/fapiao-portal/pos_issue.do?id=20190518ae91b18c79cc463789786d1b9ab1fcc1&checkCode=544D80E4
      console.log('调用原生pos')
      let base64 = convertImageToBase64(this.$refs.qrcode.$el, this.imgType)
      console.log(base64)
      this.$app.posPrint({
        img: base64,
        type: 'base64' // base64 | url
      }).then(res => {
        console.log(res)
      })
    },
    posPrint2 () {
      this.$app.posPrint({
        img: this.imgUrl2,
        type: 'url' // base64 | url
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
