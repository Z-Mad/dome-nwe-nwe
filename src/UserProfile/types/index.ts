import { type Account } from '@/types'
import { type OrderStatusFilter } from '../Order/orderUtils'

// 订单相关类型
export interface Order {
  id: string
  productName: string
  paymentStatus?: string
  orderType?: 'New' | 'Trial' | 'Renewal' | 'ResourcePack'
  version?: string
  provider?: string
  instanceName?: string
  expireDate?: string
  autoRenew?: boolean
  // 其他可能的字段
  [key: string]: any
}

// 资源相关类型
export interface Resource {
  id: string
  orderId: string
  orderType: string
  productName: string
  name?: string // 别名
  version: string
  provider: string
  instanceName: string
  status: string
  expireDate: string
  autoRenew: boolean
  quota: {
    tokens: number
    storage: number
    tokenLimit?: number
    storageLimit?: number
  }
  usage: {
    tokens: number
    storage: number
    token?: number // 兼容旧字段
    tokenLimit?: number
    storageLimit?: number
  }
}

// 账单相关类型
export interface BillDetailItem {
  instanceName: string
  productName: string
  type: string
  amount: number
  usageItems: Array<{
    name: string
    usage: string
    amount: number
  }>
}

export interface Bill {
  id: string
  period: string
  date: string
  amount: number
  count: number
  status: string
  invoiceStatus: string
  details: BillDetailItem[]
}

// 发票相关类型
export interface Invoice {
  id: string
  relatedId: string
  amount: number
  type: string
  status: string
  date: string
  title: string
}

// 发票抬头类型
export interface InvoiceHeader {
  id: string
  type: string
  title: string
  taxId: string
  address: string
  phone: string
  bank: string
  account: string
  isDefault: boolean
}

// 卖家监控数据类型
export interface MonitoringData {
  id: string
  buyer: string
  asset: string
  version: string
  instanceName: string
  instanceId: string
  orderId: string
  plan: string
  period: string
  usage: {
    tokens: string
    storage: string
  }
  unitPrice: string
  feeBreakdown: {
    tokens: number
    storage: number
  }
  estimatedCost: number
  status: string
  unbilledPeriod?: string
  billedPeriods: string[]
}

// 卖家资产类型
export interface AssetVersion {
  ver: string
  date: string
  health: number
  installs: number
  status: string
  log: string
}

export interface SellerAsset {
  id: string
  title: string
  status: string
  category: string
  desc: string
  versions: AssetVersion[]
}

// 退款类型
export interface Refund {
  id: string
  orderId: string
  amount: number
  buyer: string
  reason: string
  date: string
  status: string
}

// UI 状态类型
export interface UserProfileUIState {
  orderSearch: string
  orderStatusFilter: OrderStatusFilter
}

// 核心状态类型
export interface UserProfileState {
  currentAccount: Account | null
  displayAccount: (Account & { displayName: string; orgInfo: string }) | null
  consoleMode: 'buyer' | 'seller'
  globalOrders: Order[]
  globalResources: Resource[]
  extraAssets: any[]
  localOrders: Order[]
  localResources: Resource[]
  toastMsg: string | null
  activeModal: string | null
  setSearchParamsFn: ((fn: any) => void) | null
}

// 买家状态类型
export interface BuyerState {
  bills: Bill[]
  invoices: Invoice[]
  invoiceHeaders: InvoiceHeader[]
}

// 回调函数类型
export interface UserProfileCallbacks {
  onNavigate: (view: string, params?: any) => void
  onUpgrade?: (orderId: string, planDetails: any) => void
  onUpdateOrder?: (orderId: string, updates: any) => void
  onUpdateResource?: (resourceId: string, updates: Partial<Resource>) => void
  onAddResource?: (resource: Omit<Resource, 'id'> & { id?: string }) => void
}

// 卖家状态类型
export interface SellerState {
  monitoringData: MonitoringData[]
  sellerAssets: SellerAsset[]
  sellerRefunds: Refund[]
}

// 重新导出 OrderStatusFilter
export type { OrderStatusFilter }
