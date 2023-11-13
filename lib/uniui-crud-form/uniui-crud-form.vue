<template>
  <view class="uni-ui-crud-form" :style="{ 'padding-top': isMT ? marginTopMain : '', ...formLayout }">
    <slot name="top" :formData="modelValue"></slot>
    <view :style="{ display: 'flex', justifyContent: isDialog ? 'center' : '' }">
      <uni-forms ref="refElPlusForm" :model="props.modelValue" @submit.prevent="handleSubmitForm" v-bind="computedFormAttrs">
        <view class="uni-list">
          <view v-for="(formList, index) in attrMapToList" :key="index" class="uni-list-cell" :style="{ marginRight: isTable ? '20px' : 0 }">
            <template v-for="(formItem, y) in formList" :key="index + '-' + y + '-' + formItem.field">
              <view v-if="formItem.topTitle" class="title-line flex_ex justify_between align_center">
                <view class="title">{{ formItem.topTitle }}</view>
              </view>
              <view v-if="formItem._vif" class="crud-form-item" :style="{ paddingLeft: formItem.type === 'pcode' ? '10px' : '20px', paddingTop: formItem.type === 'sign' ? '20px' : '' }">
                <template v-if="['upload', 'textarea', 'progress', 'slider', 'sign', 'pcode'].indexOf(formItem.type || '') >= 0">
                  <view class="uni-forms-item">
                    <view class="uni-forms-item__label forms-item-labe-line" v-if="formItem.type !== 'pcode' && showLabel && formItem.showLabel !== false">
                      <text v-if="formItem.required" class="is-required">*</text>
                      <text class="form-weight-label">{{ formItem._label }}</text>
                    </view>
                    <view class="form-item-main">
                      <template v-if="formItem.type === 'upload'">
                        <uniui-crud-upload style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                      </template>
                      <template v-else-if="formItem.type === 'textarea'">
                        <uniui-crud-input style="min-width: 80px; width: 100%" type="textarea" autoHeight :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                      </template>
                      <template v-else-if="formItem.type === 'progress'">
                        <uniui-crud-progress style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                      </template>
                      <template v-else-if="formItem.type === 'slider'">
                        <uniui-crud-slider :formData="props.modelValue" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" @validateThis="() => handelValidateThis(formItem.field || '')" />
                      </template>
                      <template v-else-if="formItem.type === 'sign'">
                        <uniui-crud-sign style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                      </template>
                      <template v-else-if="formItem.type === 'pcode'">
                        <uniui-crud-pcode style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                      </template>
                    </view>
                  </view>
                </template>
                <uni-forms-item v-else style="min-height: 40px" :label="showLabel && formItem.showLabel !== false ? formItem._label : null" v-bind="formItem._formItemAttr" :labelWidth="!(showLabel && formItem.showLabel !== false ? formItem._label : null) ? 0 : formItem._formItemAttr.labelWidth">
                  <template v-if="formItem.type === 'car'">
                    <uniui-crud-car style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'select'">
                    <uniui-crud-pciker style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'ratio'">
                    <uniui-crud-checkbox :multiple="false" style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'checkbox'">
                    <uniui-crud-checkbox :multiple="true" style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'date'">
                    <uniui-crud-date style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'time'">
                    <uniui-crud-time style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'datetime'">
                    <uniui-crud-date style="min-width: 80px; width: 100%" type="datetime" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'map'">
                    <uniui-crud-map style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'map2'">
                    <uniui-crud-map2 style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <template v-else-if="formItem.type === 'text'">
                    <uniui-crud-text :type="formItem.type" style="min-width: 80px; width: 100%" :formData="props.modelValue" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" />
                    <!--										<view class="textField"> {{ props.modelValue[formItem.field || ''] }}<text class="unit">元</text></view>-->
                  </template>
                  <template v-else>
                    <uniui-crud-input :type="formItem.type" style="min-width: 80px; width: 100%" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field || ''" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')" />
                  </template>
                  <!-- <component style="min-width: 80px; width: 100%" :is="formItem._type" :formData="props.modelValue" :disabled="formItem._disabled || disabled || false" :readonly="readonly || false" v-bind="formItem._attrs" :desc="formItem" :ref="setComponentRef" :field="formItem.field" v-model="props.modelValue[formItem.field || '']" :isTable="isTable" @validateThis="() => handelValidateThis(formItem.field || '')"></component> -->
                  <!-- <view class="uni-ui-form-tip" v-if="formItem._tip" v-html="formItem._tip" /> -->
                </uni-forms-item>
              </view>
              <view v-if="formItem.cut" class="form-cut"></view>
            </template>
          </view>
        </view>
        <slot name="row"></slot>
      </uni-forms>
    </view>
    <slot name="default"></slot>
    <uni-forms style="margin: 20px 0">
      <slot :data="props.modelValue" name="form-btn">
        <view v-if="btnList && btnList.length > 0" class="uni-list">
          <view class="uni-list-cell">
            <view class="crud-form-item" style="display: flex" :style="btnRowStyle">
              <template v-for="(btn, index) of btnList" :key="index">
                <uniui-crud-btn v-bind="btn"></uniui-crud-btn>
              </template>
            </view>
          </view>
        </view>
      </slot>
      <slot name="bottom" :formData="props.modelValue"></slot>
    </uni-forms>
    <slot name="form-footer" :formData="props.modelValue"></slot>
  </view>
