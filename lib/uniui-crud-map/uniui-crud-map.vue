<template>
  <view class="uniui-crud-map">
    <view class="map-addr-text" :style="{ paddingRight: desc.icon ? '60rpx' : '0' }" @click.stop="handelOpenMap">
      <image v-if="desc.icon" class="addr-point" :src="desc.icon"></image>
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

const emits = defineEmits(['update:modelValue', 'change', 'validateThis'])

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
      // console.log('成功获取到用户经纬度: ', latitude, longitude)
      uni.chooseLocation({
        success: ({ name, address, latitude, longitude }) => {
          // eslint-disable-next-line no-console
          // console.log('拉取chooseLocation成功: ', name, address, latitude, longitude)
          currentValue.value = { name, address, latitude, longitude }
          emits('change', currentValue.value)
        },
        fail: (e: any) => {
          // eslint-disable-next-line no-console
          // console.log('拉取chooseLocation失败: ', e)
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
.uniui-crud-map {
  width: 100%;
  flex: 1;
  padding: 10px 0;
  box-sizing: border-box;
  min-height: 104rpx;
  .map-addr-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: flex-end;
    box-sizing: border-box;
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

  .uniui-crud-easyinput__content-input {
    min-height: 20px;
    line-height: 20px;
    font-size: 14px;
    // background-color: #f8f9fa;
  }
}
</style>
