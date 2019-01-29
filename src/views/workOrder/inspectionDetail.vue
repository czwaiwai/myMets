<template>
  <div class="page_modal">
    <div class="page">
        <mt-header title="巡检详情">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>
        <div class="page_bd">

          <div class="light_bg padding-v padding15-h margin-bottom">
            <p><span class="dark_99">工 单 号：</span><span>{{work.WorkOrdNo}}</span></p>
            <p><span class="dark_99">开始日期：</span><span>{{work.PlanStartTime}}</span></p>
            <p><span class="dark_99">负 责 人：</span><span>{{work.Principal}}</span></p>
          </div>

          <div class="light_bg">
            <ul>
              <li v-for="(item, index) in list" :key="index" style="border-bottom:1px solid #e3e3e3;">
                <div class="weui-flex padding15-h padding-v  relative">
                  <div class="weui-flex__item">
                    <p>{{item.EquiName}}</p>
                    <p class="dark_99 fs13"><i class="iconfont icon-weizhi-tianchong"></i>{{item.InstallationSite}}</p>
                  </div>
                  <div class="ft item_center direct_icon " :class="item.show?'weui_icon_download':''" @click="item.show = !item.show">
                    <i class="iconfont  icon-shouqi" ></i>
                  </div>
                  <button v-if="work.WorkState === '2'" class="photo_btn" @click="toPhoto(item)">
                    <span v-if="item.ImageExsit === '0'"><i class="iconfont icon-paizhao"></i>拍照</span>
                    <span v-if="item.ImageExsit === '1'">查看照片</span>
                  </button>
                </div>
                <div v-show="item.show" class="sub_item_content">
                  <ul v-if="work.WorkState === '2'"  class="sub_ul_opera ">
                    <li  v-for="(sub, key) in item.OptionsInfo" :key="key" class="border-top-half padding-v padding15-h">
                       <div>{{sub.StepsName}} <span v-if="sub.IsInput === 'True'">(正常值: {{sub.ValueMin}}~{{sub.ValueMax}}{{sub.ValueUnit}})</span></div>
                       <div class="weui-flex">
                         <div class="weui-flex__item">
                            <ins-number  v-if="sub.IsInput === 'True'" v-model="sub.InputResult" :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                            <ins-radio v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" :option-str="sub.OptionsInfo" ></ins-radio>
                         </div>
                         <a @click="remarkHandle(sub,item)" v-show="!sub.FeedContent" class="fs14 remark_color">反馈</a>
                       </div>
                       <p @click="remarkHandle(sub,item)" class="remark_color" v-show="sub.FeedContent">{{sub.FeedContent}}</p>
                    </li>
                  </ul>
                  <ul v-else class="sub_ul_show ">
                    <li v-for="(sub, key) in item.OptionsInfo" :key="key" class="border-top-half padding-v padding15-h">
                      <div>{{sub.StepsName}} <span v-if="sub.IsInput === 'True'">(正常值: {{sub.ValueMin}}~{{sub.ValueMax}}{{sub.ValueUnit}})</span></div>
                      <!-- 数值类型显示 -->
                      <ins-number :readonly="true" v-if="sub.IsInput === 'True'" v-model="sub.InputResult" :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                      <!-- 选项内容展示 --><ins-radio :readonly="true" v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" :option-str="sub.OptionsInfo" ></ins-radio>
                      <p>{{sub.FeedContent}}</p>
                    </li>
                  </ul>
                </div>
                <div v-show="item.show" class="sub_item_ft text-center " >
                    <a href="javascript:void(0)" style="display:block;" class="main_color padding5 block">立即报修</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="work.WorkState === '2'"  class="page_ft text-center light_bg padding-top5 padding15-h">
          <button @click="submitIns" class="ins_submit_btn">提交巡检</button>
        </div>
        <div v-if="work.WorkState === '3'"  class="page_ft text-center light_bg padding-top5 padding15-h">
          <button @click="closeIns" class="ins_submit_btn">关闭巡检</button>
        </div>
        <transition name="page">
          <router-view/>
        </transition>
    </div>
  </div>
