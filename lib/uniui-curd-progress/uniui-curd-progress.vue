<template>
  <view class="uniui-curd-progress">
    <view class="progress-line-panel" :style="{ height }">
      <view class="progress-line-bg" :style="{ backgroundColor: inactiveColor, height }" />
      <view class="progress-line" :style="{ backgroundColor: activeColor, height, width: parcent + '%' }">
        <view class="progress-node" @touchstart="handelTouchstart" @touchmove="handelTouchmove" />
        <template v-if="showText">
          <text class="progress-text" :style="{ transform: `translateX(${50 - parcent * 0.5}%)` }">{{ Math.floor(parcent) }}</text>
        </template>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { throttle } from 'lodash'

const emits = defineEmits(['update:modelValue', 'validateThis'])
const props = defineProps<{
  modelValue?: number | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  type?: string
}>()

let tempLength = 0

const currentValue = ref(0)
emits('update:modelValue', currentValue)

// eslint-disable-next-line vue/no-setup-props-destructure
const activeColor = ref(props.desc?.activeColor || '')
// eslint-disable-next-line vue/no-setup-props-destructure
const inactiveColor = ref(props.desc?.inactiveColor || '#ececec')
// eslint-disable-next-line vue/no-setup-props-destructure
const showText = ref(props.desc?.showText || true)
// eslint-disable-next-line vue/no-setup-props-destructure
const height = ref((props.desc?.height || 10) + 'px')
const windowWidth = ref(375)
// 保留上次的X坐标
let lastX = 0
// 本次X坐标
let thisX = 0

/**
 * 获取百分比
 */
const parcent = computed(() => {
  return currentValue.value * 100 || 0
})

// 获取步长
const step = computed(() => {
  let tempStep = props.desc.step || 1
  if (tempStep <= 0 || tempStep > 100) return 0.01
  return (props.desc.step || 1) / 100
})

/**
 * 处理开始触摸
 * @param e
 */
function handelTouchstart(e: any) {
  lastX = e.touches[0].clientX
}

/**
 * 处理触摸移动
 * @param e
 */
const handelTouchmove = throttle((e: any) => {
  thisX = e.touches[0].clientX
  // 计算步长并更新
  if (Math.abs(tempLength) >= step.value) {
    currentValue.value += step.value * (tempLength / Math.abs(tempLength))
    currentValue.value = +currentValue.value.toFixed(3)
    if (currentValue.value < 0) {
      currentValue.value = 0
    } else if (currentValue.value > 1) {
      currentValue.value = 1
    }
    tempLength = 0
  } else {
    tempLength += ((thisX - lastX) / windowWidth.value) * 1.5
  }
  lastX = thisX
}, 10)

watch(
  () => props.modelValue,
  (data: number | null | undefined) => {
    currentValue.value = data || 0
  },
  { immediate: true }
)

onMounted(() => {
  // 获取屏幕宽度
  const info = uni.getSystemInfoSync()
  windowWidth.value = info.windowWidth
})
</script>
<style lang="scss" scoped>
.uniui-curd-progress {
  width: 100%;
  display: flex;
  padding: 60rpx 20rpx;
  box-sizing: border-box;
  .progress-line-panel {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    border-radius: 8rpx;
    .progress-line-bg {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      border-radius: 8rpx;
    }
    .progress-line {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      border-radius: 8rpx;
      background-color: $uni-color-primary;
      .progress-node {
        position: absolute;
        box-sizing: border-box;
        width: 40rpx;
        height: 40rpx;
        background: $uni-color-primary;
        box-shadow: 0 0 4rpx 0 #e5e5e5;
        border: 8rpx solid #ffffff;
        border-radius: 50%;
        right: -20rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      .progress-text {
        position: absolute;
        right: 0;
        top: -60rpx;
        font-size: 36rpx;
        font-weight: 500;
        color: $uni-color-primary;
        display: flex;
        align-items: baseline;
        &::after {
          content: ' %';
          font-size: 24rpx;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}
</style>
