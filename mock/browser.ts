import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * 创建并配置 MSW worker
 * 用于在浏览器环境中拦截和模拟网络请求
 */
export const worker = setupWorker(...handlers)

/**
 * 启动 MSW worker
 * 在开发环境中启用 mock 服务
 */
export const startWorker = async () => {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass'
    })
    console.log('MSW worker 已启动')
  }
}
