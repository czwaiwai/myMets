<template>
  <div>
    <div class="listBtn" v-if="detailData.BookStatus==='HB' || detailData.BookStatus==='QR'">
      <p class="title">配套设施</p>
      <div class="box-wrap clearfix">
        <div class="btnBox" :class="{'isSelect':item.isSelect}" @click.stop="selectItem(item,index)" v-for="(item,index) in equipMatchingList" :key="index">
          <span>{{item.Name}}</span>
        </div>
      </div>
    </div>
    <div class="listBtn" v-else>
      <div class="textShowItem clearfix noneBb">
        <span class="name">配套设施：</span>
        <span class="value" style="min-height:.44rem;">
          <span v-for="(item, index) in detailData.Facilities" :key="index">
            {{item.MaterialsnName}}<span v-show="index!=detailData.Facilities.length-1">、</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'facilities',
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          BookStatus: '',
          Facilities: []
        }
      }
    },
    equipMatchingList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    selectItem (item, index) {
      let list = JSON.parse(JSON.stringify(this.equipMatchingList))
      list.forEach((arr, _index) => {
        if (index === _index) {
          arr.isSelect = !arr.isSelect
        }
      })
      console.log('serviceList', list)
      this.$emit('update:equipMatchingList', list)
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
          border: 1px solid #0DC88C;
          color: #0DC88C;
        }
      }
    }
  }
</style>
