let echarts = null // 单例模式
export default function () {
  if (!echarts) {
    return new Promise((resolve, reject) => {
      require.ensure([], function (require) {
        echarts = require('echarts/lib/echarts')
        // 引入饼图
        require('echarts/lib/chart/pie')
        // 引入仪表盘
        require('echarts/lib/chart/gauge')
        // 引入滚动
        require('echarts/lib/component/dataZoom')
        // 引入柱状图
        require('echarts/lib/chart/bar')
        // 引入折线图
        require('echarts/lib/chart/line')
        require('echarts/lib/component/graphic')
        // 引入提示框和标题组件
        // require('echarts/lib/component/tooltip')
        require('echarts/lib/component/title')
        require('echarts/lib/component/legendScroll')
        resolve(echarts)
      })
    })
  } else {
    return Promise.resolve(echarts)
    // cb(echarts)
  }
}
