<template>
  <view class="comm-list-panel">
    <!-- 顶部的Tabs -->
    <div class="list-tabs-panel" v-if="tabConf && tabConf.tabs" :style="{ top: topPadding }">
      <view class="tab-item" v-for="(item, i) in tabConf.tabs" :key="i" :class="{ active: tableTabVal === item.value }" @click="handelTabClick(i)">{{ getTabLabel(item) }}</view>
    </div>
    <!-- 查询条件插槽 -->
    <!-- <slot name="query" :reloadFn="handelQueryReload"></slot> -->
    <view class="list-main-panel" :style="{ 'margin-top': marginTopMain }">
      <!-- 查询条件插槽 -->
      <slot name="query" :reloadFn="handelQueryReload"></slot>
      <slot name="default" :dataList="dataList"></slot>
    </view>
    <!-- 加载更多 -->
    <uni-load-more :status="status" v-if="dataList.length"></uni-load-more>
    <view class="placeholder-image" :style="{ 'margin-top': marginTopMain }" v-if="!dataList.length">
      <view>
        <image :src="placeholderImg" />
        <view class="placeholder-text">暂无内容</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick, watch, computed, onMounted } from 'vue'
import { onReachBottom, onLoad } from '@dcloudio/uni-app'
import { base64Img } from './Base64'

const topPadding = ref('0px')
const marginTopMain = ref('0px')

interface IListConfigLocal {
  tabConf?: ITableTabConf
  // 调用接口
  fetch?: IFetch<any>
  // 列表配置，包含表头，每列信息等
  column: Array<IColumnItem>
  pageSize?: number
  // 查询条件
  queryMap?: any
  // 列表头部
  headerConf: ILIHeaderConfig
  placeholderImg:any
}

const emits = defineEmits(['tabChange', 'itemClick'])
const props = defineProps<IListConfigLocal>()

const dataList = reactive([] as any[])
const localQuery = ref({} as any)
const placeholderImg = ref((props.placeholderImg || base64Img) as any)
// 分页信息
// eslint-disable-next-line vue/no-setup-props-destructure
const pageInfo = reactive({
  current: 1,
  size: props.pageSize || 10,
  pages: 1
} as any)
// 加载更多状态
const status = ref('loadmore' as 'loadmore' | 'loading' | 'nomore')
// tab相关
const tabStatic = ref({} as any)
const tableTabVal = ref('' as string | number)

const getTabLabel = computed(() => (item: any) => {
  let label = item.label
  if (item.key) {
    label += ' ' + (tabStatic.value[item.key] || 0)
  }
  return label
})

/**
 * 获取查询条件
 */
function getListQueryData() {
  let queryMap = {
    // 封装查询条件
    ...props.queryMap,
    ...localQuery.value,
    t_: new Date().getTime()
  } as any
  // 封装分页信息
  queryMap.current = pageInfo.current
  queryMap.size = pageInfo.size
  // 这里处理一下列表Tab的查询条件
  if (props.tabConf && props.tabConf.prop) {
    queryMap[props.tabConf.prop] = tableTabVal.value
  }
  return handelQueryData(queryMap)
}

/**
 * 处理数据
 * @param queryMap
 */
function handelQueryData(queryMap: any) {
  if (!queryMap) return {} as any
  const tempMap = {} as any
  Object.keys(queryMap).map((key) => {
    if (queryMap[key] !== undefined && queryMap[key] !== null && queryMap[key] !== '') {
      tempMap[key] = queryMap[key]
    }
  })
  return tempMap
}

/**
 * 加载数据
 * @param isInit
 */
function loadData(isInit?: boolean) {
  if (status.value === 'loading') return false
  status.value = 'loading'
  if (isInit) {
    pageInfo.current = 1
  }
  if (props.fetch) {
    // 真正发送请求
    props.fetch(getListQueryData()).then((res: any) => {
      pageInfo.pages = +res.pages
      pageInfo.current = +res.current
      if (isInit) {
        dataList.splice(0, dataList.length, ...res.records)
      } else {
        dataList.push(...res.records)
      }
      nextTick(() => {
        // 设置加载更多的文本
        status.value = pageInfo.current < pageInfo.pages ? 'loadmore' : 'nomore'
      })
    })
  }
}

/**
 * 处理查询信息
 * @param queryMap
 */
async function handelQueryReload(queryMap: any) {
  localQuery.value = queryMap
  await reload()
}

