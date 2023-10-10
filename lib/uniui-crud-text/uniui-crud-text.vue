<template>
  <view class="uniui-crud-text" :style="desc.style">
    <view class="">
      {{ formatValue }}
    </view>
    <text v-if="desc.suffixText" class="suffix-text" :style="desc.suffixStyle">{{ desc.suffixText }}</text>
  </view>
</template>
<script lang="ts" setup>
import { ref, watch, inject, onBeforeMount, useAttrs } from 'vue'
import { getAttrs } from '../uniui-crud-form/mixins'

const format = inject('format') as any

const props = defineProps<{
  modelValue?: any
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  type?: string
}>()

const formatValue = ref('' as any)
const attrs = ref({} as any)

watch(
  () => props.modelValue,
  async () => {
    if (!props.desc.format) {
      // formatValue.value = props.modelValue === '' ? props.desc.default ?? '—' : props.modelValue ?? props.desc.default ?? '—'; 小程序打包不支持
      if (props.modelValue === '') {
        if (props.desc.default !== null && props.desc.default !== undefined) {
          formatValue.value = props.desc.default
        } else {
          formatValue.value = '-'
        }
      } else {
        if (props.modelValue !== null && props.modelValue !== undefined) {
          formatValue.value = props.modelValue
        } else if (props.desc.default !== null && props.desc.default !== undefined) {
          formatValue.value = props.desc.default
        } else {
          formatValue.value = '-'
        }
      }
    } else {
      if (typeof props.desc.format === 'function') {
        // 如果有方法类型的判断，则需要启用动态监测
        formatValue.value = await props.desc.format(props.modelValue, props.formData, props.field)
      } else if (typeof props.desc.format === 'string') {
        formatValue.value = format[props.desc.format] ? format[props.desc.format](props.modelValue, props.formData, props.field) : '--'
      } else {
        if (props.modelValue !== null && props.modelValue !== undefined) {
          formatValue.value = props.modelValue
        } else {
          formatValue.value = '—'
        }
      }
    }
  },
  { immediate: true }
)

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, {
    ...useAttrs()
  })
})
</script>
<style lang="scss" scoped>
.uniui-crud-text {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 104rpx;
  .suffix-text {
    display: inline-block;
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
  }
}
</style>
