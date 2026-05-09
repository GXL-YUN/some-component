import Taro from '@tarojs/taro'
import { getCookie } from '@/pages/util/CookieUtil'

/* ===================== 类型定义 ===================== */

interface DomainConfig {
  api: string
  file?: string
  third?: string
}

interface NetworkConfig {
  autoAuth?: boolean
  requestInterceptor?: (option: Taro.request.Option<any>) => Taro.request.Option<any>
  responseInterceptor?: (res: Taro.request.SuccessCallbackResult<any>) => any
}

type DomainType = 'api' | 'file' | 'third'

/* ===================== 域名配置 ===================== */

// 默认配置：开发环境使用空字符串（依赖 Vite proxy），生产环境使用实际域名
let domainConfig: DomainConfig = {
  api: '',  // H5: 空字符串走 Vite proxy; 小程序: 需要配置实际域名
  file: '',
  third: ''
}

// 运行时配置域名（优先级最高）
export const configureDomain = (config: Partial<DomainConfig>) => {
  domainConfig = { ...domainConfig, ...config }
}

// 根据环境自动配置域名
export const initDomainConfig = () => {
  const env = Taro.getEnv()
  
  if (env === Taro.ENV_TYPE.WEAPP) {
    // 微信小程序环境
    configureDomain({
      api: 'https://your-weapp-domain.com', // 替换为你的小程序域名
    })
  } else if (env === Taro.ENV_TYPE.TT) {
    // 抖音小程序环境
    configureDomain({
      api: 'https://your-tt-domain.com', // 替换为你的抖音小程序域名
    })
  }
  // H5 环境默认使用空字符串，走 Vite proxy
}

/* ===================== 白名单 ===================== */

const WHITELIST: RegExp[] = [
  /\/api\/account\/user\/checkToke$/,
  /\/api\/account\/user\/login$/,
  /\/api\/account\/user\/register$/,
  /\/api\/account\/user\/sendCode$/,
  /\/api\/account\/user\/resetPassword$/
]

const isWhitelist = (url: string): boolean => {
  const fullUrl = createUrl(url, 'api')
  return WHITELIST.some(r => r.test(fullUrl))
}

/* ===================== 默认配置 ===================== */

const defaultConfig: NetworkConfig = {
  autoAuth: true,
  requestInterceptor: undefined,
  responseInterceptor: undefined
}

let config: NetworkConfig = { ...defaultConfig }

export const configureNetwork = (customConfig: NetworkConfig) => {
  config = { ...config, ...customConfig }
}

/* ===================== URL 处理 ===================== */

const normalizeUrl = (base: string, path: string) =>
  `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

const createUrl = (url: string, type: DomainType = 'api'): string => {
  // 如果是完整的 URL，直接返回
  if (/^https?:\/\//.test(url)) {
    return url
  }
  
  const base = domainConfig[type] || domainConfig.api
  
  // 如果 base 为空（H5 开发环境），使用相对路径走 Vite proxy
  if (!base) {
    return url.startsWith('/') ? url : `/${url}`
  }
  
  return normalizeUrl(base, url)
}

/* ===================== Header ===================== */

const getHeaders = (token?: string | null, headers?: Record<string, string>) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...headers
})

/* ===================== 错误处理 ===================== */

const handleError = (error: any) => {
  if (error?.statusCode === 401) {
    Taro.redirectTo({ url: '/pages/merchant-login/index' })
  }
  return Promise.reject(error)
}

/* ===================== 内部请求（不走登录校验） ===================== */

export const innerRequest = async (
  option: Taro.request.Option<any>
): Promise<Taro.request.SuccessCallbackResult<any>> => {
  const token = getCookie('user_key')
  return Taro.request({
    ...option,
    url: createUrl(option.url!, 'api'),
    header: getHeaders(token, option.header)
  })
}

/* ===================== 核心请求 ===================== */

const request = async (
  option: Taro.request.Option<any>
): Promise<Taro.request.SuccessCallbackResult<any>> => {
  const url = option.url!

  // 非白名单接口检查登录状态
  if (!isWhitelist(url) && config.autoAuth) {
    // TODO: 实现登录检查逻辑
    // const user = await checkLogin()
    // if (!user) {
    //   Taro.redirectTo({ url: '/pages/login/index' })
    //   return Promise.reject('未登录')
    // }
  }

  // 自动添加 user_id
  const userId = getCookie('user_id')
  option.data = {
    ...(option.data ?? {}),
    ...(userId ? { user_id: userId } : {})
  }

  // 应用请求拦截器
  const processedOption = config.requestInterceptor
    ? config.requestInterceptor(option)
    : option

  const token = getCookie('user_key')

  return Taro.request({
    ...processedOption,
    url: createUrl(processedOption.url!, 'api'),
    header: getHeaders(token, processedOption.header)
  })
    .then(res => config.responseInterceptor?.(res) || res)
    .catch(handleError)
}

/* ===================== 文件上传 ===================== */

export const uploadFile = async (
  option: Taro.uploadFile.Option
): Promise<Taro.uploadFile.SuccessCallbackResult> => {
  const token = getCookie('user_key')

  return Taro.uploadFile({
    ...option,
    url: createUrl(option.url!, 'file'),
    header: getHeaders(token, option.header)
  }).catch(handleError)
}

/* ===================== 文件下载 ===================== */

export const downloadFile = async (
  option: Taro.downloadFile.Option
): Promise<Taro.downloadFile.FileSuccessCallbackResult> => {
  const token = getCookie('user_key')

  return Taro.downloadFile({
    ...option,
    url: createUrl(option.url!, 'file'),
    header: getHeaders(token, option.header)
  }).catch(handleError)
}

/* ===================== 对外统一出口 ===================== */

export const Network = {
  request,
  get: (url: string, data?: any, header?: Record<string, string>) =>
    request({ url, method: 'GET', data, header }),
  post: (url: string, data?: any, header?: Record<string, string>) =>
    request({ url, method: 'POST', data, header }),
  put: (url: string, data?: any, header?: Record<string, string>) =>
    request({ url, method: 'PUT', data, header }),
  delete: (url: string, data?: any, header?: Record<string, string>) =>
    request({ url, method: 'DELETE', data, header }),
  uploadFile,
  downloadFile,
  innerRequest,
  configureDomain,
  configureNetwork,
  initDomainConfig
}
