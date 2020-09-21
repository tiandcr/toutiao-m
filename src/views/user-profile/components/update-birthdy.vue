<template>
  <div class="update-gender">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
    <!--
      currentDate：双向绑定日期选择器
      min-date:可选最小日期
      max-date：可选最大日期
    -->
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'
import dayJs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
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
    async onConfirm() {
      try {
        const { data } = await updateUserName({
          birthday: dayJs(this.currentDate).format('YYYY-MM-DD')
        })
        // 更新生日
        this.$emit('input', dayJs(this.currentDate).format('YYYY-MM-DD'))
        // 关闭弹层
        this.$emit('close')
        // 提示消息
        this.$toast('更新成功')
        console.log(data)
      } catch (err) {
        this.$toast('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
