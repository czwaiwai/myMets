<template>
<div class="page_modal">
  <div class="page">
    <!-- <mt-header title="测试地图">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header> -->
    <nav-title title="测试地图"></nav-title>
    <div>
      <select @change="changeCity">
        <option>深圳</option>
        <option>上海</option>
      </select>
    </div>
    <div class="page_bd">
      <div class="baidu_map" ref="baiduMap" style="width:100%;height:100%;"></div>
    </div>
  </div>
</div>
</template>
<script>
import mapReady from '@/utils/getBaiduMap'
import navTitle from '@/components/navTitle'
export default {
  name: 'test',
  components: {navTitle},
  data () {
    return {
    }
  },
  created () {
    mapReady().then(BMap => {
      console.log(BMap)
      this.$nextTick(() => {
        this.initMap(BMap)
      })
    })
  },
  methods: {
    changeCity (e) {
      console.log(e.target.value)
      this.map.clearOverlays()
    },
    initMap (BMap) {
      // 绘制地图
      let map = this.map = this.createMap(null, BMap)
      // 添加覆盖物
      let list = this.addoverlays(map, BMap)
      // 添加marker点
      let markers = this.addmarkers(map, BMap)
      markers.forEach(item => item.hide())
      // 添加事件
      this.bindEvent(map, BMap, list, markers)
    },
    createMap (city = '深圳', BMap) {
      // 创建地图实例
      var map = new BMap.Map(this.$refs.baiduMap)
      // 创建点坐标
      // var point = new BMap.Point(116.404, 39.915)
      // 创建点坐标
      map.centerAndZoom(city, 11)
      return map
    },
    bindEvent (map, BMap, overlays, markers) {
      console.log(overlays)
      map.addEventListener('click', function (e) {
        console.log(e.point.lng + ', ' + e.point.lat)
      })
      map.addEventListener('zoomend', function (e) {
        console.log(e)
        console.log('当前缩放级别', map.getZoom())
        if (map.getZoom() > 12) {
          overlays.forEach(item => item.hide())
          markers.forEach(item => item.show())
        } else {
          markers.forEach(item => item.hide())
          overlays.forEach(item => item.show())
        }
      })
    },
    addoverlays (map, BMap) {
      let MyOverlay = this.customOverlay(BMap)
      let mapList = [
        {
          name: '龙岗区',
          lng: '114.233002',
          lat: '22.726713'
        },
        {
          name: '龙华区',
          lng: '114.051329',
          lat: '22.756577'
        },
        {
          name: '南山区',
          lng: '113.939508',
          lat: '22.537774'
        },
        {
          name: '宝安区',
          lng: '113.919098',
          lat: '22.560205'
        },
        {
          name: '罗湖区',
          lng: '114.132967',
          lat: '22.553796'
        }
      ]
      // 龙岗区 114.233002, 22.726713
      // 龙华区 114.051329, 22.756577
      // 南山区 113.939508, 22.537774
      // 宝安区 113.919098, 22.560205
      // 罗湖区 114.132967, 22.553796
      let pointArray = []
      let overlays = []
      mapList.forEach(item => {
        let point = new BMap.Point(item.lng, item.lat)
        pointArray.push(point)
        let overlay = new MyOverlay(point, item.name + '/' + parseInt(Math.random() * 1000, 10) + '套')
        overlay.addEventListener('touchstart', function (e) {
          console.log(e)
          e.preventDefault()
        })
        overlays.push(overlay)
        map.addOverlay(overlay)
      })
      map.setViewport(pointArray)
      return overlays
    },
    addmarkers (map, BMap) {
      // 114.260454, 22.714445
      // 114.196638, 22.712578
      // 114.204975, 22.697109
      // 114.211874, 22.69204
      // 114.232283, 22.655492
      // 114.2067, 22.678703
      let list = [
        {
          name: '花园1号',
          lng: 114.260454,
          lat: 22.714445
        },
        {
          name: '花园2号',
          lng: 114.196638,
          lat: 22.712578
        },
        {
          name: '花园3号',
          lng: 114.204975,
          lat: 22.697109
        },
        {
          name: '花园4号',
          lng: 114.211874,
          lat: 22.69204
        },
        {
          name: '花园5号',
          lng: 114.232283,
          lat: 22.655492
        },
        {
          name: '花园6号',
          lng: 114.2067,
          lat: 22.678703
        }
      ]
      let markers = []
      list.forEach((item, i) => {
        var label = new BMap.Label(item.name, {offset: new BMap.Size(20, -10)})
        label.setStyle({
          color: '#FFF',
          backgroundColor: '#ee5d5b',
          fontSize: '12px',
          height: '20px',
          lineHeight: '16px'
        })
        let marker = new BMap.Marker(new BMap.Point(item.lng, item.lat)) // 创建点
        marker.setLabel(label)
        marker.setShadow(null)
        markers.push(marker)
        map.addOverlay(marker) // 增加点
      })
      return markers
    },
    customOverlay (BMap) {
      // 复杂的自定义覆盖物
      function ComplexCustomOverlay (point, text, fn) {
        console.log(point, text, '----------------------')
        this._point = point
        this._text = text
        this._fn = (fn || function () {}).bind(this)
        // this._overText = mouseoverText
      }
      ComplexCustomOverlay.prototype = new BMap.Overlay()
      ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map
        var div = this._div = document.createElement('div')
        console.log(this._div, 'what')
        div.style.position = 'absolute'
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
        div.style.backgroundColor = '#EE5D5B'
        div.style.border = '1px solid #BC3B3A'
        div.style.color = 'white'
        div.style.height = '24px'
        div.style.padding = '2px'
        div.style.lineHeight = '18px'
        div.style.whiteSpace = 'nowrap'
        div.style.MozUserSelect = 'none'
        div.style.fontSize = '12px'
        var span = this._span = document.createElement('span')
        div.appendChild(span)
        span.appendChild(document.createTextNode(this._text))
        // var that = this

        var arrow = this._arrow = document.createElement('div')
        arrow.style.background = 'url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat'
        arrow.style.position = 'absolute'
        arrow.style.width = '11px'
        arrow.style.height = '10px'
        arrow.style.top = '22px'
        arrow.style.left = '10px'
        arrow.style.overflow = 'hidden'
        div.appendChild(arrow)
        // var that = this
        div.addEventListener('touchstart', this._fn)
        map.getPanes().labelPane.appendChild(div)
        return div
      }
      // 移除事件
      ComplexCustomOverlay.prototype.removeEvent = function () {
        this._div.removeEvent('touchstart', this._fn)
      }
      ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map
        var pixel = map.pointToOverlayPixel(this._point)
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + 'px'
        this._div.style.top = pixel.y - 30 + 'px'
      }
      return ComplexCustomOverlay
    }
  }
}
</script>

<style lang="scss">
.baidu_map img {
  max-width:inherit;
}
</style>
