<template>
  <div>
    <div class="listBtn" v-if="detailData.BookStatus==='HB' || detailData.BookStatus==='QR'">
      <p class="title">服务清单</p>
      <div class="box-wrap clearfix">
        <div class="btnBox" :class="{'isSelect':item.isSelect}" @click.stop="selectItem(item,index)" v-for="(item,index) in serviceList" :key="index">
          <span>{{item.ServiceDesc}}</span>
        </div>
      </div>
    </div>
    <div class="listBtn" v-else>
      <div class="textShowItem clearfix noneBb">
        <span class="name">服务清单：</span>
        <span class="value" style="min-height:.44rem;">
          <span v-for="(item,index) in detailData.Service" :key="index">
            {{item.ServiceDesc}}<span v-show="index!=detailData.Service.length-1">、</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'service',
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          BookStatus: '',
          Service: []
        }
      }
    },
    serviceList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    selectItem (item, index) {
      let list = JSON.parse(JSON.stringify(this.serviceList))
      list.forEach((a, _index) => {
        if (index === _index) {
          a.isSelect = !a.isSelect
        }
      })
      console.log(this.serviceList)
      this.$emit('update:serviceList', list)
    }
  }
}
</script>
<style lang="scss" scoped>
  .listBtn{
    padding-left: .3rem;
    margin-top: .2rem;
    background: #fff;
    padding: .2rem 0 .3rem .3rem;
    .title{
      height: .44rem;
      line-height: .44rem;
      font-size: .3rem;
      color: #999;
    }
    .box-wrap{
      .btnBox{
        position: relative;
        float: left;
        min-width: 1.34rem;
        max-width: 2rem;
        height: .6rem;
        border: 1px solid #999;
        color: #999;
        font-size: .3rem;
        border-radius: 3px;
        margin-right: .3rem;
        margin-top: .3rem;
        text-align: center;
        line-height: .6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.isSelect{
          border: 1px solid #3395ff;
          color: #3395ff;
        }
      }
    }
  }
</style>