</template>
<script lang="ts" setup>
/* eslint-disable */
import { ref, computed, useAttrs, nextTick, onMounted, watch, inject } from 'vue'
import { throttle, cloneDeep } from 'lodash'
import { castArray } from './util'
import { getPlaceholder } from './mixins'
import * as validates from './util/validate'
import { onLoad } from '@dcloudio/uni-app'

// IFormProps定义
export interface IFormProps {
  // 表单描述
  formDesc: IFormDesc | null
  // 表单数据
  modelValue: { [key: string]: any }
  // 表单自身属性
  formAttrs?: { [key: string]: any }
  // 校检规则
  rules?: { [key: string]: any } | null
  // 提交状态
  isLoading?: boolean
  // 提交函数
  requestFn?: Function | null
  // 表单更新的函数
  updateFn?: Function | null
  // 是否显示底部按钮组
  showBtns?: boolean
  // 是否显示submit按钮
  showSubmit?: boolean
  // 提交按钮文本
  submitBtnText?: string
  // 是否显示 cancel 取消按钮
  // 默认值: isDialog = true 时, 默认值为 true
  showCancel?: boolean
  // 取消按钮文本
  cancelBtnText?: string
  // 是否显示重置按钮
  showReset?: boolean
  // 重置按钮文本
  resetBtnText?: string
  // 是否显示label
  showLabel?: boolean
  // label宽度
  labelWidth?: number | string
  // 全局禁用表单
  disabled?: boolean
  // 全局的readonly
  readonly?: boolean
  // 是否为弹窗
  isDialog?: boolean
  // options 的请求方法
  optionsFn?: Function | null
  // 表单全局size
  size?: string
  // 表单列 默认1
  column?: number
  // 是否是列表头部的表单
  isTable?: boolean
  // 唯一标识符。默认为id
  idKey?: string
  // 最大宽度
  maxWidth?: string
  // label位置
  labelPosition?: 'top' | 'left'
  // 是否开始margin-top
  isMT?: boolean
  // 按钮行样式
  btnRowStyle?: any
  // 比如 beforeValidate, beforeRequest, success, requestError, requestEnd
  // 其他钩子 直接放到attrs里面去了
}

// 定义全局的format对象
const elPlusFormFormat = inject('format') as any
const navbarInfo = ref(inject('navbarInfo') as { height: number; top: number })

