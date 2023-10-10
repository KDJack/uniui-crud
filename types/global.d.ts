// 声明一个模块，防止引入文件时报错
declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.scss'
declare module '*.ts'
declare module '*.js'

declare module 'lodash'

declare class wx {
  static getMenuButtonBoundingClientRect(): any
}

/**
 * 配置微信独有的API
 */
interface Uni {
  onNeedPrivacyAuthorization: any
  requirePrivacyAuthorize: any
}

/**
 * 入参
 */
declare interface RequestParams {
  [key: string]: any
}

/**
 * 通用的请求返回对象
 */
declare interface RootObject<T> {
  status: number
  errorMsg: string
  data: T
}

/**
 * 分页数据请求返回对象
 */
declare interface PageObject<T> {
  total?: number | string
  size?: number | string
  pages?: number | string
  current?: number | string
  records?: Array<T>
}

// 申明 数组
declare type EmptyArrayType<T = any> = T[]

// 申明 对象
declare type EmptyObjectType<T = any> = {
  [key: string]: T
}
