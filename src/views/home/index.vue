<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button slot="title" type="info" size="mini" icon="search" round to="/search">搜索</van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- 绑定当前选中标签的标识符 -->
    <!-- animated 是否开启切换标签内容时的转场动画
         swipeable 是否开启手势滑动切换
    -->
    <van-tabs v-model="active" swipeable animated class="channel-tabs" swipe-threshold="3">
      <van-tab v-for="(channel, index) in channels" :key="index" :title="channel.name">
        <!-- a  -->
        <article-List :channel="channel" />
        <!--  -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn">
        <i class="iconfont icongengduo" @click="showPopup"></i>
      </div>
    </van-tabs>
    <!--/ 频道列表 -->
    <!-- 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="show"
      position="right"
      close-icon="arrow-left"
      closeable
      close-icon-position="top-left"
      :style="{ height: '100%', width: '100%' }"
    >
      <!-- channel-edit组件 -->
      <channel-edit
        :myChannels="channels"
        :active="active"
        @deleteChannel="deleteChannels"
        @addchannels="addchannel"
        @update-active="onUpdateActive"
      />
      <!--channel-edit组件  -->
    </van-popup>
  </div>
</template>

<script>
import { getUserChannel } from '@/api/user'
import { deletelUserChannel, addUserChannel } from '@/api/article'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      channels: [],
      show: false // 这里我们先设置为 true 就能看到弹窗的页面了
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      if (this.user) {
        const { data } = await getUserChannel()
        this.channels = data.data.channels
      } else {
        // 没有登录
        const bbb = getItem('TOUTIAO_CHANNELS')
        // 本地存储有信息
        if (bbb) {
          this.channels = bbb
        } else {
          // 本地存储啥都没
          const { data } = await getUserChannel()
          this.channels = data.data.channels
        }
      }
    },
    // async loadChannels() {
    //   const localChannels = getItem('TOUTIAO_CHANNELS')
    //   if (this.user || !localChannels) {
    //     const { data } = await getUserChannel()
    //     this.channels = data.data.channels
    //   } else {
    //     this.channles = localChannels
    //   }
    // },
    showPopup() {
      this.show = true
    },
    // 给我的频道增加item
    async addchannel(item) {
      this.channels.push(item)
      if (this.user) {
        // 登录的话 就调接口
        try {
          await addUserChannel({
            id: item.id,
            // 顺序序号
            seq: this.channels.length
          })
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        const TOKEN_CHANNELS = 'TOUTIAO_CHANNELS'
        // 未登录的话 把当前的频道内容存到localstorage中
        setItem(TOKEN_CHANNELS, this.channels)
      }
    },
    // 切换频道
    onUpdateActive(index) {
      this.active = index
      // 切换频道完了以后自动关闭当前弹框 回到频道页面
      this.show = false
    },
    // 删除频道
    async deleteChannels(item) {
      if (this.active > item.index) {
        this.active--
      }
      this.channels.splice(item.index, 1)
      console.log(item.index)
      console.log(item)
      console.log(deletelUserChannel)
      // 删除的时候判断有没有登录
      try {
        if (this.user) {
          await deletelUserChannel(item.channelItem.id)
          console.log(this.user)
        } else {
          const TOKEN_CHANNELS = 'TOUTIAO_CHANNELS'
          setItem(TOKEN_CHANNELS, this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-bottom: 20px;
  // padding-top: 174px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .van-button {
    width: 630px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    position: fixed;
    top: 92px;
    z-index: 1;
    width: 100%;
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }
    .van-tab--active .van-tab__text {
      color: red !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }

  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>
