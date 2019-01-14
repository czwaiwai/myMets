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
          <span class="name">{{item.CountyName}}</span>
        </div>
      </div>
    </collapse-transition>
    <collapse-transition>
      <div class="selectList areaList" v-show="showSelectList.showBox1" :style="com_zIndex(showSelectList.showBox1)">
        <div class="items" :class="{'isSelect':item.isSelect}" v-for="(item,index) in selectListData.type1" :key="index" @click.stop="selectItem(item, 1)">
          <span class="name">{{item.TradeTypeName}}</span>
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
          <input type="text" class="inputBox rentAvgMin" @input="setNum('rentAvgMin')" v-model="rentAndArea.rentAvgMin" placeholder="最小元/㎡/天">
          <span class="aline">—</span>
          <input type="text" class="inputBox rentAvgMax" @input="setNum('rentAvgMax')" v-model="rentAndArea.rentAvgMax" placeholder="最大元/㎡/天">
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
          <input type="text" class="inputBox areaTotalMin" @input="setNum('areaTotalMin')" v-model="rentAndArea.areaTotalMin" placeholder="最低㎡">
          <span class="aline">—</span>
          <input type="text" class="inputBox areaTotalMax" @input="setNum('areaTotalMax')" v-model="rentAndArea.areaTotalMax" placeholder="最高㎡">
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
      selectListData: {},
      showSelectList: {},
      showMark: false,
      rentAndArea: {
        rentAvgMin: '',
        rentAvgMax: '',
        areaTotalMin: '',
        areaTotalMax: '',
      },
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
    async selectItem (item, type) {
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
          this.selectData.County = item.ID
          break
        case 1:
          this.selectData.TradeType = item.TradeType
          break
        case 2:
          this.selectData.RentAvgMin = item.start
          this.selectData.RentAvgMax = item.end
          this.rentAndArea.rentAvgMin = ''
          this.rentAndArea.rentAvgMax = ''
          break
        case 3:
          this.selectData.AreaTotalMin = item.start
          this.selectData.AreaTotalMax = item.end
          this.rentAndArea.areaTotalMin = ''
          this.rentAndArea.areaTotalMax = ''
          break
      }
      // this.setInputInit()
      this.$emit('selectData', this.selectData)
    },
    setNum (type) {
      let num = this.rentAndArea[type]
      if (num.substr(0, 1) === '.') {
        num = ''
      }
      num = num.replace(/^0*(0\.|[1-9])/, '$1')
      num = num.replace(/[^\d.]/g, '')
      num = num.replace(/\.{2,}/g, '.')
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (num.indexOf('.') < 0 && num !== '') {
        // if (num.substr(0, 1) === '0' && num.length === 2) {
        //   num = num.substr(1, num.length)
        // }
      }
      this.rentAndArea[type] = num
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
    async selectType (item, index) {
      console.log(item)
      if (item.type === 0) {
        await this.getCountryList()
      } else if (item.type === 1) {
        await this.getTradeType()
      }
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
    // 获取区域列表
    async getCountryList () {
      if (this.selectListData.type0.length > 1) {
        return
      }
      let res = await this.$xml('UserCS_InvestmentCountyName', {
        'CityID': this.$parent.cityData.ID
      })
      console.log('getCountryList', res.data)
      if (res.data.length) {
        let list = []
        res.data.forEach(arr => {
          if (arr.CountyName !== '' || arr.ID !== '') {
            arr.isSelect = false
            list.push(arr)
          }
        })
        this.selectListData.type0 = this.selectListData.type0.concat(list)
      }
      return true
    },
    // 获取业态列表
    async getTradeType () {
      if (this.selectListData.type1.length > 1) {
        return
      }
      let res = await this.$xml('UserCS_InvestmentTradeType', {
        'CityID': this.$parent.cityData.ID
      })
      console.log('getTradeType', res)
      if (res.data.length) {
        let list = []
        res.data.forEach(arr => {
          if (arr.TradeType !== '' || arr.TradeTypeName !== '') {
            arr.isSelect = false
            list.push(arr)
          }
        })
        this.selectListData.type1 = this.selectListData.type1.concat(list)
      }
      return true
    },
    // 点击下拉背景
    clickMark () {
      this.showMark = false
      this.setSelectInit()
      let type = -1
      this.typeList.forEach((arr, index) => {
        if (arr.isSelect) {
          type = index
        }
        arr.isSelect = false
      })
      if (type > 1) {
        let isSelct = false
        this.selectListData['type' + type].forEach(arr => {
          if (arr.isSelect) {
            isSelct = true
          }
        })
        if (type === 2) {
          if (isSelct) {
            this.rentAndArea.rentAvgMin = ''
            this.rentAndArea.rentAvgMax = ''
          } else {
            this.rentAndArea.rentAvgMin = this.selectData.RentAvgMin
            this.rentAndArea.rentAvgMax = this.selectData.RentAvgMax
          }
        } else if (type === 3) {
          if (isSelct) {
            this.rentAndArea.areaTotalMin = ''
            this.rentAndArea.areaTotalMax = ''
          } else {
            this.rentAndArea.areaTotalMin = this.selectData.AreaTotalMin
            this.rentAndArea.areaTotalMax = this.selectData.AreaTotalMax
          }
        }
      }
      // this.setInputInit()
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
      if (type === 2 && this.rentAndArea.rentAvgMax !== '' && this.rentAndArea.rentAvgMax - 0 < this.rentAndArea.rentAvgMin - 0) {
        this.$toast('最大值不能小于最小值')
        this.$el.querySelector('.rentAvgMax').focus()
        return
      } else if (type === 3 && this.rentAndArea.areaTotalMax !== '' && this.rentAndArea.areaTotalMax - 0 < this.rentAndArea.areaTotalMin - 0) {
        this.$toast('最高值不能小于最低值')
        this.$el.querySelector('.areaTotalMax').focus()
        return
      }
      this.selectListData['type' + type].forEach(arr => {
        arr.isSelect = false
      })
      this.showSelectList['showBox' + type] = false
      this.showMark = false
      this.typeList[type].isSelect = false
      switch (type) {
        case 2:
          this.selectData.RentAvgMin = this.rentAndArea.rentAvgMin
          this.selectData.RentAvgMax = this.rentAndArea.rentAvgMax
          break
        case 3:
          this.selectData.AreaTotalMin = this.rentAndArea.areaTotalMin
          this.selectData.AreaTotalMax = this.rentAndArea.areaTotalMax
          break
      }
      this.$emit('selectData', this.selectData)
    },
    setInputInit () {
      this.rentAndArea = {
        rentAvgMin: '',
        rentAvgMax: '',
        areaTotalMin: '',
        areaTotalMax: '',
      }
    },
    // 重置数据
    setInitData () {
      this.setInputInit()
      this.setSelectInit()
      this.showMark = false,
      this.selectListData = {
        type0: [
          {CountyName: '不限', ID: '', isSelect: true}
        ],
        type1: [
          {TradeTypeName: '不限', TradeType: '', isSelect: true}
        ],
        type2: [
          {name: '不限', start: '', end: '', isSelect: true},
          {name: '0-5元/㎡/天', start: '0', end: '5', isSelect: false},
          {name: '5-10元/㎡/天', start: '5', end: '10', isSelect: false},
          {name: '10-15元/㎡/天', start: '10', end: '15', isSelect: false},
          {name: '15元/㎡/天以上', start: '15', end: '', isSelect: false}
        ],
        type3: [
          {name: '不限', start: '', end: '', isSelect: true},
          {name: '5000㎡以下', start: '0', end: '5000', isSelect: false},
          {name: '5000㎡-10000㎡', start: '5000', end: '10000', isSelect: false},
          {name: '10000㎡-30000㎡', start: '10000', end: '30000', isSelect: false},
          {name: '30000㎡-50000㎡', start: '30000', end: '50000', isSelect: false}
        ]
      }
      this.typeList.forEach(arr => {
        arr.isSelect = false
      })
    }
  },
  created () {
    this.setInitData()
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
          width: 1.7rem;
          height: .58rem;
          margin: 0 .1rem;
          font-size: .28rem;
          color: #333;
          border: 1px solid #DDDEE3;
          border-radius: 3px;
          text-align: center;
          &::placeholder{
            font-size: 12px;
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
