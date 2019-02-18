<template>
  <div class="page_modal">
    <div class="page">
        <mt-header :title="typeTxt+'详情'">
            <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
        </mt-header>

        <div ref="pageBD" class="page_bd">
          <search v-model="searchKey" placeholder="扫码或输设备号、设备名" :noFocus="true" @searchRes="searchRes">
             <i slot="icon" @click="scanHandle" class="weui-icon-search iconfont icon-scancode"></i>
          </search>
          <div class="light_bg padding-v padding15-h margin-bottom">
            <p><span class="dark_99">工 单 号：</span><span>{{work.WorkOrdNo}}</span></p>
            <p><span class="dark_99">开始日期：</span><span>{{work.PlanStartTime}}</span></p>
            <p><span class="dark_99">负 责 人：</span><span>{{work.Principal}}</span></p>
          </div>
          <section :id="'ins_' + insItem.AddressID" v-for="(insItem, index) in filterList" :key="index">
            <div v-if="work.IsCase === '1'" class="ins_title main_color padding-left15 padding-bottom5 padding-top5">
              <i class="iconfont icon-zhilupai"></i><span>{{insItem.AddressName}}</span>
            </div>
            <div class="light_bg">
              <ul>
                <li v-for="(item, index) in insItem.EquiInfo" :key="index"  v-show="item.searchShow" style="border-bottom:1px solid #e3e3e3;">
                  <div class="weui-flex padding15-h padding-v  relative">
                    <div class="weui-flex__item">
                      <p>{{item.EquiName}}</p>
                      <p class="dark_99 fs13"><i class="iconfont icon-weizhi-tianchong"></i>{{item.InstallationSite}}</p>
                    </div>
                    <div class="ft item_center direct_icon " :class="item.show?'weui_icon_download':''" @click="detailShowHandle(item)">
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
                              <ins-number  v-if="sub.IsInput === 'True'" v-model="sub.InputResult" @input="optionChange" :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                              <ins-radio v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" @input="optionChange" :option-str="sub.OptionsInfo" ></ins-radio>
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
                        <ins-number :readonly="true" v-if="sub.IsInput === 'True'" v-model="sub.InputResult"  :min="sub.ValueMin" :max="sub.ValueMax" :unit="sub.ValueUnit" ></ins-number>
                        <!-- 选项内容展示 --><ins-radio :readonly="true" v-else v-model="sub.InputResult" :default-val="sub.StandardOptions" :option-str="sub.OptionsInfo" ></ins-radio>
                        <p>{{sub.FeedContent}}</p>
                      </li>
                    </ul>
                  </div>
                  <div @click="routeToFix(item)" v-show="item.show && work.WorkState === '2'" class="sub_item_ft text-center " >
                      <a href="javascript:void(0)" style="display:block;" class="main_color padding5 block">立即报修</a>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <div v-if="work.WorkState === '2'"  class="page_ft text-center light_bg padding-top5 padding15-h">
          <button @click="submitIns" class="ins_submit_btn">提交{{typeTxt}}</button>
        </div>
        <div v-if="work.WorkState === '3'"  class="page_ft text-center light_bg padding-top5 padding15-h">
          <button @click="closeIns" class="ins_submit_btn">关闭{{typeTxt}}</button>
        </div>
        <transition name="page">
          <router-view/>
        </transition>
        <div v-if="work.IsCase === '1'" class="ins_aside" @click="asideShow = true"><i class="iconfont icon-qiehuan"></i></div>
        <transition name="fade">
          <div v-if="asideShow" @click="asideShow = false" class="ins_aside_mask">
            <div @click.stop style="height: calc(100% - 40px);margin-top: 40px;width: 75%;margin-left: 25%;background: #FFF;">
              <ul class="ins_aside_ul">
                <li @click="scrollTo(item)" v-for="(item, index) in filterList" :key="index">
                  <span>
                    <i v-if="index===0" class="iconfont icon-youxuanluxian"></i>
                    <i v-else-if="index === (insList.length-1)" class="iconfont icon-zhongdian"></i>
                    <i v-else class="iconfont icon-weizhi"></i>
                  </span>
                  <p>{{item.AddressName}}</p>
                </li>
              </ul>
            </div>
          </div>
        </transition>
    </div>
  </div>
