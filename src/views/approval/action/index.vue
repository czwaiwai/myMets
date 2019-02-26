<template>
  <div class="page_modal">
    <div class="page pgae_bg">
      <nav-title :title="title"></nav-title>
      <div class="page_bd">
        <!-- <p class="title">审批意见</p> -->
        <div class="textBox">
          <textarea class="text" maxlength="200" v-model="value" placeholder="请输入意见（选填）"></textarea>
          <!-- <p class="num">{{value.length}}/200</p> -->
        </div>
        <div class="padding15 pictrues">
          <div class="weui-uploader">
            <div class="weui-uploader__bd">
              <ul class="weui-uploader__files" id="uploaderFiles">
                <li v-for="(item, index) in imgs" :key="index" class="weui-uploader__file" style="overflow:hidden;position:relative;">
                  <img preview  style="max-width:100%;width:100%;height:100%;" :src="'data:image/jpg;base64,'+ item" >
                  <a @click="imgDelClick(index)" class="img_del_btn">-</a>
                </li>
              </ul>
              <div @click="getPic" v-show="imgs.length <= 2" class="weui-uploader__input-box"></div>
            </div>
          </div>
        </div>
        <div class="items" v-show="$route.query.type==2" @click.stop="setStatus">
          <span class="name">打回节点执行后，直接回到本节点</span>
          <i class="iconfont icon" :class="status?'blue icon-kaiguanguan':'grad icon-kaiguanguan1'"></i>
        </div>
        <div class="items" @click.stop="toChoisePerson" v-show="$route.query.appointNext>0">
          <span class="name">选择下一节点执行人</span>
          <span class="value">
            {{person.EmployeeName||''}}
            <!-- <span v-for="(item,index) in person" :key="index">{{item.EmployeeName||''}}<span v-show="index<person.length-1">、</span></span> -->
          </span>
          <i class="iconfont icon icon-tubiao-"></i>
        </div>
      </div>
      <div class="_btn">
        <div class="btn" @click.stop="submit">提交</div>
      </div>
      <dialog-confire
        title="是否确定提交！"
        ref="dialog"
        textAlign='center'
        @clickLeftBtn="clickLeftBtn"
        @clickRightBtn="clickRightBtn"
      ></dialog-confire>
    </div>
    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import navTitle from '@/components/navTitle'