const emits = defineEmits(['request', 'reset', 'cancel'])
const props = withDefaults(defineProps<IFormProps>(), {
  // 表单描述
  formDesc: null,
  // 表单数据
  modelValue: () => {
    return {}
  },
  // 表单自身属性
  formAttrs: () => {
    return {}
  },
  // 校检规则
  rules: null,
  // 提交状态
  isLoading: false,
  // 提交函数
  requestFn: null,
  // 表单更新的函数
  updateFn: null,
  // 是否显示按钮
  showBtns: true,
  // 是否显示submit按钮
  showSubmit: true,
  // 提交按钮文本
  submitBtnText: '提交',
  // 是否显示 cancel 取消按钮
  // 默认值: isDialog = true 时, 默认值为 true
  showCancel: false,
  // 取消按钮
  cancelBtnText: '取消',
  // 是否显示重置按钮
  showReset: true,
  // 重置按钮
  resetBtnText: '重置',
  // 是否显示标签
  showLabel: true,
  // 标签宽度
  labelWidth: '',
  // 全局禁用表单
  disabled: false,
  // 全局的readonly
  readonly: false,
  // 是否为弹窗
  isDialog: false,
  // options 的请求方法
  optionsFn: null,
  // 表单全局size
  size: 'small',
  // 表单列 默认1
  column: 1,
  // 是否是列表头部的表单
  isTable: false,
  // 唯一标识符。默认为id
  idKey: 'id',
  labelPosition: 'left'
  // 其他钩子 直接放到attrs里面去了
  // 比如 beforeValidate, beforeRequest, success, requestError, requestEnd
})

const refElPlusForm = ref()

// 是否开启全局监听
const isOpenListen = ref(false)

const tempAttr = useAttrs()

// 每个表单项的ref
const fieldRefs_ = ref([] as Array<any>)

// loading
const innerIsLoading = ref(false)

let oldFormData = null as any

const marginTopMain = ref('0px')

// 整体的布局方式
const formLayout = computed(() => ({
  display: 'flex',
  flexDirection: props.isTable ? 'row' : 'column',
  marginTop: navbarInfo.value.height + 'px'
})) as any

// 表单的Attrs
const computedFormAttrs = computed(() => {
  return {
    scrollToError: true,
    ...props.formAttrs,
    labelWidth: props.labelWidth === 'auto' ? (props.isDialog ? '100px' : '120px') : parseInt(props.labelWidth + '') + 'px',
    // validateOnRuleChange: false,
    disabled: props.disabled || innerIsLoading.value,
    rules: computedRules,
    labelPosition: props.labelPosition,
    style: {
      width: props.maxWidth || props.isTable ? '100%' : props.isDialog ? '80%' : '1000px',
      paddingRight: props.isTable ? '0' : '20px'
    }
  }
})

// 合并校验规则
const computedRules = computed(() => {
  // 首先拿到表单总体传入的rules
  const tempRules = (props.rules || {}) as { [key: string]: Array<any> }
  // 遍历属性描述对象，看看里面有没有校验规则
  if (props.formDesc) {
    Object.keys(props.formDesc).map((field: any) => {
      if (!tempRules[field]) tempRules[field] = []
      if (props.formDesc) {
        if (props.formDesc[field].rules) {
          if (typeof props.formDesc[field].rules === 'string') {
            // string的话，就行默认校验规则中取
            tempRules[field].push(...((validates as any)[props.formDesc[field]?.rules as string] || []))
          } else {
            // 查看总体规则中是否已经含有了该属性的校验
            castArray(props.formDesc[field].rules).map((item: any) => {
              tempRules[field].push(item)
            })
          }
        } else if (props.formDesc[field].required || props.formDesc[field].require) {
          // 如果直接指定 required || require，手动添加校验信息
          let rules = 'notAllBlank'
          switch (props.formDesc[field].type) {
            case 'upload':
            case 'select':
            case 'password':
            case 'textarea':
            case 'editor':
              rules = props.formDesc[field].type || ''
              break
            case 'cascader':
            case 'tselect':
            case 'linkuser':
            case 'radio':
              rules = 'select'
              break
          }
          tempRules[field].push(...(validates as any)[rules])
        }
      }
    })
  }
  return tempRules
})

