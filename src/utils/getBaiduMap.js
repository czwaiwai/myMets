
import remoteJS from './remoteJS'
let map = null
function mapReady () {
  if (!map) {
    map = new Promise((resolve, reject) => {
      // api.map.baidu.com/api?ak=您的密钥&type=lite&v=1.0
      // http://api.map.baidu.com/api?v=2.0&ak=j2sy6K7okugeW8CR00ACyKYXGnRWQGHL&callback=mapInit
      window.mapInit = function () {
        resolve(window.BMap)
      }
      // let url = 'http://api.map.baidu.com/api?ak=j2sy6K7okugeW8CR00ACyKYXGnRWQGHL&type=lite&v=1.0&callback=mapInit'
      let url = 'http://api.map.baidu.com/api?v=2.0&ak=j2sy6K7okugeW8CR00ACyKYXGnRWQGHL&callback=mapInit'
      remoteJS(url)
        .catch(reject)
    })
  }
  return Promise.resolve(map)
}
export default mapReady
