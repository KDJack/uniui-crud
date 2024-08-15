<template>
  <view class="uni-crud-date-picker">
    <picker mode="multiSelector" @change="handelChange" :value="currentValue" :range="options">
      <view class="uni-input" :class="props.desc.timeVal ? '' : 'placeholder-class'">{{ props.desc.timeVal || '请选择时间' }}</view>
    </picker>
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
import { ref, reactive, watch, inject } from 'vue'
import { isEqual } from 'lodash'

const globalData = inject('globalData') as any

const props = defineProps<{
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])
const options = reactive([] as any[])

const currentValue = ref()
emits('update:modelValue', currentValue)

/**
 * 处理change
 */
function handelChange(e: any) {
  currentValue.value = e.target.value
  emits('update:modelValue', currentValue)
  if (props.desc?.on?.change) {
    props.desc.on.change(props.field, currentValue.value)
  }
}

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
  (data: string | null | undefined) => {
    currentValue.value = data
    // console.log(data, props.desc.timeVal)
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
.uni-crud-date-picker {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .uni-input {
    width: auto;
    position: relative;
    overflow: hidden;
    flex: 1;
    line-height: 1;
    font-size: 28rpx;
    height: 70rpx;
    min-height: 40rpx;
    line-height: 40rpx;
    margin: 16rpx 0;
    text-align: right;
    padding-right: 10px;
    padding-left: 10px;
  }
  .placeholder-class {
    color: #86909c;
  }
}
</style>
