export default iosFixed
function device () {
  var ua = navigator.userAgent
  var os = {}
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  os.android = !!ua.match(/(Android)\s+([\d.]+)/)
  os.iphone = !!(!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/))
  return os
}
function iosFixed () {
  let os = device()
  let isReset = true
  if (os.iphone) {
    document.body.addEventListener('focusin', () => {
      // 软键盘弹出的事件处理
      isReset = false
    })
    document.body.addEventListener('focusout', () => {
      // 软键盘收起的事件处理
      isReset = true
      setTimeout(() => { // 当焦点在弹出层的输入框之间切换时先不归位
        if (isReset) {
          window.scroll(0, 0)// 失焦后强制让页面归位
        }
      }, 300)
    })
  }
}
