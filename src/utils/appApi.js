// window.callData.closeView(); // 关闭webview
// window.callData.backView();
// window.callData.getUser('getUser'); // 获取用户信息
// window.callData.Native_Js_ScanPayment('scanResult');  // 调用相机扫码
// window.callData.Native_Js_JumpToOffLineCenter(); // 跳转到离线中心
// window.callData.Native_Js_onLoadPage();
// window.callData.Native_Js_addData(jsonString); // 添加缓存区的数据
// window.callData.Native_Js_getData(jsonString); // 得到缓存区的数据
// var message = {
//   key: nativeData.projectId,
//   callback: 'getCacheFileResult' //回调在对象的callback参数中
// };

// window.callData.Native_Js_deleteData(jsonString);
// var message = {
//   key: nativeData.projectId,
//   callback: 'removeDataResult' //回调在对象的callback参数中
// };

// window.callData.Native_Js_HasFile(jsonString);
// var message = {
//   key: nativeData.projectId,
//   callback: 'hasFileResult' //回调在对象的callback参数中
// };

// window.callData.Native_Js_GetPic('picOnDone'); // 对应的ios为 Native_Js_camera
// window.callData.Native_Js_GetRec('recOnDone')
// window.callData.Native_Js_WatermarkCamera('picOnDone'); // 水印相机
// window.callData.Native_Js_playAudio(index_vue.parents.opUser);
// window.callData.Native_Js_addXJBYData(jsonString);
// console.log({
//   callback: 'androidNativeOffline',
//   data: {
//     orgId: nativeDict.projectID,
//     orgName: nativeDict.projectName,
//     memberId: nativeDict.memberID,
//     GongDanInfo: resList,
//     Totalcount: resList.length,
//   }
// })
// window.callData.Native_Js_serviceList('message');
// window.callData.NJInspection('messageDatas');
// window.callData.Native_Js_Payment('projectInfos');

// window.callData.Native_Js_Goback

//
// window.webkit.messageHandlers.closeView.postMessage(''); // 关闭webview
// window.webkit.messageHandlers.backView.postMessage('');
// window.webkit.messageHandlers.Native_Js_ScanPayment.postMessage('scanResult'); // 调用相机扫码
// window.webkit.messageHandlers.Native_Js_JumpToOffLineCenter.postMessage();
// window.webkit.messageHandlers.Native_Js_onLoadPage.postMessage('');
// window.webkit.messageHandlers.Native_Js_addData.postMessage(); //添加数据到原生保存
// window.webkit.messageHandlers.Native_Js_getData.postMessage(message);
// window.webkit.messageHandlers.Native_Js_deleteData.postMessage(message);
// window.webkit.messageHandlers.Native_Js_HasFile.postMessage(message);
// window.webkit.messageHandlers.Native_Js_camera.postMessage('picOnDone');
// window.webkit.messageHandlers.Native_Js_GetRec.postMessage('recOnDone');
// window.webkit.messageHandlers.Native_Js_WatermarkCamera.postMessage('picOnDone'); // 水印相机
// window.webkit.messageHandlers.Native_Js_playAudio.postMessage(index_vue.parents.opUser);
// window.webkit.messageHandlers.Native_Js_addXJBYData.postMessage(message);
// window.webkit.messageHandlers.Native_Js_serviceList.postMessage('message');
// window.webkit.messageHandlers.NJInspection.postMessage('messageDatas')
// window.webkit.messageHandlers.Native_Js_Payment.postMessage('projectInfos');

