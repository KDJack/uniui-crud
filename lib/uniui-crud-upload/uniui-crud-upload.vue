<template>
  <view class="uniui-crud-upload">
    <uni-file-picker ref="filePickerRef" v-model="currentValue" v-bind="attrs" :imageStyles="imageStyles" @select="handelSelect">
      <template v-if="desc.isCamer">
        <view class="upload-bg-panel" />
        <uni-icons style="position: relative; z-index: 1" type="camera-filled" size="30" />
      </template>
      <uni-icons v-else type="plusempty" size="24" color="#999999" />
    </uni-file-picker>
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
import { ref, watch, useAttrs, computed, onBeforeMount, nextTick } from 'vue'
import { getAttrs } from '../uniui-crud-form/mixins'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  modelValue?: Array<any>
  field: string
  desc: { [key: string]: any }
  formData: { [key: string]: any }
}>()

const emits = defineEmits(['update:modelValue', 'validateThis'])
const attrs = ref({} as any)

const filePickerRef = ref()
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
  // 这里校验文件大小-默认5M
  const maxSize = props.desc.maxSize || 1024 * 1024 * 5
  let validFlag = true
  for (let i = 0; i < data.tempFiles.length; i++) {
    if (data.tempFiles[i].size > maxSize) {
      validFlag = false
      break
    }
  }
  if (!validFlag) {
    // 全部移除
    data.tempFiles.map((item: any) => filePickerRef.value?.files?.splice(getIndex(item.path), 1))
    uni.showToast({
      title: `不能含有大于 ${(maxSize / 1024 / 1024).toFixed(1)}M 的图片，请重新选择！`,
      duration: 3000,
      icon: 'none'
    })
    return false
  }
  unload(data)
}

/**
 * 根据path获取下标
 * @param path
 */
function getIndex(path: string): number {
  if (filePickerRef.value?.files?.length) {
    return (filePickerRef.value.files as Array<any>).findIndex((item) => item.path === path)
  }
  return -1
}

async function unload(file: any) {
  // eslint-disable-next-line no-console
  const tempFilePaths = file.tempFilePaths
  const tempList = cloneDeep(currentValue.value || [])
  // 判断是否需要获取token
  let token = ''
  if (props.desc?.token) {
    if (typeof props.desc.token === 'function') {
      token = (await props.desc.token()) as any
      if (props.desc?.tokenKey) {
        token = token[props.desc.tokenKey]
      }
    } else {
      token = props.desc.token
    }
  }

  // 循环调用
  await Promise.all(
    tempFilePaths.map((fileData: any, i: number) => {
      //获取图片临时路径
      // const fileData = tempFilePaths[0]
      // 传参： 接口url，  method类型， params参数
      return new Promise((resolve, reject) => {
        const index = getIndex(fileData)
        const uploadTask = uni.uploadFile({
          //图片上传地址
          url: props.desc?.uploadUrl || '',
          filePath: fileData,
          //上传名字，注意与后台接收的参数名一致
          name: 'file',
          formData: {
            token,
            key: `${new Date().getTime()}`,
            //HTTP 请求中其他额外的 form data
            filename: file.tempFiles[i]?.name || ''
          },
          //请求成功，后台返回自己服务器上的图片地址
          success: (res) => {
            const data = JSON.parse(res.data)
            if (!data.furl) {
              // 移除
              if (filePickerRef.value?.files?.length) {
                filePickerRef.value.files.splice(index, 1)
                // filePickerRef.value.files[index].status = 'error'
              }
              nextTick(() => {
                uni.showToast({ title: '上传附件失败，请稍候再试！', duration: 3000, icon: 'none' })
              })
              reject()
            } else {
              data.url = data.furl
              data.extname = data.suffix
              tempList.push(data)
              if (filePickerRef.value?.files?.length && filePickerRef.value.files[index]) {
                filePickerRef.value.files[index].status = 'success'
              }
              resolve(true)
            }
          },
          fail: () => {
            uni.showToast({ title: '上传附件失败，请稍候再试！', duration: 3000, icon: 'none' })
            reject()
            return
          }
        })
        uploadTask.onProgressUpdate(({ progress }) => {
          if (filePickerRef.value?.files?.length & filePickerRef.value.files[index]) {
            filePickerRef.value.files[index].progress = progress
          }
        })
      })
    })
  )
  emits('update:modelValue', tempList)
  emits('validateThis')
}

