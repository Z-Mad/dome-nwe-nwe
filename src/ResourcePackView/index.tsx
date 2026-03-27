// ResourcePackView.tsx
import React, { useState, useEffect } from 'react'
import { useResourcePackData } from './hooks/useResourcePackState'
import { useCart } from './hooks/useCart'
import { useCheckoutModal } from './hooks/useCheckoutModal'
import { usePaymentApplication } from './hooks/usePaymentApplication'
import { ResourcePackHeader } from './components/ResourcePackHeader'
import { ProductTypeSelector } from './components/ProductTypeSelector'
import { QuotaGrid } from './components/QuotaGrid'
import { DurationQuantitySelector } from './components/DurationQuantitySelector'
import { RulesTabs } from './components/RulesTabs'
import { CartSidebar } from './components/CartSidebar'
import { CheckoutModal } from './components/CheckoutModal'
import { AgreementModal } from './components/AgreementModal'
import { PaymentApplicationModal } from './components/PaymentApplicationModal'
import {  DURATIONS, RULES_CONTENT } from './constants/resourcePack.tsx'
import { safeMultiply } from '@/utils/index.ts'
import { getInstanceList, type InstanceVO } from '@/services/instance'
import { useToast } from '@/components/contexts/ToastContext' // 全局提示


interface ResourcePackViewProps {
  orders: any[]
  onPurchase: (items: any[], targetOrderId: string, version: string, paymentMethod: string) => void
}

