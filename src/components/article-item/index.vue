<template>
  <van-cell class="article-item" :to="`/article/${item.art_id}`">
    <div slot="title" class="title">{{ item.title }}</div>
    <!-- 三张图显示与否 -->
    <div slot="label">
      <div v-if="item.cover.type === 3" class="cover-wrap">
        <div v-for="(img, index) in item.cover.images" :key="index" class="cover-item">
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>
      <!-- 几个标签 -->
      <div class="label-info-wrap">
        <span>{{ item.aut_name }}</span>
        <span>{{ item.comm_count }}评论</span>
        <span>{{ item.pubdate | relativeTime }}</span>
      </div>
    </div>

    <van-image v-if="item.cover.type === 1" class="right-cover" slot="default" :src="item.cover.images[0]" />
  </van-cell>
</template>

<script>
export default {
  name: '',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 125px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
