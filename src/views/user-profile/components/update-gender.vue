<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  data() {
    return {
      columns: ['男', '女'],
      gender: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      try {
        const { data } = await updateUserName({
          gender: this.gender
        })
        // 更新昵称
        this.$emit('input', this.gender)
        // 关闭弹层
        this.$emit('close')
        // 提示消息
        this.$toast('更新成功')
        console.log(data)
      } catch (err) {
        this.$toast('更新失败')
      }
    },
    onChange(picker, value, index) {
      // 将选择后的名别inde赋值给gender
      this.gender = index
      // this.Toast(`当前值：${value}, 当前索引：${index}`)
    }
  }
}
</script>

<style scoped lang="less">
.update-gender {
  .text {
    padding: 28px 38px;
    font-size: 40px;
  }
}
</style>
