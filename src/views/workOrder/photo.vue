<template>
<div class="page_modal">
  <div class="page">
    <nav-title title="拍照确认"></nav-title>
    <div class="page_bd">
      <div v-if="!onlyPhoto" class="weui-cells weui-cells_form" style="margin-top:0;">
        <div class="weui-cell">
          <div v-if="!readonly" class="weui-cell__bd">
            <textarea v-model="remark" class="weui-textarea" maxlength="200" :placeholder="'请描述'+$parent.typeTxt+'情况...'" rows="3"></textarea>
            <div class="weui-textarea-counter"><span>{{remark.length}}</span>/200</div>
          </div>
          <div v-else class="weui-cell__bd">
            {{remark}}
          </div>
        </div>
      </div>
      <div class="light_bg padding-h padding-v">
        <ins-img-list :readonly="readonly" :imgs.sync="imgs" :max="maxImgNum" @del="delItems" :only-water="true" >
          <p class="dark_99"><i class="iconfont icon-weizhi-tianchong padding-right5"></i> {{detail.InstallationSite}}</p>
       </ins-img-list>
      </div>
        <div v-if="!readonly" class="padding15">
          <button class="ins_submit_btn" @click="submit">确定</button>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import InsImgList from './child/insImgList'
import navTitle from '@/components/navTitle'
export default {
  name: 'photo',
  data () {
    return {
      imgs: [],
      readonly: false,
      delImgs: [],
      remark: '',
      maxImgNum: 4,
      detail: {}
    }
  },
  components: {navTitle, InsImgList},
  created () {
    this.readonly = !!this.$route.query.show
    this.detail = this.$parent.detailItem
    console.log(this.detail)
    this.onlyPhoto = false// this.$route.params.type === 'inspection' 放开巡检保养四张图片
    if (this.onlyPhoto) {
      this.maxImgNum = 1
    }
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let p0 = 'UserCS_GetIamgeInfo'
      let res = await this.$xml(p0, {
        ImageID: this.detail.IamgeID
      })
      // 巡检保养工单设备图片显示
      // let url = '/ets/syswin/smd/userCSGetIamgeInfo'
      // let res = await this.$http.post(url, {
      //   imageID: this.detail.IamgeID
      // })
      if (res.data[0]) {
        let {Memo: remark, ImageList: imgs} = res.data[0]
        if (imgs && imgs.length > 0) {
          this.imgs = [...imgs.map(item => item.Path).splice(0, 4)] // 增加只显示四张图片.splice(0, 4)
          this.$previewRefresh()
        }
        this.remark = remark === '无' ? '' : remark
      }
    },
    delItems (img) {
      this.delImgs.push(img.replace(/\/.*\/([^\\.]+)\..*/, '$1'))
      // console.log(img.replace(/\/.*\/([^\\.]+)\..*/, '$1'))
    },
    formatParam () {
      let param = {
        EquipmentID: this.detail.IamgeID,
        Iamge1: '',
        Iamge2: '',
        Iamge3: '',
        Iamge4: '',
        DeImage: '',
        Memo: this.remark
      }
      let resArr = ['', '', '', '']
      this.imgs.forEach((item, index) => {
        if (/[\\.jpg|\\.png]$/.test(item)) {
          resArr[index] = ''
        } else {
          resArr[index] = item
        }
      })
      if (this.imgs.length > 0) {
        resArr.forEach((item, index) => {
          param['Iamge' + (index + 1)] = item
        })
      }
      if (this.delImgs.length > 0) {
        param.DeImage = this.delImgs.join(',')
      }
      if (resArr.every(item => !item) && param.Memo === '') {
        param.Memo = '无'
      }
      return param
    },
    async submit () {
      let p0 = 'UserCS_GetEquipmentIamge'
      let param = this.formatParam()
      let res = await this.$xml(p0, param)
      // let url = '/ets/syswin/smd/userCSGetEquipmentIamge'
      // let res = await this.$http.post(url, this.formatParam())
      if ([1, 2, 3, 4].every(item => param['Iamge' + item] === '')) {
        this.$parent.detailItem.ImageExsit = '0'
      } else {
        this.$parent.detailItem.ImageExsit = '1'
      }
      this.$parent.optionChange()
      this.$root.back()
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

</style>
