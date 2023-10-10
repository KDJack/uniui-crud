<template>
  <view class="uniui-curd-btn">
    <view class="btn-main" :class="{ plain: desc.plain }" :style="{ filter: `grayscale(${localLoading ? 80 : 0}%)`, height: desc.height || '48px' }" @click.stop="handelBtnClick">
      <uni-icons v-if="localLoading" class="run-rotating" type="loop" :color="desc.plain ? '#007b57' : '#ffffff'" :size="20"></uni-icons>
      <slot name="default">
        {{ btnShowText }}
      </slot>
    </view>

    <!-- 弹框confirm -->
    <uni-popup ref="confirmDialogRef" type="dialog">
      <uni-popup-dialog :title="desc.confirmTitle || '提示'" :content="desc.confirm" @confirm="handelConfirm" @close="handelClose"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  modelValue?: string | null
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  rowIndex?: number
}>()

// 加载
const localLoading = ref(false)

const confirmDialogRef = ref()

// 处理事件
const onEvents = computed(() => {
  const events = {} as any
  if (props.desc && props.desc.on) {
    for (const key in props.desc.on) {
      if (key === 'click' && props.desc.mask) {
        events[key] = function () {
          localLoading.value = true
          props.desc.on[key]({
            row: props.formData,
            callBack: () => {
              setTimeout(() => (localLoading.value = false), 500)
            },
            field: props.field,
            rowIndex: props.rowIndex
          } as IBtnBack)
        }
      } else {
        events[key] = function () {
          props.desc.on[key]({ row: cloneDeep(props.formData || {}), field: props.field, rowIndex: props.rowIndex } as IBtnBack)
        }
      }
    }
  }
  return events
})

// 按钮文本
const btnShowText = computed(() => {
  if (props.desc.btnLabel) {
    if (typeof props.desc.btnLabel === 'function') {
      return props.desc.btnLabel(props.formData)
    }
    return props.desc.btnLabel
  }
  if (props.desc.label) {
    if (typeof props.desc.label === 'function') {
      return props.desc.label(props.formData)
    }
    return props.desc.label
  }
  return ''
})

/**
 * 按钮点击事件
 */
function handelBtnClick() {
  if (localLoading.value) return false
  if (props.desc?.confirm) {
    confirmDialogRef.value.open()
  } else {
    onEvents.value.click()
  }
}

/**
 * 取消按钮
 */
function handelClose() {
  confirmDialogRef.value.close()
}

/**
 * 取消按钮
 */
function handelConfirm() {
  onEvents.value.click()
  confirmDialogRef.value.close()
}
</script>
<style lang="scss" scoped>
.uniui-curd-btn {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .btn-main {
    width: 100%;
    display: flex;
    background-color: $uni-color-primary;
    border: 1px solid $uni-color-primary;
    box-sizing: border-box;
    font-size: 32rpx;
    font-weight: 400;
    color: #ffffff;
    border-radius: 4rpx;
    align-items: center;
    justify-content: center;
  }
  .plain {
    background-color: #ffffff;
    color: $uni-color-primary;
  }
}
</style>
