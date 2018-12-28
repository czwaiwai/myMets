let white = '#000000'
// let opWhite = ''
let option1 = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  toolbox: {
    show: true,
    feature: {
      mark: {show: true},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  series: [
    {
      name: '业务指标',
      type: 'gauge',
      radius: '130%',
      center: ['50%', '75%'],
      startAngle: 190,
      endAngle: -10,
      pointer: { // 指针
        show: false,
        width: 1,
        color: 'rgba(255, 255, 255, 0)',
        length: '100%'
      },
      axisLine: { // 坐标轴线
        show: true, // 默认显示，属性show控制显示与否
        lineStyle: { // 属性lineStyle控制线条样式
          // color: [[0, white], [(num / 100), white], [1, 'rgba(251, 212, 55, 0.3)']],
          width: 10
        }
      },
      axisTick: { // 坐标轴小标记
        show: false,
        length: 10, // 属性length控制线长
        lineStyle: { // 属性lineStyle控制线条样式
          color: white
        }
      },
      splitLine: { // 分隔线
        show: false,
        length: 10,
        lineStyle: {
          width: 3,
          color: white
        }
      },
      title: {
        color: white,
        offsetCenter: [0, '-10%'], // x, y，单位px
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: 'white'
        }
      },
      detail: {
        show: true,
        formatter: '{value}%',
        offsetCenter: [0, '-35%'],
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: '#FFF'
        }
      }
      // data: [{value: num, name: '收缴率'}]
    }
  ]
}
let option2 = {
  color: ['#DC81D2', '#F2637B', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
  legend: {
    textStyle: {
      fontSize: 12
    },
    type: 'scroll',
    orient: 'vertical',
    x: 'left',
    top: 'center',
    itemGap: 5,
    itemWidth: 18,
    itemHeight: 10,
    data: []
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '60%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: '{d}%\n{b}'
        },
        emphasis: {
          show: true,
          textStyle: {
            // fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      // label: {
      //   normal: {
      //     show: true,
      //     formatter: '{b} {d}'
      //   },
      //   emphasis: {
      //     show: true,
      //     textStyle: {
      //       fontWeight: 'bold'
      //     }
      //   }
      // },
      data: []
    }
  ]
}
export {
  option1,
  option2
}
