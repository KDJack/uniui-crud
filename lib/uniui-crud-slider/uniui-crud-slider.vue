<template>
  <view class="content">
    <slider :value="currentValue" activeColor="#007b57" backgroundColor="#ececec" block-size="16" block-color="#007b57" step="20" @change="sliderChange" show-value />
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: any
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  type?: string
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])

const currentValue = ref()
emits('update:modelValue', currentValue)

function sliderChange(e: any) {
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

<style scoped></style>
