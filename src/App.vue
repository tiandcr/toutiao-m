<template>
  <div id="app">
    <!-- 路由出口 -->
    <keep-alive include="layout">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>
>
<style lang="less">
#box {
  width: 200px;
  height: 200px;
  background-color: #999;
}
</style>
