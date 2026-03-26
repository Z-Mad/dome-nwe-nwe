import { PaymentStatusBadge, StatusBadge } from '@/src/UserProfile/Shared/components/atoms/badges'
import {
  ArrowUpRight,
  Box,
  FileText,
  Headphones,
  History,
  PlayCircle,
  PlusCircle,
  Receipt,
  RefreshCcw,
  Repeat,
  Scale,
  X,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from '../../Core/useUserProfileStore'

export const OrderDetailModal = () => {
  const { localOrders, closeModal, onNavigate, openModal } = useUserProfile()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const selectedItem = localOrders.find((o) => o.id === orderId)

  if (!selectedItem) return null

  const isSubscription = selectedItem.type === 'Subscription'
  const isResourcePack = selectedItem.type === 'ResourcePack'
  const isTrialSuspended = selectedItem.status === 'TRIAL_SUSPENDED'
  const isExpired = selectedItem.status === 'Expired'
  const isActive = selectedItem.status === 'Active'
  const isPaymentFailed = selectedItem.status === 'PaymentFailed'

  // Mock installation fee logic (sync with publish wizard config)
  const orderType = selectedItem.orderType || 'NewPurchase'
  const isTrialOrder = orderType === 'Trial' || selectedItem.status === 'Trial'
  const isUsageOrder = selectedItem.snapshot?.period === 'Usage'
  const isResourcePackOrder = orderType === 'ResourcePack'

  let installationFee = 0
  if (isTrialOrder || isUsageOrder) {
    installationFee = selectedItem.amount
  } else if (!isResourcePackOrder) {
    installationFee = 2000 // Mock amount for standard subscriptions
  }

  const baseAmount = Math.max(0, selectedItem.amount - installationFee)

  // const formatQuota = (quota: any) => {
  //   if (!quota) return null
  //   if (typeof quota === 'string') return quota
  //   if (typeof quota === 'object') {
  //     const parts = []
  //     if (quota.tokens) parts.push(`${(quota.tokens / 1000).toFixed(0)}k Tokens`)
  //     if (quota.storage) parts.push(`${quota.storage}G 存储`)
  //     if (quota.users) parts.push(`${quota.users} 用户`)
  //     return parts.join(' / ') || null
  //   }
  //   return null
  // }

  const getTimelineSteps = () => {
    const steps = [
      { label: '订单创建', time: selectedItem.createTime, active: true, color: 'bg-blue-500' },
    ]

    if (selectedItem.paymentStatus === 'Cancelled') {
      steps.push({ label: '订单取消', time: '-', active: true, color: 'bg-gray-500' })
    } else if (selectedItem.paymentStatus === 'PendingPayment') {
      steps.push({ label: '等待支付', time: '-', active: true, color: 'bg-orange-500' })
    } else if (selectedItem.paymentStatus === 'UnderReview') {
      steps.push({
        label: '提交回执',
        time: selectedItem.payTime || '-',
        active: true,
        color: 'bg-blue-500',
      })
      steps.push({ label: '审核中', time: '-', active: true, color: 'bg-orange-500' })
    } else if (selectedItem.paymentStatus === 'Rejected') {
      steps.push({
        label: '提交回执',
        time: selectedItem.payTime || '-',
        active: true,
        color: 'bg-blue-500',
      })
      steps.push({ label: '已驳回', time: '-', active: true, color: 'bg-red-500' })
    } else if (selectedItem.paymentStatus === 'PaymentFailed') {
      steps.push({
        label: '支付失败',
        time: selectedItem.payTime || '-',
        active: true,
        color: 'bg-red-500',
      })
    } else {
      // Paid
      steps.push({
        label: '支付成功',
        time: selectedItem.payTime || '-',
        active: true,
        color: 'bg-blue-500',
      })
      steps.push({
        label: '订单完成',
        time:
          selectedItem.status === 'Active' || selectedItem.status === 'Running'
            ? selectedItem.payTime || selectedItem.createTime
            : '-',
        active: selectedItem.status === 'Active' || selectedItem.status === 'Running',
        color:
          selectedItem.status === 'Active' || selectedItem.status === 'Running'
            ? 'bg-green-500'
            : 'bg-gray-200',
      })
    }

    return steps
  }

  const timelineSteps = getTimelineSteps()

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" /> 订单管理 (Order Management)
          </h3>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Order Status Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedItem.paymentStatus === 'Paid'
                      ? '订单已支付'
                      : selectedItem.paymentStatus === 'PendingPayment'
                        ? '等待支付'
                        : selectedItem.paymentStatus === 'UnderReview'
                          ? '审核中'
                          : selectedItem.paymentStatus === 'Rejected'
                            ? '已驳回'
                            : selectedItem.paymentStatus === 'PaymentFailed'
                              ? '支付失败'
                              : '已取消'}
                  </h2>
                  <StatusBadge status={selectedItem.status} expireDate={selectedItem.expireDate} />
                </div>
                <div className="text-sm text-gray-500 font-mono">订单号: {selectedItem.id}</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-3xl font-bold text-gray-900 font-mono mb-2">
                  ¥ {selectedItem.amount.toLocaleString()}
                </div>
                <PaymentStatusBadge status={selectedItem.paymentStatus} />
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Box size={18} className="text-blue-600" /> 产品信息
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                  <Box size={24} />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{selectedItem.productName}</div>
                  <div className="text-sm text-gray-500">
                    供应商: {selectedItem.provider} | 版本: {selectedItem.version}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 mb-1">订单类型</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {selectedItem.orderType === 'Trial'
                      ? '试用订单'
                      : selectedItem.orderType === 'Renewal'
                        ? '续费订单'
                        : selectedItem.orderType === 'ResourcePack'
                          ? '扩展资源包订单'
                          : '新购订单'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">计费模式</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {isSubscription
                      ? selectedItem.snapshot?.period === 'Yearly'
                        ? '包年'
                        : selectedItem.snapshot?.period === 'Monthly'
                          ? '包月'
                          : '按量付费'
                      : '一次性付费'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">创建时间</div>
                  <div className="font-bold text-gray-900 text-sm font-mono">
                    {selectedItem.createTime}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">服务周期</div>
                  <div className="font-bold text-gray-900 text-sm font-mono">
                    {selectedItem.expireDate
                      ? `${selectedItem.createTime.split(' ')[0]} 至 ${selectedItem.expireDate.split(' ')[0]}`
                      : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Details & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Scale size={18} className="text-orange-500" /> 费用明细
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">初装费</span>
                    <span className="font-medium text-gray-900 font-mono">
                      ¥ {installationFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {isResourcePackOrder
                        ? '资源包费用'
                        : isUsageOrder
                          ? '按量计费 (预估)'
                          : isTrialOrder
                            ? '试用期费用'
                            : '周期订阅费'}
                    </span>
                    <span className="font-medium text-gray-900 font-mono">
                      {isUsageOrder ? '¥ 0 (后付费)' : `¥ ${baseAmount.toLocaleString()}`}
                    </span>
                  </div>
                  {selectedItem.snapshot?.quota && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                      <div className="text-xs text-gray-500 mb-2">包含明细：</div>
                      <div className="space-y-1.5">
                        {selectedItem.snapshot.quota.tokens && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Token 额度</span>
                            <span className="font-medium text-gray-900">
                              {(selectedItem.snapshot.quota.tokens / 10000).toFixed(0)}万 Tokens
                            </span>
                          </div>
                        )}
                        {selectedItem.snapshot.quota.storage && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">存储空间</span>
                            <span className="font-medium text-gray-900">
                              {selectedItem.snapshot.quota.storage} GB
                            </span>
                          </div>
                        )}
                        {selectedItem.snapshot.quota.users && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">用户数</span>
                            <span className="font-medium text-gray-900">
                              {selectedItem.snapshot.quota.users} 个
                            </span>
                          </div>
                        )}
                        {selectedItem.snapshot.plan && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">套餐类型</span>
                            <span className="font-medium text-gray-900">
                              {selectedItem.snapshot.plan}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-gray-900">总计</span>
                    <span className="font-bold text-gray-900 font-mono text-lg">
                      ¥ {selectedItem.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Receipt size={18} className="text-indigo-500" /> 支付信息
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">支付方式</span>
                    <span className="font-medium text-gray-900">
                      {selectedItem.paymentMethod === 'Alipay'
                        ? '支付宝'
                        : selectedItem.paymentMethod === 'WeChat'
                          ? '微信支付'
                          : selectedItem.paymentMethod === 'CorporateRemittance'
                            ? '线下对公转账'
                            : selectedItem.paymentMethod || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">支付时间</span>
                    <span className="font-medium text-gray-900 font-mono">
                      {selectedItem.payTime || '-'}
                    </span>
                  </div>
                  {selectedItem.paymentMethod === 'CorporateRemittance' && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">付款回执单</span>
                        <span
                          className="font-bold text-indigo-600 cursor-pointer hover:underline flex items-center gap-1"
                          onClick={() => {
                            openModal('preview_image', {
                              imageUrl: 'https://picsum.photos/seed/receipt/800/600',
                            })
                          }}
                        >
                          <FileText size={14} /> 查看凭证
                        </span>
                      </div>
                      {selectedItem.status === 'Active' && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">收款凭证单</span>
                          <span
                            className="font-bold text-indigo-600 cursor-pointer hover:underline flex items-center gap-1"
                            onClick={() => {
                              openModal('preview_image', {
                                imageUrl: 'https://picsum.photos/seed/invoice/800/600',
                              })
                            }}
                          >
                            <FileText size={14} /> 查看凭证
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.rejectReason && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                      <span className="font-bold">驳回原因:</span> {selectedItem.rejectReason}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <History size={18} className="text-green-500" /> 订单快照
              </h3>
              <div className="flex items-center justify-between relative px-4 sm:px-12">
                <div className="absolute left-4 sm:left-12 right-4 sm:right-12 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100"></div>

                {timelineSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative z-10 flex flex-col items-center bg-white px-2"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mb-2 ${step.active ? step.color : 'bg-gray-200'}`}
                    ></div>
                    <div
                      className={`text-xs font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1">{step.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center flex-wrap gap-4">
          <button
            onClick={() => {
              closeModal()
              onNavigate('messages', { conversationId: 'manager_james' })
            }}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Headphones size={16} /> 联系专属顾问
          </button>

          <div className="flex gap-3 flex-wrap justify-end">
            {selectedItem.paymentStatus === 'Paid' &&
              (selectedItem.orderType === 'Trial' || selectedItem.orderType === 'New') && (
                <button
                  onClick={() => {
                    closeModal()
                    onNavigate('detail', {
                      id: selectedItem.resourceId,
                      upgrade_instance_id: selectedItem.id,
                      action: 'purchase',
                    })
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2"
                >
                  <ArrowUpRight size={16} /> 续费
                </button>
              )}

            {isTrialSuspended && (
              <button
                onClick={() => {
                  closeModal()
                  onNavigate('detail', {
                    id: selectedItem.resourceId,
                    upgrade_instance_id: selectedItem.id,
                    action: 'purchase',
                  })
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <PlayCircle size={16} /> 订阅以解锁
              </button>
            )}

            {isActive && isSubscription && (
              <>
                <button
                  onClick={() => {
                    closeModal()
                    onNavigate('resource_packs', {
                      target_instance_id: selectedItem.id,
                    })
                  }}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                >
                  <PlusCircle size={16} /> 补充资源包
                </button>
                <button
                  onClick={() => {
                    closeModal()
                    openModal('refund_request', { orderId: selectedItem.id })
                  }}
                  className="px-6 py-2.5 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
                >
                  <RefreshCcw size={16} /> 申请售后/退款
                </button>
                <button
                  onClick={() => {
                    closeModal()
                    onNavigate('detail', {
                      id: selectedItem.resourceId,
                      action: 'purchase',
                    })
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2"
                >
                  <Repeat size={16} /> 再次购买
                </button>
              </>
            )}

            {isActive && isResourcePack && (
              <>
                <button
                  onClick={() => {
                    closeModal()
                    openModal('refund_request', { orderId: selectedItem.id })
                  }}
                  className="px-6 py-2.5 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
                >
                  <RefreshCcw size={16} /> 申请售后/退款
                </button>
                <button
                  onClick={() => {
                    closeModal()
                    onNavigate('detail', {
                      id: selectedItem.resourceId,
                      action: 'purchase',
                    })
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2"
                >
                  <Repeat size={16} /> 再次购买
                </button>
              </>
            )}

            {isPaymentFailed && (
              <button
                onClick={() => {
                  closeModal()
                  onNavigate('detail', {
                    id: selectedItem.resourceId,
                    action: 'purchase',
                  })
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2"
              >
                <Repeat size={16} /> 重新支付
              </button>
            )}

            {isExpired && (
              <button
                onClick={() => {
                  closeModal()
                  onNavigate('detail', {
                    id: selectedItem.resourceId,
                    action: 'purchase',
                  })
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2"
              >
                <Repeat size={16} /> 再次购买
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
