<template>
  <div class="qa-container">
    问答
    <div>苹果的价格是{{ newPrice }}</div>
    <span class="title">aaaa</span>
    <mybutton />
  </div>
</template>

<script>
import mybutton from './mybutton'
export default {
  name: 'QaPage',
  components: {
    mybutton
  },
  data() {
    return {
      price: 100
    }
  },
  computed: {
    // 当我们需要一项新的数据，这项新的数据依赖于data中的另一项数据
    newPrice() {
      return this.price > 0 ? '100元' : '0'
    }
  },
  filters: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang='less'>
.qa-container {
  background-color: red;
  /deep/ .title {
    color: white;
  }
}
</style>
