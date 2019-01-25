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
        <div class="items" v-show="$route.query.type==2" @click.stop="setStatus">
          <span class="name">打回节点执行后，直接回到本节点</span>
          <i class="iconfont icon" :class="status?'blue icon-kaiguanguan':'grad icon-kaiguanguan1'"></i>
        </div>
        <div class="items" @click.stop="">
          <span class="name">附件</span>
          <i class="iconfont icon-fujian icon"></i>
          <input type="file" ref="ifile" class="file">
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
      person: {}
    }
  },
  methods: {
    // 选择下一执行人
    toChoisePerson () {
      this.$router.push({name: 'approvalResponsibleChoose'})
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
      let res = await this.$xml('UserAudit_SubmitAuditTaskResult', {
        'EmployeeId': this.$parent.employeeId,
        'TaskId': this.$route.params.id,
        'Result': this.$route.query.type,
        'Reason': this.value
        // 'IsBackToThisNode': this.status ? '1' : '0',
        // 'NextExecutorId': this.person.EmployeeID,
        // 'AppointNext': '',
        // 'Image1': '',
        // 'Image2': '',
        // 'Image3': '',
        // 'FieldName1': '',
        // 'FieldName2': '',
        // 'FieldName3': ''
      })
      console.log(res)
      if (res.status === 200 || res.status === '200') {
        if (res.data.Syswin[0].status === 0 || res.data.Syswin[0].status === '0') {
          this.$toast(res.data.Syswin[0].msg)
        } else {
          this.$toast(res.data.Syswin[0].msg)
          this.$router.go(-1)
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
    }
  },
  created () {
    this.setInit()
    this.nav.orgId = this.$parent.orgId
    this.nav.orgName = this.$parent.orgName
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
