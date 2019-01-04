// 满意度曲线
const option1 = {
  grid: {
    top: 10,
    bottom: 30
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ECECEC'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ECECEC'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      color: '#0DC88C',
      smooth: true
    }
  ]
}
// 满意度直方图
var option2 = {
  grid: {
    top: 20,
    bottom: 30,
    left: '25%'
  },
  xAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ECECEC'
      }
    },
    axisLabel: {
      formatter: '{value} %'
    },
    max: 100
  },
  yAxis: {
    type: 'category',
    data: [],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ECECEC'
      }
    }
  },
  series: [
    {
      type: 'bar',
      color: '#0DC88C',
      barWidth: '50%',
      data: [],
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: '{c}%'
        }
      }
    }
  ]
}
// 工单
var option3 = {
  color: ['#DC81D2', '#F2637B', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
  grid: {
    top: 10,
    bottom: 30
  },
  legend: {
    show: false
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
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
      labelLine: {
        normal: {
          show: false
        }
      },
      data: []
    }
  ]
}

// 类型占比
var option4 = {
  color: ['#DC81D2', '#F2637B', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
  legend: {
    textStyle: {
      fontSize: 10
    },
    type: 'scroll',
    orient: 'vertical',
    x: 'left',
    top: 'center',
    itemGap: 2,
    itemHeight: 10,
    data: []
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '60%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      label: {
        normal: {
          show: true,
          formatter: '{b} {d}'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontWeight: 'bold'
          }
        }
      },
      data: []
    }
  ]
}
export {
  option1,
  option2,
  option3,
  option4
}
