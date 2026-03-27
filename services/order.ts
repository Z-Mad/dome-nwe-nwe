// order.ts
import { get, post } from '@/utils/request'
import type { ApiResponse } from '@/types'
// ========== 类型定义 ==========

/**
 * 资源包商品项
 */
export interface ResourcePackGoodsItemDTO {
  buyQuantity: number // 购买数量
  deadline: number // 有效期 1-6个月 2-1年
  goodsCode: string // 商品编码
  goodsDesc?: string // 商品描述
  goodsId: number // 商品ID
  goodsName: string // 商品名称
  goodsType: number // 商品类型 1-token包 2-数据存储包
  price: number // 单价
  quantity: number // 资源数量
  totalAmount: number // 该商品项总金额
  unit: number // 资源单位 1-tokens 2-GB
}

/**
 * 资源包订单创建 DTO
 */
export interface CreateResourcePackOrderDTO {
  amount: number // 订单总金额
  buyType: number // 购买类型（1：新购订单 2：续费订单 3：试用订单）
  exampleId?: number // 实例ID
  goodsList: ResourcePackGoodsItemDTO[] // 资源包商品列表
  payAmount: number // 支付金额
  remark?: string // 订单备注
  tenantId?: string // 租户ID
  tenantName: string // 租户名称
  userId?: number // 用户ID
  userName?: string // 用户名称
}

/**
 * 应用商品项
 */
export interface AppGoodsItemDTO {
  applicationSkuCurrentVersion: string // 应用SKU当前版本
  applicationSkuId: number // 应用SKU ID
  applicationSkuName: string // 应用SKU名称
  commodityAmount: number // 商品总金额
  initialInstallationFee?: number // 初始安装费
  licenseType: number // 授权类型 1-按月 2-按季 3-按年 4-永久
  paymentStrategy: string // 付费策略
  remark?: string // 备注
  resourcePackageFee?: number // 资源包费用
  riskControlStrategy: string // 风控策略
  trial: number // 试用标识 0-非试用 1-试用
}

/**
 * 应用订单创建 DTO
 */
export interface CreateAppOrderDTO {
  amount: number // 订单总金额
  buyType: number // 购买类型（1：新购订单 2：续费订单 3：试用订单）
  exampleId?: number // 实例ID
  goodsList: AppGoodsItemDTO[] // 应用商品列表
  payAmount: number // 支付金额
  remark?: string // 订单备注
  tenantId?: string // 租户ID
  tenantName: string // 租户名称
  userId?: number // 用户ID
  userName?: string // 用户名称
}

/**
 * 线下支付订单 DTO
 */
export interface OfflinePayDTO {
  bankTransactionNumber: string // 银行流水号
  mark?: string // 备注
  orderId: number // 订单ID
  payAccount: string // 付款账户
  payAmount: number // 支付金额
  payBank: string // 付款银行
  payName: string // 付款人名称
  payTime: string // 付款时间
  receiveAccount: string // 收款账户
  receiveBank: string // 收款银行
  receiveName: string // 收款人名称
  voucherUrl: string // 支付凭证URL
}

/**
 * 订单查询条件 DTO
 */
export interface OrderQueryDTO {
  page: number
  pageSize: number
  searchMessage?: string // 搜索内容
  status?: number // 订单状态
}

/**
 * 订单商品详情 VO（应用市场）
 */
export interface CommodityDetailVO {
  applicationSkuCurrentVersion: string
  applicationSkuId: number
  applicationSkuName: string
  commodityAmount: number
  createTime: string
  endTime: string
  exampleId: number
  id: number
  initialInstallationFee: number
  licenseDays: number
  licenseType: number
  orderId: number
  orderNo: string
  paymentStrategy: string
  remark: string
  resourcePackageFee: number
  riskControlStrategy: string
  startTime: string
  tenantId: string
  trial: number
  updateTime: string
  userId: number
  [key: string]: any
}

/**
 * 订单商品详情 VO（资源包）
 */
