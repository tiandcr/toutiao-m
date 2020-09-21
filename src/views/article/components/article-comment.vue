<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
      clearable
    />
    <van-button class="post-btn" @click="onAddComment">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  data() {
    return {
      message: ''
    }
  },
  props: {
    // // 文章id
    // art_id: {
    //   type: [Number, String, Object],
    //   required: true
    // },
    // 爹传
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 文章的id
  inject: {
    art_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  computed: {
    newDate() {
      if (this.target.toString() === this.art_id.toString()) {
        return null
      } else {
        return this.art_id
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onAddComment() {
      //   const content = this.message.trim()
      // 非空校验
      console.log(this.newDate)
      // console.log(this.art_id)
      if (!this.message.length) {
        return this.$toast('请输入内容')
      }
      try {
        const { data } = await addComment({
          target: this.target, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.newDate // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // console.log(data)
        this.$emit('onpost-success', data.data.new_obj)
        this.message = ''
        // console.log(data.data.new_obj)
        // console.log(this.message)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