const ResourcePackView: React.FC<ResourcePackViewProps> = ({ orders, onPurchase }) => {
  const { showToast } = useToast();
   const { getConfigForType, fetchGoods, loading: goodsLoading, error: goodsError } = useResourcePackData()
   // 将 selectedType 映射为商品类型 ID
   const [selectedType, setSelectedType] = useState<'token' | 'storage'>('token')
   const goodsType = selectedType === 'token' ? 1 : 2
  const [selectedQuotaIdx, setSelectedQuotaIdx] = useState(0)
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [activeRuleTab, setActiveRuleTab] = useState('deduction')
  const { cartItems, addToCart, removeFromCart, clearCart, cartTotal } = useCart()
  const {
    isPurchaseModalOpen,
    targetOrderId,
    setTargetOrderId,
    selectedVersion,
    setSelectedVersion,
    paymentMethod,
    setPaymentMethod,
    agreementChecked,
    setAgreementChecked,
    isProcessing,
    setProcessing,
    openModal,
    closeModal,
    activeOrders,
    currentVersions,
    getVersionsForOrder,
  } = useCheckoutModal(orders)
  const [instances, setInstances] = useState<InstanceVO[]>([])
const [instancesLoading, setInstancesLoading] = useState(false)

  const { showPaymentApplicationModal, setShowPaymentApplicationModal } = usePaymentApplication()
  const [showAgreementDetail, setShowAgreementDetail] = React.useState(false)

    // 获取当前类型的配置（包含动态 quotas）
  const currentConfig = getConfigForType(goodsType)
  const currentQuota = currentConfig.quotas[selectedQuotaIdx] || currentConfig.quotas[0]


  const currentDuration = DURATIONS[selectedDurationIdx]
  const currentSelectionPrice = safeMultiply(Number(currentQuota.price), currentDuration.multiplier)
  const currentSelectionSubtotal = safeMultiply(currentSelectionPrice, purchaseQuantity)
  // 打开弹窗前获取实例列表
  const handleCheckoutClick = async () => {
    if (cartItems.length === 0) return

    // 获取实例列表
    setInstancesLoading(true)
    try {
      const res = await getInstanceList()
      if (res.success) {
        setInstances(res.data || [])
      } else {
        showToast(res.msg || '获取实例列表失败','error')
        return
      }
    } catch (err) {
      showToast('获取实例列表失败','error')
      return
    } finally {
      setInstancesLoading(false)
    } 
    // 重置弹窗状态
    setTargetOrderId('')
    setSelectedVersion('')
    setPaymentMethod('alipay')
    setAgreementChecked(true)

    // 自动选择第一个实例（如果有）
    if (instances.length > 0) {
      setTargetOrderId(String(instances[0].id))
      // 版本列表需要根据实例的产品ID获取，这里假设实例自带版本，或需要另一个接口
      setSelectedVersion(instances[0].version || 'v1.0.0')
    }

    // setIsPurchaseModalOpen(true)
    openModal()
  }
  const handleAddToCart = () => {
    addToCart({
      id: `item_${Date.now()}`,
      type: selectedType,
      name: `${currentQuota.label} (${currentDuration.label})`,
      amount: currentQuota.value,
      unit: currentConfig.unit,
      price: currentSelectionPrice,
      validity: currentDuration.label,
      quantity: purchaseQuantity,
      subtotal: currentSelectionSubtotal,
    })
    setPurchaseQuantity(1)
  }

  const handleConfirmPurchase = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      onPurchase(cartItems, targetOrderId, selectedVersion, paymentMethod)
      closeModal()
      clearCart()
      if (paymentMethod === 'offline') {
        setShowPaymentApplicationModal(true)
      }
    }, 1500)
  }

  const handleAgreeAndClose = () => {
    setShowAgreementDetail(false)
    setAgreementChecked(true)
  }

  const handleDownloadPDF = () => {
    alert('正在生成PDF并下载...')
    setShowPaymentApplicationModal(false)
  }



  // 当 selectedType 变化时，获取商品列表
  useEffect(() => {
    fetchGoods(goodsType)
  }, [goodsType, fetchGoods])

  // 当商品数据加载完成且当前选中的配额索引无效时，重置为 0
  useEffect(() => {
    if (currentConfig.quotas.length > 0 && selectedQuotaIdx >= currentConfig.quotas.length) {
      setSelectedQuotaIdx(0)
    }
  }, [currentConfig.quotas, selectedQuotaIdx])

  // 如果正在加载且当前没有配额数据，显示加载中（保持样式一致性）
  if (goodsLoading[goodsType] && currentConfig.quotas.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="text-gray-500">加载商品列表中...</div>
        </div>
      </div>
    )
  }

  // 如果加载失败，显示错误信息
  if (goodsError[goodsType]) {
    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="text-red-500">加载失败：{goodsError[goodsType]}</div>
          <button
            onClick={() => fetchGoods(goodsType)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
      <div className="max-w-7xl mx-auto">
        <ResourcePackHeader />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: Configuration Panel */}
          <div className="flex-1 space-y-6 w-full">
            <ProductTypeSelector
              selectedType={selectedType}
              onSelect={(type) => {
                setSelectedType(type); 
                setSelectedQuotaIdx(0)
                setSelectedDurationIdx(0)
                setPurchaseQuantity(1)
              }}
            />
            <QuotaGrid
              quotas={currentConfig.quotas}
              selectedIdx={selectedQuotaIdx}
              onSelect={setSelectedQuotaIdx}
            />
            <DurationQuantitySelector
              durations={DURATIONS}
              selectedDurationIdx={selectedDurationIdx}
              onDurationSelect={setSelectedDurationIdx}
              quantity={purchaseQuantity}
              onQuantityChange={setPurchaseQuantity}
            />
            <RulesTabs
              tabs={RULES_CONTENT}
              activeId={activeRuleTab}
              onTabChange={setActiveRuleTab}
            />
          </div>

          {/* RIGHT: Cart & Summary Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <CartSidebar
              cartItems={cartItems}
              cartTotal={cartTotal}
              currentSelection={{
                label: currentQuota.label,
                duration: currentDuration.label,
                subtotal: currentSelectionSubtotal,
                quantity: purchaseQuantity,
              }}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={removeFromCart}
              onCheckout={handleCheckoutClick}
            />
          </div>
        </div>
      </div>

      <CheckoutModal
        instances={instances}
        instancesLoading={instancesLoading}
        isOpen={isPurchaseModalOpen}
        cartItems={cartItems}
        cartTotal={cartTotal}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        agreementChecked={agreementChecked}
        setAgreementChecked={setAgreementChecked}
        isProcessing={isProcessing}
        onClose={closeModal}
        onConfirm={handleConfirmPurchase}
        onShowAgreement={() => setShowAgreementDetail(true)}
        onShowPaymentApplication={() => setShowPaymentApplicationModal(true)}
      />

      <AgreementModal
        isOpen={showAgreementDetail}
        onClose={() => setShowAgreementDetail(false)}
        onAgree={handleAgreeAndClose}
      />

      <PaymentApplicationModal
        isOpen={showPaymentApplicationModal}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onClose={() => setShowPaymentApplicationModal(false)}
        onDownload={handleDownloadPDF}
      />
    </div>
  )
}

export default ResourcePackView