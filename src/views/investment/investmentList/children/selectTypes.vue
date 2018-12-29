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
          <input type="text" class="inputBox" placeholder="最小㎡">
          <span class="aline">—</span>
          <input type="text" class="inputBox" placeholder="最大㎡">
          <div class="btn">确定</div>
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
          <input type="text" class="inputBox" placeholder="最低㎡">
          <span class="aline">—</span>
          <input type="text" class="inputBox" placeholder="最高㎡">
          <div class="btn">确定</div>
        </div>
      </div>
    </collapse-transition>
    <transition name="mark">
      <div class="mark" v-show="showMark" @click.stop="clickMark"></div>
    </transition>
  </div>
</template>
<script>
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
          {name: '不限', start: '', end: '', isSelect: true},
          {name: '宝安区', start: '1', end: '5', isSelect: false},
          {name: '南山区', start: '6', end: '10', isSelect: false},
          {name: '福田区', start: '11', end: '15', isSelect: false},
          {name: '罗湖区', start: '15', end: '', isSelect: false},
          {name: '盐田区', start: '11', end: '15', isSelect: false},
          {name: '龙岗区', start: '15', end: '', isSelect: false},
          {name: '龙华区', start: '11', end: '15', isSelect: false},
          {name: '坪山区', start: '15', end: '', isSelect: false}
        ],
        type1: [
          {name: '不限', start: '', end: '', isSelect: true},
          {name: '写字楼', start: '1', end: '5', isSelect: false},
          {name: '商业', start: '6', end: '10', isSelect: false},
          {name: '商业园区', start: '11', end: '15', isSelect: false},
          {name: '商业综合体', start: '15', end: '', isSelect: false}
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
      height: 0
    }
  },
  methods: {
    // 点击下拉列表项
    selectItem (item, type) {
      console.log('in....')
      if (item.isSelect) {
        return
      }
      this.selectListData['type' + type].forEach(arr => {
        arr.isSelect = false
      })
      item.isSelect = true
      this.showSelectList['showBox' + type] = false
      this.showMark = false
      this.typeList[type].isSelect = false
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
