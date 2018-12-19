<template>
  <mt-index-list>
    <mt-index-section v-for="(item,index) in charList" :key="index"  :index="item.name">
      <mt-cell @click.native="itemClick(sub)" v-for="(sub,index) in item.value" :key="index" :title="sub.EmployeeName" :value="sub.PositionName" >
        <span class="icon_color" slot="icon" >{{sub.char}}</span>

      </mt-cell>
    </mt-index-section>
  </mt-index-list>
</template>

<script>
import sleep from '@/utils/sleep'
export default {
  name: 'indexList',
  props: {
    proId: {
      type: String
      // default: '11091315263400010000'
    }
  },
  data () {
    return {
      charList: []
    }
  },
  created () {
    this.getPageDateNet()
  },
  methods: {
    async getPageDateNet () {
      let res = await this.$xml('UserCS_GetEmployeeInfo', {OrgID: this.proId})
      await sleep() // 优化大量元素构建导致转场动画卡顿
      let obj = {'#': []}
      this.$emit('setList', res.data)
      let charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      res.data.forEach(item => {
        item.char = item.EmployeeName.slice(0, 1)
        item.PositionName = item.PositionName.replace(/^.*-/, '')
        let char = item.EmployeeNamePY.charAt(0).toLocaleUpperCase()
        if (!obj[char]) obj[char] = []
        if (charStr.indexOf(char) > -1) {
          obj[char].push(item)
        } else {
          obj['#'].push(item)
        }
      })
      let resCharList = []
      charStr.split('').forEach(item => {
        if (obj[item]) {
          let tmp = {}
          tmp.name = item
          tmp.value = obj[item]
          resCharList.push(tmp)
        }
      })
      resCharList.push({
        name: '#',
        value: obj['#']
      })
      this.charList = resCharList
      console.log(res.data, '-0---')
    },
    itemClick (item) {
      this.$emit('itemClick', item)
    }
  }
}
</script>

<style>
.mint-indexlist-nav {
  border-left:none;
}
.mint-indexlist-navlist .mint-indexlist-navitem {
  color:#27cb96;
}
.mint-indexsection-index {
  padding: 2px 10px;
}
.mint-cell {
  min-height: 45px;
}
.mint-indexsection .mint-cell:after {
  content: "";
  border-bottom: 1px solid #e3e3e3;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 15px;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.mint-cell .icon_color {
  display: inline-block;
  width: 31px;
  height: 31px;
  color: #FFF;
  border-radius: 100%;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  margin-right:10px;
}

.mint-indexlist-content > .mint-indexsection  .mint-cell:nth-of-type(n) .icon_color {
  background: #4da9ec;
}
.mint-indexlist-content > .mint-indexsection  .mint-cell:nth-of-type(2n) .icon_color {
  background: #16c295;
}
.mint-indexlist-content > .mint-indexsection  .mint-cell:nth-of-type(3n) .icon_color {
  background: #f3725d;
}
.mint-indexlist-content > .mint-indexsection  .mint-cell:nth-of-type(4n) .icon_color {
  background: #f7b55e;
}
.mint-indexlist-content > .mint-indexsection  .mint-cell:nth-of-type(5n) .icon_color {
  background: #9b89b9;
}

</style>
