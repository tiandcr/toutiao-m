<template>
  <div class="my-container">
    <!--  已登录-->
    <div class="header userinfo" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button to="/user/profile" type="default" size="mini" round>编辑资料</van-button>
        </div>
      </div>

      <div class="data-states">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img src="~@/assets/mobile.png" alt />
        <span>登录 / 注册</span>
      </div>
    </div>
    <!-- 宫格导航 -->
    <van-grid :column-num="2" clickable class="nav-grid">
      <van-grid-item text="收藏">
        <i slot="icon" class="iconfont iconshoucang"></i>
        <span class="text" slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i slot="icon" class="iconfont iconlishi"></i>
        <span class="text" slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 单元格 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link></van-cell>
      <van-cell title="小志同学" is-link></van-cell>
      <van-cell v-if="user" title="退出登录" class="logout-cell" @click="onLogout" clickable></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyPage',
  components: {},
  data() {
    return {
      // 个人详细信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 初始化的时候，如果用户登录了，就请求获取当前登录的信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted() {},
  methods: {
    onLogout() {
      // 退出提示
      this.$dialog
        .confirm({
          title: '推出提示',
          message: '确认退出'
        })
        .then(() => {
          // on confirm
          // 确认退出 清除登录状态 容器中的user＋本地存储中的user
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消执行这里')
          // on cancel
        })
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        // console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background-image: url('~@/assets/banner.png');
    background-size: cover;
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      img {
        width: 152px;
        height: 152px;
        margin-bottom: 15px;
      }
      span {
        font-size: 28px;
        color: #ffffff;
      }
    }
  }
  .userinfo {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 30px;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 20px;
          border: 2px solid #fff;
        }
      }
    }
    .data-states {
      display: flex;
      justify-content: center;
      .data-item {
        height: 130px;
        display: flex;
        justify-content: center;
        flex: 1;
        flex-direction: column;
        align-items: center;
        color: #ffffff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .nav-grid {
    background: #fff;
    .iconfont {
      font-size: 45px;
    }
    .iconshoucang {
      color: #eb5253;
    }
    .iconlishi {
      color: #ff9d1d;
    }
    .text {
      color: #000;
      font-size: 28px;
      margin-top: 8px;
    }
  }
  .logout-cell {
    height: 100px;
    text-align: center;
    margin: 10px 0;
    font-size: 30px;
  }
}
</style>
