export default {
  methods: {
    // 显示底部按钮逻辑
    showButtons: function (workOrderState, bHandle, isFromSkill) {
      /*
                    WOSta_Sub    : 已提交
                    WOSta_Proc   : 处理中
                    WOSta_Finish : 已完成
                    WOSta_Visit  : 已评价
                    WOSta_Close  : 已关闭
                    */
      if (workOrderState === 'WOSta_Sub') {
        if (bHandle === '1') {
          if (isFromSkill === '1') {
            return ['抢单']
          } else {
            if (this.isTransferBtn) {
              return ['转单', '接单']
            } else {
              return ['接单']
            }
          }
        }
      } else if (workOrderState === 'WOSta_Proc') {
        if (this.isMaterial && this.isTransferBtn) {
          return ['转单', '材料申请', '反馈']
        } else if (!this.isMaterial && this.isTransferBtn) {
          return ['转单', '反馈']
        } else if (this.isMaterial && !this.isTransferBtn) {
          return ['材料申请', '反馈']
        } else {
          return ['反馈']
        }
      } else if (workOrderState === 'WOSta_Finish') {
        return this.isTransferBtn ? ['转单', '完成回访'] : ['完成回访']
      } else if (workOrderState === 'WOSta_Visit') {
        return ['回访详情', '关闭工单']
      } else {
        return []
      }
    },
    btnAction (item, btnName) {
      this.workItem = item
      switch (btnName) {
        case '抢单': this.routeTakeOrder(item); break
        case '接单': this.routeTakeOrder(item); break
        case '转单': this.covertOrder(item); break
        case '反馈': this.routeFeedback(item); break
        case '材料申请': this.routeMaterial(item); break
        case '完成回访': this.routeVisit(item); break
        case '回访详情': this.routeVisitDetail(item); break
        case '关闭工单': this.closeOrder(item); break
      }
    },
    // 抢单
    // 接单
    routeTakeOrder (obj) {
      this.$router.push({path: this.$route.path + '/takeOrder'})
    },
    // 转单
    covertOrder (obj) {
      this.$router.push({path: this.$route.path + '/personSelector'})
    },
    // 反馈
    routeFeedback (obj) {
      this.$router.push({path: this.$route.path + '/feedback'})
    },
    // 材料申请
    routeMaterial (obj) {
      this.$router.push({path: this.$route.path + '/material'})
    },
    // 完成回访
    routeVisit (obj) {
      this.$router.push({path: this.$route.path + '/visit'})
    },
    // 回访详情
    routeVisitDetail (obj) {
      this.$router.push({path: this.$route.path + '/visitDetail'})
    }
  }
}
