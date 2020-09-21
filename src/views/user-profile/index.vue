<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->
    <input type="file" ref="inputFile" @change="inputChange" hidden />
    <van-cell title="头像" is-link @click="$refs.inputFile.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true" />
    <van-cell title="性别" :value="user.gender ? '女' : '男'" is-link @click="isUpdategenderShow = true" />
    <van-cell title="生日" :value="user.birthday || '1977-00-00'" is-link @click="isUpdateBirthdayShow = true" />
    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" style="height: 90%" position="bottom">
      <!-- 更新昵称组件 -->
      <update-name @close="isUpdateNameShow = false" v-model="user.name" v-if="isUpdateNameShow" />
      <!-- /更新昵称组件 -->
    </van-popup>
    <!-- 编辑昵称 -->

    <van-popup v-model="isUpdategenderShow" position="bottom" item-height="20px">
      <!-- 更新性别组件 -->
      <update-gender @close="isUpdategenderShow = false" v-model="user.gender" v-if="isUpdategenderShow" />
      <!-- /更新性别组件 -->
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <!-- 更新生日组件 -->
      <update-birthday @close="isUpdateBirthdayShow = false" v-model="user.birthday" v-if="isUpdateBirthdayShow" />
      <!-- /更新生日组件 -->
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" style="height: 100%" position="bottom">
      <updated-photo :src="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event" v-if="isUpdatePhotoShow" />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import updateName from './components/update-name.vue'
import updateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthdy.vue'
import updatedPhoto from './components/update-photo'
export default {
  name: 'userProfile',
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdategenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  components: {
    updateName,
    updateGender,
    UpdateBirthday,
    updatedPhoto
  },
  created() {
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        const res = await getUserProfile()
        this.user = res.data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    inputChange() {
      const file = this.$refs.inputFile.files[0]
      // 获取blob数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      console.log(file)
      console.log(this.img)
      // console.log(imgUrl)
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.inputFile.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background: #fff;
  }
}
</style>