// 属性对象转数组
const attrMapToList = computed(() => {
  const formLayoutRows = [] as Array<Array<IFormDescItem>>
  if (props.formDesc) {
    let tempData = [] as Array<IFormDescItem>
    for (const key in props.formDesc) {
      tempData.push({ ...props.formDesc[key], field: key })
    }
    // 这里处理一下layout的布局-渲染
    let rowItemList = [] as Array<IFormDescItem>
    let tempCount = 0
    tempData.map((item) => {
      if (item._vif || item.isBlank) {
        rowItemList.push(item)
        tempCount++
        if (item.colspan) {
          tempCount += item.colspan - 1
        }
        if (tempCount >= props.column) {
          // 一行结束
          formLayoutRows.push(rowItemList)
          rowItemList = [] as Array<IFormDescItem>
          tempCount = 0
          return
        }
      }
    })
    if (rowItemList.length > 0) {
      formLayoutRows.push(rowItemList)
    }
  }
  return formLayoutRows
})

// 整体初始化属性
const initFormAttrs = throttle(() => {
  if (props.formDesc) {
    Object.keys(props.formDesc).forEach((field) => {
      if (props.formDesc) {
        const formItem = props.formDesc[field]
        if (formItem && formItem.type) {
          // 设置 _type
          // formItem._type = compTypeList.includes(formItem.type.toLowerCase()) ? 'uni-ui-form-' + formItem.type : formItem.type
          // 触发 v-if 显示 / 隐藏 设置_vif
          formItem._vif = handelKeyValue(formItem, 'vif', field, !formItem.isBlank || true)
          // 触发 disabled 禁用 / 启用 设置_disabled
          formItem._disabled = handelKeyValue(formItem, 'disabled', field, props.disabled || false)
          // 动态属性 attrs
          const tempAttr = {} as any
          // if ((typeof formItem.attrs === 'object' && formItem.attrs?.options) || formItem.options) {
          //   tempAttr.options = (formItem.attrs as any)?.options || formItem.options
          // }
          formItem._attrs = Object.assign({}, handelKeyValue(formItem, 'attrs', field), tempAttr)
          // 动态options
          // formItem._options = handelKeyValue(formItem, 'options', field)
          // 动态 _label
          formItem._label = handelKeyValue(formItem, 'label', field)
          // 动态 prop
          // formItem._prop = handelKeyValue(formItem, 'prop', field);
          // 动态 _tip
          formItem._tip = handelKeyValue(formItem, 'tip', field)

          formItem.placeholder = formItem.placeholder || getPlaceholder(formItem)
          // 这里封装一下formItemAttr
          formItem._formItemAttr = {
            labelWidth: formItem.labelWidth || props.labelWidth || (props.isDialog ? '100px' : '120px'),
            prop: formItem.field,
            style: { width: formItem._attrs?.width || formItem.width || (props.isTable ? '150px' : '100%') },
            required: formItem.required || false,
            labelPosition: formItem.labelPosition || props.labelPosition
          }

          // 单独处理下上传
          if (!formItem._tip && !formItem.noTip && formItem.type === 'upload') {
            formItem._tip = `最多上传${formItem.multiple ? formItem.limit || 20 : 1}${formItem.upType === 'file' ? '个文件' : '张图片'}`
          }
          // 这里初始化一下默认值
          if (formItem.default !== undefined && formItem.default !== null && (props.modelValue[field] === undefined || props.modelValue[field] === null)) {
            props.modelValue[field] = formItem.default
          }
          // 这里初始化一下默认选中项
          if (formItem.defaultItem !== undefined && formItem.defaultItem !== null && props.modelValue[field] === undefined) {
            props.modelValue[field] = formItem.defaultItem.value
          }
          // 这里格式化一下数据
          if (formItem.format) {
            if (typeof formItem.format === 'string') {
              props.modelValue[field] = elPlusFormFormat[formItem.format](props.modelValue[field], props.modelValue)
            } else if (typeof formItem.format === 'function') {
              props.modelValue[field] = (formItem as any).format(props.modelValue[field], props.modelValue)
            } else {
              // console.log('未知的格式化类型:', formItem.format)
            }
          }
        }
      }
    })
  }
}, 500)

