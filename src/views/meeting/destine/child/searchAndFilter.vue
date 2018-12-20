<template>
<div >
  <div class="searchBox clearfix">
    <form @submit.prevent class="searchWrap clearfix" >
        <i class="iconfont icon-sousuo icon"></i>
        <input class="search-input" placeholder="请输入会议室名称或所在位置" type="search" v-model="searchKey" @keydown.13="selectListConfirm">
        <i class="iconfont icon-quxiao1" v-show="searchKey.length" @click.stop="clearKey"></i>
    </form>
    <i class="iconfont icon-shaixuan" @click.stop="setDialogShow"></i>
  </div>
  <transition name="_dialog">
    <div class="_dialog" v-if="dialogShow">
      <div class="mark" @click.stop="closeDialog"></div>
      <div class="_d-content">
        <ul class="_d-list">
          <li class="_d-items" v-for="(item,index) in typeList" v-show="!item.isHide" :key="index">
            <template v-if="!item.isHide">
              <div class="title" >
                <span class="name">{{item.name}}</span>
                <span class="status clearfix" @click.stop="clickSelect(item)">
                  <span class="status-title">
                    <span v-for="(it,i) in item.selectType" :key="i">{{it.showText}}<span v-show="i!=item.selectType.length-1">、</span></span>
                  </span>
                  <i class="iconfont icon" :class="item.isSelect?'icon-zhankai1':'icon-zhankai'"></i>
                </span>
              </div>
              <transition name="_d-box">
                <div class="_d-box clearfix" v-show="item.isSelect">
                  <span class="_d-btns" :class="{'isSelect':it.isSelect}" @click.stop="selectType(item,it)" v-for="(it,i) in item.list" :key="i">{{it.showText}}</span>
                </div>
              </transition>
            </template>
          </li>
        </ul>
        <div class="_d-footer clearfix">
          <div class="btn" @click.stop="selectListRest">重置</div>
          <div class="btn" @click.stop="selectListConfirm">确定</div>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
