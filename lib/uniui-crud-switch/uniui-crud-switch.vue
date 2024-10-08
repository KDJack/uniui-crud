<template>
  <view class="uniui-crud-switch">
    <switch :checked="currentValue" @change="handelChange" />
  </view>
</template>
<script lang="ts" setup>
import { ref, watch, useAttrs, onBeforeMount, inject } from 'vue'
import { getAttrs } from '../uniui-crud-form/mixins'

const defaultConf = inject('defaultConf') as ICRUDConfig

const props = defineProps<{
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  type?: string
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])

const currentValue = ref()
emits('update:modelValue', currentValue)

function handelChange(e: any) {
  currentValue.value = e.detail.value
  emits('update:modelValue', currentValue)
  if (props.desc?.on?.change) {
    props.desc.on.change(props.formData, currentValue.value)
  }
}

watch(
  () => props.modelValue,
  (data: any) => {
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
.uniui-crud-switch {
  width: 100%;
  height: 70rpx;
  margin: 16rpx 0;
  display: flex;
  justify-content: flex-end;
}
</style>
