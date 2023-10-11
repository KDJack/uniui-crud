<template>
  <view class="uniui-crud-picker" v-if="isInit">
    <!-- <picker @change="handelChange" :value="currentValue" v-bind="attrs" :range="options">
      <view class="uni-input">{{ showText }}</view>
    </picker> -->
    <uni-data-picker class="uni-data-picker" v-bind="attrs" :localdata="options" v-model="currentValue" @change="handelChange" />
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
  modelValue?: string | number | Array<string | number> | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
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
.uniui-crud-picker {
  width: 100%;
  display: flex;
  align-items: center;

  .suffix-text {
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
  }
  ::v-deep .uni-data-picker {
    flex: 1;
    padding: 9px 0;
    .input-value-border {
      border: none;
      padding: 0;
      .selected-area {
        font-size: 14px;
        color: #999999;
        font-weight: 400;
        justify-content: flex-end;
        .selected-list {
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