// 表单底部按钮
const btnList = computed(() => {
  let btnList_ = [] as any[]
  if (!props.showBtns) {
    return btnList_
  }
  // 取消按钮
  if (props.showCancel) {
    btnList_.push({
      field: '_reset_btn',
      desc: {
        label: props.cancelBtnText || '取消',
        disabled: innerIsLoading.value,
        plain: true,
        on: { click: () => emits('cancel') }
      }
    })
  }
  // 重置按钮
  if (props.showReset) {
    btnList_.push({
      field: '_reset_btn',
      desc: {
        label: props.resetBtnText || '重置',
        confirm: `确定要${props.resetBtnText || '重置'}?`,
        disabled: innerIsLoading.value,
        plain: true,
        on: { click: reset }
      }
    })
  }
  // 提交按钮
  if (props.showSubmit) {
    btnList_.push({
      field: '_reset_btn',
      desc: {
        mask: true,
        label: props.submitBtnText || '提交',
        loading: props.isLoading || innerIsLoading.value,
        on: { click: handleSubmitForm }
      }
    })
  }
  return btnList_
})

// 处理属性
const handelKeyValue = (formItem: IFormDescItem, key: string, field: string, defVal: number | boolean | string | null = null) => {
  if (typeof formItem[key] === 'function') {
    // 如果有方法类型的判断，则需要启用动态监测
    isOpenListen.value = true
    return formItem[key](props.modelValue, props.modelValue[field])
  } else if (typeof formItem[key] === 'boolean') {
    return formItem[key] || false
  } else if (typeof formItem[key] === 'string') {
    return formItem[key] || ''
  } else {
    return formItem[key] || defVal
  }
}

// 验证表单
const validateForm = (btnBack: IBtnBack) => {
  let errorMsg = '' as any
  // 循环校验
  for (let key in props.formDesc) {
    if (props.formDesc[key]._vif) {
      // 开始单个校验
      for (let i = 0; i < computedRules.value[key].length; i++) {
        if (computedRules.value[key][i].required) {
          if (props.modelValue[key] === undefined || props.modelValue[key] === null || props.modelValue[key] === '') {
            uni.showToast({ title: props.formDesc[key].placeholder || `${props.formDesc[key]._label}不能为空`, icon: 'none' })
            btnBack.callBack && btnBack.callBack()
            return false
          }
        }
        if (computedRules.value[key][i].validator && typeof computedRules.value[key][i].validator === 'function') {
          errorMsg = computedRules.value[key][i].validator(props.modelValue[key], props.modelValue)
          if (errorMsg !== true) {
            uni.showToast({ title: `${props.formDesc[key]._label}：${errorMsg}`, icon: 'none' })
            btnBack.callBack && btnBack.callBack()
            return false
          }
        }
      }
    }
  }
  return true
}

// 设置子组件的ref-重置form的时候需要用到
const setComponentRef = (el: any) => {
  if (!el) return
  if (fieldRefs_.value.filter((item: any) => item.field === el.field).length <= 0) {
    fieldRefs_.value.push(el)
  }
}

/**
 * 处理单个表单值
 * @param val
 */
