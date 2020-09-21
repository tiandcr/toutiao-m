<template>
  <van-button
    :loading="isFollowLoading"
    v-if="is_followed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="isFollowLoading"
  >关注</van-button>
  <!-- 需要文章用户的id值 // 是否被关注is_followed -->
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'follow-user',
  model: {
    prop: 'is_followed',
    event: 'update-follow'
  },
  props: {
    is_followed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  data() {
    return {
      isFollowLoading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      // 一点击就开启loading
      this.isFollowLoading = true
      try {
        if (this.is_followed) {
          await deleteFollow(this.user_id)
        } else {
          await addFollow(this.user_id)
        }
        this.$emit('update-follow', !this.is_followed)
        // this.is_followed = !this.is_followed
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return this.$toast.fail('不能关注自己')
        }
        this.$toast.fail('操作失败')
      }
      // 更新完取消
      this.isFollowLoading = false
    }
  }
}
</script>

<style scoped></style>
