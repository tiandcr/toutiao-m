<template>
  <div class="article-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="refreshSuccessText" :success-duration="1500">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- article-item子组件 -->
        <article-item v-for="(item, index) in list" :key="index" :title="item.title" :item="item"></article-item>
        <!-- article-item子组件 -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 刚开始的时间戳
      error: false,
      isLoading: false,
      refreshSuccessText: ''
    }
  },
  methods: {
    // 上拉加载
    async onLoad() {
      // 异步更新数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('ddd')
        // }
        const { results } = data.data
        //  this.list = data.data.results
        this.list.push(...results)
        console.log(data)
        // console.log(this.list)
        // 本次数据加载结束之后要把吧加载状态设置为结束
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        console.log(err)
      }
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.list.push(this.list.length + 1)
      //     }

      //     // 加载状态结束
      //     this.loading = false

      //     // 数据全部加载完成
      //     if (this.list.length >= 40) {
      //       this.finished = true
      //     }
      //   }, 1000)
    },
    // 下拉刷新
    // 下拉刷新时会触发 refresh 事件
    // 刷新的时候要去调接口 获取最新数据，添加到列表的最开头
    async onRefresh() {
      console.log('onRefresh')
      try {
        // 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 要获取最新的数据所以要传当前最新的时间
          with_top: 1
        })
        console.log(data)
        const { results } = data.data
        console.log(results)
        // 将数据追加到列表顶部用
        // this.list.unshift(...results)
        this.list = results
        // 3. 关闭下拉刷新的 loading 状态
        this.isLoading = false
        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
        this.onLoad()
      } catch (err) {
        this.$toast('刷新失败')
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
// 百分比参考的是父元素
// rem设置的是宽
.article-list {
  height: 89vh;
  overflow: auto;
}
</style>
