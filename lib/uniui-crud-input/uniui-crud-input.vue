<template>
  <view v-if="isInit" class="uniui-crud-input" :class="{ 'uniui-crud-textarea': type === 'textarea' }">
    <uniui-crud-easyinput @change="handelChange" :type="type || ''" v-model="currentValue" v-bind="attrs" :placeholder="attrs.placeholder" :styles="{ background: '#666666' }" />
    <text v-if="desc.suffixText" class="suffix-text">{{ desc.suffixText }}</text>
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
const attrs = ref({} as any)
const isInit = ref(false)

const currentValue = ref()
emits('update:modelValue', currentValue)

/**
 * 处理change
 */
function handelChange() {
  if (props.desc?.on?.change) {
    props.desc.on.change(props.formData, currentValue.value)
  }
}

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, {
    inputBorder: false,
    maxlength: props.type === 'textarea' ? defaultConf.form?.leng.textarea : defaultConf.form?.leng.input,
    clearable: false,
    placeholderStyle: 'font-size: 14px;',
    ...useAttrs()
  })
  isInit.value = true
})

watch(
  () => props.modelValue,
  (data: string | null | undefined) => {
    // 这里要截取一下字符串长度
    if (data && data.length > attrs.value.maxlength) {
      data = data.substring(0, attrs.value.maxlength)
    }
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
.uniui-crud-input {
  width: 100%;
  display: flex;
  align-items: center;
  .suffix-text {
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
  }
}
.uniui-crud-textarea {
  .uni-easyinput {
    .is-textarea {
      background-color: #f8f8f8 !important;
      border-radius: 4rpx;
    }
  }
}
</style>
