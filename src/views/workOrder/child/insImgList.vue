<template>
<div >
  <div class="weui-uploader">
    <div class="weui-uploader__bd">
        <ul class="weui-uploader__files" id="uploaderFiles">
            <li v-for="(img,key) in imgs" :key="key" class="weui-uploader__file relative" >
                <!-- :style="'background-image:url(data:image/jpg;base64,'+img+')'" -->
              <a v-if="!readonly" @click="delImg(img, key)" class="img_del_btn"></a>
              <img preview  :src="imgSrc(img)"  style="max-width:100%;width:100%;height:100%;" >
            </li>
        </ul>
        <div v-show="imgs.length < max"  @click="addImgHandle" class="weui-uploader__input-box">
            <!-- <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple=""> -->
        </div>
    </div>
  </div>
  <div class="weui-uploader__hd">
      <div class="weui-uploader__title"><slot></slot></div>
      <div class="weui-uploader__info">图片数量: {{imgs.length}}</div>
  </div>
</div>
</template>
<script>
export default {
  name: 'insImgList',
  props: {
    imgs: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    onlyWater: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    delImg (item, index) {
      let img = this.imgs.splice(index, 1)
      if (img[0] && /[\\.jpg|\\.png]$/.test(img[0])) {
        this.$emit('del', img[0])
      }
    },
    imgSrc (img) {
      if (/^(.+)\.(jpg|png)$/.test(img)) {
        let ip = this.$store.getters.ip
        if (ip) {
          return 'http://' + ip + img
        } else {
          return img
        }
      } else {
        return 'data:image/jpg;base64,' + img
      }
    },
    async addImgHandle () {
      if (this.readonly) return
      if (this.$dev) {
        let imgs = [...this.imgs, 'iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=']
        this.$emit('update:imgs', imgs)
        this.$previewRefresh()
      } else {
        let img
        if (this.onlyWater) {
          img = await this.$app.waterCamera()
        } else {
          img = await this.$app.getPic()
        }
        let imgs = [...this.imgs, img]
        this.$emit('update:imgs', imgs)
        this.$previewRefresh()
      }
    }
  }
}
</script>
<style lang="scss" scoped >
// .ins_radio_group .right_text_color {
//   color:#3395FF;
// }
// .ins_radio_group .wrong_text_color {
//   color: #f00404;
// }
// .ins_radio {
//   color:#999;
//   display:inline-block;
//   padding-right:10px;
//   font-size:16px;
// }
// .ins_radio input:checked + i.iconfont:before{
//   content: "\E610"
// }
.img_del_btn {
  width:20px;
  height:20px;
  display:block;
  position: absolute;
  top:0;
  right:0;
  z-index:2;
  color:#FFF;
  text-align:center;
  background:url('../../../assets/img/tool/close_img.png') no-repeat;
  background-size:cover;
}
</style>