/**
 * 重新加载数据
 * @param isTab
 */
async function reload(isTab?: boolean) {
  await loadData(true)
  // 这里判断一下Tab
  if (!isTab && props.tabConf && props.tabConf.fetch) {
    tabStatic.value = await props.tabConf.fetch(Object.assign({}, getListQueryData(), props.tabConf?.queryMap || {}))
  }
  return dataList
}

/**
 * 处理tab的点击事件
 * @param index
 */
function handelTabClick(index: number) {
  if (props.tabConf) {
    if (tableTabVal.value !== props.tabConf.tabs[index].value) {
      tableTabVal.value = props.tabConf.tabs[index].value
      reload(true)
      emits('tabChange', index, tableTabVal.value)
    }
  }
}

function getHeight() {
  let { statusBarHeight = 0 } = uni.getSystemInfoSync()
  let customHeight = uni.getMenuButtonBoundingClientRect()
  let { top, height } = customHeight
  let navigationBarHeight = height + (top - statusBarHeight) * 2
  topPadding.value = `${navigationBarHeight + statusBarHeight}px`
  marginTopMain.value = `${navigationBarHeight + statusBarHeight + 48}px`
}

watch(
  () => props.tabConf,
  (data) => {
    if (data) {
      tableTabVal.value = data.tabs[0].value || ''
    }
  },
  { deep: true, immediate: true }
)

/**
 * 到达底部后加载
 */
onReachBottom(() => {
  if (pageInfo.current < pageInfo.pages) {
    pageInfo.current += 1
    loadData()
  } else {
    status.value = 'nomore'
  }
})

onLoad(() => {
  getHeight()
})

onMounted(() => {
  // 初始化
  reload()
})

defineExpose({ reload })
</script>

<style lang="scss" scoped>
.comm-list-panel {
  width: 100%;
  height: 100%;
  .list-tabs-panel {
    width: 100%;
    height: 48px;
    padding: 16rpx 32rpx;
    box-sizing: border-box;
    display: flex;
    position: fixed;
    z-index: 9;
    background-color: #ffffff;
    .tab-item {
      font-size: 32rpx;
      font-weight: 400;
      color: #999999;
      line-height: 40rpx;
      text-align: center;
      line-height: 60rpx;
      padding: 0 24rpx;
      display: flex;
      white-space: nowrap;
      position: relative;
    }
    .active {
      font-size: 36rpx;
      font-weight: 600;
      color: #000000;
      &::before {
        content: '';
        position: absolute;
        width: 48rpx;
        height: 8rpx;
        background: #007957;
        left: 50%;
        bottom: -8rpx;
        transform: translateX(-50%);
      }
    }
  }
  .list-main-panel {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 32rpx;
    box-sizing: border-box;
    // margin-top: calc(var(--status-bar-height) + 170rpx);
    .list-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 4rpx;
      border: 2rpx solid #ebeef5;
      padding: 32rpx;
      box-sizing: border-box;
      margin-bottom: 32rpx;
      .item-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        .item-header-title {
          width: 100%;
          display: flex;
          align-items: center;
          .header-title-tag {
            margin-right: 8px;
          }
          .header-title {
            flex: 1;
            font-size: 30rpx;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #50b1ff;
            line-height: 36rpx;
          }
          .header-right {
            color: #909399;
            font-size: 34rpx;
          }
        }
        .item-header-tip {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24rpx;
          margin-top: 10rpx;
          .header-tip {
            font-weight: 400;
            color: #303133;
            line-height: 34rpx;
          }
          .header-time {
            font-weight: 300;
            color: #a6a9ad;
            line-height: 28rpx;
          }
        }
      }
      .item-main {
        margin-top: 32rpx;
        border-top: 2rpx solid #ebeef5;
        display: flex;
        flex-direction: column;
        padding-top: 24rpx;
        box-sizing: border-box;
        .main-item {
          width: 100%;
          display: flex;
          font-size: 28rpx;
          font-weight: 400;
          line-height: 40rpx;
          margin-top: 24rpx;
          .label {
            color: #a6a9ad;
            width: 25%;
          }
          .value {
            color: #303133;
            flex: 1;
          }
        }
      }
    }

    .list-item:last-child {
      margin-bottom: 0;
    }
  }
  .placeholder-image{
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .placeholder-text{
      font-size:28rpx;
      color:#999999;
      text-align: center;
      margin-top: 24rpx;
    }
  }
}
</style>
