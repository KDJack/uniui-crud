<template>
  <view class="uniui-crud-data" :class="{ active: currentValue }">
    <uni-datetime-picker :type="type || 'date'" v-model="currentValue" v-bind="attrs" @change="handelChange" />
    <uni-icons type="bottom" size="20" style="margin-left: 4px"></uni-icons>
  </view>
</template>
<script lang="ts" setup>
import { ref, watch, useAttrs, onBeforeMount } from 'vue'
import { getAttrs } from '../uniui-crud-form/mixins'

const props = defineProps<{
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  type?: string
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])
const attrs = ref({} as any)

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
    border: false,
    clearIcon: false,
    ...useAttrs()
  })
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
.uniui-crud-data {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  .suffix-text {
    margin-left: 12rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
  }

  .uni-date {
    .uni-date-editor {
      .uni-date-x {
        justify-content: flex-end;
        .icon-calendar {
          display: none;
        }
        .uni-date__x-input {
          flex: none;
          font-size: 14px;
          color: #999999;
          font-weight: 400;
        }
      }
    }
    .uni-calendar-item--multiple .uni-calendar-item--before-checked,
    .uni-calendar-item--multiple .uni-calendar-item--after-checked {
      background-color: $uni-color-primary;
    }

    .uni-calendar {
      .uni-calendar-item__weeks-box {
        .uni-calendar-item--checked {
          background-color: $uni-color-primary;
        }
      }
      .uni-datetime-picker--btn {
        background-color: $uni-color-primary;
        border-radius: 2px;
      }
    }
  }
  .active {
    .uni-date {
      .uni-date-editor {
        .uni-date-x {
          .uni-date__x-input {
            font-weight: 500;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
