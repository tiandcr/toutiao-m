<template>
  <div class="update-photo">
    <img :src="src" ref="photo" />
    <div class="toolbar">
      <span @click="$emit('close')">取消</span>
      <span @click="comfirm">完成</span>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserAvatar } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  components: {},
  data() {
    return {}
  },
  props: {
    src: {
      type: [String, Object],
      retuired: true
    }
  },
  created() {},
  mounted() {
    const image = this.$refs.photo
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
  },
  methods: {
    comfirm() {
      //   console.log(this.cropper.getData())
      this.cropper.getCroppedCanvas().toBlob(
        blob => {
          this.updateUserPhoto(blob)
        } /*, 'image/png' */
      )
    },
    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const formData = new FormData()
        // Pass the image file name as the third parameter if necessary.
        formData.append('photo', blob /*, 'example.png' */)
        const { data } = await updateUserAvatar(formData)
        this.$emit('update-photo', data.data.photo)
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background: #000;
  width: 100%;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
img {
  display: block;
  max-width: 100%;
}
</style>
