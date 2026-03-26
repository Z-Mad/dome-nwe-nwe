export interface ProfileOrderItem {
  id: string
  productName: string
  paymentStatus?: string
}

export const ORDER_STATUS_OPTIONS = [
  'all',
  'PendingPayment',
  'UnderReview',
  'Rejected',
  'Paid',
  'PaymentFailed',
  'Cancelled',
] as const

export type OrderStatusFilter = (typeof ORDER_STATUS_OPTIONS)[number]

export const getOrderStatusLabel = (status: OrderStatusFilter): string => {
  switch (status) {
    case 'all':
      return '全部订单'
    case 'PendingPayment':
      return '待支付'
    case 'UnderReview':
      return '审核中'
    case 'Rejected':
      return '已驳回'
    case 'Paid':
      return '已支付'
    case 'PaymentFailed':
      return '支付失败'
    case 'Cancelled':
      return '已取消'
    default:
      return status
  }
}

export const getPaymentMethodLabel = (paymentMethod?: string): string => {
  switch (paymentMethod) {
    case 'Alipay':
      return '支付宝'
    case 'WeChat':
      return '微信支付'
    case 'CorporateRemittance':
      return '对公转账'
    case 'Free':
      return '体验试用'
    default:
      return paymentMethod || '-'
  }
}

export const matchesOrderStatus = (order: ProfileOrderItem, statusFilter: string): boolean => {
  return statusFilter === 'all' || order.paymentStatus === statusFilter
}

export const matchesOrderKeyword = (order: ProfileOrderItem, keyword: string): boolean => {
  const target = keyword.trim().toLowerCase()
  if (!target) {
    return true
  }
  return order.productName.toLowerCase().includes(target) || order.id.toLowerCase().includes(target)
}

export const filterOrders = <T extends ProfileOrderItem>(
  orders: T[],
  statusFilter: string,
  keyword: string,
): T[] => {
  return orders
    .filter((order) => matchesOrderStatus(order, statusFilter))
    .filter((order) => matchesOrderKeyword(order, keyword))
}
