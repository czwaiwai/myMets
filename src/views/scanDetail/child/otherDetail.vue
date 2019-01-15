<template>
  <div class="page_bd">
    <div class="light_bg padding15">
      <p class="padding-bottom5 fs15"><span class="dark_99">设备类型：</span>{{obj.STID}}</p>
      <p class="padding-bottom5 fs15"><span class="dark_99">制造商：</span>{{obj.ManuCompany}}</p>
      <p class="padding-bottom5 fs15"><span class="dark_99">制造日期：</span>{{obj.ManufactureTime}}</p>
      <p class="padding-bottom5 fs15"><span class="dark_99">启用日期：</span>{{obj.EnableTime}}</p>
      <p class="padding-bottom5 fs15"><span class="dark_99">免保期限：</span>{{obj.FreePeriod}}</p>
      <p class="padding-bottom5 fs15"><span class="dark_99">折旧年限：</span>{{obj.DepreciableLife}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'otherDetail',
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">

</style>