const handelValToForm = (desc: IFormDescItem, field: string, val: any) => {
  const result = {} as { [key: string]: any }
  if (!desc) return { [field]: val }
  if (!desc._vif || val === undefined || val === null) return result
  if (desc.type === 'category') {
    if (val === null) val = []
    // 如果是直接显示结果
    if (desc.checkStrictly === true) {
      result.categoryId = val[2] || val[1] || val[0] || ''
    } else {
      for (let i = 0; i < 3; i++) {
        result['categoryId' + (i + 1)] = val[i] || ''
      }
    }
  } else if (desc.type === 'area') {
    if (val === null) val = [null, null, null, null]
    const [pid, cid, zid, sid] = val
    if (desc.checkStrictly) {
      result[field] = sid || zid || cid || pid || null
    } else {
      result.provinceId = pid || -1
      result.cityId = cid || -1
      result.zoneId = zid || -1
      result.streetId = sid || -1
    }
  } else if (desc.type === 'daterange') {
    if (val && val.length === 2) {
      result.startTime = val[0]
      if (typeof val[1] === 'string') {
        result.endTime = new Date(val[1]).getTime()
      } else {
        result.endTime = val[1]
      }
      result.endTime = result.endTime + (24 * 60 * 60 - 1) * 1000
      // 再处理一下时间戳
      result.startTime = elPlusFormFormat.time(result.startTime, 3)
      result.endTime = elPlusFormFormat.time(result.endTime, 3)
    }
  } else if (desc.type === 'linkuser') {
    const [userIds, deptIds, userNames, deptNames] = val
    result.userIds = userIds
    result.deptIds = deptIds
    result.userNames = userNames
    result.deptNames = deptNames
  } else {
    // 这里处理下通用表单的数据类型
    switch (desc.type) {
      case 'checkbox':
        if (Array.isArray(val)) {
          val = val.join(',')
        }
        break
    }
    result[field] = val
  }
  return result
}

/**
 * 获取处理过后的表单数据
 */
const getFormData = () => {
  const tempData = {} as { [key: string]: any }
  if (props.formDesc) {
    // 循环获取表单数据
    Object.keys(props.modelValue).map((key) => {
      if (['provinceId', 'cityId', 'zoneId', 'streetId'].indexOf(key) >= 0) return
      if (props.formDesc) {
        Object.assign(tempData, handelValToForm(props.formDesc[key], key, props.modelValue[key]))
      }
    })
  }
  return tempData
}

/**
 * 刷新验证码图片
 */
const changeValidImg = () => {
  fieldRefs_.value.map((item) => {
    if (item.CID) {
      item.changeValidImg()
    }
  })
}

/**
 * 提交表单
 */
