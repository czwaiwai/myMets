<template>
  <div class="radio_wrap border-bottom-half" >
    <dl class="">
      <dt class="weui-flex padding-bottom">
        <div class=""><slot></slot></div>
        <div class="padding-left dot_line weui-flex__item text-right">{{showText}}</div>
      </dt>
      <dd>
        <ul class="clearfix">
          <li  @click="chooseClick(item,index)" v-for="(item, index) in shortList" :key="index" class="item_radio">
            <div :class="isItemCheck(item)" class="item_content">{{item.name}}</div>
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>
<script>
export default {
  name: 'filterCheckbox',
  props: {
    value: String,
    name: String,
    dataList: {
      type: Array,
      default: () => [
        {name: '正常', value: '1'},
        {name: '正常', value: '2'},
        {name: '异常', value: '22'},
        {name: '历史', value: '3'},
        {name: '历史', value: '4'},
        {name: '历史', value: '5'},
        {name: '中国进口发动机', value: '6'},
        {name: '历史', value: '7'},
        {name: '历史', value: '8'},
        {name: '历史', value: '9'},
        {name: '历史', value: '10'},
        {name: '历史', value: '11'},
        {name: '历史', value: '12'},
        {name: '历史', value: '13'},
        {name: '历史', value: '14'},
        {name: '历史', value: '15'},
        {name: '历史', value: '16'}
      ]
    }
  },
  data () {
    return {
      validList: [],
      shortList: []
      // activeIndex: 0
    }
  },
  computed: {
    showList () {
      if (this.validList.length > 9) {
        let list = this.validList.slice(0, 8)
        list.push({name: '更多', value: 'more', checked: false})
        return list
      } else {
        return this.validList
      }
    },
    showText () {
      let res = this.validList.reduce((before, item) => {
        if (item.checked) {
          before.push(item.name)
        }
        return before
      }, [])
      return res.join(',')
    },
    checkboxId () {
      return 'checkbox_' + Date.now() + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000) + '' + parseInt(Math.random() * 1000)
    }
  },
  // watch: {
  //   value: {
  //     immediate: true,
  //     handler: function (val) {
  //       console.log(val, '执行了')
  //       if (val !== undefined) {
  //         let arr = val.split(',')
  //         this.validList.forEach(item => {
  //           if (arr.indexOf(item.value) > 0) {
  //             item.checked = true
  //           }
  //         })
  //       }
  //     }
  //   }
  // },
  created () {
    this.formItemId = this.checkboxId
    this.validList = this.formatData(this.dataList)
    this.shortList = this.showList
    this.saveVal = this.value
  },
  methods: {
    // '设置了组件的初始值'
    activeFilter () {
      let val = this.value
      if (val !== undefined) {
        let arr = val.split(',')
        this.validList.forEach(item => {
          if (arr.indexOf(item.value) > 0) {
            item.checked = true
          }
        })
      }
    },
    // 重置组件
    filterReset () {
      let val = this.saveVal
      if (val !== undefined) {
        let arr = val.split(',')
        this.validList.forEach(item => {
          if (arr.indexOf(item.value) > 0) {
            item.checked = true
          }
        })
      }
    },
    isItemCheck (item) {
      if (item.value === 'more') {
        if (this.validList.some((item, index) => item.checked && index > 7)) {
          return 'active'
        }
        return ''
      }
      return item.checked ? 'active' : ''
    },
    formatData () {
      if (!this.dataList) return []
      if (this.datalist && this.datalist.length === 0) return []
      if (typeof this.dataList[0] === 'string') {
        let list = this.dataList.map(item => {
          return {
            name: item,
            value: item,
            checked: false
          }
        })
        list.unshift({name: '全部', value: '', checked: false})
        return list
      } else {
        let list = this.dataList.map(item => {
          return {
            name: item.name,
            value: item.value,
            checked: false
          }
        })
        list.unshift({name: '全部', value: '', checked: false})
        return list
      }
    },
    chooseClick (item, index) {
      if (item.value === 'all') {
        if (item.checked) {
          this.validList.forEach(item => {
            item.checked = false
          })
        } else {
          this.validList.forEach(item => {
            item.checked = true
          })
        }
      } else if (item.value === '') {
        if (!item.checked) {
          this.validList.forEach(item => {
            item.checked = false
          })
          item.checked = true
        }
      } else if (item.value === 'more') {
        this.$parent.setCheckList(this.name, this.validList, this.activeIndex)
      } else {
        if (this.validList.some(item => item.value === '')) {
          let emptyItem = this.validList.find(item => item.value === '')
          emptyItem.checked = false
        }
        item.checked = !item.checked
        // this.value = i
      }
      this.emitRes()
    },
    emitRes () {
      let res = this.validList.reduce((before, item) => {
        if (item.checked && item.value !== 'all') {
          before.push(item.value)
        }
        return before
      }, [])
      this.$emit('input', res.join(','))
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
