import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserProfile } from '../Core/useUserProfileStore';
import { useSellerStore } from './useSellerStore';

import { SellerRefundAuditModal } from './components/organisms/modals/SellerRefundAuditModal';
import { EditAssetModal } from './components/organisms/modals/EditAssetModal';
import { ManageVersionModal } from './components/organisms/modals/ManageVersionModal';
import { ConfirmPaymentModal } from './components/organisms/modals/ConfirmPaymentModal';
import { IssueInvoiceModal } from './components/organisms/modals/IssueInvoiceModal';
import { GenerateInvoiceModal } from './components/organisms/modals/GenerateInvoiceModal';
import { ConfirmTakedownModal } from './components/organisms/modals/ConfirmTakedownModal';
import { MonitoringDetailModal } from './components/organisms/modals/MonitoringDetailModal';
import { ExportStatementModal } from '../Buyer/modals/ExportStatementModal';
import { PreviewImageModal } from '../Shared/components/organisms/modals/PreviewImageModal';
import { UnderDevelopmentModal } from '../Shared/components/organisms/modals/UnderDevelopmentModal';

export const SellerModals: React.FC = () => {
  const profileContext = useUserProfile();
  const sellerStore = useSellerStore();
  const [searchParams] = useSearchParams();

  const { activeModal } = profileContext;

  if (!activeModal || activeModal === 'none') return null;

  let selectedItem = null;
  const assetId = searchParams.get('assetId');
  if (assetId) {
    selectedItem = sellerStore.sellerAssets.find(a => a.id === assetId) || { id: assetId };
  }

  const sharedProps = {
    ...profileContext,
    ...sellerStore,
    selectedItem,
    // Add compatibility layer
    setSelectedItem: () => {},
    setActiveModal: (m: string) => profileContext.openModal(m),
    setPreviewImageUrl: (url: string) => profileContext.openModal('preview_image', { imageUrl: url }),
    previewImageUrl: searchParams.get('imageUrl') || '',
  };

  return (
    <>
      {activeModal === "monitoring_detail" && <MonitoringDetailModal {...sharedProps} />}
      {activeModal === "seller_refund_audit" && <SellerRefundAuditModal {...sharedProps} />}
      {activeModal === "edit_asset" && <EditAssetModal {...sharedProps} />}
      {activeModal === "manage_version" && <ManageVersionModal {...sharedProps} />}
      {activeModal === "confirm_takedown" && <ConfirmTakedownModal {...sharedProps} />}
      {activeModal === "generate_invoice" && <GenerateInvoiceModal {...sharedProps} />}
      {activeModal === "issue_invoice" && <IssueInvoiceModal {...sharedProps} />}
      {activeModal === "export_statement" && <ExportStatementModal {...sharedProps} />}
      {activeModal === "preview_image" && <PreviewImageModal {...sharedProps} />}
      {activeModal === "under_development" && <UnderDevelopmentModal {...sharedProps} />}
      {activeModal === "confirm_payment" && <ConfirmPaymentModal {...sharedProps} />}
    </>
  );
};
