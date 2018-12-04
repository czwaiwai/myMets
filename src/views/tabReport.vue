<template>
  <div class="page">
    <div class="page_hd">
      <mt-header   :title="$route.meta && $route.meta.title"></mt-header>
    </div>
    <div class="page_bd">
      <div class="scroll">
        <p>这个是报表的页面</p>
        <div class="weui-flex flex_center padding15 margin-bottom" style="height:80px;background:#FFF;">
          <div class="weui-flex__item item_center">
            <p>
              <img style="height:40px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMmYyNGM3Ny05OWQ4LThmNGMtODg5OC04NGZkNDMyZTBkZWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzY1NDVFQzAyRkUyMTFFNzhFMzFGMUUxQzVDMTIyQzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzY1NDVFQkYyRkUyMTFFNzhFMzFGMUUxQzVDMTIyQzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDk3NjBlMjktNDlmNi02NDQzLWI4MzktMjU0OTVmMjg0ZDA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIyZjI0Yzc3LTk5ZDgtOGY0Yy04ODk4LTg0ZmQ0MzJlMGRlZSIv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" />
              <span class="padding-left">文字</span>
            </p>
          </div>
          <div class="flex_center item_center padding-right" >
            <p>0.9分</p>
            <p>满意度</p>
          </div>
          <div class="flex_center item_center" >
            <p>0.0%</p>
            <p>关闭率</p>
          </div>
        </div>
        <div class="weui-flex flex_center padding15" style="height:80px;background:#FFF;">
          <div class="weui-flex__item item_center">
            <p>
              <img style="height:40px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMmYyNGM3Ny05OWQ4LThmNGMtODg5OC04NGZkNDMyZTBkZWUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzY1NDVFQzAyRkUyMTFFNzhFMzFGMUUxQzVDMTIyQzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzY1NDVFQkYyRkUyMTFFNzhFMzFGMUUxQzVDMTIyQzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDk3NjBlMjktNDlmNi02NDQzLWI4MzktMjU0OTVmMjg0ZDA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIyZjI0Yzc3LTk5ZDgtOGY0Yy04ODk4LTg0ZmQ0MzJlMGRlZSIv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">
              <span class="padding-left">文字</span>
            </p>
          </div>
          <div class="flex_center item_center" >
            <p>文字</p>
            <p>文字</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'Vuex'
export default {
  name: 'tabReport',
  data () {
    return {
      currRand: 0
    }
  },
  created () {
    // this.$store.dispatch('getUserAction').then(res => {
    //   console.log(res, '--------------getUserAction')
    // })
  },
  activated () {
    console.log(this.user, 'user')
    // 当切换职位或项目之后重新调用更新数据
    if (this.currRand !== 0 && this.currRand !== this.rand) {
      this.getPageData && this.getPageData()
      this.currRand = this.rand
    } else {
      this.currRand = this.rand
    }
  },
  computed: {
    ...mapGetters({
      'user': 'user',
      'rand': 'rand'
    })
  }
}
</script>

<style scoped>

</style>
