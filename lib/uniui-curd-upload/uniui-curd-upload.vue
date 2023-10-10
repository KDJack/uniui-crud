<template>
  <view class="uniui-curd-upload">
    <uni-file-picker v-model="currentValue" v-bind="attrs" :imageStyles="imageStyles" @select="handelSelect">
      <template v-if="desc.isCamer">
        <view class="upload-bg-panel" />
        <uni-icons style="position: relative; z-index: 1" type="camera-filled" size="30" color="#007957" />
      </template>
      <uni-icons v-else type="plusempty" size="24" color="#999999" />
    </uni-file-picker>
  </view>
</template>
<script lang="ts" setup>
import { ref, watch, useAttrs, computed, onBeforeMount } from 'vue'
import { getAttrs } from '../uniui-curd-form/mixins'
import { throttle } from 'lodash'

const props = defineProps<{
  modelValue?: Array<any>
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])
const attrs = ref({} as any)

const currentValue = ref([] as any)
// emits('update:modelValue', currentValue)

// 自定义图片样式
const imageStyles = computed(() => {
  const tempStyle = {
    width: props.desc?.width || 106,
    height: props.desc?.height || 106,
    border: {
      style: 'dashed',
      width: '2px',
      radius: '2px',
      ...(props.desc?.imageStyles || {})
    }
  }

  return tempStyle
})

/**
 * 处理上传
 */
function handelSelect(data: any) {
  unload(data)
}

async function unload(file: any) {
  // eslint-disable-next-line no-console
  const tempFilePaths = file.tempFilePaths
  // 循环调用
  await Promise.all(
    tempFilePaths.map((fileData: any, i: number) => {
      //获取图片临时路径
      // const fileData = tempFilePaths[0]
      // 传参： 接口url，  method类型， params参数
      return new Promise((resolve) => {
        uni.uploadFile({
          //图片上传地址
          url: props.desc?.uploadUrl || '',
          filePath: fileData,
          //上传名字，注意与后台接收的参数名一致
          name: 'file',
          formData: {
            //HTTP 请求中其他额外的 form data
            filename: file.tempFiles[i]?.name || ''
          },
          //请求成功，后台返回自己服务器上的图片地址
          success: (res) => {
            const data = JSON.parse(res.data).result
            data.url = data.shareUrl
            data.extname = data.suffix
            currentValue.value.push(data)
            resolve(true)
          },
          fail: () => {
            uni.showToast({
              title: '上传附件失败，请稍候再试！',
              duration: 1000,
              icon: 'none'
            })
            resolve(true)
            return
          }
        })
      })
    })
  )
  handelChange()
}

/**
 * 处理改变
 */
const handelChange = throttle(() => {
  const tempList = [] as any[]
  // 这里遍历
  let isHave = false
  currentValue.value.map((item: any) => {
    isHave = false
    if (props.modelValue && props.modelValue?.length) {
      for (let i = 0; i < props.modelValue.length; i++) {
        if (props.modelValue[i].name === item.name) {
          tempList.push(props.modelValue[i])
          isHave = true
          break
        }
      }
    }
    if (!isHave) {
      tempList.push(item)
    }
  })
  emits('update:modelValue', tempList)
}, 500)

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, { fileMediatype: 'image', mode: 'grid', fileExtname: 'png,jpg', limit: 9, ...useAttrs(), ...props.desc })
  if (!props.desc?.uploadUrl) {
    console.warn('请配置uploadUrl后方可使用上传组件！！！')
  }
})

watch(
  () => props.modelValue,
  (data: Array<any> | undefined) => {
    if (data && data.map((item) => item.name).join(',') !== currentValue.value.map((item: any) => item.name).join(',')) {
      if (data?.length) {
        data.map((item) => {
          item.url = item.url || item.shareUrl
          item.extname = item.extname || item.suffix?.replace('.', '')
        })
      }
      currentValue.value = data
    }
  },
  { immediate: true }
)

watch(
  () => currentValue.value,
  (newData: Array<any>, oldData: Array<any>) => {
    if (newData.map((item) => item.name).join(',') !== oldData.map((item) => item.name).join(',')) {
      handelChange()
      emits('validateThis')
    }
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
.uniui-curd-upload {
  width: 100%;
  padding: 16rpx 0;
  display: flex;
  align-items: center;
  padding-bottom: 40rpx;
}
</style>
