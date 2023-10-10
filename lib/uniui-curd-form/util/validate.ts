/**
 * 获取通用的校验规则
 */

/**
 * 不能为空
 */
export const notNull = [{ required: true, trigger: 'blur', validator: validateInputNotNull }]

/**
 * 不能全是空格
 */
export const notAllBlank = [{ required: true, trigger: 'blur', validator: validateInputNotAllBlank }]

/**
 * 必须是数字
 */
export const number = [{ type: 'number', message: '请填入数字！' }]

/**
 * 校验验证码
 */
export const vCode = [{ required: true, trigger: 'blur', validator: validateValidateCode }]

/**
 * 校验邮箱
 */
export const email = [{ trigger: 'blur', validator: validateEmail }]

/**
 * 校验手机号
 */
export const phone = [{ required: true, trigger: 'blur', validator: validatePhone }]

/**
 * 校验密码
 */
export const password = [{ required: true, trigger: 'blur', validator: validatePassword }]

/**
 * 校验密码
 */
export const password2 = [{ trigger: 'blur', validator: validatePassword }]

/**
 * 校验账户
 */
export const account = [{ required: true, trigger: 'blur', validator: validateAccount }]

/**
 * 校验英文字母加数字
 */
export const wordnum = [{ trigger: 'blur', validator: validateWordNumber }]
export const wordnum2 = [{ required: true, trigger: 'blur', validator: validateWordNumber }]

/**
 * 必须是数字且不为空
 */
export const numberNotNull = [
  { required: true, message: '不能为空！', trigger: 'blur' },
  { type: 'number', message: '请填入数字！' }
]

/**
 * 正整数
 */
export const zhengZhengShu = [{ required: true, trigger: 'blur', validator: validateZhengZhengShu }]

/**
 * Double类型
 */
export const double = [{ required: true, trigger: 'blur', validator: validateDouble }]
/**
 * Double类型且必填
 */
export const double2 = [{ trigger: 'blur', validator: validateDouble }]

/**
 * 选择
 */
export const select = [{ required: true, trigger: 'change', validator: validateSelect }]

/**
 * 级联选择
 * @type {[*]}
 */
export const cascader = [{ required: true, trigger: 'change', validator: validateSelect }]

/**
 * 必须上传
 */
export const upload = [{ required: true, trigger: 'change', validator: validateUpload }]

/**
 * 文本域
 */
export const textarea = [{ required: true, trigger: 'change', validator: validateTextarea }]

/**
 * 富文本编辑器
 */
export const editor = [{ required: true, trigger: 'change', validator: validateEditor }]

/**
 * 所有字符
 */
export const code = [{ required: true, trigger: 'blur', validator: vaildataCode }]

/**
 * 汉字
 */
export const chineseCode = [{ required: true, trigger: 'blur', validator: vaildataChineseCode }]

/**
 * 带两位小数的数字
 */
export const money = [{ required: true, trigger: 'blur', validator: vaildataMoney }]

/**
 * 身份证
 */
export const idCard = [{ required: true, trigger: 'blur', validator: vaildataIDcard }]

/**
 * 企业名称
 */
export const enterpriseName = [{ required: true, trigger: 'blur', validator: vaildataIEnterpriseName }]
/**
 * 企业名称
 */
export const uscc = [{ required: true, trigger: 'blur', validator: vaildataIUscc }]

/**
 * 正整数校验
 * @param rule
 * @param value
 * @param callback
 */
function validateZhengZhengShu(value: any) {
  if (!/^[1-9]\d*$/.test(value * 1 + '')) {
    return '请输入正整数！'
  }
  return true
}

/**
 * 选择
 * @param rule
 * @param value
 * @param callback
 */
function validateValidateCode(value: any) {
  if (value.length !== 4) {
    return '验证码必须是4位！'
  }
  return true
}

/**
 * 选择
 * @param rule
 * @param value
 * @param callback
 */
function validateInputNotNull(value: any) {
  if (typeof value === 'undefined' || value === '' || value === null) {
    return '此项必填！'
  }
  return true
}

/**
 * 不能全是空格
 * @param rule
 * @param value
 * @param callback
 */
function validateInputNotAllBlank(value: any) {
  if (typeof value === 'undefined' || value === '' || value === null) {
    return '此项必填！'
  } else {
    if (typeof value === 'number') {
      value = value + ''
    }
    if (typeof value === 'string' && value.match(/^[ ]*$/)) {
      return '不能全是空格!'
    }
    return true
  }
}

/**
 * 选择
 * @param rule
 * @param value
 * @param callback
 */