function device () {
  var ua = navigator.userAgent
  var os = {}
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  os.android = !!ua.match(/(Android)\s+([\d.]+)/)
  os.iphone = !!(!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/))
  return os
}
/*
* loadView 需要转递一个对象
* {
*   url: '',
*   type: ''
* }
*  shenpi 审批
*  chaobiao 抄表
*  xunjian 巡检
*  baoyang 保养
*  baoshi 报事
*  weixiu 维修
*  shoukuan 收款
*  zulin 租赁
*
* */
export default (function () {
  let os = device()
  let tmp = ''
  let glob = null
  // 尾数1表示是否有直接回调,2表示对象内callback设置回调名
  let obj = {
    close: 'closeView',
    back: 'backView',
    getUser: 'getUser|1',
    loadView: 'APP_loadView', // 加载webview
    routeOA: 'APP_routeOA',
    topView: 'App_topView',
    outApp: 'APP_outApp',
    network: 'APP_network|1',
    offlineBadge: 'APP_offlineBadge|1', // 调用offline角标
    setOptions: 'APP_setOptions',
    scan: 'Native_Js_ScanPayment|1', // 调用相机扫码
    jumpOffline: 'Native_Js_JumpToOffLineCenter', // 跳转到离线中心
    onLoadPage: 'Native_Js_onLoadPage',
    addData: 'Native_Js_addData', // 添加数据到原生缓存区
    getData: 'Native_Js_getData|2',
    delData: 'Native_Js_deleteData|2',
    hasData: 'Native_Js_HasFile|2',
    getPic: 'Native_Js_GetPic|1',
    getRec: 'Native_Js_GetRec|1', // 语音播放
    waterCamera: 'Native_Js_WatermarkCamera|1', // 水印相机
    playAudio: 'Native_Js_playAudio',
    addXJBYData: 'Native_Js_addXJBYData|2', // 添加离线保养数据
    serviceList: 'Native_Js_serviceList|1',
    nJInspection: 'NJInspection|1',
    clearCache: 'APP_clearCache', // 清空浏览器html5本地页面,并退出登录
    logout: 'App_logout',
    paymentData: 'Native_Js_Payment|1', // 支付界面数据获取
    changePosition: 'APP_changePosition', // 切换职位
    changeProject: 'APP_changeProject', // 切换项目
    posPay: 'APP_PosPay|2',
    goBack: 'Native_Js_Goback|1' // 返回键注册
  }
  let callObj = {}
  if (os.android) {
    glob = window.callData
    callObj.isAndroid = true
    callObj.isIOS = false
    document.body.classList.add('android')
  }
  if (os.iphone) {
    tmp = 'postMessage'
    obj.getPic = 'Native_Js_camera|1'
    callObj.isAndroid = false
    callObj.isIOS = true
    document.body.classList.add('ios')
  }

  function isJSON (str) {
    if (typeof str === 'string') {
      try {
        let obj = JSON.parse(str.replace(/[\r\n]/g, ''))
        if (typeof obj === 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e)
        return false
      }
    }
    console.log('It is not a string!')
  }
  function covert2Obj (str) {
    console.log(typeof str, 'typeof str ----------------')
    if (typeof str === 'object') {
      return str
    }
    if (isJSON(str)) {
      return JSON.parse(str.replace(/[\r\n]/g, ''))
    } else {
      return str
    }
  }
  if (window.callData) { // android app 环境
    setTimeout(() => {
      console.log(glob, 'android glob')
    }, 10)
    Object.keys(obj).forEach((name) => {
      let arr = obj[name].match(/([^|]+)\|(\d)/)
      let num = '0'
      let value = obj[name]
      if (arr) {
        value = arr[1]
        num = arr[2]
      }
      let appGlob = glob[value]
      if (num === '0') {
        callObj[name] = function () {
          let args = Array.prototype.slice.call(arguments)
          if (args[0]) {
            if (typeof args[0] === 'object') {
              args[0] = JSON.stringify(args[0])
            }
          }
          if (glob[value]) {
            console.log(glob, value, arguments, '------------------')
            appGlob.apply(glob, args)
            // glob[value].apply(glob, arguments)
            return Promise.resolve(true)
          } else {
            return Promise.reject(new Error('方法不存在:' + value))
          }
        }
      }
      if (num === '1') {
        callObj[name] = function () {
          return new Promise(function (resolve, reject) {
            // let that = this
            if (glob[value]) {
              appGlob.call(glob, 'app_' + name)
              window['app_' + name] = function (res) {
                let resData = covert2Obj(res)
                console.log('接口返回的结果1', resData)
                resolve(resData)
                window['app_' + name] = null
              }
            } else {
              reject(new Error('方法不存在:' + value))
            }
          })
        }
      }
      if (num === '2') {
        callObj[name] = function (msg) {
          return new Promise(function (resolve, reject) {
            // let that = this
            msg.callback = 'app_' + name
            if (glob[value]) {
              appGlob.call(glob, JSON.stringify(msg)) // android需要JSON.stringify
              window['app_' + name] = function (res) {
                let resData = covert2Obj(res)
                console.log('接口返回的结果2', resData)
                resolve(resData)
                window['app_' + name] = null
              }
            } else {
              reject(new Error('方法不存在:' + value))
            }
          })
        }
      }
    })
  }
  console.log(window.webkit, 'window.webkit--------------')
  if (window.webkit && window.webkit.messageHandlers) { // ios app 环境
    glob = window.webkit.messageHandlers
    console.log(glob, 'ios glob')
    Object.keys(obj).forEach((name) => {
      let arr = obj[name].match(/([^|]+)\|(\d)/)
      let num = '0'
      let value = obj[name]
      if (arr) {
        value = arr[1]
        num = arr[2]
      }
      let appGlob = glob[value]
      if (num === '0') {
        callObj[name] = function () {
          // window.webkit.messageHandlers.App_logout.postMessage('')
          if (glob[value]) {
            let args = Array.prototype.slice.call(arguments)
            if (!args[0]) {
              args[0] = ''
            }
            appGlob[tmp].apply(glob[value], args)
            // glob[value][tmp].apply(glob, arguments)
            return Promise.resolve(true)
          } else {
            console.log('出错了:', value)
            return Promise.reject(new Error('不存在调用方法' + value))
          }
        }
      }
      if (num === '1') {
        callObj[name] = function () {
          return new Promise(function (resolve, reject) {
            if (glob[value]) {
              let args = Array.prototype.slice.call(arguments)
              if (!args[0]) {
                args[0] = ''
              }
              appGlob[tmp].call(glob[value], 'app_' + name)
              // glob[value][tmp].apply(glob, 'app_' + name)
              window['app_' + name] = function (res) {
                let resData = covert2Obj(res)
                console.log('接口返回的结果1', resData)
                resolve(resData)
                window['app_' + name] = null
              }
            } else {
              console.log('出错了:', value)
              reject(new Error('不存在调用方法' + value))
            }
          })
        }
      }
      if (num === '2') {
        callObj[name] = function (msg) {
          return new Promise(function (resolve, reject) {
            if (glob[value]) {
              msg.callback = 'app_' + name
              appGlob[tmp].call(glob[value], msg)
              // glob[value][tmp].apply(glob, msg)
              window['app_' + name] = function (res) {
                let resData = covert2Obj(res)
                console.log('接口返回的结果2', resData)
                resolve(resData)
                window['app_' + name] = null
              }
            } else {
              console.log('出错了:', value)
              return reject(new Error('不存在调用方法' + value))
            }
          })
        }
      }
      console.log('---------------------------------------------------------------')
    })
  }
  // 纯h5页面兼容 (标示不在手机app环境) 浏览器环境
  if (!window.callData && !window.webkit) {
    Object.keys(obj).forEach((name) => {
      let loop = function (res) {
        console.log('传入的参数为：', JSON.stringify(res))
        console.warn('当前不在app环境 正在调用方法:' + name)
        return Promise.reject('当前不在app环境 正在调用方法:' + name)
      }
      callObj[name] = loop // 产生空函数调用 返回 Promise 对象
    })
  }
  return callObj
})()
