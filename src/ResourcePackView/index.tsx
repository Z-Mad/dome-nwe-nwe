// ResourcePackView.tsx
import React from 'react'
import { useResourcePackState } from './hooks/useResourcePackState'
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
import { CONFIG_OPTIONS, DURATIONS, RULES_CONTENT } from './constants/resourcePack'

interface ResourcePackViewProps {
  orders: any[]
  onPurchase: (items: any[], targetOrderId: string, version: string, paymentMethod: string) => void
}

const ResourcePackView: React.FC<ResourcePackViewProps> = ({ orders, onPurchase }) => {
  const {
    selectedType,
    setSelectedType,
    selectedQuotaIdx,
    setSelectedQuotaIdx,
    selectedDurationIdx,
    setSelectedDurationIdx,
    purchaseQuantity,
    setPurchaseQuantity,
    activeRuleTab,
    setActiveRuleTab,
  } = useResourcePackState()

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

  const { showPaymentApplicationModal, setShowPaymentApplicationModal } = usePaymentApplication()
  const [showAgreementDetail, setShowAgreementDetail] = React.useState(false)

  const currentConfig = CONFIG_OPTIONS[selectedType]
  const currentQuota = currentConfig.quotas[selectedQuotaIdx]
  const currentDuration = DURATIONS[selectedDurationIdx]

  const currentSelectionPrice = Math.floor(currentQuota.price * currentDuration.multiplier)
  const currentSelectionSubtotal = currentSelectionPrice * purchaseQuantity

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

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
      <div className="max-w-7xl mx-auto">
        <ResourcePackHeader />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: Configuration Panel */}
          <div className="flex-1 space-y-6 w-full">
            <ProductTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
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
              onCheckout={openModal}
            />
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isPurchaseModalOpen}
        cartItems={cartItems}
        cartTotal={cartTotal}
        targetOrderId={targetOrderId}
        setTargetOrderId={setTargetOrderId}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        agreementChecked={agreementChecked}
        setAgreementChecked={setAgreementChecked}
        isProcessing={isProcessing}
        activeOrders={activeOrders}
        currentVersions={currentVersions}
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