onBeforeMount(async () => {
  attrs.value = await getAttrs(props, { fileMediatype: 'image', mode: 'grid', fileExtname: 'png,jpg', limit: 9, ...useAttrs(), ...props.desc })
  if (!props.desc?.uploadUrl) {
    console.warn('请配置uploadUrl后方可使用上传组件！！！')
  }
})

watch(
  () => props.modelValue,
  (data: Array<any> | undefined) => {
    // if (data && data.map((item) => item.name).join(',') !== currentValue.value.map((item: any) => item.name).join(',')) {
    //   if (data?.length) {
    //     data.map((item) => {
    //       item.url = item.url || item.furl || item.shareUrl
    //       item.extname = item.extname || item.suffix?.replace('.', '')
    //     })
    //   }
    // }
    currentValue.value = data
  },
  { immediate: true, deep: true }
)

// watch(
//   () => currentValue.value,
//   (newData: Array<any>, oldData: Array<any>) => {
//     console.log('newData: ', newData)
//     if (newData.map((item) => item.name || item).join(',') !== oldData.map((item) => item.name || item).join(',')) {
//       handelChange()
//       emits('validateThis')
//     }
//   },
//   { deep: true }
// )
</script>
<style lang="scss" scoped>
.uniui-crud-upload {
  width: 100%;
  padding: 16rpx 0;
  display: flex;
  align-items: center;
  padding-bottom: 40rpx;
  ::v-deep .uni-file-picker {
    .file-picker__box {
      .file-picker__box-content {
        background-color: #f8f8f8;
        .upload-bg-panel {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          z-index: 0;
          background-size: cover;
          background-position: center;
          background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wgARCADMAUADAREAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAD2YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyZAKbOYAAABsoAAAAIZBTQAAAAMGQCnQ5kAAABs0AAAAQwQA2aAAAAIAAUgAAABQAAAAZMggKdAAAAAAAAAAAAAAAAAZMggKdAAAADJkApswQAAAGygAAAEMAgNGwAAADBkAp0OZAAAAbNAAAAAhkFNAAAAAhAAaMgAAAFKAAADJAAQFNFAAAAAAAAAAAAAABkyACAAHUAAAyZAKbAAAAAAAABkyAQAAHQoAAMGQCnQAAAAAAAAAyZIAAU2UAAAgABQAAAAAAAAAQhADRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJkAAAAAAApsAAHMAAAAGjQAAMmAAAAAAACnQAAHIAAAAGzQAAIQAAAAAAApQAAQgAAABSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/xAAiEAADAAEEAwADAQAAAAAAAAAAARICESAwURAxQDJQcGD/2gAIAQEAAT8A/peTKfZT7KfZi3r4bepT7KfZT7KfZT7KfZT7KfYnquSyxZJ8eezH34ft8OP48bezF68colEoSS8NJkolEolEolEolceW3H3+jz2r3xZPQplMpiyfh5MplMplMplMplMT1XE1twXFnsXvw/b4cfx42tSWSxYd8bWpCIRCFil4eKZCIRCIRCIRCIXFRTKZTKZbLZbE9fvy64U9HwZMp9lPsp9mLevx5LhS14M9mPv5Hj1vWLYlpwyiUShJL5oRBDIEkv8ANZPRFMplMplMplMplMplMplMplMxb3vJlMplMplMplMplMxeq35+vgw973xYeuCUSiUSiUSiUSiUSiUSiUSiUJJb5RKJRKJRKJRKJRK/pv8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAoP/aAAgBAgEBPwACH//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8AAh//2Q==');
        }
      }
    }
  }
}
</style>
