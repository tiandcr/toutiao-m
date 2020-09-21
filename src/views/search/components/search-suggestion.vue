<template>
  <div class="Search-suggestion">
    <van-cell icon="search" v-for="(text, index) in suggstions" :key="index" @click="$emit('search', text)">
      <span slot="title" v-html="$options.filters.hightLight(text, searchText)"></span>
    </van-cell>
  </div>
  <!--
    <text :aa="text|hightLight">

    <div v-html="aa"><div>
   -->
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
//  按需加载好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    // 输入框的内容
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggstions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      //  监视的处理函数
      // debounce
      // 参数1 ：函数
      // 参数2： 延迟时间
      // 返回值：防抖之后的函数
      handler: debounce(function(value) {
        //  console.log(value)
        this.loadSearchSuggestions(value)
      }, 1000),
      // 首次监视就触发
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        console.log(data)
        this.suggstions = data.data.options
      } catch (err) {
        console.log(err)
      }
    }
    // ,
    // hightLight(text) {
    //   const str = `<span style="color:red">${this.searchText}</span>`
    //   // 创建一个正则表达式
    //   // 参数1： 匹配模式字符串
    //   // 参数2 匹配模式，写道字符串中
    //   const reg = new RegExp(this.searchText, 'gi')
    //   return text.replace(reg, str)
    // }
  }
}
</script>

<style scoped></style>
