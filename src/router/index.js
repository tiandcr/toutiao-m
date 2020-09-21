import Vue from 'vue'
import VueRouter from 'vue-router'
// 注册路由
Vue.use(VueRouter)

// 路由表
const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/search', name: 'search', component: () => import('@/views/search') },
  { path: '/article/:articleId', name: 'article', component: () => import('@/views/article'), props: true },
  { path: '/user/profile', name: 'user-profile', component: () => import('@/views/user-profile') },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]
// 配置路由实例对象
const router = new VueRouter({
  routes
})

export default router
