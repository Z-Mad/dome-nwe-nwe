// components/CheckoutModal.tsx
import React, { useState, useEffect } from 'react'
import { useConfirm } from '@/components/contexts/ConfirmContext' // 全局确认弹窗
import { createResourcePackOrder, type CreateResourcePackOrderDTO, type ResourcePackGoodsItemDTO } from '@/services/order'
import type { InstanceVO } from '@/services/instance'
import type { CartItem } from '../types/resourcePack'
import { CreditCard,X,CheckCircle,ChevronDown,Building2,Loader2 } from 'lucide-react'
interface CheckoutModalProps {
  isOpen: boolean
  cartItems: CartItem[]
  cartTotal: number
  instances: InstanceVO[]          // 实例列表（从接口获取）
  instancesLoading: boolean        // 加载状态
  InstanceId?: string
  selectedVersion: string
  setSelectedVersion: (version: string) => void
  paymentMethod: 'alipay' | 'wechat' | 'offline'
  setPaymentMethod: (method: 'alipay' | 'wechat' | 'offline') => void
  agreementChecked: boolean
  setAgreementChecked: (checked: boolean) => void
  isProcessing: boolean
  onClose: () => void
  onConfirm: (instanceId: string, version: string, method: string) => void  // 改为由父组件处理
  onShowAgreement: () => void
  onShowPaymentApplication: () => void
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  cartTotal,
  instances,
  instancesLoading,
  InstanceId,
  selectedVersion,
  setSelectedVersion,
  paymentMethod,
  setPaymentMethod,
  agreementChecked,
  setAgreementChecked,
  isProcessing,
  onClose,
  onConfirm,
  onShowAgreement,
  onShowPaymentApplication,
  showToast,
}) => {
  const { confirm } = useConfirm()
  const [creatingOrder, setCreatingOrder] = useState(false)
const [selectedInstanceId, setSelectedInstanceId] = useState(InstanceId || '')
  // 当实例列表变化时，自动选中第一个
  useEffect(() => {
    if (instances.length > 0 && !selectedInstanceId) {
      setSelectedInstanceId(String(instances[0].id))
      setSelectedVersion(instances[0].version || 'v1.0.0')
    }
  }, [instances, selectedInstanceId, setSelectedInstanceId, setSelectedVersion])

  // 根据选中的实例获取可用的版本列表（这里简单使用实例自带版本，实际可能需要额外接口）
  const getVersionsForInstance = (instanceId: string) => {
    const instance = instances.find(i => String(i.id) === instanceId)
    return instance ? [instance.version || 'v1.0.0'] : []
  }

  const currentVersions = selectedInstanceId ? getVersionsForInstance(selectedInstanceId) : []

  // 支付处理
  const handlePay = async () => {
    if (!selectedInstanceId) {
      showToast?.('请选择挂载实例', 'warning')
      return
    }
    if (!selectedVersion) {
      showToast?.('请选择适配版本', 'warning')
      return
    }
    if (!agreementChecked) {
      showToast?.('请阅读并同意服务协议', 'warning')
      return
    }

    // 二次确认
    const ok = await confirm({
      title: '确认支付',
      message: `确认支付 ¥${cartTotal.toLocaleString()} 元？`,
      confirmText: '确认支付',
      cancelText: '取消',
      type: 'info',
    })

    if (!ok) return

    // 构建订单 DTO
    const goodsList: ResourcePackGoodsItemDTO[] = cartItems.map(item => ({
      buyQuantity: item.quantity,
      deadline: item.validity === '1年' ? 12 : 6, // 根据有效期映射：1年->12，6个月->6
      goodsCode: item.id, // 实际应使用商品编码，这里暂时用id
      goodsDesc: item.name,
      goodsId: Number(item.id),
      goodsName: item.name,
      goodsType: item.type === 'token' ? 1 : 2,
      price: item.price,
      quantity: item.amount,
      totalAmount: item.subtotal,
      unit: item.type === 'token' ? 1 : 2,
    }))

    const orderDto: CreateResourcePackOrderDTO = {
      amount: cartTotal,
      buyType: 1, // 新购订单
      exampleId: Number(selectedInstanceId),
      goodsList,
      payAmount: cartTotal,
      tenantName: '', // 从用户信息获取
      remark: `资源包购买 - 支付方式: ${paymentMethod}`,
    }

    setCreatingOrder(true)
    try {
      const res = await createResourcePackOrder(orderDto)
      if (res.success) {
        showToast?.('订单创建成功，请完成支付', 'success')
        // 调用父组件的确认回调
        onConfirm(selectedInstanceId, selectedVersion, paymentMethod)
      } else {
        showToast?.(res.msg || '订单创建失败', 'error')
      }
    } catch (err: any) {
      showToast?.(err.message || '订单创建失败', 'error')
    } finally {
      setCreatingOrder(false)
    }
  }

  if (!isOpen) return null

  const isConfirmDisabled = !selectedInstanceId || !selectedVersion || !agreementChecked || isProcessing || creatingOrder

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" /> 订单确认
          </h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Items Summary */}
          <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 max-h-40 overflow-y-auto custom-scrollbar">
            <div className="text-xs font-bold text-blue-800 mb-2 uppercase">
              包含商品 ({cartItems.length})
            </div>
            <div className="space-y-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-700">
                  <span>
                    {item.name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-mono">¥{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-blue-200 mt-3 pt-2 flex justify-between font-bold text-blue-900">
              <span>合计</span>
              <span>¥{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* 1. Instance Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              1. 挂载实例 (TARGET INSTANCE) <span className="text-red-500">*</span>
            </label>
            {instancesLoading ? (
              <div className="text-center py-4 text-gray-500">加载实例列表中...</div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl p-1">
                {instances.length > 0 ? (
                  instances.map((instance) => (
                    <div
                      key={instance.id}
                      onClick={() => {
                        setSelectedInstanceId?.(String(instance.id))
                        setSelectedVersion(instance.version || 'v1.0.0')
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        selectedInstanceId === String(instance.id)
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-800">{instance.name}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {instance.productName} · {instance.status}
                        </div>
                      </div>
                      {selectedInstanceId === String(instance.id) && (
                        <CheckCircle size={18} className="text-blue-600" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                    暂无可用实例，请先购买或激活实例
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Version Selection */}
          {selectedInstanceId && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                2. 适配版本 (TARGET VERSION) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 font-bold outline-none appearance-none cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  {currentVersions.map((ver) => (
                    <option key={ver} value={ver}>
                      {ver}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none"
                />
              </div>
            </div>
          )}

          {/* 3. Payment Method */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              3. 支付方式 (PAYMENT) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod('alipay')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  paymentMethod === 'alipay'
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  支
                </div>
                <span className="text-sm font-bold">支付宝</span>
              </button>
              <button
                onClick={() => setPaymentMethod('wechat')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  paymentMethod === 'wechat'
                    ? 'border-green-500 bg-green-50 ring-1 ring-green-500 text-green-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  微
                </div>
                <span className="text-sm font-bold">微信支付</span>
              </button>
              <button
                onClick={() => setPaymentMethod('offline')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  paymentMethod === 'offline'
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500 text-orange-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <Building2 size={18} className={paymentMethod === 'offline' ? 'text-orange-500' : 'text-gray-400'} />
                <span className="text-sm font-bold">线下支付</span>
              </button>
            </div>
            {paymentMethod === 'offline' && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 mt-3">
                <p className="font-bold mb-1">对公转账说明：</p>
                <p>
                  请在提交订单后，下载
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={onShowPaymentApplication}
                  >
                    《支付申请单》
                  </span>
                  并交由财务进行对公转账。款项到账后系统将自动开通服务。
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2 mb-4 px-2">
            <input
              type="checkbox"
              id="modal-agreement"
              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
            />
            <label
              htmlFor="modal-agreement"
              className="text-xs text-gray-500 cursor-pointer select-none"
            >
              点击去结算即代表同意
              <span
                className="text-blue-600 hover:underline mx-1 font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  onShowAgreement()
                }}
              >
                《资源包服务协议》
              </span>
              ，购买后立即生效，不支持退款。
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handlePay}
              disabled={isConfirmDisabled}
              className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isConfirmDisabled
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-gray-900 hover:bg-black shadow-gray-300'
              }`}
            >
              {isProcessing || creatingOrder ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> 处理中...
                </>
              ) : paymentMethod === 'offline' ? (
                '提交订单并下载《支付申请单》'
              ) : (
                `支付 ¥${cartTotal.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}