<template>
  <view class="uniui-crud-selectTag" v-if="isInit">
    <view class="value-text" :class="{ 'p-text': showText === '' }" @click.stop="handelOpenDialog">{{ showText || attrs.placeholder }}</view>
    <text v-if="desc.suffixText" class="suffix-text">{{ desc.suffixText }}</text>

    <!-- 弹框 -->
    <uni-popup ref="popupRef" type="bottom" :safe-area="false" @touchmove.stop="() => {}">
      <view class="select-tag-panel">
        <view class="top-panel">
          <view class="title">{{ desc.title || attrs.placeholder }}</view>
          <view class="close">
            <uni-icons type="closeempty" color="#fff" size="24" @click.stop="handelClose"></uni-icons>
          </view>
        </view>
        <view class="tag-list">
          <template v-for="(item, i) in options" :key="i">
            <view class="tag-item" :class="{ active: hasActive(item) }" @click.stop="handelCheck(item)">{{ item.label || item.l }}</view>
          </template>
        </view>
        <view class="bottom-btn" @click.stop="handelSubmit">确认选择</view>
      </view>
    </uni-popup>
  </view>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import { ref, reactive, computed, watch, useAttrs, onBeforeMount, inject } from 'vue'
import { getAttrs } from '../uniui-crud-form/mixins'
import { isEqual } from 'lodash'

const globalData = inject('globalData') as any

const props = defineProps<{
  modelValue?: Array<string> | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue'])
const attrs = ref({} as any)
const options = reactive([] as any[])
const isInit = ref(false)
const popupRef = ref()

const currentValue = ref(props.modelValue || [])
const showValue = ref(props.modelValue || [])

const showText = ref('')

const hasActive = computed(() => (item: any) => {
  return showValue.value?.includes(item.value)
})
/**
 * 处理change
 */
function handelChange() {
  if (props.desc?.on?.change) {
    props.desc.on.change(props.formData, currentValue.value)
  }
}

function handelClose() {
  popupRef.value?.close()
}

function handelCheck(item: any) {
  // 校验是否存咋
  const index = showValue.value?.findIndex((i) => i === item.value)
  if (index >= 0) {
    showValue.value.splice(index, 1)
  } else {
    showValue.value.push(item.value)
  }
}

function handelOpenDialog() {
  showValue.value = [...currentValue.value]
  popupRef.value?.open('bottom')
}

function handelSubmit() {
  currentValue.value = [...(showValue.value || [])]
  if (currentValue.value.length) {
    showText.value = `已选${currentValue.value.length}个`
  } else {
    showText.value = ''
  }
  emits('update:modelValue', currentValue.value)
  handelClose()
}

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, { clearable: true, map: { text: 'label', value: 'value' }, ...useAttrs() })
  attrs.value.popupTitle = attrs.value.popupTitle || attrs.value.placeholder
  attrs.value.clearIcon = attrs.value.clearIcon || attrs.value.clearable
  isInit.value = true
  if (!currentValue.value) currentValue.value = []
  if (!showValue.value) showValue.value = []
})

watch(
  () => props.desc.options,
  async (data: any) => {
    if (typeof data === 'string') {
      // 从全局数据中获取options
      options.splice(0, options.length, ...(globalData[data] || []))
    } else if (typeof data === 'function') {
      options.splice(0, options.length, ...(await data(props.formData)))
    } else if (Array.isArray(data)) {
      if (data && options && !isEqual(data, options)) {
        options.splice(0, options.length, ...data)
      }
    } else {
      options.splice(0, options.length)
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (data: any) => {
    // if (JSON.stringify(showValue.value) !== JSON.stringify(data)) {
    // currentValue.value = data
    showValue.value = data || []
    currentValue.value = [...(data || [])]
    if (currentValue.value.length) {
      showText.value = `已选${currentValue.value.length}个`
    } else {
      showText.value = ''
    }
    // }
  },
  { immediate: true }
)

// watch(
//   () => currentValue.value,
//   () => {
//     emits('validateThis')
//   }
// )
</script>
<style lang="scss" scoped>
.uniui-crud-selectTag {
  width: 100%;
  display: flex;
  align-items: center;

  .value-text {
    flex: 1;
    text-align: right;
    height: 70rpx;
    line-height: 70rpx;
    margin: 16rpx 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .p-text {
    font-size: 24rpx !important;
    color: #999999 !important;
  }
  .suffix-text {
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
  }

  :deep(.uni-popup__wrapper) {
    width: 100% !important;
    padding: 0 !important;
  }

  .select-tag-panel {
    width: 100vw;
    min-height: 50vh;
    max-height: 70vh;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 40rpx 40rpx 0 0;
    display: flex;
    flex-direction: column;
    z-index: 1;
    position: relative;
    padding: 40rpx;
    box-sizing: border-box;
    .top-panel {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-size: 32rpx;
      margin-bottom: 20rpx;
      .close {
        position: absolute;
        right: 40rpx;
        top: 30rpx;
        z-index: 2;
      }
    }
    .top-query {
      width: 100%;
    }
    .tag-list {
      height: 100%;
      flex: 1;
      overflow-y: scroll;
      width: 100%;
      display: grid;
      grid-gap: 10rpx;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 20rpx 0;
      margin: 20rpx 0;
      box-sizing: border-box;
      .tag-item {
        // height: fit-content;
        text-align: center;
        padding: 24rpx 16rpx;
        border-radius: 8rpx;
        background: #ffffff;
        box-sizing: border-box;
        color: #43444d;
        font-weight: 600;
        font-size: 28rpx;
      }
      .active {
        background: #ff7a43;
        color: #ffffff;
      }
    }
    .bottom-btn {
      width: 100%;
      height: 96rpx;
      line-height: 96rpx;
      display: flex;
      flex-direction: column;
      place-content: center;
      place-items: center;
      border-radius: 16rpx;
      background: #ffffff;
      color: #43444d;
      font-weight: 600;
      font-size: 36rpx;
    }
  }
}
</style>
