<template>
  <div class="selectTypes">
    <ul class="list">
      <li class="items" :class="{'isSelect': item.isSelect}" @click.stop="selectType(item,index)" v-for="(item,index) in typeList" :key="index">
        <span class="name">{{item.name}}</span>
        <i class="iconfont" :class="item.isSelect?'icon-zhankai1':'icon-zhankai'"></i>
      </li>
    </ul>
    <collapse-transition>
      <div class="selectList areaList" v-show="showSelectList.showBox0" :style="com_zIndex(showSelectList.showBox0)">
        <div class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectListData.type0" :key="index" @click.stop="selectItem(item, 0)">
          <span class="name">{{item.name}}</span>
        </div>
      </div>
    </collapse-transition>
    <collapse-transition>
      <div class="selectList areaList" v-show="showSelectList.showBox1" :style="com_zIndex(showSelectList.showBox1)">
        <div class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectListData.type1" :key="index" @click.stop="selectItem(item, 1)">
          <span class="name">{{item.name}}</span>
        </div>
      </div>
    </collapse-transition>
    <collapse-transition>
      <div class="selectList areaList" v-show="showSelectList.showBox2" :style="com_zIndex(showSelectList.showBox2)">
        <div class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectListData.type2" :key="index" @click.stop="selectItem(item, 2)">
          <span class="name">{{item.name}}</span>
        </div>
        <div class="auto clearfix">
          <span class="name">自定义</span>
          <input type="text" class="inputBox" @input="setNum('rentAvgMin')" v-model="rentAvgMin" placeholder="最小㎡">
          <span class="aline">—</span>
          <input type="text" class="inputBox" @input="setNum('rentAvgMax')" v-model="rentAvgMax" placeholder="最大㎡">
          <div class="btn" @click.stop="confirm(2)">确定</div>
        </div>
      </div>
    </collapse-transition>
    <collapse-transition>
      <div class="selectList areaList" v-show="showSelectList.showBox3" :style="com_zIndex(showSelectList.showBox3)">
        <div class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectListData.type3" :key="index" @click.stop="selectItem(item, 3)">
          <span class="name">{{item.name}}</span>
        </div>
        <div class="auto clearfix">
          <span class="name">自定义</span>
          <input type="text" class="inputBox" @input="setNum('areaTotalMin')" v-model="areaTotalMin" placeholder="最低㎡">
          <span class="aline">—</span>
          <input type="text" class="inputBox" @input="setNum('areaTotalMax')" v-model="areaTotalMax" placeholder="最高㎡">
          <div class="btn" @click.stop="confirm(3)">确定</div>
        </div>
      </div>
    </collapse-transition>
    <transition name="mark">
      <div class="mark" v-show="showMark" @click.stop="clickMark"></div>
    </transition>
  </div>
