import request from '@/utils/request'

// 获取文章列表数据
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
// 获取频道列表
export const getAllchannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
// 添加频道
export const addUserChannel = channel => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: { channels: [channel] }
  })
}
// 删除用户指定的频道
export const deletelUserChannel = channel => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channel}`
  })
}

// 获取新闻文章详情
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}
// 收藏文章
export const addCollect = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target: userId
    }
  })
}
// 取消收藏文章
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${target}`
  })
}
// 点赞
export const addLike = articleId => {
  // （被取消关注的用户id）
  // 目标用户（被取消关注的用户id）
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}
// 取消点赞
export const deleteLike = articleId => {
  // （被取消关注的用户id）
  // 目标用户（被取消关注的用户id）
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