</template>
<script>
import InsRadio from './child/insRadio'
import InsNumber from './child/insNumber'
export default {
  name: 'inspectionDetail',
  data () {
    return {
      test: '通过',
      test1: '不通过',
      work: {},
      detailItem: {},
      list: []
    }
  },
  components: {
    InsRadio,
    InsNumber
  },
  created () {
    this.nav = this.$parent.nav
    this.currNav = this.$parent.currNav
    this.work = this.$parent.workItem
    this.getPageData()
  },
  methods: {
    async getPageData () {
      let res = await this.$http.post('/ets/table/list/equipBaseGetInspectionEquipmentH5', {
        projId: this.nav.orgId,
        workID: this.work.WorkID,
        caseID: this.work.CaseID,
        isCase: this.work.IsCase
      })
      let list = res.data
      list.forEach((item, index) => {
        item.show = false
        if (index === 0) {
          item.show = true
        }
        item.OptionsInfo.forEach(sub => {
          if (sub.IsInput === 'True') {
            sub.InputResult = sub.InputResult || sub.ValueMin
          } else {
            sub.InputResult = sub.InputResult || sub.StandardOptions
          }
        })
      })
      this.list = list
      console.log(res)
    },
    toPhoto (item) {
      this.detailItem = item
      this.$router.push({path: this.$route.path + '/photo', params: {type: 'ins'}})
    },
    // 数值类型显示颜色
    fnIsNumNormal (item) {
      if (item.IsInput !== 'False') {
        let min = parseFloat(item.ValueMin)
        let max = parseFloat(item.ValueMax)
        let num = parseFloat(item.InputResult)
        if (num < min || num > max) {
          return 'wrong_text_color'
        } else {
          return 'right_text_color'
        }
      }
    },
    // 反馈
    async remarkHandle (sub, item) {
      let {value, action} = await this.$message.prompt(' ', {title: '反馈内容', inputPlaceholder: '请输入反馈内容', inputValue: sub.FeedContent})
      if (action === 'confirm') {
        sub.FeedContent = value
      }
    },
    // 提交参数生成
    getSubmitParams () {
      let params = {
        billId: this.work.WorkID,
        wordType: this.work.WordType,
        workState: this.work.WorkState,
        opUserId: this.nav.memberId,
        listStr: ''
      }
      let arr = []
      this.list.forEach(item => {
        let obj = {
          EAID: item.EquiID,
          EAInfo: []
        }
        item.OptionsInfo.forEach(sub => {
          obj.EAInfo.push({
            CheckOptionsName: sub.CheckOptionsName,
            FeedBackID: sub.FeedBackID,
            InputResult: sub.InputResult,
            FeedContent: sub.FeedContent,
            StandardOptions: sub.StandardOptions,
            IsInput: sub.IsInput,
            ValueMin: sub.ValueMin,
            ValueMax: sub.ValueMax
          })
        })
        arr.push(obj)
      })
      params.listStr = JSON.stringify(arr)
      return params
    },
    // 提交巡检
    async submitIns () {
      let url = '/ets/syswin/smd/equipBaseSaveBackWork'
      await this.$message.confirm('确定提交吗?')
      let res = await this.$http.post(url, this.getSubmitParams())
      console.log(res)
      // setTimeout(function() {
      //     _this.closePage();
      //     T.AllData.callbackList.data = _this.detailDatas.WorkID + _this.detailDatas.WorkState;
      // }, 1600);
      // _this.removeStorage(_this.detailDatas.WorkID);
      this.$toast('提交巡检成功')
      // 返回主页面
      this.$root.back()
      // 刷新父页面的值
      this.$parent.refresh()
    },
    // 关闭巡检
    async closeIns () {
      let url = '/ets/syswin/smd/equipBaseWorkCompletionColse'
      await this.$message.confirm('确定要关闭吗?')
      let res = await this.$http.post(url, {
        wordId: this.work.WorkID,
        wordType: this.work.WordType,
        workState: this.work.WorkState,
        opUserId: this.nav.memberId
      })
      //  setTimeout(function() {
      //     _this.closePage();
      //     T.AllData.callbackList.data = _this.detailDatas.WorkID + _this.detailDatas.WorkState;
      //   }, 1600);
      console.log(res)
      this.$toast('关闭巡检成功')
      // 返回主页面
      this.$root.back()
      // 刷新父页面的值
      this.$parent.refresh()
    }
  }
}
</script>

<style lang="scss">
.right_text_color {
  color:#0dc88c;
}
.wrong_text_color {
  color: #f00404;
}
.remark_color {
  color:#fa8a2c;
}
.sub_item_content {
  background:#f8f8f8;
}
.sub_ul_show {
  display:block;
}
.photo_btn {
    border: 1px solid #3395FF;
    border-radius: 5px;
    position: absolute;
    right: 50px;
    height: 35px;
    width: 78px;
    top: 13px;
}
.ins_submit_btn {
  height:35px;
  display:block;
  color:#FFF;
  width:100%;
  border-radius:5px;
  background:#3395FF;
}
.direct_icon.weui_icon_download {
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
}
.direct_icon {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
    -webkit-transition: -webkit-transform 0.2s linear;
    transition: -webkit-transform 0.2s linear;
    transition: transform 0.2s linear;
    transition: transform 0.2s linear, -webkit-transform 0.2s linear;
}
</style>