const handleSubmitForm = async (btnBack: IBtnBack) => {
  // 校验
  const validate = validateForm(btnBack)
  if (!validate) return false
  // 获取数据
  let postData = getFormData()
  try {
    // 校验表单事件处理
    if (tempAttr.beforeValidate) {
      const isPass = await (tempAttr.beforeValidate as Function)(postData)
      if (isPass === false) return
    }
    // await validateForm()
    for (const field in postData) {
      // 去除下划线开头的参数
      if (field.indexOf('_') === 0) {
        delete postData[field]
        continue
      }
      if (props.formDesc) {
        const formItem = props.formDesc[field]
        // valueFormatter的处理
        if (formItem && formItem.valueFormat) {
          postData[field] = formItem.valueFormat(postData[field], postData)
        }
        // 处理带有true或者false值
        if (postData[field] === true || postData[field] === false) {
          postData[field] = +postData[field]
        }
      }
    }
    // 提交数据前的通知
    if (tempAttr.beforeRequest) {
      const beforeRequestData = await (tempAttr.beforeRequest as Function)(postData)
      if (beforeRequestData === false) return
      if (typeof beforeRequestData === 'object') {
        postData = beforeRequestData
      }
    }
    if (props.requestFn) {
      // 在内部调用请求
      if (innerIsLoading.value) return
      innerIsLoading.value = true
      try {
        let response = {}
        if (props.updateFn && postData && (postData as any)[props.idKey]) {
          response = await props.updateFn(postData)
        } else {
          response = await props.requestFn(postData)
        }
        nextTick(() => {
          if (tempAttr.success && typeof tempAttr.success === 'function') {
            tempAttr.success({ response, formData: props.modelValue, callback: () => (innerIsLoading.value = false) } as IFormBack)
          }
          btnBack.callBack && btnBack.callBack()
        })
      } catch (error) {
        // 如果用户有处理异常的方法了
        if (tempAttr.requestError && typeof tempAttr.requestError === 'function') {
          tempAttr.requestError(error)
        } else {
          // 处理异常情况
          if (error instanceof Error) {
            // 返回的是Error类型, 则进行解析
            try {
              const msg = JSON.parse(error.message)
              if (msg instanceof Object) {
                // innerFormError.value = msg;
              }
              // eslint-disable-next-line
            } catch (e) {}
          } else if (error instanceof Object) {
            // 返回的是对象类型, 则直接设置
            // innerFormError = error;
          }
          if (tempAttr.requestError && typeof tempAttr.requestError === 'function') {
            tempAttr.requestError()
          }
        }
        // 报错了这里恢复
        innerIsLoading.value = false
        btnBack.callBack && btnBack.callBack()
      } finally {
        if (!props.isDialog) {
          innerIsLoading.value = false
        }
        if (tempAttr.requestEnd && typeof tempAttr.requestEnd === 'function') {
          tempAttr.requestEnd()
        }
      }
    } else {
      // 在外部用户自己处理请求
      if (props.isLoading) return
      emits('request', postData, btnBack)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('表单校验失败: ', error)
    btnBack.callBack && btnBack.callBack()
  }
}

/**
 * 重置，并清除校验
 */
const reset = () => {
  // 重置
  Object.keys(props.modelValue).map((key) => {
    props.modelValue[key] = oldFormData ? oldFormData[key] : (props.formDesc && props.formDesc[key] && props.formDesc[key].default) || null
  })
  setTimeout(() => {
    // 清空校验
    clearValid()
  }, 100)
  // 通知外部
  emits('reset')
}

/**
 * 清空校验
 */
const clearValid = () => {
  // refElPlusForm.value?.resetFields()
}

/**
 * 清理
 */
const clear = () => {
  // 这里进行数据清空
  if (props.modelValue) {
    Object.keys(props.modelValue).map((key) => {
      props.modelValue[key] = (props.formDesc && props.formDesc[key] && props.formDesc[key].default) || null
    })
  }
  // 重置校验
  nextTick(() => {
    clearValid()
  })
}

/**
 * 单独校验一下字段
 * @param field
 */
function handelValidateThis(field: string) {
  refElPlusForm.value.validateField(field, (err: any) => {
    // eslint-disable-next-line no-console
    console.log('validate err: ', err)
  })
}

// 监听Desc改变
watch(
  () => props.formDesc,
  (formDesc) => {
    if (formDesc) {
      // 检查联动
      initFormAttrs()
    }
  }
)

// 深度监听data改变
watch(
  () => props.modelValue,
  (data) => {
    if (!oldFormData || (isOpenListen.value && data && JSON.stringify(data) !== JSON.stringify(oldFormData))) {
      // 检查联动
      if (JSON.stringify(data) !== JSON.stringify(oldFormData)) {
        oldFormData = cloneDeep(data)
        initFormAttrs()
      }
    }
  },
  { deep: true }
)

onLoad(() => {
  let { statusBarHeight = 0 } = uni.getSystemInfoSync()
  let customHeight = uni.getMenuButtonBoundingClientRect()
  let { top, height } = customHeight
  let navigationBarHeight = height + (top - statusBarHeight) * 2
  marginTopMain.value = `${navigationBarHeight + statusBarHeight}px`
})

onMounted(async () => {
  // 检查联动
  if (!isOpenListen.value) {
    initFormAttrs()
  }
  clearValid()
})

// 暴露对外方法
defineExpose({ submit: handleSubmitForm, getData: getFormData, validate: validateForm, reset, clearValid, clear, changeValidImg })
/* eslint-enable */
</script>
<style lang="scss" scoped>
.uni-ui-crud-form {
  width: 100%;
  overflow-x: hidden;
  .uni-list {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    .uni-list-cell {
      position: relative;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      .form-cut {
        width: 100%;
        height: 16rpx;
      }
      .crud-form-item {
        background-color: #fff;
        flex: 1;
        box-sizing: border-box;
        padding: 0 40rpx;
        border-bottom: 1px solid #f8f8f8;

        .form-weight-label {
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
        }

        .textField {
          font-size: 32rpx;
          color: #303133;
          text-align: right;
          min-height: 108rpx;
          line-height: 108rpx;
          .unit {
            padding-left: 20rpx;
          }
        }
      }
    }
  }
}
</style>