export interface ExpansionPackDetailVO {
  buyQuantity: number
  createTime: string
  deadline: number
  endTime: string
  goodsCode: string
  goodsDesc: string
  goodsId: number
  goodsName: string
  goodsType: number
  id: number
  orderId: number
  orderNo: string
  price: number
  quantity: number
  startTime: string
  totalAmount: number
  unit: number
  updateTime: string
  [key: string]: any
}

/**
 * 订单日志 VO
 */
export interface OrderLogVO {
  createTime: string
  id: number
  logType: number
  logTypeDesc: string
  operateUserId: number
  operateUserName: string
  orderId: number
  orderNo: string
  [key: string]: any
}

/**
 * 订单详情 VO
 */
export interface OrderDetailVO {
  actualPayAmount: number
  amount: number
  billingStatus: number // 0：待开票 1：开票中 2：已开票
  buyType: number
  commodityList: CommodityDetailVO[]
  createTime: string
  exampleId: number
  expansionPackList: ExpansionPackDetailVO[]
  id: number
  logList: OrderLogVO[]
  orderNo: string
  orderType: number // 1-资源包订单 2-应用订单
  payAmount: number
  payType: number // 0:支付宝 1：微信 2：云闪付 3：线下支付
  status: number // 0-待支付 1-待创建实例 2-已取消 3-已完成
  tenantId: string
  tenantName: string
  updateTime: string
  userId: number
  userName: string
  [key: string]: any
}

/**
 * 订单基础数据 VO（列表项）
 */
export interface OrderBaseVO {
  actualPayAmount: number
  amount: number
  billingStatus: number
  buyType: number
  commodityList: CommodityDetailVO[]
  createTime: string
  exampleId: number
  expansionPackList: ExpansionPackDetailVO[]
  id: number
  orderNo: string
  orderType: number
  payAmount: number
  payType: number
  status: number
  [key: string]: any
}



export interface Page<T> {
  current: number
  pages: number
  records: T[]
  size: number
  total: number
  [key: string]: any
}

// ========== API 函数 ==========

/**
 * 创建资源包订单
 */
export const createResourcePackOrder = (dto: CreateResourcePackOrderDTO) => {
  return post<ApiResponse<string>>(
    `${__SCS_MARKET_CENTER__}/order/createResourcePackOrder`,
    dto
  )
}

/**
 * 取消订单
 * @param orderId 订单ID
 */
export const cancelOrder = (orderId: number) => {
  return post<ApiResponse<boolean>>(
    `${__SCS_MARKET_CENTER__}/order/cancel/${orderId}`
  )
}

/**
 * 创建应用订单
 */
export const createAppOrder = (dto: CreateAppOrderDTO) => {
  return post<ApiResponse<string>>(
    `${__SCS_MARKET_CENTER__}/order/createAppOrder`,
    dto
  )
}

/**
 * 删除订单
 * @param orderId 订单ID
 */
export const deleteOrder = (orderId: number) => {
  return post<ApiResponse<boolean>>(
    `${__SCS_MARKET_CENTER__}/order/deleted/${orderId}`
  )
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 */
export const getOrderDetail = (orderId: number) => {
  return get<ApiResponse<OrderDetailVO>>(
    `${__SCS_MARKET_CENTER__}/order/detail/${orderId}`
  )
}

/**
 * 根据订单编号获取订单详情
 * @param orderNo 订单编号
 */
export const getOrderDetailByNo = (orderNo: string) => {
  return get<ApiResponse<OrderDetailVO>>(
    `${__SCS_MARKET_CENTER__}/order/getOrderDetailByNo`,
    { orderNo }
  )
}

/**
 * 获取用户订单列表
 * @param dto 查询条件
 */
export const getUserOrderList = (dto: OrderQueryDTO) => {
  return post<ApiResponse<Page<OrderBaseVO>>>(
    `${__SCS_MARKET_CENTER__}/order/getUserOrderList`,
    dto
  )
}

/**
 * 线下支付订单
 * @param dto 线下支付信息
 */
export const offlinePay = (dto: OfflinePayDTO) => {
  return post<ApiResponse<boolean>>(
    `${__SCS_MARKET_CENTER__}/order/offlinePay`,
    dto
  )
}