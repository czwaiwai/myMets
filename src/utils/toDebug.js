let cs = null
function toDebug () {
  if (!cs) {
    require.ensure([], function (require) {
      var VConsole = require('vconsole')
      cs = new VConsole()
    })
    return true
  }
}
export default toDebug
