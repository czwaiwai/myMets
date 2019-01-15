<template>
  <div class="page_bd">
    <mt-loadmore :auto-fill="true"  :top-method="refresh"  ref="loadmore">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li :class="liClass" v-for="(item, index) in list" :key="index">
          <slot :item="item" ></slot>
        </li>
      </ul>
      <div>
        <div v-if="listStatus === 'load'" class="weui-loadmore">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">正在加载</span>
        </div>
        <div v-if="listStatus === 'empty'" class="weui-loadmore weui-loadmore_line">
            <span class="weui-loadmore__tips">暂无数据</span>
        </div>
        <div v-if="listStatus === 'end'" class="weui-loadmore weui-loadmore_line weui-loadmore_dot">
            <span class="weui-loadmore__tips"></span>
        </div>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
export default {
  // name: 'pageList', //同一组件keepalive复用不要写name,会缓存为同一个
  props: {
    liClass: String,
    config: {
      type: Object,
      default: function () {
        return {
          url: '',
          params: {}
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      page: 0,
      list: [],
      listStatus: 'load'
    }
  },
  created () {
    console.log(this.config, 'this.config')
  },
  methods: {
    async getPageData (isStart) {
      let url = this.config.url
      let res = await this.$http.post(url, {
        page: this.page,
        pageSize: this.config.params.pageSize || 10,
        hideLoad: true,
        ...this.config.params
      })
      if (isStart) {
        this.list = []
      }
      if (res.data && res.data[0]) {
        let arr
        if (typeof this.config.format === 'function') {
          arr = this.config.format(res.data[0])
        } else {
          arr = res.data
        }
        this.list = [...this.list, ...arr]
        if (arr.length < (this.config.params.pageSize || 10)) {
          this.listStatus = 'end'
        }
        if (this.list.length === 0) {
          this.listStatus = 'empty'
        }
      } else {
        if (this.list.length === 0) {
          this.listStatus = 'empty'
        }
        if (this.list.length > 0) {
          this.listStatus = 'end'
        }
      }
      return this.list
    },
    refresh () {
      this.page = 1
      // this.list = []
      this.listStatus = 'load'
      this.getPageData(true).then(res => {
        this.$refs.loadmore.onTopLoaded()
        this.loading = false
      })
    },
    loadMore () {
      if (['empty', 'end'].indexOf(this.listStatus) > -1) {
        this.loading = true
        return
      }
      this.loading = true
      this.page++
      this.getPageData().then(res => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.weui-loadmore_line .weui-loadmore__tips {
  background:transparent;
}
</style>