</template>
<script>
import Search from '@/components/search'
import InsRadio from './child/insRadio'
import InsNumber from './child/insNumber'
import {mapGetters} from 'Vuex'
import local from '@/utils/local'
export default {
  name: 'inspectionDetail',
  data () {
    return {
      typeTxt: '巡检',
      test: '通过',
      test1: '不通过',
      searchKey: '',
      work: {},
      asideShow: false,
      detailItem: {},
      insList: [],
      list: []
    }
  },
  components: {
    Search,
    InsRadio,
    InsNumber
  },
  created () {
    this.nav = this.$parent.nav || {
      orgId: this.user.OrgID,
      orgName: this.user.OrgName,
      userName: this.user.UserID,
      memberId: this.user.memberId
    }
    this.currNav = this.$parent.currNav
    this.work = this.$parent.workItem

    console.log(this.work, this.$route.params, 'work------')
    // 缓存
    if (!this.work.WorkID) {
      this.work = local.get('inspection_work_' + this.$route.params.workId)
    }
    if (this.work.WorkState === '2') {
      local.set('inspection_work_' + this.work.WorkID, this.work)
    }
    this.typeTxt = this.work.WordType === 'Work_insp' ? '巡检' : '保养'
    // 是否控制打开权限
    this.isCtrlShow = this.work.BillStatu === '1'
    // this.isCtrlShow = true
    this.getPageData()
  },
  computed: {
    ...mapGetters({
      'user': 'user'
    }),
    filterList () {
      let search = this.searchKey
      let list = []
      this.insList.forEach(item => {
        let i = 0
        item.EquiInfo.forEach(sub => {
          if (sub.EquiCode.indexOf(search) >= 0 || sub.EquiName.indexOf(search) >= 0) {
            sub.searchShow = true
            i++
          } else {
            sub.searchShow = false
          }
        })
        if (i > 0) {
          list.push(item)
        }
      })
      return list
    }
  },
  methods: {
    detailShowHandle (item) {
      // 权限开启
      if (this.isCtrlShow && this.work.WorkState === '2') {
        if (item.ImageExsit === '1') {
          item.show = !item.show
        } else {
          this.$toast('请点击拍照按钮签到后进行' + this.typeTxt + '操作')
        }
      } else {
        item.show = !item.show
      }
    },
    // 扫一扫
    async scanHandle () {
      let res = await this.$app.scan()
      console.log(res)
      this.searchKey = res.replace(/\|.*$/, '')
    },
    // 移动到
    scrollTo (item) {
      let id = 'ins_' + item.AddressID
      let el = document.getElementById(id)
      this.$refs.pageBD.scrollTop = el.offsetTop
      this.asideShow = false
    },
    // 立即报修
    routeToFix (item) {
      //       // 给原生传参
      // var message = {
      //   name: EquiName,
      //   code: InstallationSite,
      //   id: EquiID
      // };
      // // /mets/mets-inspection/docs
      // // /ETSInspection/
      // // ../ETSRepair?name=

      // var url = '/ETSInspection/';
      // window.location.href =
      //   '/ETSRepair?name=' + encodeURIComponent(EquiName) +
      //   '&code=' + encodeURIComponent(InstallationSite) +
      //   '&id=' + EquiID +
      //   '&userName=' + this.detailDatas.userName +
      //   '&orgId=' + this.detailDatas.orgID +
      //   '&orgName=' + encodeURIComponent(this.detailDatas.orgName) +
      //   '&fromURL=' + encodeURIComponent(url);
      this.$router.forward('/customerService?type=baoxiu')
    },
    searchRes () {

    },
    optionChange () {
      local.set('ins_page_' + this.work.WorkID, this.insList)
    },
    async getPageData () {
      let res = await this.$http.post('/ets/table/list/equipBaseGetInspectionEquipmentH5', {
        projId: this.nav.orgId,
        workID: this.work.WorkID,
        caseID: this.work.CaseID,
        isCase: this.work.IsCase
      })
      // let list = res.data
      let insList = []
      if (this.work.IsCase === '0') {
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
        insList.push({
          AddressName: '',
          OrgID: '1234567890',
          SortOrder: '',
          EquiInfo: list,
          AddressID: '',
          Memo: '',
          searchShow: true
        })
        this.list = list
      } else {
        let isFirst = true
        insList = res.data
        insList.forEach(top => {
          top.searchShow = true
          top.EquiInfo.forEach((item, index) => {
            item.show = false
            item.searchShow = true
            if (!this.isCtrlShow && isFirst && index === 0) {
              item.show = true
              isFirst = false
            }
            item.OptionsInfo.forEach(sub => {
              if (sub.IsInput === 'True') {
                sub.InputResult = sub.InputResult || sub.ValueMin
              } else {
                sub.InputResult = sub.InputResult || sub.StandardOptions
              }
            })
          })
        })
      }
      let storeStr = local.get('ins_page_' + this.work.WorkID)
      if (storeStr) {
        this.insList = JSON.parse(storeStr)
      } else {
        this.insList = insList
      }
      console.log(res)
    },
    toPhoto (item) {
      this.detailItem = item
      if (this.work.WordType === 'Work_insp') {
        this.$router.push({path: this.$route.path + '/photo/inspection'})
      } else {
        this.$router.push({path: this.$route.path + '/photo/keepFit'})
      }
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
      local.set('ins_page_' + this.work.WorkID, this.insList)
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
      this.insList.forEach(top => {
        top.EquiInfo.forEach(item => {
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
      // _this.removeStorage(_this.detailDatas.WorkID);
      local.remove('inspection_work_' + this.work.WorkID)
      local.remove('ins_page_' + this.work.WorkID)
      this.$toast('提交' + this.typeTxt + '成功')
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
      console.log(res)
      this.$toast('关闭' + this.typeTxt + '成功')
      // 返回主页面
      this.$root.back()
      // 刷新父页面的值
      this.$parent.refresh()
    }
  }
}
</script>

<style lang="scss">
.ins_line_mask {
  position:fixed
}
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
.ins_aside {
    position: fixed;
    bottom: 60px;
    height: 50px;
    width: 50px;
    background: #3395FF;
    text-align: center;
    height: 50px;
    border-radius: 100%;
    line-height: 50px;
    right: 15px;
    & i.iconfont {
      font-size: 30px;
      color:#FFF;
    }
}
.ins_aside_mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(51, 51, 51, 0.4);
    z-index: 3;
}
.ins_aside_ul {
  padding: 40px 15px 0 25px;
  display:block;
  & li {
    padding-bottom:40px;
    border-left:1px solid #3395FF;
    padding-left:25px;
    position:relative;
    & span {
      position:absolute;
      width:22px;
      height:22px;
      border-radius:100%;
      background:#3395FF;
      text-align:center;
      color:#FFF;
      line-height:24px;
      left:-11px;
    }
  }
  & li:last-child{
    border-left:1px solid #FFF;
  }
}
</style>
