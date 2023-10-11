<template>
  <view class="uniui-crud-map">
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

    <!-- 地图弹出层 -->
    <uni-popup ref="mapPopupRef" type="bottom" :safe-area="false">
      <view class="map-content" :catchtouchmove="() => {}">
        <view class="map-panel">
          <map class="map-comp" :latitude="mapLocation.latitude" :longitude="mapLocation.longitude" @regionchange="handelRegionchange"> </map>
          <image class="addr-point" src="../../static/images/icon/location.png"></image>
          <uni-icons class="close-btn" type="closeempty" size="30" color="#ffffff"></uni-icons>
        </view>
        <view class="addr-list-panel">
          <view class="top-btn-list">
            <view class="" @click="handelCloseMap">取消</view>
            <view class="btn-submit" @click="handelSubmitAddr">确定</view>
          </view>
          <view class="input-panel">
            <uni-easyinput placeholder="请输入要查询的地址" prefixIcon="search" @touchmove.stop="() => {}" @change="handelInput" v-model="userInput" />
            <view class="search-btn"></view>
          </view>
          <scroll-view class="addr-list" :scroll-y="true">
            <view v-for="(item, i) in addrList" :key="i" class="addr-item" @click.stop="() => handelSelectItem(i)">
              <uni-icons v-if="i === selectIndex" class="select-icon" type="checkmarkempty" size="24" color="#007b57"></uni-icons>
              <view class="title">{{ item.title }}</view>
              <view class="detail line-clamp2">{{ item.address }}</view>
            </view>
          </scroll-view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, getCurrentInstance, reactive, inject } from 'vue'
import { debounce } from 'lodash'
import { queryExplorePage, querySuggestionPage } from './txMapApi'

const instance = getCurrentInstance() as any
const mapKey = (inject('defaultConf') as ICRUDConfig).mapKey?.tx || ''

const props = defineProps<{
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])

const currentValue = ref<{
  name: string
  address: string
  latitude: number
  longitude: number
} | null>()
emits('update:modelValue', currentValue)

const userInput = ref('')
const currentCity = ref('成都')
const mapLocation = reactive({ latitude: 30.6598, longitude: 104.065072 })
const selectItem = ref({} as ITXMapPOI | null)
const addrList = ref([] as ITXMapPOI[])
const selectIndex = ref(-1)

const mapPopupRef = ref()

/**
 * 显示地图
 */
function show() {
  mapPopupRef.value.open()
}

/**
 * 处理拖动地图后，中心点位置改变事件
 */
const handelRegionchange = debounce(async (regionData: any) => {
  if (regionData.type === 'end') {
    if (mapLocation.latitude !== regionData.detail.centerLocation.latitude || mapLocation.longitude !== regionData.detail.centerLocation.longitude) {
      selectIndex.value = -1
      selectItem.value = null
      await queryExploreList(regionData.detail.centerLocation.latitude, regionData.detail.centerLocation.longitude)
      // 默认选中第0个
      // handelSelectItem(0)
    }
  }
}, 50)

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
    },
    fail(e: any) {
      // eslint-disable-next-line no-console
      console.log('获取位置失败: ', e)
    },
    complete() {
      uni.chooseLocation({
        success: function ({ name, address, latitude, longitude }) {
          currentValue.value = {
            name,
            address,
            latitude,
            longitude
          }
        },
        complete: () => {
          show()
          queryExploreList()
        }
      })
    }
  })
}

/**
 * 处理关闭
 */
function handelCloseMap() {
  mapPopupRef.value.close()
}

/**
 * 处理用户输入
 */
async function handelInput() {
  selectIndex.value = -1
  selectItem.value = null
  addrList.value = await querySuggestionPage({ key: mapKey, keyword: userInput.value, region: currentCity.value, filter: encodeURIComponent('category<>地名地址') })
}

/**
 * 处理选中的item
 * @param index
 */
function handelSelectItem(index: number) {
  selectIndex.value = index
  selectItem.value = addrList.value[index]
  // 刷新地图
  mapLocation.latitude = selectItem.value.location.lat
  mapLocation.longitude = selectItem.value.location.lng
}

/**
 * 查询列表
 */
async function queryExploreList(latitude?: number, longitude?: number) {
  addrList.value = await queryExplorePage({ key: mapKey, boundary: `nearby(${latitude || mapLocation.latitude},${longitude || mapLocation.longitude},500,1)`, policy: 1 })
}

/**
 * 确认地址
 */
function handelSubmitAddr() {
  if (!selectItem.value || selectIndex.value < 0) {
    uni.showToast({ title: '请选择一个地址~', icon: 'none' })
    return false
  }
  currentValue.value = {
    name: selectItem.value?.title || '',
    address: selectItem.value?.address || '',
    latitude: mapLocation.latitude,
    longitude: mapLocation.longitude
  }
  handelCloseMap()
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

onMounted(() => {
  // eslint-disable-next-line no-console
  selectIndex.value = 0
})

defineExpose({ show })
</script>
<style lang="scss" scoped>
.uniui-crud-map {
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
  .map-content {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    .map-panel {
      width: 100%;
      height: calc(100vh - 600rpx);
      position: relative;
      .map-comp {
        width: 100vw;
        height: calc(100vh - 600rpx);
      }
      .addr-point {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 64rpx;
        height: 64rpx;
        transform: translateX(-50%) translateY(-50%);
        z-index: 5;
      }
      .close-btn {
        position: absolute;
        z-index: 2;
        top: 40rpx;
        right: 40rpx;
      }
    }
    .addr-list-panel {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 20rpx 40rpx;
      margin-top: -80rpx;
      position: relative;
      z-index: 5;
      background-color: #ffffff;
      border-radius: 20rpx 20rpx 0 0;
      .top-btn-list {
        width: 100%;
        box-sizing: border-box;
        padding: 8rpx 0 20rpx 0;
        display: flex;
        justify-content: space-between;
        font-size: 32rpx;
        font-weight: 500;
        & > view {
          color: #333333;
        }
        .btn-submit {
          color: $uni-color-primary;
        }
      }
      .addr-list {
        width: 100%;
        height: 480rpx;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 8rpx;
        padding: 8rpx;
        box-sizing: border-box;

        .addr-item {
          width: 100%;
          padding: 16rpx 60rpx 16rpx 0;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border-bottom: 1px solid #f8f8f8;
          position: relative;
          .select-icon {
            position: absolute;
            right: 24rpx;
            top: 50%;
            transform: translateY(-50%);
          }
          .title {
            box-sizing: border-box;
            width: 100%;
            font-size: 32rpx;
            font-weight: 500;
            color: #333333;
            margin-bottom: 8rpx;
          }
          .detail {
            box-sizing: border-box;
            width: 100%;
            font-size: 28rpx;
            font-weight: 400;
            color: #999999;
          }
        }
      }
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
