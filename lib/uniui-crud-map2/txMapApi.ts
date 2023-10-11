/**
 * 周边推荐
 * 只需提供搜索中心点及半径（无须关键词），即可搜索获取周边高热度地点，
 * @param data
 * @returns
 */
export function queryExplorePage(data: any) {
  return request<Array<ITXMapPOI>>(`https://apis.map.qq.com/ws/place/v1/explore?${mapToUrlStr(data)}`, 'GET')
}

/**
 * 搜索项
 * @param data
 * @returns
 */
export function querySuggestionPage(data: any) {
  return request<Array<ITXMapPOI>>(`https://apis.map.qq.com/ws/place/v1/suggestion?${mapToUrlStr(data)}`, 'GET')
}

/**
 * map转string
 * @param map
 * @param excludeList
 * @returns {string}
 */
function mapToUrlStr(map: any, excludeList?: any) {
  let queryStr = ''
  for (const key in map) {
    if (excludeList && Array.isArray(excludeList) && excludeList.length > 0) {
      if (excludeList.indexOf(key) >= 0) {
        continue
      }
    }
    if (map[key] !== undefined && map[key] !== null && map[key] !== '') {
      if (queryStr !== '') {
        queryStr += '&'
      }
      queryStr += key + '=' + map[key]
    }
  }
  return queryStr
}

/**
 * 封装请求
 * @param url
 * @param method
 * @param data
 * @param headers
 * @returns
 */
function request<T>(url: string, method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' = 'POST', queryData?: RequestParams, headers?: { [key: string]: any }) {
  // 传参： 接口url，  method类型， params参数
  let token = uni.getStorageSync('token') || ''
  return new Promise<T>((resolve, reject) => {
    uni.request({
      method: method,
      url,
      data: queryData,
      header: {
        ...(headers || {}),
        ['Device-Type']: 'WXMA',
        Authorization: token
      },
      success: function ({ data, statusCode }) {
        const { code, status, result, data: rData, msg, message } = data as any
        if (statusCode === 200) {
          if (code === 200 || status === 0) {
            resolve((result || rData) as T)
          } else {
            uni.hideLoading()
            uni.showToast({ title: msg || message, icon: 'none', duration: 2000 })
          }
          reject(msg)
        } else {
          uni.hideLoading()
          uni.showToast({ title: msg || message, icon: 'none', duration: 2000 })
        }
      },
      fail: function (error: any) {
        // 这里处理请求错误类型
        switch (error.message) {
          case 'Network Error':
            uni.showToast({ icon: 'none', title: '网络请求失败，请检查您的网络，或者稍后再试' })
            break
        }
        // 对响应错误做点什么
        reject(error)
      }
    })
  })
}
