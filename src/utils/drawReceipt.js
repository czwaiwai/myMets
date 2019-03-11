export default drawReceipt

function getImg (url) {
  let promise = new Promise((resolve, reject) => {
    var img = new Image()
    img.onload = function () {
      img.onload = null
      resolve(img)
    }
    img.onerror = function () {
      img.onerror = null
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
  return promise
}
function draw (ctx, img, data) {
  ctx.rect(0, 0, ctx.width, ctx.height)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.drawImage(img, 0, 0)
  ctx.font = '18px Verdana'
  ctx.fillStyle = 'black'
  ctx.fillText(parseInt(Math.random() * 100000000), 130, 55)
  ctx.font = '22px Verdana'
  ctx.textAlign = 'center' // 文本水平对齐方式
  ctx.fillText('银河世纪花园', ctx.center, 105)
  ctx.font = '18px Verdana'
  ctx.textAlign = 'left'
  ctx.fillText('曹正', 130, 195)
  ctx.fillText('2019-03-04 00:00:00', 375, 195)
  ctx.fillStyle = 'red'
  ctx.font = '22px Verdana'
  ctx.fillText('￥10000.00', 185, 780)
  drawList(ctx)
}
function drawList (ctx, list) {
  // ctx.fillText('什么鬼', 50, 385)
  ctx.font = '16px Verdana'
  ctx.fillStyle = 'black'
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 9; j++) {
      ctx.fillText('什么鬼', 45 + (j * 100), 345 + (i * 40))
    }
  }
}
function getCtx (el) {
  var canvas = document.createElement('canvas')
  canvas.width = '980'
  canvas.height = '1086'
  canvas.style.display = 'none'
  el.append(canvas)
  var ctx = canvas.getContext('2d')
  // ctx.canvas = canvas
  ctx.width = canvas.width
  ctx.height = canvas.height
  ctx.center = parseInt(canvas.width / 2)
  return {ctx, canvas}
}
async function drawReceipt (el, imgtpl, data) {
  let img = await getImg(imgtpl || './static/tpl.png')
  let {ctx, canvas} = getCtx(el)
  for (var i = 0; i < 1; i++) {
    draw(ctx, img, data)
    let genImg = new Image()
    genImg.src = canvas.toDataURL('image/png')
    el.append(genImg)
  }
  el.removeChild(canvas)
}
