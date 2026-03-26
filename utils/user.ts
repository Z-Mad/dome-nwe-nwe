import { create } from 'zustand'
import { useAuthStore } from '../store/authStore'
import { refreshToken, logout as logoutApi } from '../services/auth'
import {
  getUserInfo as getUserInfoApi,
  getTenantList as getTenantListApi,
  type UserInfo,
  type TenantInfo,
} from '../services/system'

// 声明全局变量以避免 TS 报错（建议放到全局 vite-env.d.ts 中）
declare const __SCS_RESOURCE__: string

interface UserState {
  userInfo: UserInfo | null
  tenantList: TenantInfo[]
  deviceInfo: any
  checkDeveloper: boolean // 是否是开发者

  setUserInfo: (info: UserInfo) => void
  getUserInfo: (userId: string) => Promise<UserInfo | null>
  getTenantList: () => Promise<TenantInfo[]>
  refreshUser: (tenantId?: string, shouldReload?: boolean) => Promise<any>
  refreshPage: () => void
  logout: () => Promise<void>
  clearAll: () => void
}

let userInfoPromise: Promise<UserInfo | null> | null = null
let tenantListPromise: Promise<TenantInfo[]> | null = null

const checkIsDeveloper = (userInfo: UserInfo | null) => {
  return !!(userInfo?.menuCode?.includes('setting:developer') && userInfo?.checkDeveloper)
}

export const useUserStore = create<UserState>((set, getStore) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')

  return {
    userInfo,
    tenantList: [],
    deviceInfo: JSON.parse(localStorage.getItem('device_info') || '{}'),
    checkDeveloper: checkIsDeveloper(userInfo),

    setUserInfo: (info: UserInfo) => {
      set({
        userInfo: info,
        checkDeveloper: checkIsDeveloper(info),
      })
      localStorage.setItem('userInfo', JSON.stringify(info))
    },

    getUserInfo: async (userId: string) => {
      if (!userId) return null
      // 如果正在请求，返回现有 Promise
      if (userInfoPromise) return userInfoPromise

      userInfoPromise = (async () => {
        try {
          const response = await getUserInfoApi(userId)
          if (response.success && response.data) {
            set({
              userInfo: response.data,
              checkDeveloper: checkIsDeveloper(response.data),
            })
            localStorage.setItem('userInfo', JSON.stringify(response.data))
            return response.data
          }
          return null
        } catch (error) {
          console.error('获取用户信息失败:', error)
          return null
        } finally {
          userInfoPromise = null
        }
      })()

      return userInfoPromise
    },

    getTenantList: async () => {
      // 如果已经有列表，直接返回
      const currentList = getStore().tenantList
      if (currentList && currentList.length > 0) {
        return currentList
      }

      // 如果正在请求，返回现有 Promise
      if (tenantListPromise) return tenantListPromise

      tenantListPromise = (async () => {
        try {
          const response = await getTenantListApi()
          if (response.success && response.data) {
            const filteredData = response.data.filter((item) => item.status === 'NORMAL')
            set({ tenantList: filteredData })
            return response.data
          }
          return []
        } catch (error) {
          console.error('获取组织信息失败:', error)
          return []
        } finally {
          tenantListPromise = null
        }
      })()

      return tenantListPromise
    },

    refreshPage: () => {
      window.location.reload()
    },

    refreshUser: async (tenantId?: string, shouldReload: boolean = false) => {
      const authStore = useAuthStore.getState()
      const refresh_token = authStore.refresh_token || localStorage.getItem('market_refresh_token')

      if (!refresh_token) {
        getStore().clearAll()
        return Promise.reject(new Error('没有可用的 refresh_token'))
      }

      try {
        // 传递自定义 Header
        const options = tenantId ? { headers: { 'Tenant-Id': tenantId } } : {}

        const response = await refreshToken(
          {
            grant_type: 'refresh_token',
            scope: 'all',
            refresh_token,
          },
          options,
        )
        if (response.success && response.data?.access_token) {
          const newToken = `${response.data.token_type || 'Bearer'} ${response.data.access_token}`

          // 更新 authStore 状态
          useAuthStore.setState({
            token: newToken,
            refresh_token: response.data.refresh_token,
            tenantId: tenantId || authStore.tenantId,
          })

          // 更新 localStorage
          localStorage.setItem('market_token', newToken)
          localStorage.setItem('market_refresh_token', response.data.refresh_token)
          if (tenantId && response.data.user_id) {
            localStorage.setItem('market_tenantId', tenantId)
            await getStore().getUserInfo(response.data.user_id)
          }

          if (shouldReload) {
            window.location.reload()
          }

          return response.data
        } else {
          throw new Error(response.msg || 'Token 刷新失败')
        }
      } catch (error) {
        console.error('刷新 token 请求失败:', error)
        getStore().clearAll()
        return Promise.reject(error)
      }
    },

    logout: async () => {
      try {
        // 如果后端有登出接口可以调用
        await logoutApi()
      } catch (e) {
        console.warn('退出登录接口调用失败或未定义', e)
      }
      getStore().clearAll()
      // 退出后回到首页或其他无授权页面，依赖项目实际情况
      // window.location.href = '/';
    },

    clearAll: () => {
      set({ userInfo: null, tenantList: [], checkDeveloper: false })
      localStorage.removeItem('userInfo')
      // 清除 authStore
      useAuthStore.setState({
        token: null,
        refresh_token: null,
        tenantId: null,
        authorization: null,
      })
      localStorage.removeItem('market_token')
      localStorage.removeItem('market_refresh_token')
      localStorage.removeItem('market_tenantId')
      localStorage.removeItem('market_authorization')
    },
  }
})
