<template>
  <div class="Search-result">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="refreshSuccessText" :success-duration="1500">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search.js'
export default {
  name: 'SearchResult',
  components: {},
  data() {
    return {
      list: [], // 数据列表
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false,
      isLoading: false,
      refreshSuccessText: ''
    }
  },
  props: {
    // 输入框的内容
    searchText: {
      type: String,
      required: true
    }
  },
  computed: {},
  created() {},
  methods: {
    // 上拉加载
    async onLoad() {
      try {
        var params = {
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        }
        const { data } = await getSearchResults(params)
        const results = data.data.results
        this.list.push(...results)
        // 加载状态结束
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          // 数据全部加载完成
          this.finished = true
        }
        console.log(data)
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新
    async onRefresh() {
      console.log('onRefresh')
      try {
        // 请求获取数据
        const { data } = await getSearchResults({
          page: 1,
          per_page: this.per_page,
          q: this.searchText
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
.Search-result {
  height: 94vh;
  overflow: auto;
}
</style>