</template>
<script>
/*eslint-disable*/
import CollapseTransition from '@/utils/collapseTransition.js'
export default {
  name: 'selectTypes',
  components: {CollapseTransition},
  data () {
    return {
      typeList: [
        {name: '区域', isSelect: false, type: 0},
        {name: '业态', isSelect: false, type: 1},
        {name: '租金', isSelect: false, type: 2},
        {name: '面积', isSelect: false, type: 3}
      ],
      selectListData: {
        type0: [
          {name: '不限', id: '', isSelect: true},
          {name: '宝安区', id: '1', isSelect: false},
          {name: '南山区', id: '6', isSelect: false},
          {name: '福田区', id: '11', isSelect: false},
          {name: '罗湖区', id: '15', isSelect: false},
          {name: '盐田区', id: '11', isSelect: false},
          {name: '龙岗区', id: '15', isSelect: false},
          {name: '龙华区', id: '11', isSelect: false},
          {name: '坪山区', id: '15', isSelect: false}
        ],
        type1: [
          {name: '不限', id: '', isSelect: true},
          {name: '写字楼', id: '1', isSelect: false},
          {name: '商业', id: '6', isSelect: false},
          {name: '商业园区', id: '11', isSelect: false},
          {name: '商业综合体', id: '15', isSelect: false}
        ],
        type2: [
          {name: '不限', start: '', end: '', isSelect: true},
          {name: '1-5元㎡/天', start: '1', end: '5', isSelect: false},
          {name: '6-10元㎡/天', start: '6', end: '10', isSelect: false},
          {name: '11-15元㎡/天', start: '11', end: '15', isSelect: false},
          {name: '15元㎡/天以上', start: '15', end: '', isSelect: false}
        ],
        type3: [
          {name: '不限', start: '', end: '', isSelect: true},
          {name: '5000㎡以下', start: '', end: '5000', isSelect: false},
          {name: '5000㎡-10000㎡', start: '5000', end: '10000', isSelect: false},
          {name: '10000㎡-30000㎡', start: '10000', end: '30000', isSelect: false},
          {name: '30000㎡-50000㎡', start: '30000', end: '50000', isSelect: false}
        ]
      },
      showSelectList: {
        showBox0: false,
        showBox1: false,
        showBox2: false,
        showBox3: false
      },
      showMark: false,
      rentAvgMin: '',
      rentAvgMax: '',
      areaTotalMin: '',
      areaTotalMax: '',
      selectData: {
        County: '', // 区域
        TradeType: '', // 业态类型
        RentAvgMin: '', // 最小租金
        RentAvgMax: '', // 最大租金
        AreaTotalMin: '', // 最小面积
        AreaTotalMax: '' // 最大面积
      }
    }
  },
  methods: {
    // 点击下拉列表项
    selectItem (item, type) {
      console.log('in....')
      if (!item.isSelect) {
        this.selectListData['type' + type].forEach(arr => {
          arr.isSelect = false
        })
        item.isSelect = true
      }
      this.showSelectList['showBox' + type] = false
      this.showMark = false
      this.typeList[type].isSelect = false
      this.setSelectData(item, type)
    },
    // 整合搜索类型
    setSelectData (item, type) {
      switch (type) {
        case 0:
          this.selectData.County = item.id
          break
        case 1:
          this.selectData.TradeType = item.id
          break
        case 2:
          this.selectData.RentAvgMin = item.start
          this.selectData.RentAvgMax = item.end
          break
        case 3:
          this.selectData.AreaTotalMin = item.start
          this.selectData.AreaTotalMax = item.end
          break
      }
      this.$emit('selectData', this.selectData)
    },
    setNum (type) {
      let num = this[type]
      if (num.substr(0, 1) === '.') {
        num = ''
      }
      num = num.replace(/^0*(0\.|[1-9])/, '$1')
      num = num.replace(/[^\d.]/g, '')
      num = num.replace(/\.{2,}/g, '.')
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (num.indexOf('.') < 0 && num !== '') {
        if (num.substr(0, 1) === '0' && num.length === 2) {
          num = num.substr(1, num.length)
        }
      }
      if (num > 0 && num < 1) {
        num = 1
      }
      this[type] = num
    },
    // 下拉筛选层级
    com_zIndex (status) {
      if (status) {
        return 'z-index: 10;'
      } else {
        return 'z-index: 9;'
      }
    },
    // 选择下拉类型
    selectType (item, index) {
      console.log(item)
      if (item.isSelect) {
        item.isSelect = false
        this.showMark = false
        this.showSelectList['showBox' + item.type] = false
        return
      }
      this.typeList.forEach(arr => {
        if (arr.type === item.type) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      this.setSelectInit()
      this.showSelectList['showBox' + item.type] = true
      this.showMark = true
    },
    // 点击下拉背景
    clickMark () {
      this.showMark = false
      this.setSelectInit()
      this.typeList.forEach(arr => {
        arr.isSelect = false
      })
    },
    // 初始化下拉状态
    setSelectInit () {
      this.showSelectList = {
        showBox0: false,
        showBox1: false,
        showBox2: false,
        showBox3: false
      }
    },
    // 点击确定
    confirm (type) {
      this.selectListData['type' + type].forEach(arr => {
        arr.isSelect = false
      })
      this.showSelectList['showBox' + type] = false
      this.showMark = false
      this.typeList[type].isSelect = false
      switch (type) {
        case 2:
          this.selectData.RentAvgMin = this.rentAvgMin
          this.selectData.RentAvgMax = this.rentAvgMax
          break
        case 3:
          this.selectData.AreaTotalMin = this.areaTotalMin
          this.selectData.AreaTotalMax = this.areaTotalMax
          break
      }
      this.$emit('selectData', this.selectData)
    }
  },
  created () {
    this.setSelectInit()
  }
}
</script>
<style lang="scss" scoped>
  .selectTypes{
    position: relative;
    height: .88rem;
    background: #fff;
    border-bottom: 1px solid #ededed;
    .list{
      display: flex;
      .items{
        flex: 1;
        border-right: 1px solid #ededed;
        font-size: .3rem;
        color: #333;
        text-align: center;
        line-height: .88rem;
        &:last-child {
          border-right: none;
        }
        &.isSelect{
          color: #0DC88C;
        }
      }
    }
    .selectList{
      position: absolute;
      top: 0.88rem;
      background: #fff;
      width: 100vw;
      max-height: calc(100vh - 2.74rem);
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .items{
        height: .7rem;
        padding: 0 .3rem;
        font-size: .28rem;
        line-height: .7rem;
        color: #333;
        border-bottom: 1px solid #ededed;
        &.isSelect{
          color: #0DC88C;
        }
      }
      .auto{
        padding: .3rem;
        .name{
          float: left;
          height: .58rem;
          line-height: .58rem;
          font-size: .3rem;
          color: #333;
        }
        .inputBox {
          float: left;
          width: 1.62rem;
          height: .58rem;
          margin: 0 .1rem;
          font-size: .28rem;
          color: #333;
          border: 1px solid #DDDEE3;
          border-radius: 3px;
          text-align: center;
          &::placeholder{
            color: #999;
          }
        }
        .aline{
          float: left;
          height: .58rem;
          line-height: .58rem;
          font-size: .3rem;
          color: #333;
        }
        .btn{
          float: right;
          width: 1.6rem;
          height: .58rem;
          line-height: .58rem;
          text-align: center;
          background: #0DC88C;
          font-size: .32rem;
          color: #fff;
          border-radius: 3px;
        }
      }
    }
    .mark-enter-active, .mark-leave-active {
      transition: opacity .3s;
      -webkit-transform: opacity .3s;
    }
    .mark-enter, .mark-leave-active {
      opacity: 0
    }
    .mark{
      position: absolute;
      top: 0.88rem;
      left: 0;
      z-index: 6;
      width: 100vw;
      height: calc(100vh - 2.74rem);
      background: #000;
      opacity: .5;
      overflow: hidden;
    }
  }
</style>
