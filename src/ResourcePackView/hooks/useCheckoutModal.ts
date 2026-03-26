// hooks/useCheckoutModal.ts
import { useState } from 'react'
import type { Order } from '../types/resourcePack'

export const useCheckoutModal = (orders: Order[]) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [targetOrderId, setTargetOrderId] = useState<string>('')
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat' | 'offline'>('alipay')
  const [agreementChecked, setAgreementChecked] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const getVersionsForOrder = (productName: string): string[] => {
    if (productName.includes('数字冷轧')) return ['v2.4.1 (最新)', 'v2.4.0', 'v2.3.5']
    if (productName.includes('连退炉温')) return ['v1.2.0', 'v1.1.5']
    return ['v1.0.0']
  }

  const openModal = () => {
    setTargetOrderId('')
    setSelectedVersion('')
    setPaymentMethod('alipay')
    setAgreementChecked(true)

    const validOrders = orders.filter(o => o.status === 'Active' || o.status === 'Trial')
    if (validOrders.length > 0) {
      setTargetOrderId(validOrders[0].id)
      const versions = getVersionsForOrder(validOrders[0].productName)
      setSelectedVersion(versions[0])
    }
    setIsPurchaseModalOpen(true)
  }

  const closeModal = () => {
    setIsPurchaseModalOpen(false)
    setIsProcessing(false)
  }

  const setProcessing = (value: boolean) => setIsProcessing(value)

  const activeOrders = orders.filter(o => o.status === 'Active' || o.status === 'Trial')
  const currentVersions = targetOrderId
    ? getVersionsForOrder(orders.find(o => o.id === targetOrderId)?.productName || '')
    : []

  return {
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
  }
}