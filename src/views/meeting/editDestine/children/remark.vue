<template>
  <div>
    <div class="remark" v-if="detailData.BookStatus==='HB' || detailData.BookStatus==='QR'">
      <div class="textItem clearfix noneBb">
        <span class="name">预订备注</span>
        <textarea class="areas" v-model="detailData.Memo" @input="inputText" placeholder="请输入备注内容"></textarea>
      </div>
    </div>
    <div class="remark" v-else>
      <div class="textShowItem clearfix noneBb">
        <span class="name">预订备注</span>
        <span class="value">{{detailData.Memo}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'remark',
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          BookStatus: '',
          Memo: ''
        }
      }
    }
  },
  methods: {
    inputText (e) {
      let obj = Object.assign({}, this.detailData, {
        Memo: e.target.value
      })
      this.$emit('update:detailData', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
  .remark{
    padding-left: .3rem;
    margin-top: .2rem;
    background: #fff;
  }
</style>
