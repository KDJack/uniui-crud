<template>
  <view class="uniui-crud-checkbox" v-if="isInit" :style="{ justifyContent: desc.flex || 'flex-end' }">
    <uni-data-checkbox @change="handelChange" :localdata="options" v-model="currentValue" v-bind="attrs" />
    <text v-if="desc.suffixText" class="suffix-text">{{ desc.suffixText }}</text>
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
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  multiple?: boolean
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])
const attrs = ref({} as any)
const options = reactive([] as any[])
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
    multiple: props.multiple || props.desc?.multiple || false,
    map: { text: 'label', value: 'value' },
    // selectedColor: '#007957',
    ...useAttrs()
  })
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
  (data: string | null | undefined) => {
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
.uniui-crud-checkbox {
  width: 100%;
  display: flex;
  align-items: center;
  .suffix-text {
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
  }

  ::v-deep .uni-data-checklist {
    .checklist-group {
      .checklist-box {
        margin: 34rpx 24rpx !important;
      }
      .checklist-box:last-child {
        margin-right: 0 !important;
      }
      .checklist-box:first-child {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
