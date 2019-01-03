// #1
var option1 = {
  color: ['#46A9FC', '#A5D6FF', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
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
// #2
var option2 = {
  color: ['#FD8550', '#FECEB9', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
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
// #3
var option3 = {
  color: ['#0DC88C', '#A9FCE1', '#EAA674', '#FBD437', '#ACDF82', '#5ED982', '#82DFBE', '#36CBCB', '#5CD5FE', '#60ACF2', ' #FB9365', '#9C8CFD'],
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
export {
  option1,
  option2,
  option3
}
