import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from '../Core/useUserProfileStore'
import { useBuyerStore } from './useBuyerStore'

import { OrderDetailModal } from './modals/OrderDetailModal'
import { BillDetailModal } from './modals/BillDetailModal'
import { RefundRequestModal } from './modals/RefundRequestModal'
import { CreateTicketModal } from './modals/CreateTicketModal'
import { PaymentApplicationModal } from './modals/PaymentApplicationModal'
import { UploadReceiptModal } from './modals/UploadReceiptModal'
import { RequestInvoiceModal } from './modals/RequestInvoiceModal'
import { PayBillModal } from './modals/PayBillModal'
import { PaymentModal } from './modals/PaymentModal'
import { ExportStatementModal } from './modals/ExportStatementModal'
import { InvoiceHeaderModal } from '../Shared/components/organisms/modals/InvoiceHeaderModal'
import { UnderDevelopmentModal } from '../Shared/components/organisms/modals/UnderDevelopmentModal'
import { PreviewImageModal } from '../Shared/components/organisms/modals/PreviewImageModal'

export const BuyerModals: React.FC = () => {
  const profileContext = useUserProfile()
  const buyerStore = useBuyerStore()
  const [searchParams] = useSearchParams()

  const { activeModal } = profileContext

  if (!activeModal || activeModal === 'none') return null

  // Simulate selectedItem from URL params for old components
  let selectedItem = null
  const orderId = searchParams.get('orderId')
  const billId = searchParams.get('billId')
  if (orderId) {
    selectedItem = profileContext.localOrders.find((o) => o.id === orderId) || { id: orderId }
  } else if (billId) {
    selectedItem = buyerStore.bills.find((b) => b.id === billId) || { id: billId }
  }

  const sharedProps = {
    ...profileContext,
    ...buyerStore,
    selectedItem,
    // Add compatibility layer
    setSelectedItem: () => {},
    setActiveModal: (m: string) => profileContext.openModal(m),
    setPreviewImageUrl: (url: string) =>
      profileContext.openModal('preview_image', { imageUrl: url }),
    previewImageUrl: searchParams.get('imageUrl') || '',
  }

  return (
    <>
      {activeModal === 'order_detail' && <OrderDetailModal />}
      {activeModal === 'bill_detail' && <BillDetailModal {...sharedProps} />}
      {activeModal === 'refund_request' && <RefundRequestModal {...sharedProps} />}
      {activeModal === 'create_ticket' && <CreateTicketModal {...sharedProps} />}
      {activeModal === 'invoice_header' && <InvoiceHeaderModal {...sharedProps} />}
      {activeModal === 'request_invoice' && <RequestInvoiceModal {...sharedProps} />}
      {activeModal === 'pay_bill' && <PayBillModal {...sharedProps} />}
      {activeModal === 'payment_application' && <PaymentApplicationModal {...sharedProps} />}
      {activeModal === 'payment' && <PaymentModal {...sharedProps} />}
      {activeModal === 'upload_receipt' && <UploadReceiptModal {...sharedProps} />}
      {activeModal === 'export_statement' && <ExportStatementModal {...sharedProps} />}
      {activeModal === 'preview_image' && <PreviewImageModal {...sharedProps} />}
      {activeModal === 'under_development' && <UnderDevelopmentModal {...sharedProps} />}
    </>
  )
}
