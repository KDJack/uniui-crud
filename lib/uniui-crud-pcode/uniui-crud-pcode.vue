<template>
  <view class="uniui-crud-pcode">
    <uni-easyinput @change="handelChange" :type="type || 'number'" v-model="currentValue" v-bind="attrs" :styles="{ background: '#666666', flex: 1 }" />
    <!-- <view class="send-btn" :class="{ disabled: littleTime > 0 }" @click.stop="handelSendClick">{{ showText }}</view> -->
    <uniui-crud-btn class="send-btn" :disabled="littleTime > 0" :class="{ disabled: littleTime > 0 }" :desc="{ label: showText, mask: true, fontSize: '24rpx', height: '64rpx', on: { click: handelSendClick } }"></uniui-crud-btn>
  </view>
</template>
<script lang="ts" setup>
/* eslint-disable */
import { ref, watch, computed, useAttrs, onBeforeMount } from 'vue'
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
// 默认的phoneKey为phone
const phoneKey = ref(props.desc?.phoneKey || 'phone')
// 剩余可发送时间
const littleTime = ref(0)
const showText = computed(() => {
  if (littleTime.value > 0) {
    return `${littleTime.value}s后重新获取`
  }
  return '获取验证码'
})

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

/**
 * 处理按钮点击事件
 */
async function handelSendClick({ callBack }: IBtnBack) {
  if (littleTime.value > 0) return false
  const phoneVal = props.formData[phoneKey.value]
  if (phoneVal === undefined || phoneVal === null || phoneVal === '') {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    callBack && callBack(100)
    return false
  }
  // 校验手机号
  if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(phoneVal)) {
    uni.showToast({ title: '手机号格式错误', icon: 'none' })
    callBack && callBack(100)
    return false
  }

  if (props.desc?.remote) {
    const postData = Object.assign({}, props.desc?.queryData, { [phoneKey.value]: phoneVal })
    let res = await props.desc?.remote(postData)
    // 开始倒计时
    littleTime.value = 60
    cutTime()
    props.formData.code = typeof res === 'string' && res.length < 7 ? res : ''
    callBack && callBack(100)
  }
}

/**
 * 时间倒计时
 */
function cutTime() {
  if (littleTime.value > 0) {
    setTimeout(() => {
      littleTime.value -= 1
      cutTime()
    }, 1000)
  }
}

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, {
    inputBorder: false,
    maxlength: 6,
    clearable: false,
    placeholderStyle: 'font-size: 14px;',
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
/* eslint-enable */
</script>
<style lang="scss" scoped>
.uniui-crud-pcode {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  .send-btn {
    min-width: 200rpx;
    max-width: 200rpx;
  }
  .disabled {
    filter: grayscale(90%);
  }
}
</style>
