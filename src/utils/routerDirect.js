import sess from './sess'
const nextDirection = function (appId) {
  return function (direction) {
    let el = document.getElementById(appId)
    if (el) el.setAttribute('transition-direction', direction)
  }
}

export default {
  install (Vue, options) {
    let router = options.router
    let appId = options.appId
    let direction = nextDirection(appId)
    let fn = router['push']
    router['_push'] = fn
    router.forward = function (target) {
      direction('forward')
      setTimeout(() => router['_push'](target), 300)
    }
    router.back = function (target) {
      direction('back')
      setTimeout(() => {
        window.history.back()
      }, 0)
      if (target) {
        setTimeout(() => router['_push'](target), 300)
      }
    }

    const beforeEach = (toRoute, fromRoute, next) => {
      const to = toRoute.path
      const from = fromRoute.path
      const scrollTop = this.pageContentScrollTop()

      let h = sess.get(to)
      if (h && h.history) {
        direction('back')
        h.history = false
        sess.set(to, h)
      } else {
        sess.set(from || '/', {
          history: true,
          scrollTop: scrollTop
        })
        direction('forward')
      }

      const tabbarRoutes = [
        '/advanced/tabbar/home',
        '/advanced/tabbar/discount',
        '/advanced/tabbar/cart',
        '/advanced/tabbar/user'
      ]

      if (from && tabbarRoutes.indexOf(from) > -1) {
        sess.set(from, {
          history: false,
          scrollTop: scrollTop
        })
      }

      // 某些页面定制 page transition direction
      if (
        (from === '/' && to === '/home') ||
        (from === '/home' && to === '/advanced/tabbar/home') ||
        (from === '/advanced/tabbar/user' && to === '/pageFromTabbar')
      ) {
        direction('forward')
      }

      if (
        (to === '/' && from === '/home') ||
        (to === '/home' && from === '/advanced/tabbar/home') ||
        (to === '/advanced/tabbar/user' && from === '/pageFromTabbar')
      ) {
        direction('back')
      }
      next()
    }

    const afterEach = (toRoute, fromRoute) => {
      const to = toRoute.path
      // const from = fromRoute.path
      // [Custom Business] Never use history scrollTop when '/' => '/home'
      // if (from === '/' && to === '/home') return

      const h = sess.get(to)
      if (h && h.scrollTop) {
        Vue.nextTick(() => {
          this.pageContentScrollTop(h.scrollTop)
        })
      }
    }

    Vue.prototype.$nextDirection = function (direction) {
      direction(direction)
    }
    router.beforeEach(beforeEach)
    router.afterEach(afterEach)
  },
  pageContentScrollTop (scrollTop) {
    const root = document.querySelector('app')
    if (typeof scrollTop === 'number') {
      const pages = root && root.querySelectorAll('.page .page_bd')
      const content = pages[pages.length - 1]
      if (content) {
        content.scrollTop = scrollTop
      }
    } else {
      return root && root.querySelector('.page .page_bd')
        ? root.querySelector('.page .page_bd').scrollTop
        : 0
    }
  },
  nextDirection: nextDirection
}
