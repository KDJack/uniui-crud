export interface IMixinsProps {
  modelValue?: any
  field: string
  rowIndex?: number
  loading?: boolean
  desc: { [key: string]: any }
  formData: { [key: string]: any }
  defineEmits?: any
}

/**
 * 获取属性
 * @param props
 * @param customAttrs
 * @returns
 */
export const getAttrs = async (props: IMixinsProps, customAttrs?: { [key: string]: any }) => {
  // 合并属性
  const attrs = Object.assign({}, customAttrs, props.desc?._attrs, props.desc?.attrs, { placeholder: getPlaceholder(props.desc) })

  // 处理多选
  if (props.desc.multiple) {
    attrs.multiple = true
    attrs.showCheckbox = true
    if (['select'].indexOf(props.desc.type) >= 0) {
      attrs.collapseTags = props.desc.attrs?.collapseTags || false
      attrs.collapseTagsTooltip = props.desc.attrs?.collapseTagsTooltip || false
    }
  }

  // if (['area'].indexOf(props.desc.type) >= 0) {
  //   delete attrs.options
  // }

  // 处理下elType
  if (props.desc.elType) {
    if (typeof props.desc.elType === 'function') {
      attrs.type = props.desc.elType(props.formData)
    } else {
      attrs.type = props.desc.elType
    }
  }
  return attrs
}

/**
 * 获取事件
 * @returns
 */
export const getEvents = (props: IMixinsProps) => {
  const tempOn = {} as any
  if (props.desc?.on) {
    Object.keys(props.desc.on).map((key: string) => {
      tempOn[key] = (val: any) => {
        props.desc.on[key](props.formData, props.rowIndex, val)
      }
    })
  }
  return tempOn
}

/**
 * 根据类型获取属性 placeholder
 * @param desc
 * @returns
 */
export function getPlaceholder(desc: { [key: string]: any }): string {
  if (!desc || !desc.type) return ''
  switch (desc.type) {
    case 'input':
    case 'digit':
    case 'nbinput':
    case 'password':
    case 'number':
    case 'validCode':
    case 'tag':
    case 'textarea':
    case 'pcode':
    case 'idcard':
      return desc?.placeholder || '请输入' + desc?._label
    case 'switch':
      return ''
    case 'area':
    case 'date':
    case 'select':
    case 'selectTag':
    case 'category':
    case 'cascader':
    case 'map':
    case 'map2':
      return desc?.placeholder || '请选择' + (desc.remote ? (desc.initLoad !== false ? '（默认查10个，其余请输入搜索）' : '或输入进行搜索') : desc?._label)
    case 'datetime':
    case 'daterange':
    case 'datetimerange':
    case 'timerange':
    case 'monthrange':
      return '选择日期'
    case 'dates':
      return '选择一个或多个日期'
    case 'month':
      return '选择月'
    case 'time':
      return '请选择时间'
    case 'timsPicker':
      return '请选择周'
    case 'year':
      return '请选择年'
    case 'upimg':
      return '请上传'
    case 'upfile':
      return '点击上传'
  }
  return ''
}
