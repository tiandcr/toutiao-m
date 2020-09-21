<template>
  <!-- <van-button :loading="isFollowLoading" v-if="is_collected" class="follow-btn" round size="small" @click="onFollow">已关注</van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading="isFollowLoading"
    >关注</van-button
  >-->
  <!-- 需要文章用户的id值 // 是否被关注is_followed -->
  <van-icon
    :color="is_collected ? '#ffa500' : ''"
    :name="is_collected?'star':'star-o'"
    @click="onFollow"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'collectArticle',
  model: {
    prop: 'is_collected',
    event: 'update-collected'
  },
  props: {
    is_collected: {
      type: Boolean,
      required: true
    },
    art_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {
    is_collected() {
      this.$toast.success(this.is_collected ? '收藏成功' : '取消收藏')
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      // 一点击就开启loading
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        if (this.is_collected) {
          const res = await deleteCollect(this.art_id)
          console.log(res)
        } else {
          const res = await addCollect(this.art_id)
          console.log(res)
        }
        this.$emit('update-collected', !this.is_collected)
        // 上面的代码只想完，this.is_collected的值还没有立马修改，因此监听this.is_collected值的变化，来判断收藏的状态
        // this.$toast.success(this.is_collected ? '取消收藏' : '收藏成功')
        // this.is_followed = !this.is_followed
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped></style>