import { Indicator } from 'mint-ui'
export default {
  name: 'detail',
  props: {
    orgId: String,
    filterObj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      dialogShow: false,
      typeList: [],
      isFirst: true,
      searchKey: ''
    }
  },
  created () {
    this.setInitType()
  },
  computed: {
  },
  methods: {
    // 还原数据到默认状态
    reset () {
      this.setInitType()
    },
    // 更新filter
    updateFilter () {
      let obj = {...this.filterObj}
      this.searchKey = obj.MeetName
      if (obj.CapacityMin && obj.CapacityMax) {
        obj.Capacity = obj.CapacityMin + '-' + obj.CapacityMax
      } else {
        obj.Capacity = ''
      }
      this.setAsyncSingle(obj)
      this.setAsyncMutil()
    },
    setAsyncSingle (filterObj) {
      this.typeList.forEach(item => {
        let value = filterObj[item.nameEn]
        if (value && item.isSingle) {
          if (item.isAsync && item.list.length === 1) {
            this.getSelectList(item).then(res => {
              item.list.forEach(sub => {
                sub.isSelect = sub.value === value
              })
              item.selectType = item.list.filter(item => item.isSelect)
              item.initType = [...item.selectType]
            })
          } else {
            item.list.forEach(sub => {
              sub.isSelect = sub.value === value
            })
            item.selectType = item.list.filter(item => item.isSelect)
            item.initType = [...item.selectType]
          }
        }
      })
    },
    setAsyncMutil () {
      let value = this.filterObj.MaterialName
      let select = this.typeList.find(item => item.nameEn === 'MaterialName')
      if (value && select.list.length === 1) {
        this.getSelectList(select).then(res => {
          select.list.forEach(item => {
            if (value.split(',').indexOf(item.value) > -1) {
              item.isSelect = true
            } else {
              item.isSelect = false
            }
          })
          select.selectType = select.list.filter(item => item.isSelect)
          select.initType = [...select.selectType]
        })
      } else {
        select.list.forEach(item => {
          if (value.split(',').indexOf(item.value) > -1) {
            item.isSelect = true
          } else {
            item.isSelect = false
          }
        })
        select.selectType = select.list.filter(item => item.isSelect)
        select.initType = [...select.selectType]
      }
    },

    clearKey () {
      this.searchKey = ''
      this.selectListConfirm()
    },
    // 打开筛选器
    setDialogShow () {
      this.typeList.forEach(arr => {
        if (arr.type < 3) {
          arr.isSelect = true
        } else {
          arr.isSelect = false
        }
      })
      // 获取类型下拉列表
      this.getSelectList(this.typeList[0])
      this.dialogShow = true
      if (!this.isFirst) {
        this.updateFilter()
      }
      this.isFirst = false
    },
    // 关闭筛选
    closeDialog () {
      this.dialogShow = false
      // this.typeList.forEach(arr => {
      //   arr.selectType = arr.initType
      //   // arr.isSelect = false
      //   arr.list.forEach(ar => {
      //     let index = arr.selectType.findIndex(item => {
      //       return item.value === ar.value
      //     })
      //     if (index > -1) {
      //       ar.isSelect = true
      //     } else {}
      //     // arr.selectType.forEach(a => {
      //     //   if (a.id === ar.id) {
      //     //     a.isSelect = true
      //     //   } else {
      //     //     a.isSelect = false
      //     //   }
      //     // })
      //   })
      // })
      // console.log(this.typeList, 'closeDialog')
    },
    // 重置筛选
    selectListRest () {
      this.typeList.forEach(arr => {
        let list = []
        list.push(arr.list[0])
        arr.selectType = list
        arr.list.forEach((a, index) => {
          if (index === 0) {
            a.isSelect = true
          } else {
            a.isSelect = false
          }
        })
      })
    },
    // 确定筛选条件
    selectListConfirm () {
      let obj = {
        MeetName: this.searchKey
      }
      this.typeList.forEach(arr => {
        arr.initType = arr.selectType
        if (!arr.nameEn) return
        if (arr.isSingle) {
          if (arr.nameEn === 'Capacity') {
            let tmp = arr.selectType[0].value.split('-')
            if (tmp && tmp.length === 2) {
              obj['CapacityMin'] = tmp[0]
              obj['CapacityMax'] = tmp[1]
            } else {
              obj['CapacityMin'] = ''
              obj['CapacityMax'] = ''
            }
          } else {
            obj[arr.nameEn] = arr.selectType[0].value
          }
        } else {
          obj[arr.nameEn] = arr.selectType.map(item => item.value).join(',')
        }
      })
      this.$emit('filter', obj)
      this.dialogShow = false
    },
    // 点选筛选类型
    selectType (item, it) {
      if (item.type === 4) {
        this.setType4Status(item, it)
        return
      }
      if (it.isSelect) {
        return
      }
      let list = []
      list.push(it)
      this.typeList[item.type].selectType = list
      this.typeList[item.type].list.forEach(arr => {
        arr.isSelect = false
      })
      it.isSelect = true
    },
    // 第四种类型允许多选
    setType4Status (item, it) {
      if (it.isSelect && item.selectType.length === 1) {
        return
      }
      let list = []
      // 点选不限项
      if (it.id === '') {
        item.list.forEach((arr, index) => {
          if (index === 0) {
            arr.isSelect = true
            list.push(arr)
          } else {
            arr.isSelect = false
          }
        })
        item.selectType = list
        return
      }
      // 点选/反选其它
      if (item.list[0].isSelect) {
        item.list[0].isSelect = false
        item.selectType.splice(0, 1)
      }
      if (it.isSelect) {
        it.isSelect = false
        let num = 0
        item.selectType.forEach((arr, index) => {
          if (arr.id === it.id) {
            num = index
          }
        })
        item.selectType.splice(num, 1)
      } else {
        it.isSelect = true
        item.selectType.push(it)
      }
    },
    // 点击筛选展开收起按钮
    async clickSelect (item) {
      if (item.isSelect) {
        item.isSelect = false
        return
      }
      item.isSelect = true
      if (item.type === 1 || item.type === 2) {
        return
      }
      this.getSelectList(item)
    },
    // 获取筛选下拉列表
    async getSelectList (item) {
      if (item.list.length > 1) {
        return
      }
      Indicator.open({spinnerType: 'fading-circle'})
      let params = {}
      let httpUrl = ''
      switch (item.type) {
        case 0: params = {'TypeName': 'MeetType'}; httpUrl = 'UserRent_GetOptionList'
          break
        case 3: params = {'OrgID': this.orgId || '11091315263400010000'}; httpUrl = 'UserCS_MeetingFloor'
          break
        case 4: params = {'OrgID': this.orgId || '11091315263400010000'}; httpUrl = 'UserCS_MeetingEquipMatching'
          break
      }
      let res = await this.$xml(httpUrl, params)
      let arr = []
      let list = []
      arr.push(this.typeList[item.type].list[0])
      if (item.type === 0) {
        res.data.forEach((arr, index) => {
          let obj = {
            showText: arr.showText, id: index + 1, value: arr.value, isSelect: false
          }
          list.push(obj)
        })
      } else if (item.type === 3) {
        res.data.forEach((arr, index) => {
          let obj = {
            showText: arr.Floor + '楼', id: index + 1, value: arr.Floor, isSelect: false
          }
          list.push(obj)
        })
      } else if (item.type === 4) {
        res.data.forEach((arr, index) => {
          let obj = {
            showText: arr.MaterialsnName, value: arr.MaterialsnName, id: index + 1, isSelect: false // value: arr.Specification,
          }
          list.push(obj)
        })
      }
      this.typeList[item.type].list = arr.concat(list)
      Indicator.close()
      item.isSelect = true
    },
    // 设置筛选初始值
    setInitType () {
      this.typeList = [
        {
          type: 0,
          name: '类型',
          nameEn: 'MeetType',
          isSingle: true, // 单选
          isSelect: false,
          isAsync: true, // 是否是异步
          selectType: [{showText: '不限', id: '', value: ''}],
          initType: [{showText: '不限', id: '', value: ''}],
          list: [{showText: '不限', id: '', value: '', isSelect: true}]
        },
        {
          type: 1,
          name: '空闲',
          nameEn: '',
          isHide: true,
          isSingle: true, // 单选
          isSelect: true,
          isAsync: false, // 是否是异步
          selectType: [{showText: '不限', id: '', value: ''}],
          initType: [{showText: '不限', id: '', value: ''}],
          list: [
            {showText: '不限', id: '', value: '', isSelect: true},
            {showText: '半小时', id: '1', value: '1', isSelect: false},
            {showText: '1小时', id: '2', value: '2', isSelect: false},
            {showText: '2小时', id: '3', value: '3', isSelect: false},
            {showText: '3-4小时', id: '4', value: '4', isSelect: false},
            {showText: '全天', id: '5', value: '5', isSelect: false}
          ]
        },
        {
          type: 2,
          name: '大小',
          nameEn: 'Capacity',
          isSingle: true, // 单选
          isSelect: true,
          isAsync: false, // 是否是异步
          selectType: [{showText: '不限', id: '', value: ''}],
          initType: [{showText: '不限', id: '', value: ''}],
          list: [
            {showText: '不限', id: '', value: '', isSelect: true},
            {showText: '2-5人', id: '1', value: '2-5', isSelect: false},
            {showText: '6-10人', id: '2', value: '6-10', isSelect: false},
            {showText: '11-30人', id: '3', value: '11-30', isSelect: false},
            {showText: '31-50人', id: '4', value: '31-50', isSelect: false},
            {showText: '50人以上', id: '5', value: '50-999', isSelect: false}
          ]
        },
        {
          type: 3,
          name: '楼层',
          nameEn: 'Floor',
          isSingle: true, // 单选
          isSelect: false,
          isAsync: true, // 是否是异步
          selectType: [{showText: '不限', floor: '', value: ''}],
          initType: [{showText: '不限', id: '', value: ''}],
          list: [
            {showText: '不限', id: '', value: '', isSelect: true}
          ]
        },
        {
          type: 4,
          name: '设备',
          nameEn: 'MaterialName',
          isSingle: false, // 单选
          isSelect: false,
          isAsync: true, // 是否是异步
          selectType: [{showText: '不限', id: '', value: ''}],
          initType: [{showText: '不限', id: '', value: ''}],
          list: [
            {showText: '不限', id: '', value: '', isSelect: true}
          ]
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.searchBox{
  position: relative;
  width: 100vw;
  height: 1.06rem;
  padding: .2rem .3rem;
  border-bottom: 1px solid #ededed;
  .searchWrap {
    float: left;
    width: 6.08rem;
    height: 0.68rem;
    background: #fff;
    border-radius: 0.2rem;
    line-height: 0.68rem;
    .icon {
      float: left;
      width: 0.68rem;
      height: 0.68rem;
      padding: 0 .1rem;
      line-height: 0.68rem;
      font-size: .34rem;
      text-align: right;
      color: #999;
    }
    .search-input{
      float: left;
      width: 4.4rem;
      height: 0.68rem;
      // line-height: 0.68rem;
      color: #333;
      font-size: 0.28rem;
      &::-webkit-input-placeholder {
        color: #999;
      }
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
    .icon-input_clear {
      float: right;
      width: 0.48rem;
      height: 0.68rem;
      margin-right: 0.2rem;
      line-height: 0.68rem;
      font-size: 0.4rem;
      text-align: right;
      color: #999;
    }
  }
  .icon-shaixuan {
    float: left;
    width: 0.68rem;
    height: 0.68rem;
    margin-left: 0.14rem;
    font-size: 0.6rem;
    line-height: 0.68rem;
    text-align: right;
    color: #0dc88c;
  }
}
._dialog-enter-active, ._dialog-leave-active {
  transition: opacity .5s;
  -webkit-transform: opacity .5s;
}
._dialog-enter, ._dialog-leave-active {
  opacity: 0
}
._dialog{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 999;
  .mark{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 9;
    background: #000;
    opacity: .5;
  }
  ._d-content{
    position: absolute;
    top: 0;
    right: 0;
    width: 5.76rem;
    height: 100vh;
    background: #fff;
    z-index: 11;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    ._d-list{
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      height: 100%;
      padding-left: .3rem;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-transform: translateZ(0px);
      transform: translate(0px);
      ._d-items{
        padding-top: .2rem;
        padding-bottom: .2rem;
        border-bottom: 1px solid #ededed;
        &:last-child{
          border-bottom: none;
        }
        .title{
          position: relative;
          height: .44rem;
          line-height: .44rem;
          font-size: .28rem;
          color: #777E8C;
          .status{
            position: absolute;
            right: .3rem;
            top: 0;
            display: block;
            .status-title{
              float: left;
              max-width: 4rem;
              height: .44rem;
              line-height: .44rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: .28rem;
              color: #0DC88C;
            }
            .icon{
              float: left;
              width: .4rem;
              height: .44rem;
              line-height: .44rem;
              font-size: .34rem;
              color: #999;
            }
          }
        }
        ._d-box{
          padding-bottom: .2rem;
          ._d-btns{
            float: left;
            width: 1.58rem;
            height: .56rem;
            font-size: .24rem;
            color: #333;
            text-align: center;
            background: #F2F2F4;
            border-radius: .28rem;
            margin-right: .2rem;
            margin-top: .2rem;
            line-height: .56rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &.isSelect{
              color: #0DC88C;
              border: 1px solid #0DC88C;
              background: #F1FEFA;
              box-sizing: border-box;
            }
          }
        }
      }
    }
    ._d-footer{
      height: 1rem;
      width: 5.76rem;
      border-top: 1px solid #ededed;
      .btn{
        float: left;
        width: 2.88rem;
        height: 1rem;
        line-height: 1rem;
        font-size: .34rem;
        color: #7E7D7D;
        text-align: center;
        &:last-child{
          color: #fff;
          background: #0DC88C;
        }
      }
    }
  }
}
</style>
