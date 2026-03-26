import { create } from 'zustand'
import { type Account } from '../types'
import { ACCOUNTS } from '../data'

interface AuthState {
  token: string | null
  refresh_token: string | null
  tenantId: string | null
  authorization: string | null
  userId: string | null
  currentAccount: Account

  initAuth: () => void
  setCurrentAccount: (id: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refresh_token: null,
  tenantId: null,
  authorization: null,
  userId: null,
  currentAccount: ACCOUNTS[0],

  initAuth: () => {
    if (typeof window === 'undefined') return
    const searchParams = new URLSearchParams(window.location.search)
    let hasAuthParams = false
    const authData: Partial<AuthState> = {}

    // 尝试解析单一 data 参数 (JSON 字符串)
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        // searchParams.get 已经自动执行了解码，直接 parse 即可
        const parsedData = JSON.parse(dataParam)
        const keysToExtract = [
          { key: 'token', storeKey: 'token' },
          { key: 'refresh_token', storeKey: 'refresh_token' },
          { key: 'tenantId', storeKey: 'tenantId' }, // 注意大小写映射
          { key: 'authorization', storeKey: 'authorization' },
          { key: 'userId', storeKey: 'userId' },
        ]
        keysToExtract.forEach(({ key, storeKey }) => {
          if (parsedData[key]) {
            ;(authData as any)[storeKey] = parsedData[key]
            hasAuthParams = true
            localStorage.setItem(`market_${storeKey}`, parsedData[key])
          }
        })

        searchParams.delete('data')
      } catch (error) {
        console.error('Failed to parse authentication data from URL:', error)
      }
    }

    // 兼容原有的独立参数或从 localStorage 恢复
    const stateKeys: (keyof AuthState)[] = [
      'token',
      'refresh_token',
      'tenantId',
      'authorization',
      'userId',
    ]
    stateKeys.forEach((stateKey) => {
      // 如果前面没有从 data 参数中拿到，尝试从单独的 URL 参数或本地存储恢复
      if (!(authData as any)[stateKey]) {
        const val = searchParams.get(stateKey) || searchParams.get(stateKey.toLowerCase())
        if (val) {
          ;(authData as any)[stateKey] = val
          hasAuthParams = true
          localStorage.setItem(`market_${stateKey}`, val)
          searchParams.delete(stateKey)
          searchParams.delete(stateKey.toLowerCase())
        } else {
          const storedVal = localStorage.getItem(`market_${stateKey}`)
          if (storedVal) {
            ;(authData as any)[stateKey] = storedVal
          }
        }
      }
    })

    if (hasAuthParams) {
      // Clean up URL
      const newUrl = `${window.location.pathname}${
        searchParams.toString() ? '?' + searchParams.toString() : ''
      }${window.location.hash}`
      window.history.replaceState({}, '', newUrl)
    }

    set((state) => ({ ...state, ...authData }))

    // 触发获取用户信息（使用动态 import 避免与 userStore 形成循环依赖）
    if (authData.userId || localStorage.getItem('market_userId')) {
      import('../utils/user')
        .then(({ useUserStore }) => {
          const store = useUserStore.getState()
          const finalUserId = (authData.userId || localStorage.getItem('market_userId')) as string

          // 当 dataParam 存在（说明发生了新登录/SSO），或者本地无用户信息时，去请求接口
          const currentUserInfo = store.userInfo
          if (dataParam || !currentUserInfo || currentUserInfo.userId !== finalUserId) {
            store.getUserInfo(finalUserId)
          }

          // 同时获取租户列表
          if (dataParam || store.tenantList.length === 0) {
            store.getTenantList()
          }
        })
        .catch((err) => console.error('Failed to load user store:', err))
    }
  },

  setCurrentAccount: (id: string) => {
    const account = ACCOUNTS.find((a) => a.id === id)
    if (account) {
      set({ currentAccount: account })
    }
  },
}))
