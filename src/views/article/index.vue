<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="onClickLeft"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- 模板中的$event是事件参数
          当我们传递给子组件的数据既要使用还要修改的时候
          传递：props :is_followed="article.is_followed"
          修改: 自定义事件 @update-follow="article.is_followed = $event
          简写方式： 在组件上使用 v-model
          默认传递的属性
          value="article.isfollowed"
          默认接收的事件
          @input="article.isfollowed=$event"
          -->
          <!-- <follow-user :is_followed="article.is_followed" :user_id="article.aut_id" @update-follow="article.is_followed = $event"></follow-user> -->
          <follow-user :user_id="article.aut_id" v-model="article.is_followed"></follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="contentRef"></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论列表 -->
        <comment-list
          type="a"
          :art_id="article.art_id"
          @totalList="totalList=$event"
          ref="commentlist"
          @reply-click="commentReply"
        />
        <!-- /文章列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPOSTShow=true"
          >写评论</van-button>

          <!-- 评论总数 -->
          <van-icon name="comment-o" :info="totalList" color="#777" />

          <!-- 收藏文章 -->
          <collect-article :art_id="article.art_id" v-model="article.is_collected"></collect-article>
          <!-- /收藏文章 -->

          <!-- 点赞文章 -->
          <like-article :art_id="article.art_id" v-model="article.attitude"></like-article>
          <!-- /点赞文章 -->
          <van-icon name="share" color="#777777"></van-icon>

          <!-- 文章评论 -->
          <van-popup v-model="isPOSTShow" position="bottom">
            <article-comment :target="article.art_id" @onpost-success="onAddsuccess" />
          </van-popup>
          <!-- /文章评论 -->
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticleInfo">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染的，只有在第一次展示时候才会渲染里面的内容 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 90%">
      <comment-reply :comment="currentComment" @click-close="isReplyShow=false" v-if="isReplyShow"></comment-reply>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import ArticleComment from './components/article-comment'
import CommentList from './components/comment-list'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  provide() {
    return {
      art_id: this.articleId
    }
  },
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    ArticleComment,
    CommentList,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      isLoading: true,
      errStatus: 0,
      isPOSTShow: false,
      totalList: '',
      isReplyShow: false,
      currentComment: {} // 当前评论的回复项
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticleInfo()
  },
  mounted() {},
  methods: {
    async loadArticleInfo() {
      try {
        // const a = Math.random()
        // if (a > 0.5) {
        //   JSON.parse('ccccccccccc')
        // }
        console.log(this.article)
        const { data } = await getArticleById(this.articleId)
        console.log(data)
        this.article = data.data
        this.isLoading = false
        // 在数据更改之后立即使用 然后等待 DOM 更新。
        this.$nextTick(() => {
          this.previewImg()
        })
        // setTimeout(() => {
        //   this.previewImg()
        // }, 10)
      } catch (err) {
        console.log(err.response)
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        } else {
          this.$toast('获取失败')
        }
      }
      this.isLoading = false
    },
    // 图片预览
    previewImg() {
      const contentEL = this.$refs.contentRef
      const allImg = contentEL.querySelectorAll('img')
      // 声明一个存取图片地址的数组
      const images = []
      allImg.forEach((element, index) => {
        // 获取每个img的src,添加到数组中
        images.push(element.src)
        // 给每个图片添加点击事件
        element.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    // 点击返回
    onClickLeft() {
      this.$router.back()
    },
    // 发布评论成功
    onAddsuccess(data) {
      // console.log(data)
      this.$refs.commentlist.addlist(data)
      this.totalList++
      this.isPOSTShow = false
    },
    // 评论回复
    commentReply(comment) {
      this.isReplyShow = true
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
