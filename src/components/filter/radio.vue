<template>
  <div class="radio_wrap border-bottom-half" >
    <dl class="">
      <dt class="weui-flex padding-bottom">
        <div class="weui-flex__item"><slot></slot></div>
        <div style="max-width: 80%;">{{chooseItem.name}}</div>
      </dt>
      <dd>
        <ul class="clearfix">
          <li  @click="chooseClick(item,index)" v-for="(item, index) in showList" :key="index" class="item_radio">
            <div :class="showActiveIndex===index?'active': ''" class="item_content">{{item.name}}</div>
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>
<script>
export default {
  name: 'filterRadio',
  props: {
    value: String,
    name: String,
    noAll: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => [
        // {name: '正常', value: '1'},
        // {name: '正常', value: '2'},
        // {name: '异常', value: '22'},
        // {name: '历史', value: '3'},
        // {name: '历史', value: '4'},
        // {name: '历史', value: '5'},
        // {name: '中国进口发动机', value: '6'},
        // {name: '历史', value: '7'}
      ]
    }
  },
  inject: ['setList'],
  data () {
    return {
    }
  },
  computed: {
    activeIndex () {
      return this.formatList.findIndex(item => item.value === this.value)
    },
    showActiveIndex () {
      if (this.formatList.length > 9) {
        return this.activeIndex > 8 ? 8 : this.activeIndex
      } else {
        return this.activeIndex
      }
    },
    formatList () {
      if (!this.dataList) return []
      if (this.datalist && this.datalist.length === 0) return []
      if (typeof this.dataList[0] === 'string') {
        let list = this.dataList.map(item => {
          return {
            name: item,
            value: item
          }
        })
        if (!this.noAll) {
          list.unshift({name: '全部', value: ''})
        }
        return list
      } else {
        let list = this.dataList.map(item => {
          return {
            name: item.name,
            value: item.value
          }
        })
        if (!this.noAll) {
          list.unshift({name: '全部', value: ''})
        }
        return list
      }
    },
    showList () {
      if (this.formatList.length > 9) {
        let list = this.formatList.slice(0, 8)
        list.push({name: '更多', value: 'more'})
        return list
      } else {
        return this.formatList
      }
    },
    chooseItem () {
      return this.formatList[this.activeIndex]
    },
    radioId () {
      return 'date_' + Date.now() + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  created () {
    this.formItemId = this.radioId
    this.saveVal = this.value
  },
  methods: {
    filterReset () {
      this.$emit('input', this.saveVal)
    },
    chooseClick (item, index) {
      if (item.value === 'more') {
        this.setList(this.name, this.formatList, this.activeIndex)
      } else {
        // this.value = i
        this.$emit('input', item.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.radio_wrap {
  background:#FFF;
  padding: 10px 10px;
}
.item_radio {
  float:left;
  width:33.3%;
  height:28px;
  padding:0 5px;
  line-height:28px;
  text-align:center;
  margin-bottom:10px;
  & .item_content{
    width:100%;
    border-radius:28px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    background:#ECECEC;
    border:1px solid #ECECEC;
  }
  & .item_content.active {
    border:1px solid #3395FF;
    color:#3395FF;
    background: #EBF5FF;
  }
}
</style>
