import { useAuthStore } from '../store/authStore';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

/**
 * 封装 Fetch API，自动注入 Token 和 TenantId
 */
export const request = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { params, ...customOptions } = options;
  const { token, tenantid, authorization } = useAuthStore.getState();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customOptions.headers,
  };

  if (token) {
    headers['token'] = token;
  }
  if (tenantid) {
    headers['tenantid'] = tenantid;
  }
  if (authorization) {
    headers['Authorization'] = authorization;
  }

  let finalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    finalUrl += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(finalUrl, {
      ...customOptions,
      headers,
    });

    if (response.status === 401) {
      // 处理 Token 过期，可以跳转到登录或刷新 Token
      console.error('Unauthorized: Token expired or invalid');
      // 这里的逻辑可以根据实际情况进行补充
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

export const get = <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'GET', params });
};

export const post = <T>(url: string, body?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) });
};

export const put = <T>(url: string, body?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) });
};

export const del = <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'DELETE', params });
};
