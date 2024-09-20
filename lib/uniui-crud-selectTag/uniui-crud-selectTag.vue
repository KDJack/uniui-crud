<template>
  <view class="uniui-crud-selectTag" v-if="isInit" @click="handelOpenDialog">
    <view class="value-text" :class="{ 'p-text': showText === '' }">{{ showText || attrs.placeholder }}</view>
    <text v-if="desc.suffixText" class="suffix-text">{{ desc.suffixText }}</text>

    <!-- 弹框 -->
    <uni-popup ref="popupRef" type="bottom" :safe-area="false" @touchmove.stop="() => {}">
      <view class="select-tag-panel">
        <view class="top-panel">
          <view class="title">这是标题XXX</view>
          <view class="close">
            <uni-icons type="closeempty" color="#000" size="24"></uni-icons>
          </view>
        </view>
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
import { ref, reactive, watch, useAttrs, onBeforeMount, inject } from 'vue'
import { getAttrs } from '../uniui-crud-form/mixins'
import { isEqual } from 'lodash'

const globalData = inject('globalData') as any

const props = defineProps<{
  modelValue?: string | number | Array<string | number> | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])
const attrs = ref({} as any)
const options = reactive([] as any[])
const isInit = ref(false)
const popupRef = ref()

const currentValue = ref()
const showText = ref('')
emits('update:modelValue', currentValue)

/**
 * 处理change
 */
function handelChange() {
  if (props.desc?.on?.change) {
    props.desc.on.change(props.formData, currentValue.value)
  }
}

function handelOpenDialog() {
  console.log('show dialog..............', popupRef.value)
  popupRef.value?.open('bottom')
}

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, { clearable: true, map: { text: 'label', value: 'value' }, ...useAttrs() })
  attrs.value.popupTitle = attrs.value.popupTitle || attrs.value.placeholder
  attrs.value.clearIcon = attrs.value.clearIcon || attrs.value.clearable
  isInit.value = true
})

watch(
  () => props.desc.options,
  async (data) => {
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
  (data) => {
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
.uniui-crud-selectTag {
  width: 100%;
  display: flex;
  align-items: center;
  .value-text {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 70rpx;
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
    padding: 0 !important;
  }

  .select-tag-panel {
    width: 100vw;
    min-height: 50vh;
    background-color: white;
    border-radius: 40rpx 40rpx 0 0;
    display: flex;
    flex-direction: column;
    z-index: 1;
    position: relative;
    .top-panel {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-size: 32rpx;
      margin-top: 20rpx;
      .close {
        position: absolute;
        right: 40rpx;
        top: 20rpx;
        z-index: 2;
      }
    }
  }
}
</style>
