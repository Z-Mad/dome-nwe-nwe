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

const getAssetModalData = (activeModal: string, params: any, sellerAssets: any[]) => {
  const assetModals = ['edit_asset', 'confirm_takedown', 'manage_version'];
  if (!assetModals.includes(activeModal) && !(activeModal === 'preview_image' && params.assetId)) {
    return null;
  }
  const item = sellerAssets.find(a => a.id === params.assetId) || { id: params.assetId };
  const version = params.versionId ? item?.versions?.find((v: any) => v.ver === params.versionId) : null;
  return { selectedItem: item, selectedVersion: version };
};

const getConfirmPaymentData = (params: any, localOrders: any[], monitoringData: any[]) => {
  const item = params.orderId 
    ? localOrders.find(o => o.id === params.orderId) || { id: params.orderId }
    : monitoringData.find(m => m.id === params.itemId) || { id: params.itemId };
  return { selectedItem: item, selectedVersion: null };
};

const getOrderOrMonitoringData = (activeModal: string, params: any, localOrders: any[], monitoringData: any[]) => {
  if (activeModal === 'confirm_payment') {
    return getConfirmPaymentData(params, localOrders, monitoringData);
  }
  
  if (activeModal === 'issue_invoice') {
    return { selectedItem: localOrders.find(o => o.id === params.orderId) || { id: params.orderId }, selectedVersion: null };
  }
  
  if (activeModal === 'generate_invoice' || activeModal === 'monitoring_detail') {
    return { selectedItem: monitoringData.find(m => m.id === params.itemId) || { id: params.itemId }, selectedVersion: null };
  }
  
  return null;
};

const getSelectedData = (
  activeModal: string,
  searchParams: URLSearchParams,
  sellerAssets: any[],
  localOrders: any[],
  monitoringData: any[],
  sellerRefunds: any[]
) => {
  const params = Object.fromEntries(searchParams.entries());

  const assetData = getAssetModalData(activeModal, params, sellerAssets);
  if (assetData) return assetData;

  const orderData = getOrderOrMonitoringData(activeModal, params, localOrders, monitoringData);
  if (orderData) return orderData;

  if (activeModal === 'seller_refund_audit') {
    return { selectedItem: sellerRefunds.find(r => r.id === params.refundId) || { id: params.refundId }, selectedVersion: null };
  }

  return { selectedItem: null, selectedVersion: null };
};

export const SellerModals: React.FC = () => {
  const profileContext = useUserProfile();
  const sellerStore = useSellerStore();
  const [searchParams] = useSearchParams();

  const { activeModal } = profileContext;

  if (!activeModal || activeModal === 'none') return null;

  const { selectedItem, selectedVersion } = getSelectedData(
    activeModal,
    searchParams,
    sellerStore.sellerAssets,
    profileContext.localOrders,
    sellerStore.monitoringData,
    sellerStore.sellerRefunds
  );

  const sharedProps = {
    ...profileContext,
    ...sellerStore,
    selectedItem,
    selectedVersion,
    // Add compatibility layer
    setSelectedItem: () => {},
    closeModal: () => profileContext.closeModal(),
    setActiveModal: (m: string) => {
      if (m === "none") profileContext.closeModal();
      else profileContext.openModal(m);
    },
    setPreviewImageUrl: (url: string) => profileContext.openModal('preview_image', { imageUrl: url }),
    previewImageUrl: searchParams.get('imageUrl') || '',
  };

  const modalMap: Record<string, React.ReactNode> = {
    monitoring_detail: <MonitoringDetailModal {...sharedProps} />,
    seller_refund_audit: <SellerRefundAuditModal {...sharedProps} />,
    edit_asset: <EditAssetModal {...sharedProps} />,
    manage_version: <ManageVersionModal {...sharedProps} />,
    confirm_takedown: <ConfirmTakedownModal {...sharedProps} />,
    generate_invoice: <GenerateInvoiceModal {...sharedProps} />,
    issue_invoice: <IssueInvoiceModal {...sharedProps} />,
    export_statement: <ExportStatementModal {...sharedProps} />,
    preview_image: <PreviewImageModal {...sharedProps} />,
    under_development: <UnderDevelopmentModal {...sharedProps} />,
    confirm_payment: <ConfirmPaymentModal {...sharedProps} />
  };

  return <>{modalMap[activeModal] || null}</>;
};