import dialogConfire from '@/components/dialogConfire.vue'
export default {
  name: 'approvalAction',
  components: {navTitle, dialogConfire},
  data () {
    return {
      nav: {
        orgId: '',
        orgName: ''
      },
      title: '',
      value: '',
      status: false,
      person: {},
      isAndroid: false,
      imgs: [],
      isHttp: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  methods: {
    // 选择下一执行人
    toChoisePerson () {
      let name = 'approvalChoose'
      if (this.$route.name === 'approvalActionQuick') {
        name = 'approvalChooseQuick'
      }
      this.$router.push({name: name})
    },
    // 设置执行人
    setPerson (item) {
      this.person = item
      console.log(item)
      // if (this.person.length) {
      //   this.person.forEach((arr, index) => {
      //     if (arr.EmployeeID === item.EmployeeID) {
      //       this.person.splice(index, 1)
      //     }
      //   })
      // }
      // this.person.unshift(item)
    },
    // 设置回到本节点状态
    setStatus () {
      this.status = !this.status
    },
    async submit () {
      if (this.isHttp) {
        return
      }
      this.$refs.dialog.show()
    },
    // 点击左边按钮
    clickLeftBtn () {
      this.$refs.dialog.hide()
    },
    // 点击右边按钮
    clickRightBtn () {
      this.$refs.dialog.hide()
      this.upData()
    },
    // 提交
    async upData () {
      let obj = {
        'EmployeeId': this.user.UserID,
        'TaskId': this.$parent.detailId,
        'Result': this.$route.query.type,
        'Reason': this.value
      }
      this.imgs.forEach((arr, index) => {
        obj['Image' + (index + 1)] = arr
        obj['FieldName' + (index + 1)] = ''
      })
      console.log(this.person)
      if (this.$route.query.appointNext > 0) {
        if (this.person.EmployeeID) {
          obj.NextExecutorId = this.person.EmployeeID
        } else {
          this.$toast('请选择下一节点执行人！')
          return
        }
      }
      if (this.$route.query.type === 2) {
        obj.IsBackToThisNode = this.status ? '1' : '0'
      }
      this.isHttp = true
      let res = await this.$xml('UserAudit_SubmitAuditTaskResult', obj)
      // 'IsBackToThisNode': this.status ? '1' : '0',
      // 'NextExecutorId': this.person.EmployeeID,
      // 'AppointNext': '',
      // 'Image1': '',
      // 'Image2': '',
      // 'Image3': '',
      // 'FieldName1': '',
      // 'FieldName2': '',
      // 'FieldName3': ''
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        if (res.data) {
          this.$toast(res.data.Syswin[0].msg)
          setTimeout(() => {
            this.isHttp = false
          }, 2000)
        } else {
          this.$toast(res.msg)
          if (this.$route.name === 'approvalActionQuick') {
            setTimeout(() => {
              this.isHttp = false
              this.$router.push(`/tab/work`)
            }, 2000)
            return
          }
          this.$parent.$parent.getAllData()
          setTimeout(() => {
            this.isHttp = false
            this.$router.go(-2)
          }, 2000)
        }
      }
    },
    setInit () {
      let num = this.$route.query.type - 0
      switch (num) {
        case 0:
          this.title = '否决'
          this.value = '否决'
          break
        case 1:
          this.title = '同意'
          this.value = '同意'
          break
        case 2:
          this.title = '打回'
          this.value = '打回'
          break
      }
    },
    async getPic () {
      // this.imgs.push('iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=')
      let img = await this.$app.getPic()
      this.imgs.push(img)
      this.$previewRefresh()
    },
    imgDelClick (index) {
      this.imgs.splice(index, 1)
    }
  },
  created () {
    this.setInit()
    this.nav.orgId = this.user.OrgID
    this.nav.orgName = this.user.OrgName
    var u = navigator.userAgent
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  }
}
</script>
<style lang="scss" scoped>
  .textBox {
    height: 3rem;
    width: 100vw;
    margin-top: .2rem;
    background: #fff;
    .text{
      height: 3rem;
      width: 100vw;
      padding: .3rem;
      font-size: .3rem;
      color: #333;
      line-height: 1.3;
      &::placeholder{
        color: #999;
      }
    }
  }
  .pictrues{
    background: #fff;
    border-top: 1px solid #ededed;
    .img_del_btn {
      width:20px;
      height:20px;
      display:block;
      position: absolute;
      top:0;
      right:0;
      z-index:2;
      color:#FFF;
      text-align:center;
      background:url('../../../assets/img/tool/close_img.png') no-repeat;
      background-size:cover;
    }
  }
  .items{
    position: relative;
    height: .8rem;
    width: 100vw;
    padding: 0 .3rem;
    line-height: .8rem;
    font-size: .28rem;
    color: #333;
    background: #fff;
    margin-top: .2rem;
    .file{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      width: 100vw;
      height: .8rem;
      opacity:0;
    }
    .icon{
      position: absolute;
      top: 0;
      right: .2rem;
      display: block;
      height: .8rem;
      line-height: .8rem;
      font-size: .4rem;
      color: #999;
    }
    .value {
      position: absolute;
      top: 0;
      right: .8rem;
      display: block;
      height: .8rem;
      max-width: 3rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: .8rem;
      font-size: .3rem;
      color: #333;
    }
    .blue{
      color: #3395FF;
    }
    .grad{
      color: #999;
    }
  }
  ._btn{
    height: 1.2rem;
    width: 100vw;
    padding: .2rem .3rem;
    border-top: 1px solid #ededed;
    background: #fff;
    .btn{
      height: .8rem;
      border-radius: 3px;
      font-size: .32rem;
      color: #fff;
      background: #3395FF;
      line-height: .8rem;
      text-align: center;
    }
  }
</style>
