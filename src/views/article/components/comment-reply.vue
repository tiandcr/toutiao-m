<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="commentTotal">
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 当前评论项 -->
    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>
      <!-- /当前评论项 -->
      <van-cell title="所有回复" />
      <!-- 评论的回复列表 -->
      <comment-list type="c" :art_id="comment.com_id" ref="commentlist"></comment-list>
      <!-- /评论的回复列表 -->
    </div>
    <!-- 底部 -->
    <div class="reply-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow=true"
        block
      >写评论</van-button>
    </div>
    <!-- /底部 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <article-comment :target="comment.com_id" @onpost-success="onAddsuccess" />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentList from './comment-list'
import CommentItem from './comment-item'
import ArticleComment from './article-comment'
export default {
  name: 'CommentReply',
  components: {
    CommentList,
    CommentItem,
    ArticleComment
  },
  props: {
    comment: {
      // 当前评论的回复项
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false
    }
  },
  computed: {
    commentTotal() {
      if (this.comment.reply_count > 0) {
        return `${this.comment.reply_count}条回复`
      } else {
        return '暂无回复'
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // onPostSuccess() {
    //   this.isPostShow = true
    // },
    onAddsuccess(data) {
      //   console.log(this.comment.com_id)
      this.$refs.commentlist.addlist(data)
      this.comment.reply_count++
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-reply {
  .van-nav-bar {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
  }
  //   .scroll-wrap {
  //     position: fixed;
  //     top: 92px;
  //     left: 0;
  //     right: 0;
  //     bottom: 88px;
  //     overflow-y: auto;
  //   }
  //   .reply-bottom {
  //     position: fixed;
  //     bottom: 0;
  //     left: 0;
  //     right: 0;
  //     height: 88px;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     background-color: #fff;
  //     border-top: 1px solid #d8d8d8;
  //     .write-btn {
  //       width: 60%;
  //     }
  //   }
  .comment-btn {
    position: fixed;
    bottom: 0;
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }
}
</style>
