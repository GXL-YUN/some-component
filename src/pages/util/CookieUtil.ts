import Taro from '@tarojs/taro'

/**
 * Cookie 工具类
 * 用于在 Taro 中模拟 Cookie 操作
 */

// 使用 Taro.getStorageSync 模拟 Cookie
const COOKIE_PREFIX = 'cookie_'

/**
 * 设置 Cookie
 */
export const setCookie = (key: string, value: string, expires?: number) => {
  const data = {
    value,
    expires: expires ? Date.now() + expires * 1000 : undefined
  }
  Taro.setStorageSync(`${COOKIE_PREFIX}${key}`, JSON.stringify(data))
}

/**
 * 获取 Cookie
 */
export const getCookie = (key: string): string | null => {
  try {
    const raw = Taro.getStorageSync(`${COOKIE_PREFIX}${key}`)
    if (!raw) return null
    
    const data = JSON.parse(raw)
    
    // 检查是否过期
    if (data.expires && Date.now() > data.expires) {
      removeCookie(key)
      return null
    }
    
    return data.value
  } catch {
    return null
  }
}

/**
 * 移除 Cookie
 */
export const removeCookie = (key: string) => {
  Taro.removeStorageSync(`${COOKIE_PREFIX}${key}`)
}

/**
 * 清除所有 Cookie
 */
export const clearCookie = () => {
  const keys = Taro.getStorageInfoSync().keys
  keys.forEach(key => {
    if (key.startsWith(COOKIE_PREFIX)) {
      Taro.removeStorageSync(key)
    }
  })
}

/**
 * 检查 Cookie 是否存在
 */
export const hasCookie = (key: string): boolean => {
  return !!getCookie(key)
}

/**
 * 设置用户登录信息
 */
export const setUserInfo = (userId: string, token: string, expires?: number) => {
  setCookie('user_id', userId, expires)
  setCookie('user_key', token, expires)
}

/**
 * 获取用户 ID
 */
export const getUserId = (): string | null => {
  return getCookie('user_id')
}

/**
 * 获取用户 Token
 */
export const getToken = (): string | null => {
  return getCookie('user_key')
}

/**
 * 清除用户登录信息
 */
export const clearUserInfo = () => {
  removeCookie('user_id')
  removeCookie('user_key')
  removeCookie('api_code')
}

/**
 * 检查用户是否已登录
 */
export const isLoggedIn = (): boolean => {
  return !!getToken()
}
