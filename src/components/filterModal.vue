<template>
  <div class="filter_wrap">
    <transition name="fade">
      <div  v-show="value" class="filter_mask" @click="$emit('input', false)"></div>
    </transition>
    <transition name="filter">
      <div  v-show="value" class="filter_modal">
        <div class="page">
            <div class="page_bd">
              <slot></slot>
            </div>
            <transition name="filter">
              <div v-if="isList" class="page_modal">
                <div class="page">
                  <div class="page_hd">
                    <a @click.stop="radioBack" href="javascript:void(0)">
                      <i class="iconfont icon-fanhui1 icon" ></i>
                     <span>返回</span>
                    </a>
                  </div>
                  <div class="page_bd">
                    <div class="weui-cells weui-cells_radio" style="margin-top:0;">
                      <label v-for="(item, index) in list" :key="index" class="weui-cell weui-check__label" :for="'x_123'+item.value">
                        <div class="weui-cell__bd">
                            <p>{{item.name}}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <input type="radio" v-model="radio" @change="radioChange(item)" :value="item.value" class="weui-check" name="radio1" :id="'x_123'+item.value">
                            <span class="weui-icon-checked"></span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
          </transition>
          <transition name="filter">
            <div v-if="isCheckList" class="page_modal">
              <div class="page">
                <div class="page_hd">
                  <a @click.stop="checkBack" href="javascript:void(0)">
                    <i class="iconfont icon-fanhui1 icon" ></i>
                    <span>返回</span>
                  </a>
                </div>
                <div class="page_bd">
                  <!-- <i>iconfont icon-Ellipse</i> -->
                  <div class="light_bg">
                    <ul>
                      <li @click="checkboxClick(item)" style="padding: 10px 15px;" class="border-top-half border-padding-left" v-for="(item, index) in list" :key="index" >
                        <div  class="fs16 check_item weui-flex">
                          <div class="weui-flex__item">{{item.name}}</div>
                          <div ><i style="font-size: 20px;line-height: 1;" :class="item.checked? 'icon-select-copy main_color' :'icon-Ellipse dark_99'" class="fs16 iconfont icon-Ellipse"></i></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div class="page_ft weui-flex">
            <button class="filter_btn weui-flex__item filter_cancel_btn">重置</button>
            <button @click="confirm" class="filter_btn weui-flex__item  filter_ok_btn">确定</button>
          </div>
        </div>
      </div>
    </transition>
    <mt-datetime-picker  @confirm="dateConfirm" ref="picker" type="date" v-model="pickerValue" year-format="{value} 年"  month-format="{value} 月"  date-format="{value} 日" ></mt-datetime-picker>
  </div>
</template>
<script>
export default {
  name: 'filterModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isList: false,
      isCheckList: false,
      list: [],
      radio: '',
      checkbox: [],
      pickerValue: new Date(),
      dateValue: ''
    }
  },
  created () {
    this.copyForm = JSON.parse(JSON.stringify(this.form))
    console.log(this.copyForm)
  },
  watch: {
    value (val, old) {
      if (val) {
        this.isList = false
        this.isCheckList = false
        this.triggerFilterItem()
      }
    }
  },
  methods: {
    // 触发子组件同事设置 传入的值
    triggerFilterItem () {
      this.$children.forEach(item => {
        item.activeFilter && item.activeFilter()
      })
    },
    // 单个日期处理
    dateOpen (name, date) {
      this.tmpName = name
      this.datetype = 'only'
      if (date) {
        this.pickerValue = date
      }
      this.$refs.picker.open()
    },
    // 日期确认
    dateConfirm (date) {
      let form = {...this.form}
      if (this.datetype === 'only') {
        form[this.tmpName] = date.format('yyyy-MM-dd')
      }
      if (this.datetype === 'start') {
        let dateArr = form[this.tmpName].split(',')
        dateArr[0] = date.format('yyyy-MM-dd')
        if (!dateArr[1]) {
          dateArr.push('')
        }
        form[this.tmpName] = dateArr.join(',')
      }
      if (this.datetype === 'end') {
        let dateArr = form[this.tmpName].split(',')
        if (dateArr.length === 2) {
          dateArr[1] = date.format('yyyy-MM-dd')
        } else {
          dateArr = ['', date.format('yyyy-MM-dd')]
        }
        form[this.tmpName] = dateArr.join(',')
      }
      this.$emit('update:form', form)
    },
    // 开始日期处理
    dateStartOpen (name, date) {
      this.tmpName = name
      this.datetype = 'start'
      if (date) {
        this.pickerValue = date
      }
      this.$refs.picker.open()
    },
    // 结束日期处理
    dateEndOpen (name, date) {
      this.tmpName = name
      this.datetype = 'end'
      if (date) {
        this.pickerValue = date
      }
      this.$refs.picker.open()
    },
    setList (name, list, index) {
      this.tmpName = name
      this.isList = true
      this.list = list
      this.radio = list[index].value
    },
    radioBack () {
      this.isList = false
      this.isCheckList = false
    },
    radioChange () {
      let form = {...this.form}
      form[this.tmpName] = this.radio
      this.$emit('update:form', form)
      this.isList = false
    },
    setCheckList (name, list, index) {
      this.tmpName = name
      this.isCheckList = true
      this.list = list
    },
    // 多选框返回
    checkBack () {
      this.isCheckList = false
      let form = {...this.form}
      let res = this.list.reduce((before, item) => {
        if (item.checked && item.value !== 'all') {
          before.push(item.value)
        }
        return before
      }, [])
      form[this.tmpName] = res.join(',')
      this.$emit('update:form', form)
    },
    // 点击多选框
    checkboxClick (item) {
      if (item.value === 'all') {
        if (item.checked) {
          this.list.forEach(item => {
            item.checked = false
          })
        } else {
          this.list.forEach(item => {
            item.checked = true
          })
        }
      } if (item.value === '') {
        if (!item.checked) {
          this.list.forEach(item => {
            item.checked = false
          })
          item.checked = true
        }
      } else {
        if (this.list.some(item => item.value === '')) {
          let emptyItem = this.list.find(item => item.value === '')
          emptyItem.checked = false
        }
        item.checked = !item.checked
      }
    },
    // 验证所有子组件是否合法
    validatesItem () {
      let errorMsg = ''
      if (this.$children.some(item => {
        if (item.validateFilterItem) {
          errorMsg = item.validateFilterItem()
          return !!errorMsg
        } else {
          return false
        }
      })) {
        console.log(errorMsg)
        this.$toast(errorMsg)
        return false
      } else {
        return true
      }
    },
    confirm () {
      if (this.validatesItem()) {
        this.$emit('submit', this.form)
        this.$emit('input', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter_wrap {

  & .filter_mask {
    position: absolute;
    top:40px;
    right: 0;
    left: 0;
    bottom: 0;
     z-index: 2;
    background: rgba(0, 0, 0, 0.35);
  }
  & .filter_modal {
    position: absolute;
    top: 40px;
    right: 0;
    bottom: 0;
    z-index: 2;
    height: calc(100% - 40px);
    background:#FFF;
    width:80%;
  }
}
.filter-enter-active, .filter-leave-active {
  transform: translate3d(0,0,0);
  transition: transform .3s cubic-bezier(.36,.66,.04,1);
}
.filter-enter, .filter-leave-to {
  transform: translate3d(100%, 0, 0)
}
.filter_btn  {
  display:block;
}
.filter_ok_btn {
  background:#3395FF;
  color:#FFF;
}
</style>
