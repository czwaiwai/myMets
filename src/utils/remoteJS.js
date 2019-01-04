let isLoadJsArr = []
function remoteJS (url) {
  for (var i = 0, len = isLoadJsArr.length; i < len; i++) {
    let context = isLoadJsArr[i]
    if (context.name === url) { // 在数组中找到匹配的JS
      return context.promise.then(res => {
        return 'cache'
      })
    }
  }
  let promise = new Promise((resolve, reject) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.onerror = reject
    document.body.appendChild(script)
    script.onload = function () {
      if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        resolve('done')
      } else {
        reject(new Error(0))
      }
    }
  })
  isLoadJsArr.push({
    name: url,
    promise: promise
  })
  return promise
}
export default remoteJS
