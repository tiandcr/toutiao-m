<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell slot="title" title="我的频道" class="my-channel" icon="user-o">
      <van-button round type="danger" size="mini" plain class="btn" @click="isEditshow">{{ isComplete }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item v-for="(channelItem, index) in myChannels" :key="index" class="channel-item" @click="onMyChannelClick(channelItem, index)">
        <span class="text" slot="text" :class="{ active: active === index || index === 0 }">{{ channelItem.name }}</span>
        <!-- 推荐频道不能执行编辑 -->
        <van-icon slot="icon" v-show="isEdit && index !== 0" name="close"></van-icon>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell slot="title" title="频道推荐" class="my-channel" icon="apps-o"> </van-cell>
    <van-grid :gutter="10" class="recommend-grid" clickable>
      <van-grid-item v-for="(channel, index) in recommendChannels" :key="index" text="文字" class="channel-item" icon="plus" @click="onAddchannel(channel)">
        <span class="text" slot="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllchannels } from '@/api/article'
// import { mapState } from 'vuex'
// import { setItem } from '@/utils/storage.js'
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      channelList: [], // 所有的频道列表
      isEdit: false // 点击编辑时❌的显示与否
    }
  },
  created() {
    this.loadAllChannels()
  },
  computed: {
    // 剩余的推荐频道
    recommendChannels() {
      const nomychannel = this.channelList.filter(myChannel => !this.myChannels.some(channel => channel.id === myChannel.id))
      return nomychannel
    },
    // 控制编辑按钮显示不同的状态
    isComplete() {
      return this.isEdit ? '完成' : '编辑'
    }
    // ...mapState(['user'])
  },
  methods: {
    // 请求所有的列表数据
    async loadAllChannels() {
      try {
        const { data } = await getAllchannels()
        this.channelList = data.data.channels
        //  console.log(this.recommendChannels)
        // console.log(this.myChannels)
        // console.log(this.channelList)
      } catch (err) {
        this.$toast('获取列表失败')
      }
    },
    // 点击推荐频道的时候传值到父组件 增加我的频道的item
    async onAddchannel(channel) {
      // this.myChannels.push(channel)
      this.$emit('addchannels', channel)
    },
    // 控制编辑❌的显示与否
    isEditshow() {
      this.isEdit = !this.isEdit
    },
    // 点击切换频道
    onMyChannelClick(channelItem, index) {
      if (this.isEdit) {
        // 如果是固定频道，则不删除
        // 删除频道的操作
        if (index === 0) return
        const parama = {
          channelItem,
          index
        }
        this.$emit('deleteChannel', parama)
      } else {
        // 在查号没有显示的时候就执行切换频道的功能
        this.$emit('update-active', index)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  .my-channel {
    color: #333;
  }
  .btn {
    width: 100px;
    height: 50px;
  }
  /deep/ .channel-item {
    height: 86px;
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  /deep/ .van-grid-item__content {
    border-radius: 22px;
    // background-color: #f5f5f6;
    border: 1px solid #3333;
    flex-direction: row;
    color: red;
    .van-icon {
      font-size: 28px;
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 36px;
      color: #ccc;
      z-index: 2;
    }
    .van-grid-item__text,
    .text {
      margin-top: 0px;
      font-size: 24px;
      color: #222;
      white-space: nowrap;
    }
  }
  /deep/.channel-item {
    .van-icon-close {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 36px;
      color: red;
    }
    .active {
      color: red;
    }
  }
}
</style>
