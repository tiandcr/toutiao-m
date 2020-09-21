<template>
  <div class="Search-container">
    <!-- 顶部搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        shape="round"
        background="#3296fa"
        @focus="isResultShow = false"
      />
      <!-- 搜索结果 -->
      <Search-result v-if="isResultShow" :search-text="searchText" />
      <!-- 联想建议 -->
      <Search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch" />
      <!-- 搜索历史记录 -->
      <!-- 文本框没有内容显示历史记录 -->
      <Search-history
        v-else
        :search-histories="searchHistories"
        @clear-search-history="searchHistories = []"
        @deleteIndex="deleteIndex"
        @searchItem="onSearch"
      />
    </form>
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-results'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('serach-histories') || []
    }
  },
  computed: {},
  watch: {
    searchHistories(val) {
      // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  mounted() {
    document.querySelector('.van-field__control').focus()
    // document.getElementById('').focus()
  },
  methods: {
    onSearch(val) {
      // console.log(val)
      if (val === '') {
        return false
      }
      this.searchText = val
      this.isResultShow = true
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // -1是有，删掉
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
    },
    onCancel() {
      this.$router.back()
    },
    // 删除历史的某一个
    deleteIndex(index) {
      this.searchHistories.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
.Search-container {
  //   height: 94vh;
  //   overflow: auto;
  padding-top: 106px !important;
  /deep/.van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #ffffff;
  }
  .van-search__action:hover {
    background-color: #3296fa;
  }
}
</style>
