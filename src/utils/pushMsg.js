import Vue from 'vue'
let bus = new Vue()
window.APP_pushMsg = function (res) {
  console.log(res, 'APP_pushMsg')
  bus.$emit('jPush', res)
}
window.APP_subBack = function (res) {
  console.log(res, 'APP_subBack')
  bus.$emit('subBack', res)
}
export default bus
