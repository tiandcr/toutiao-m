/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import jsonBig from 'json-bigint'

// 配置基准路径
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  transformResponse: [
    function(data) {
      // 对 data 进行任意转换处理
      try {
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // console.log(config)
    // Do something before request is sent
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 务必要有，要不请求发不出去
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response
  },
  async function(error) {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      // 登录超时，通过refresh_token刷新token
      const refreshToken = store.state.user.refresh_token
      const ret = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: 'Bearer' + refreshToken
        }
      })
      store.commit('setUser', {
        token: ret.data.data.token,
        refresh_token: refreshToken
      })
      return request(error.config)
    }
    return Promise.reject(error)
  }
)

export default request
