<template>
  <div class="update-name">
    <van-nav-bar
      title="昵称"
      right-text="保存"
      @click-right="onClickRight"
      left-arrow
      @click-left="$emit('close')"
    />
    <div class="text">昵称</div>
    <!-- 输入框 -->
    <div style="padding: 10px;">
      <van-field
        v-model="localName"
        placeholder="请输入昵称"
        clearable
        maxlength="7"
        show-word-limit
        type="textarea"
      />
    </div>
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  data() {
    return {
      localName: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onClickRight() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      if (!this.localName.trim()) {
        return this.$toast('请输入昵称')
      }
      // 没有更改关闭弹出层
      if (this.localName === this.value) {
        return this.$emit('close')
      }
      try {
        const { data } = await updateUserName({
          name: this.localName
        })
        // 更新昵称
        this.$emit('input', this.localName)
        // 关闭弹层
        this.$emit('close')
        // 提示消息
        this.$toast('更新成功')
        console.log(data)
      } catch (err) {
        if (err.response && err.response.status === 409) {
          return this.$toast('用户名已存在')
        }
        this.$toast('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-name {
  .text {
    padding: 28px 38px;
    font-size: 40px;
  }
}
</style>
