import Vue from 'vue'
import dayjs from 'dayjs'
// // 加载中文语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用中文语言包
dayjs.locale('zh-cn')
// dayjs() 获取当前最新时间

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
