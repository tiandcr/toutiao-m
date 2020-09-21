<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="arrow-left" @click="$router.go(-1)" />
    </van-nav-bar>
    <!--登录表单 -->
    <van-form @submit="onSubmit" class="login-form" ref="loginForm">
      <!-- 手机表单 -->
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>
      <!-- 验证吗表单 -->
      <van-field
        name="code"
        placeholder="请输入验证码"
        class="pwd-btn"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <!-- 倒计时验证码 -->
        <van-count-down
          slot="button"
          :time="1000 * 10"
          format="ss s"
          v-if="isCountDowmShow"
          @finish="isCountDowmShow=false"
        />
        <!-- 获取验证码的按钮 -->
        <van-button
          v-else
          slot="button"
          round
          class="send-sms-btn"
          size="small"
          @click="onSendSms"
          native-type="button"
        >获取验证码</van-button>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'

export default {
  data() {
    return {
      // 用户登录的手机号和验证码
      user: {
        mobile: '',
        code: ''
      },
      // 表单验证规则
      userFormRules: {
        mobile: [
          { required: true, message: '请填写用户名' },
          {
            pattern: /1[3|5|7|8]\d{9}/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDowmShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 表单提交
    async onSubmit() {
      // 1获取表单数据
      const user = this.user
      // 2 表单验证
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0 // 持续展示 toast
      })
      // 3 提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        // data.data是后台返回的token
        // console.log(data)
        this.$toast.success('登录成功')
        // 登录成功，跳转到个人中心页面
        this.$router.push('/my')
        // this.$router.back()
      } catch (err) {
        console.log(err.response)
        if (err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
        this.$toast.fail('登录失败,请稍后重试')
      }
      // 4 根据请求响应结果处理后续操作
    },
    async onSendSms() {
      // 1 校验手机号  上面的是登录的时候才会校验
      try {
        this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败')
      }
      // 2 验证通过，显示倒计时
      this.isCountDowmShow = true
      // 3 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      border-radius: 15px;
    }
  }
  .login-form {
    padding: 30px 10px;
  }
}
</style>
