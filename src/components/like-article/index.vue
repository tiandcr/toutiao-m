<template>
  <van-icon
    color="attitude ===1 ? 'red' : ''"
    :name="attitude === 1 ? 'good-job':'good-job-o'"
    @click="onFollow"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  data() {
    return {}
  },
  model: {
    prop: 'attitude',
    event: 'update-attitude'
  },
  props: {
    attitude: {
      type: Number,
      required: true
    },
    art_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      // console.log(this.attitude)
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        if (this.attitude === 1) {
          await deleteLike(this.art_id)
          //   this.$emit('update-attitude', -1)
          //   this.article.attitude = -1
          // this.$toast.success('取消点赞')
        } else {
          await addLike(this.art_id)
          //   this.article.attitude = 1
          // this.$toast.success('点赞成功')
        }
        this.$emit('update-attitude', this.attitude === 1 ? -1 : 1)
        this.$toast.success(this.attitude === 1 ? '取消点赞' : '点赞成功')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped>
</style>
