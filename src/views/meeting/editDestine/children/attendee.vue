<template>
  <div>
    <div class="attendee" v-if="detailData.BookStatus==='HB' || detailData.BookStatus==='QR'">
      <div class="btnItem" >
        <p class="title">参会人（已选{{detailData.Participants.length}}人）</p>
        <div class="box-wrap clearfix">
          <div class="btnBox" v-for="(item,index) in detailData.Participants" :key="index">
            <span class="name">{{item.Names}}</span>
            <i class="iconfont icon-jianshanchu-yuankuang icon" @click.stop="deletePerson(item,index)"></i>
          </div>
          <div class="addBox" @click.stop="routeTo">+</div>
        </div>
      </div>
      <div class="inputItem clearfix noneBb">
        <span class="name">其他参会人：</span>
        <input class="inputs" type="text" name="OtherMeettingPerson" @input="inputText" :value="detailData.OtherMeettingPerson" placeholder="请输入其他参会人">
      </div>
    </div>
    <div class="attendee" v-else>
      <div class="btnItem">
        <p class="title">参会人（已选{{detailData.Participants.length}}人）</p>
        <p class="peopleList">
          <span v-for="(item,index) in detailData.Participants" :key="index">
            {{item.Names}}<span v-show="index!=detailData.Participants.length-1">、</span>
          </span>
        </p>
      </div>
      <div class="selectItem clearfix noneBb">
        <span class="name">其他参会人：</span>
        <span class="value textLeft">{{detailData.OtherMeettingPerson}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'attendee',
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          BookStatus: '',
          Participants: []
        }
      }
    }
  },
  data () {
    return {
      selectData: {
        title: '',
        type: '',
        list: []
      }
    }
  },
  computed: {
    ...mapGetters({
      locationData: 'getMeetingLocation'
    })
  },
  methods: {
    // 输入文本
    inputText (e) {
      let text = e.target.value + ''
      this.upData(e.target.name, text)
    },
    // 更新数据
    upData (name, value) {
      let obj = {}
      obj[name] = value
      this.$emit('update:detailData', Object.assign({}, this.detailData, obj))
    },
    // 删除参会人
    deletePerson (item, index) {
      let list = JSON.parse(JSON.stringify(this.detailData.Participants))
      list.splice(index, 1)
      let obj = {
        Participants: list
      }
      this.$emit('update:detailData', Object.assign({}, this.detailData, obj))
    },
    // 选择人员页面
    routeTo () {
      this.$router.push({
        name: 'meetpeopleChoose',
        query: {
          name: 'Participants'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .attendee{
    padding-left: .3rem;
    margin-top: .2rem;
    background: #fff;
    .btnItem{
      padding: .2rem 0;
      border-bottom: 1px solid #ededed;
      .title{
        height: .44rem;
        line-height: .44rem;
        font-size: .3rem;
        color: #999;
      }
      .box-wrap{
        .btnBox{
          position: relative;
          float: left;
          height: .6rem;
          padding: 0 .05rem;
          border: 1px solid #3395ff;
          border-radius: 3px;
          margin-right: .3rem;
          margin-top: .3rem;
          .name{
            display: block;
            min-width: 1.24rem;
            height: .6rem;
            max-width: 2rem;
            color: #3395ff;
            font-size: .3rem;
            text-align: center;
            line-height: .6rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .icon{
            position: absolute;
            right: -.2rem;
            top: -.2rem;
            display: block;
            width: .4rem;
            height: .4rem;
            color: #FC5A5A;
            font-size: .4rem;
            line-height: .4rem;
            background: #fff;
            border-radius: 50%;
          }
        }
        .addBox{
          float: left;
          width: 1.34rem;
          height: .6rem;
          border: 1px dashed #3395ff;
          color: #3395ff;
          font-size: .34rem;
          border-radius: 3px;
          margin-right: .3rem;
          margin-top: .3rem;
          text-align: center;
          line-height: .54rem;
        }
      }
    }
  }
</style>