function validateSelect(value: any) {
  if (value === null || typeof value === 'undefined' || value === '' || value.length <= 0) {
    return '请选择！'
  }
  return true
}

/**
 * 上传
 * @param rule
 * @param value
 * @param callback
 */
function validateUpload(value: any) {
  if (value === null || typeof value === 'undefined' || value === '' || value.length <= 0) {
    return '请上传！'
  }
  return true
}

/**
 * 文本域
 * @param rule
 * @param value
 * @param callback
 */
function validateTextarea(value: any) {
  if (typeof value === 'undefined' || value === null || value === '' || value === null) {
    return '此项必填！'
  } else if (!value.replace(/\n/g, '')) {
    return '不能全是换行！'
  } else if (typeof value === 'string' && value.replace(/\n/g, '').match(/^[ ]*$/)) {
    return '不能全是空格!'
  }
  return true
}
/**
 * 富文本编辑器
 * @param rule
 * @param value
 * @param callback
 */
function validateEditor(value: any) {
  if (typeof value === 'undefined' || value === null || value === '' || value === null) {
    return '此项必填！'
  } else if (!value.replace(/\n/g, '')) {
    return '不能全是换行！'
  } else if (typeof value === 'string' && value.replace(/\n/g, '').match(/^[ ]*$/)) {
    return '不能全是空格!'
  }
  return true
}

/**
 * 小数校验规则
 * @param rule
 * @param value
 * @param callback
 */
function validateDouble(value: any) {
  if (!/^\d+(\.(\d{1}|\d{2}))?$/.test(value * 1 + '')) {
    return '小数格式错误(最多两位)!'
  }
  return true
}

/**
 * 校验邮箱
 * @param rule
 * @param value
 * @param callback
 */
function validateEmail(value: any) {
  if (!value) {
    return '邮箱必填'
  } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
    return '邮箱格式错误!'
  }
  return true
}

/**
 * 校验手机号
 * @param rule
 * @param value
 * @param callback
 */
function validatePhone(value: any) {
  if (!value) {
    return '手机号必填'
  } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
    return '手机号格式错误!'
  }
  return true
}

/**
 * 校验密码
 * @param rule
 * @param value
 * @param callback
 */
export function validatePassword(value: any) {
  if (!value || !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?=.*[~!@#$%^&*])(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,32}$/.test(value)) {
    return '密码为8-32位字母大小写+特殊字符+数字!'
  }
  return true
}

/**
 * 校验密码
 * @param rule
 * @param value
 * @param callback
 */
export function validatePassword2(value: any) {
  if (value && !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?=.*[~!@#$%^&*])(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,32}$/.test(value)) {
    return '密码为8-32位字母大小写+特殊字符+数字!'
  }
  return true
}

/**
 * 校验账户
 * @param rule
 * @param value
 * @param callback
 */
function validateAccount(value: any) {
  if (typeof value === 'undefined' || value === '' || value === null) {
    return '此项必填！'
  } else if (value && !/^([a-z,A-z,0-9]){4,20}$/.test(value)) {
    return '账号为4-20位字母或数字!'
  }
  return true
}

/**
 * 校验字母和数字组成
 * @param rule
 * @param value
 * @param callback
 */
function validateWordNumber(value: any) {
  if (value && !/^([a-z,A-z,0-9]){16,20}$/.test(value)) {
    return '请输入16-20位字母或数字!'
  }
  return true
}

/**
 * 校验字符
 */

function vaildataChineseCode(value: any) {
  if (value && !/^[\u4E00-\u9FA5·]+$/.test(value)) {
    return '请输入中文字符!'
  }
  return true
}

/**
 * 校验字符
 */

function vaildataCode(value: any) {
  if (value && !/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)) {
    return '请输入中文、字母、数字或下划线字符!'
  }
  return true
}

/**
 * 数字(最多带两位小数)
 */

function vaildataMoney(value: any) {
  if (value && !/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) {
    return '请输入数字(最多带两位小数)!'
  }
  return true
}

/**
 * 身份证
 */
function vaildataIDcard(value: any) {
  if (value && !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/.test(value)) {
    return '请输入正确的身份证号码！'
  }
  return true
}

/**
 * 企业名称
 */
function vaildataIEnterpriseName(value: any) {
  if (value && !/^[\u4E00-\u9FA50-9_]+$/.test(value)) {
    return '请输入中文、数字字符!'
  }
  return true
}

/**
 * 统一社会信用代码
 */
function vaildataIUscc(value: any) {
  if (value && !/^[A-Za-z0-9]+$/.test(value)) {
    return '请输入英文字母、数字字符!'
  }
  return true
}
