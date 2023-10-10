<template>
  <view class="uniui-curd-map">
    <view class="map-addr-text" @click.stop="handelOpenMap">
      <image class="addr-point" src="../../static/images/icon/location.png"></image>
      <template v-if="currentValue?.address">
        <view class="address">{{ currentValue?.name }}</view>
        <view class="address-detail line-clamp2">{{ currentValue?.address }}</view>
      </template>
      <template v-else>
        <view class="placeholder-text">{{ desc.placeholder }}</view>
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps<{
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])

const mapLocation = reactive({ latitude: 30.6598, longitude: 104.065072 })
const currentValue = ref<{
  name: string
  address: string
  latitude: number
  longitude: number
} | null>()
emits('update:modelValue', currentValue)

/**
 * 打开地图弹框
 */
function handelOpenMap() {
  // 这里首先获取用户地址
  uni.getLocation({
    type: 'gcj02',
    success({ latitude, longitude }) {
      mapLocation.latitude = latitude
      mapLocation.longitude = longitude
      // eslint-disable-next-line no-console
      console.log('成功获取到用户经纬度: ', latitude, longitude)
      uni.chooseLocation({
        success: ({ name, address, latitude, longitude }) => {
          // eslint-disable-next-line no-console
          console.log('拉取chooseLocation成功: ', name, address, latitude, longitude)
          currentValue.value = { name, address, latitude, longitude }
        },
        fail: (e: any) => {
          // eslint-disable-next-line no-console
          console.log('拉取chooseLocation失败: ', e)
        }
      })
    },
    fail(e: any) {
      // eslint-disable-next-line no-console
      console.log('获取位置失败: ', e)
      if (+e.errno === 103) {
        uni.showModal({
          title: '提示',
          content: '您之前拒绝了获取位置权限，请点击右上角-设置-位置信息 进行手动开启~',
          confirmText: '知道了', // 确认按钮的文字
          showCancel: false, // 是否显示取消按钮，默认为 true
          success: () => {}
        })
      }
    },
    complete() {}
  })
}

watch(
  () => props.modelValue,
  (data: any | null | undefined) => {
    currentValue.value = data
  },
  { immediate: true }
)

watch(
  () => currentValue.value,
  () => {
    emits('validateThis')
  }
)
</script>
<style lang="scss" scoped>
.uniui-curd-map {
  width: 100%;
  padding: 10px 0;
  min-height: 104rpx;
  box-sizing: border-box;
  .map-addr-text {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    align-items: flex-end;
    padding-right: 60rpx;
    position: relative;
    .addr-point {
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .address {
      box-sizing: border-box;
      text-align: right;
      width: 100%;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 56rpx;
      color: #333333;
    }
    .address-detail {
      box-sizing: border-box;
      text-align: right;
      width: 100%;
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
    }
    .placeholder-text {
      box-sizing: border-box;
      text-align: right;
      width: 100%;
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
      line-height: 64rpx;
    }
  }
}
</style>
