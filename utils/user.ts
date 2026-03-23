import { create } from 'zustand';
import { useAuthStore } from '../store/authStore';
import { refreshToken, logout as logoutApi } from '../services/auth';
import { getUserInfo as getUserInfoApi, getTenantList as getTenantListApi, UserInfo, TenantInfo } from '../services/system';

// 声明全局变量以避免 TS 报错（建议放到全局 vite-env.d.ts 中）
declare const __SCS_RESOURCE__: string;

interface UserState {
  userInfo: UserInfo | null;
  tenantList: TenantInfo[];
  deviceInfo: any;
  
  setUserInfo: (info: UserInfo) => void;
  getUserInfo: (userId: string) => Promise<UserInfo | null>;
  getTenantList: () => Promise<TenantInfo[]>;
  refreshUser: (tenantId?: string) => Promise<any>;
  logout: () => Promise<void>;
  clearAll: () => void;
}

export const useUserStore = create<UserState>((set, getStore) => ({
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  tenantList: [],
  deviceInfo: JSON.parse(localStorage.getItem('device_info') || '{}'),

  setUserInfo: (info: UserInfo) => {
    set({ userInfo: info });
    localStorage.setItem('userInfo', JSON.stringify(info));
  },

  getUserInfo: async (userId: string) => {
    if (!userId) return null;
    try {
      const response = await getUserInfoApi(userId);
      if (response.success && response.data) {
        set({ userInfo: response.data });
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  },

  getTenantList: async () => {
    try {
      const response = await getTenantListApi();
      if (response.success && response.data) {
        set({ tenantList: response.data });
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('获取组织信息失败:', error);
      return [];
    }
  },

  refreshUser: async (tenantId?: string) => {
    const authStore = useAuthStore.getState();
    const refresh_token = authStore.refresh_token || localStorage.getItem('market_refresh_token');
    
    if (!refresh_token) {
      getStore().clearAll();
      return Promise.reject(new Error('没有可用的 refresh_token'));
    }

    try {
      // 传递自定义 Header
      const options = tenantId ? { headers: { 'Tenant-Id': tenantId } } : {};
      
      const response = await refreshToken(
        {
          grant_type: 'refresh_token',
          scope: 'all',
          refresh_token,
          ...getStore().deviceInfo,
        },
        options
      );

      if (response.success && response.data?.access_token) {
        const newToken = `${response.data.token_type || 'Bearer'} ${response.data.access_token}`;
        
        // 更新 authStore 状态
        useAuthStore.setState({
          token: newToken,
          refresh_token: response.data.refresh_token,
          tenantId: tenantId || authStore.tenantId
        });
        
        // 更新 localStorage
        localStorage.setItem('market_token', newToken);
        localStorage.setItem('market_refresh_token', response.data.refresh_token);
        if (tenantId) {
          localStorage.setItem('market_tenantId', tenantId);
        }

        // 如果传了 tenantId，意味着切了组织，更新下用户信息
        if (tenantId && response.data.user_id) {
          await getStore().getUserInfo(response.data.user_id);
        }
        
        return response.data;
      } else {
        throw new Error(response.msg || 'Token 刷新失败');
      }
    } catch (error) {
      console.error('刷新 token 请求失败:', error);
      getStore().clearAll();
      return Promise.reject(error);
    }
  },

  logout: async () => {
    try {
      // 如果后端有登出接口可以调用
      await logoutApi();
    } catch (e) {
      console.warn('退出登录接口调用失败或未定义', e);
    }
    getStore().clearAll();
    // 退出后回到首页或其他无授权页面，依赖项目实际情况
    window.location.href = '/'; 
  },

  clearAll: () => {
    set({ userInfo: null, tenantList: [] });
    localStorage.removeItem('userInfo');
    
    // 清除 authStore
    useAuthStore.setState({ token: null, refresh_token: null, tenantId: null, authorization: null });
    localStorage.removeItem('market_token');
    localStorage.removeItem('market_refresh_token');
    localStorage.removeItem('market_tenantId');
    localStorage.removeItem('market_authorization');
  }
}));
