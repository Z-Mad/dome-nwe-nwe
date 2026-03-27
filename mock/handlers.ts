import { discoverHandlers } from './discover'

/**
 * MSW handlers 集合
 * 汇总所有服务的 mock 处理器
 */
export const handlers = [...discoverHandlers]
