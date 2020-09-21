
<template>
  <!-- list只有在可视范围才可以加载 -->
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <comment-item
      v-for="(item,index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click',$event)"
    ></comment-item>
  </van-list>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    art_id: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null // 请求下一页数据的页码
      // flag: false
    }
  },
  computed: {},
  watch: {},
  created() {
    // 当手动初始onload的话，他不会自动开始初始的loading
    this.onLoad()
    this.loading = true
  },
  mounted() {},
  methods: {
    async onLoad() {
      console.log('aaaaa')
      // this.flag = true
      try {
        const { data } = await getComment({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.art_id + '', // 源id，文章id或评论id
          offset: this.offset, // 请求下一页数据的页码, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 10 // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data)
        const { results } = data.data
        this.list.push(...results)
        this.$emit('totalList', data.data.total_count)
        // 加载状态结束
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id // 更新获取下一页数据的页码
        } else {
          this.finished = true // 没有数据了，关闭加载更多
        }
      } catch (err) {
        // console.log(err)
        this.$toast('获取评论失败')
      }
    },
    addlist(data) {
      console.log(data)
      // if (this.flag) {
      this.list.unshift(data)
      // }
      // console.log(this.list)
    }
  }
}
</script>

<style scoped lang='less'>
.van-list {
  margin-bottom: 45px;
}
</style>
