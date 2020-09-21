<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-history')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index" @click="onHistoryClick(item, index)">
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  data() {
    return {
      isDeleteShow: false
    }
  },
  props: {
    // 输入框的内容
    searchHistories: {
      type: Array,
      required: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onHistoryClick(item, index) {
      if (this.isDeleteShow) {
        this.$emit('deleteIndex', index)
      } else {
        this.$emit('searchItem', item)
      }
    }
  }
}
</script>

<style scoped></style>
