import { useAuthStore } from '../store/authStore'

const BASE_URL = (import.meta as any).env?.VITE_BASE_API || ''

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

let isRefreshing: boolean = false
let reqList: any[] = []
let isShowModal: boolean = true

const outLog = async () => {
  const { useUserStore } = await import('./user')
  const userStore = useUserStore.getState()
  userStore.clearAll()
  setTimeout(() => {
    isRefreshing = false
    isShowModal = true
  }, 1000)
  // window.location.href = '/';
}

/**
 * 封装 Fetch API，自动注入 Token 和 tenantId
 */
export const request = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { params, ...customOptions } = options
  const { token, tenantId, authorization } = useAuthStore.getState()
  const isFormDataBody = customOptions.body instanceof FormData

  const headers: HeadersInit = {
    ...customOptions.headers,
  }
  if (!isFormDataBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Skyman-Auth'] = token
  }
  if (!headers['Tenant-Id'] && tenantId) {
    headers['Tenant-Id'] = tenantId
  }
  if (authorization) {
    headers['Authorization'] = authorization
  }
  console.log(headers, useAuthStore.getState())

  let finalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    finalUrl += `?${searchParams.toString()}`
  }

  try {
    const response = await fetch(finalUrl, {
      ...customOptions,
      headers,
    })

    const status = response.status
    console.log(status, response)
    if (response.url?.includes('/oauth/token') && status === 412) {
      await outLog()
      return {} as T
    }

    if (status === 412) {
      if (!isShowModal) return {} as T
      if (localStorage.getItem('market_token')) {
        if (!isRefreshing) {
          isRefreshing = true
          const { useUserStore } = await import('./user')
          const userStore = useUserStore.getState()
          try {
            await userStore.refreshUser()
            reqList.forEach((cb) => cb())
            reqList = []
            isRefreshing = false
            return await request<T>(url, options)
          } catch (e) {
            reqList = []
            isRefreshing = false
            throw e
          }
        } else {
          return new Promise<T>((resolve) => {
            reqList.push(() => {
              resolve(request<T>(url, options))
            })
          })
        }
      } else {
        // alert('token缺失，请重新登录');
        await outLog()
        return {} as T
      }
    } else if (status === 401) {
      // alert('身份过期，请重新登录');
      await outLog()
      return {} as T
    } else if (status === 409) {
      if (!isShowModal) return {} as T
      isShowModal = false
      if (window.confirm('该账号已被其他设备操作登出\n请重新登录')) {
        await outLog()
      } else {
        await outLog() // Even if cancelled, we logout
      }
      return {} as T
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {} as T
    }
    console.error('Request failed:', error)
    throw error
  }
}

export const get = <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'GET', params })
}

export const post = <T>(url: string, body?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) })
}

export const postForm = <T>(url: string, formData: FormData, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'POST', body: formData })
}

export const put = <T>(url: string, body?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) })
}

export const del = <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'DELETE', params })
}
