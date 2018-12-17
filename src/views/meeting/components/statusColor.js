let color = null
function meetingColor (list) {
  if (!color && list && list.length > 0) {
    let style = document.createElement('style')
    let tmp = ''
    list.forEach(({statusValue, color}) => {
      let col = color.toLowerCase()
      tmp = tmp +
`.valid_item.meet_bg_${statusValue} {
  background: ${col};
}
`
    })
    style.setAttribute('id', 'meetingStyle')
    style.innerHTML = tmp
    document.head.appendChild(style)
    color = true
  }
  return function () { // 清楚样式
    color = false
    document.head.removeChild(document.getElementById('meetingStyle'))
  }
}

export default meetingColor
