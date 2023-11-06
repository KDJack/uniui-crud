<template>
  <view class="uniui-curd-sign">
    <view class="sign-data-panel" @click.stop="show">
      <image v-if="currentValue?.shareUrl" style="width: 100%; height: 100%" mode="aspectFit" :src="currentValue.shareUrl" />
      <view v-else class="text">点击签字</view>
    </view>

    <uni-popup ref="signPopupRef" type="bottom" :safe-area="false" @touchmove.stop="() => {}">
      <view class="sign-content">
        <canvas class="mycanvas" canvas-id="mycanvas" disable-scroll="true" style="width: 100%; height: 70vw" @touchstart="handelTouchstart" @touchmove="handelTouchmove" @touchend="handelTouchend" />
        <view class="content_btn">
          <uniui-curd-btn :desc="{ label: '清空', plain: true, on: { click: clear } }"></uniui-curd-btn>
          <uniui-curd-btn :desc="{ label: '确定', mask: true, on: { click: upload } }"></uniui-curd-btn>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
// import { serverBaseUrl } from '@/config/index'
import { onMounted, ref, getCurrentInstance } from 'vue'

const instance = getCurrentInstance() as any

const props = defineProps<{
  modelValue?: IOssInfo | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])

// eslint-disable-next-line vue/no-setup-props-destructure
const currentValue = ref(props.modelValue)
emits('update:modelValue', currentValue)

const signPopupRef = ref()
const picture = ref()
const points = ref([] as any[])
const isClear = ref(true)
const windowWidth = ref(0)
const windowHeight = ref(0)

/**
 * 显示触摸板
 */
function show() {
  picture.value.lineWidth = 4
  picture.value.lineCap = 'round'
  picture.value.lineJoin = 'round'
  signPopupRef.value.open()
}

/**
 * 开始触摸
 * @param e
 */
function handelTouchstart(e: any) {
  let startX = e.changedTouches[0].x
  let startY = e.changedTouches[0].y
  let startPoint = { X: startX, Y: startY }
  points.value.push(startPoint)
  picture.value.beginPath()
}

/**
 * 触摸移动
 * @param e
 */
function handelTouchmove(e: any) {
  if (isClear.value) {
    isClear.value = false
  }
  let moveX = e.changedTouches[0].x
  let moveY = e.changedTouches[0].y
  let movePoint = { X: moveX, Y: moveY }
  points.value.push(movePoint)
  let len = points.value.length
  if (len >= 2) {
    draw()
  }
}

/**
 * 触摸结束
 */
function handelTouchend() {
  points.value = []
}

/**
 * 手写
 */
function draw() {
  let point1 = points.value[0]
  let point2 = points.value[1]
  points.value.shift()
  picture.value.moveTo(point1.X, point1.Y)
  picture.value.lineTo(point2.X, point2.Y)
  picture.value.stroke()
  picture.value.draw(true)
}

/**
 * 清空
 */
function clear(notClearVal?: boolean) {
  isClear.value = true
  if (!notClearVal) {
    currentValue.value = null
  }
  picture.value.clearRect(0, 0, windowWidth.value, windowHeight.value)
  picture.value.draw(true)
}

/**
 * 完成签名
 */
function upload({ callBack }: IBtnBack) {
  if (isClear.value) {
    currentValue.value = null
    // 这里清空一下画布
    clear(true)
    signPopupRef.value.close()
    callBack && callBack()
    return false
  }
  // #ifdef MP-WEIXIN
  uni.canvasToTempFilePath(
    {
      canvasId: 'mycanvas',
      success: async (res) => {
        // currentValue.value = res.tempFilePath;
        await setUnload(res)
        // 这里清空一下画布
        clear(true)
        signPopupRef.value.close()
      },
      fail: (res) => {
        // eslint-disable-next-line no-console
        console.log(res)
      },
      complete: () => {
        callBack && callBack()
      }
    },
    instance
  )
  // #endif
  // #ifndef MP-WEIXIN
  uni.canvasToTempFilePath({
    canvasId: 'mycanvas',
    success: async (res) => {
      // currentValue.value = res.tempFilePath;
      await setUnload(res)
      // 这里清空一下画布
      clear(true)
      signPopupRef.value.close()
    },
    fail: (res: any) => {
      // eslint-disable-next-line no-console
      console.log(res)
    },
    complete: () => {
      callBack && callBack()
    }
  })
  // #endif
}

async function setUnload(file: any) {
  if (!props.desc?.action) {
    console.warn('desc中未配置 action 属性 ，无法自动上传，需手动处理上传....')
    return await new Promise((resolve) => resolve(true))
  }
  let token = uni.getStorageSync('token')
  uni.uploadFile({
    //图片上传地址
    // url: serverBaseUrl + 'file/fileannex/upload',
    url: props.desc.action,
    filePath: file.tempFilePath,
    //上传名字，注意与后台接收的参数名一致
    name: 'file',
    header: {
      Authorization: token
    },
    formData: {
      //HTTP 请求中其他额外的 form data
      filename: new Date().getTime() + '.png' //后端接口需要加.png
    },
    //请求成功，后台返回自己服务器上的图片地址
    success: (res) => {
      const data = JSON.parse(res.data).result
      currentValue.value = data
    },
    fail: () => {
      uni.showToast({
        title: '上传失败，请稍候再试！',
        duration: 1000,
        icon: 'none'
      })
      return
    }
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  windowWidth.value = systemInfo.windowWidth || 0
  windowHeight.value = systemInfo.windowHeight || 0

  picture.value = uni.createCanvasContext('mycanvas', instance)
  picture.value.lineWidth = 4
  picture.value.lineCap = 'round'
  picture.value.lineJoin = 'round'
})

defineExpose({ show })
</script>
<style lang="scss" scoped>
.uniui-curd-sign {
  width: 100%;
  padding-bottom: 40rpx;

  .sign-data-panel {
    width: 100%;
    height: 50vw;
    background: #f0faf7;
    border-radius: 4rpx;
    display: flex;
    .text {
      margin: auto;
      font-size: 36rpx;
      font-weight: 600;
      color: $uni-color-primary;
    }
  }

  .sign-content {
    width: 100%;
    height: 100vw;
    background-color: white;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    z-index: 1;
    .mycanvas {
      width: 100%;
      height: 50vw;
      background-color: rgba(0, 0, 0, 0.1);
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.3);
    }
    .content_btn {
      box-sizing: border-box;
      padding: 40rpx;
      margin-top: 40rpx;
      width: 100%;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
