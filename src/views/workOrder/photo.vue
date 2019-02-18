<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="拍照确认">
        <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
      <div v-if="!onlyPhoto" class="weui-cells weui-cells_form" style="margin-top:0;">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <textarea v-model="remark" class="weui-textarea" maxlength="200" placeholder="请描述巡检情况..." rows="3"></textarea>
                <div class="weui-textarea-counter"><span>{{remark.length}}</span>/200</div>
            </div>
        </div>
      </div>
      <div class="light_bg padding-h padding-v">
        <ins-img-list :imgs.sync="imgs" :max="maxImgNum" @del="delItems" :only-water="true" >
          <p class="dark_99"><i class="iconfont icon-weizhi-tianchong padding-right5"></i> {{detail.InstallationSite}}</p>
       </ins-img-list>
      </div>
        <div class="padding15">
            <button class="ins_submit_btn" @click="submit">确定</button>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import InsImgList from './child/insImgList'
export default {
  name: 'photo',
  data () {
    return {
      imgs: [],
      delImgs: [],
      remark: '',
      maxImgNum: 3,
      detail: {}
    }
  },
  components: {InsImgList},
  created () {
    this.detail = this.$parent.detailItem
    console.log(this.detail)
    this.onlyPhoto = this.$route.params.type === 'inspection'
    if (this.onlyPhoto) {
      this.maxImgNum = 1
    }
    this.getPageData()
  },
  methods: {
    async getPageData () {
      // 巡检保养工单设备图片显示
      let url = '/ets/syswin/smd/userCSGetIamgeInfo'
      let res = await this.$http.post(url, {
        imageID: this.detail.IamgeID
      })
      if (res.data[0]) {
        let {Memo: remark, ImageList: imgs} = res.data[0]
        if (imgs && imgs.length > 0) {
          this.imgs = [...imgs.map(item => item.Path)]
          this.$previewRefresh()
        }
        this.remark = remark === '无' ? '' : remark
      }
    },
    delItems (img) {
      this.delImgs.push(img)
      console.log(img)
    },
    formatParam () {
      let param = {
        equipmentID: this.detail.IamgeID,
        iamge1: '',
        iamge2: '',
        iamge3: '',
        iamge4: '',
        memo: this.remark
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
          param['iamge' + (index + 1)] = item
        })
      }
      if (this.delImgs.length > 0) {
        param.deImage = this.delImgs.join(',')
      }
      if (resArr.every(item => !item) && param.memo === '') {
        param.memo = '无'
      }
      return param
    },
    async submit () {
      let url = '/ets/syswin/smd/userCSGetEquipmentIamge'
      let res = this.$http.post(url, this.formatParam())
      this.$parent.detailItem.ImageExsit = '1'
      this.$root.back()
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

</style>
