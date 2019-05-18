<template>
  <div class="page page_bg">
    <div class="page_bd guestDetail">
        <div class="list">
          <div class="photo">照片</div>
          <div class="context">
            <div class="items"><p class="name">项目名称：思源大厦</p></div>
            <div class="items"><p class="name">资源编码：09-1103</p></div>
            <div class="items"><p class="name">管家姓名：张三</p></div>
            <div class="items"><p class="name">联系方式：<a class="phone" :href="'tel:188 8888 8888'">
                <span class="name" style="padding: 0 0;">188 8888 8888</span>
                <i class="iconfont icon-dianhua phoneIcon"></i>
              </a>
              </p></div>
          </div>
          <div>
            <p class="tip">管家服务介绍：</p>
            <p class="tipContext">这里是一段介绍这里是一段介绍这里是一段介绍这里是
一段介绍这里是一段介绍</p>
          </div>
        </div>
        <div class="list">
          <div class="photo">照片</div>
          <div class="context">
            <div class="items"><p class="name">项目名称：思源大厦</p></div>
            <div class="items"><p class="name">资源编码：09-1103</p></div>
            <div class="items"><p class="name">管家姓名：张三</p></div>
            <div class="items"><p class="name">联系方式：<a class="phone" :href="'tel:188 8888 8888'">
                <span class="name" style="padding: 0 0;">188 8888 8888</span>
                <i class="iconfont icon-dianhua phoneIcon"></i>
              </a>
              </p>
            </div>
          </div>
          <div>
            <p class="tip">管家服务介绍：</p>
            <p class="tipContext">这里是一段介绍这里是一段介绍这里是一段介绍这里是
一段介绍这里是一段介绍</p>
          </div>
        </div>
        <div class="list">
          <div class="photo">照片</div>
          <div class="context">
            <div class="items"><p class="name">项目名称：思源大厦</p></div>
            <div class="items"><p class="name">资源编码：09-1103</p></div>
            <div class="items"><p class="name">管家姓名：张三</p></div>
            <div class="items"><p class="name">联系方式：<a class="phone" :href="'tel:188 8888 8888'">
                <span class="name" style="padding: 0 0;">188 8888 8888</span>
                <i class="iconfont icon-dianhua phoneIcon"></i>
              </a>
              </p>
              </div>
          </div>
          <div>
            <p class="tip">管家服务介绍：</p>
            <p class="tipContext">这里是一段介绍这里是一段介绍这里是一段介绍这里是
一段介绍这里是一段介绍</p>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import navTitle from '@/components/navTitle'
export default {
  name: 'guestDetail',
  components: {navTitle},
  data () {
    return {
      pageType: 1,
      detailData: {CstType: 'P'}
    }
  },
  methods: {
    async getData () {
      console.log('tag', this.$route.params)
      let res = await this.$xml('UserCS_CustomerDetail', {
        'CstID': this.$route.params.cstId
      })
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        this.detailData = res.data[0]
      } else {
        this.$toast(res.msg)
      }
      // this.$vux.loading.hide()
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .guestDetail{
    .list{
      margin-top: 15px;
      background-color: #FFFFFF;
      padding: 20px 15px;
      position: relative;
      .photo{
        width: 80px;
        height: 100px;
        top: 0px;
        background-color: #EDF3FD;
      }
      .context{
        float: left;
        left: 100px;
        position: absolute;
        top: 14px;
        padding: 0 5px;
        .items{
          font-size: 15px;
          color:#333333;
          .name{
              color:#333333;
              padding: 2px 0;
            .phone{
              color: #3395FF;
            }
          }
        }
      }
      .tip{
        font-size: 14px;
        color: #999999;
        padding: 3px 0;
      }
      .tipContext{
        font-size: 14px;
        text-indent:2em;
        color:#333333;
      }
    }
  }
</style>
