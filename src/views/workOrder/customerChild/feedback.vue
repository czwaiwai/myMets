<template>
<div class="page_modal">
  <div class="page">
    <mt-header title="工单反馈">
      <mt-button slot="left" @click="$router.back()" icon="back">返回</mt-button>
    </mt-header>
    <div class="page_bd">
        <div class="weui-cells" style="margin-top:0;">
            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">处理结果</label>
                </div>
                <div class="weui-cell__bd">
                    <select class="weui-select" name="select2">
                        <option value="1">处理中</option>
                        <option value="2">已完成</option>
                        <option value="3">客户自行处理</option>
                    </select>
                </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__bd">
                  <textarea class="weui-textarea" placeholder="请输入文本" rows="2"></textarea>
                  <div class="weui-textarea-counter"><span>0</span>/200</div>
                  <div class="border-top-half padding-top">
                   <ins-img-list :imgs.sync="imgs" :max="3">
                        <p class="dark_99 padding-top5"><button type="button" class="voice_btn"><i data-v-7a147d10="" class="icon-yuyin iconfont"></i>语音</button></p>
                    </ins-img-list>
                  </div>
              </div>
            </div>
        </div>
        <div class="weui-cells weui-cells_form" style="margin-top:10px;">
            <a class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>开工时间</p>
                </div>
                <div class="weui-cell__ft">
                </div>
            </a>
            <a class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>完工时间</p>
                </div>
                <div class="weui-cell__ft">
                </div>
            </a>
            <div class="weui-cell ">
                <div class="weui-cell__hd"><label class="weui-label">人工费</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入qq号">
                </div>
            </div>
            <div class="weui-cell ">
                <div class="weui-cell__hd"><label class="weui-label">材料费</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入qq号">
                </div>
            </div>
        </div>
        <div class="weui-cells__title text-right">合计: 0.00</div>
        <div class="weui-cells weui-cells_form" style="margin-bottom:15px;">
            <a @click="routeMaterial" class="weui-cell weui-cell_access" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>材料清单</p>
                </div>
                <div class="weui-cell__ft">
                </div>
            </a>
        </div>
    </div>
    <div class="page_ft text-center light_bg padding-top5 padding15-h">
        <button class="ins_submit_btn">提交反馈</button>
    </div>
    <transition name="page">
    <!-- <keep-alive > -->
    <router-view/>
    <!-- </keep-alive> -->
    </transition>
  </div>
</div>
</template>
<script>
import InsImgList from '../child/insImgList'
export default {
  name: 'feedback',
  components: {
    InsImgList
  },
  data () {
    return {
      imgs: []
    }
  },
  created () {
  },
  methods: {
    routeMaterial () {
      this.$router.forward(this.$route.path + '/materialDetail')
    }
  }
}
</script>

<style lang="scss">
.voice_btn {
    background: transparent;
    border: 1px solid #cbcbcb;
    color: #8E8E93;
    padding: 3px 10px;
    border-radius: 20px;
    outline: none;
}
</style>
