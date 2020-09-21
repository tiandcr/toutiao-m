import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import './style/index.less'
// 导入vant相关的组件
import './plugins/vant'
// 可伸缩布局方案
import 'amfe-flexible'
// 导入处理时间的过滤器
import './utils/dayjs'
// 阻止启动生产提示
Vue.config.productionTip = false

Vue.filter('hightLight', function(text, value) {
  const str = `<span style="color:red">${value}</span>`
  const reg = new RegExp(value, 'gi')
  return text.replace(reg, str)
})

new Vue({
  router, // 要通过 router 配置参数注入路由，
  store,
  render: h => h(App)
}).$mount('#app')
