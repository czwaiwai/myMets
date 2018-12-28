/* eslint-disable */
import bou from '../triple-bounce.vue'
export default {bou,
  data: {
    s: 0,
    inv: false,
    last: true,
    top: 0
  },
  methods: {
    on (dom, str, fuc) {
      dom.addEventListener(str, fuc)
    },
        // 移动
    mv (dom, s) {
      if (!dom) { return false }
      dom.style.cssText =
            '-webkit-transform:translate3d(0, ' +
            s +
            ', 0);transform:translate3d(0px, ' +
            s +
            ', 0);'
    },
    setTop (top) {
      this.top = top || this.top
      if (this.top > 0) {
        this.$refs.move.scrollTop = this.top
      }
    },
        // 到底部判断函数,height,是离底部还有多远就判定到底部了。fuc是回调
    IsLast (height, fuc) {
      var dom = this.$refs.move
      var d = dom,
        h = height,
        domH = dom.offsetHeight
      fuc = fuc || function () {}
      var that = this

      function scroll (f) {
        var beforeScrollTop = d.scrollTop,
          scroKs = 0
        d.addEventListener(
                    'scroll',
                    function () {
                      var afterScrollTop = d.scrollTop,
                        delta = afterScrollTop - beforeScrollTop
                      if (delta === 0) {
                        return false
                      }
                      if (scroKs === 0) {
                        scroKs = 1
                        f(delta > 0 ? 'down' : 'up')
                        setTimeout(function () {
                          scroKs = 0
                        }, 100)
                      }
                      beforeScrollTop = afterScrollTop
                      that.top = afterScrollTop
                    },
                    false
                )
      }
      scroll(function (direction) {
        setTimeout(function () {
          fuc = fuc || function () {}
          if (direction === 'down' && (d.scrollHeight - d.scrollTop < dom.offsetHeight + h)) {
            if (fuc) {
              fuc(direction, d.scrollTop, true)
            }
          } else {
            fuc(direction, d.scrollTop, false)
          }
        }, 200)
      })
    },
    aotuMove () {
      let t = 0
      let that = this
      if (that.s <= that.items.h) {
        that.succ()
        return false
      }

      this.inv = setInterval(function () {
        t++
        let nowS = that.s - that.items.a * t * t / 2
        if (nowS < that.items.h) {
          clearInterval(that.inv)
          that.s = that.items.h
          that.mv(that.$refs.touchM, that.s + 'px')

          if (that.last) {
            that.items.ref()
          }
          that.last = false
        } else {
          that.s = nowS
          that.mv(that.$refs.touchM, that.s + 'px')
        }
      }, 18)
    },
    succ () {
      let t = 0
      let that = this
      let s = setInterval(function () {
        t++
        let nowS = that.s - that.items.a * t * 10
        if (nowS < 0) {
          clearInterval(s)
          that.s = 0
          that.mv(that.$refs.touchM, that.s + 'px')
          that.last = true
        } else {
          that.s = nowS
          that.mv(that.$refs.touchM, that.s + 'px')
        }
      }, 18)
    }
  },
  met (obj) {
    var dom = obj.$refs.move
    var tm = obj.$refs.touchM
    var ks = false
    var that = obj
    var tempS = 0
    obj.on(dom, 'touchmove', function (e) {
      if (dom.scrollTop === 0 && !ks) {
        ks = e
        clearInterval(that.inv)
        tempS = that.s
      } else if (dom.scrollTop === 0 && ks) {
        that.s =
                tempS +
                parseInt(e.targetTouches[0].pageY / 2) -
                ks.targetTouches[0].pageY
        if (that.s < 0) {
          that.s = 0
        }
        if (that.s > 3 * that.items.h) {
          that.s = 3 * that.items.h
        }
        that.mv(tm, that.s + 'px')
      }
    })
    obj.on(dom, 'touchend', function (e) {
      that.aotuMove()
      ks = false
    })
  }}
