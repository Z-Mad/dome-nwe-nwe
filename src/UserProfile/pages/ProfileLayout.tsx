// pages/profile/ProfileLayout.tsx
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Receipt, Box, PieChart, Headphones, Wallet, LifeBuoy, BarChart2, Activity } from 'lucide-react';
import { ProfileHeader } from '../components/ProfileHeader';
import  { useToast } from '../hooks/useToast';
import  { useModal } from '../hooks/useModal';
import  { useInvoiceHeaders } from '../hooks/useInvoiceHeaders';
import { useBuyerBills } from '../hooks/useBuyerBills';
import { useBuyerInvoices } from '../hooks/useBuyerInvoices';
import { useUserStore } from '@/utils/user'


// 引入所有弹窗组件
import { OrderDetailModal } from '../modals/OrderDetailModal';
import { MonitoringDetailModal } from '../modals/MonitoringDetailModal';
import { BillDetailModal } from '../modals/BillDetailModal';
import { RefundRequestModal } from '../modals/RefundRequestModal';
import { SellerRefundAuditModal } from '../modals/SellerRefundAuditModal';
import { CreateTicketModal } from '../modals/CreateTicketModal';
import { InvoiceHeaderModal } from '../modals/InvoiceHeaderModal';
import { RequestInvoiceModal } from '../modals/RequestInvoiceModal';
import { PayBillModal } from '../modals/PayBillModal';
import { EditAssetModal } from '../modals/EditAssetModal';
import { ManageVersionModal } from '../modals/ManageVersionModal';
import { ConfirmTakedownModal } from '../modals/ConfirmTakedownModal';
import { UnderDevelopmentModal } from '../modals/UnderDevelopmentModal';
import { PaymentApplicationModal } from '../modals/PaymentApplicationModal';
import { PaymentModal } from '../modals/PaymentModal';
import { GenerateInvoiceModal } from '../modals/GenerateInvoiceModal';
import { ConfirmPaymentModal } from '../modals/ConfirmPaymentModal';
import { UploadReceiptModal } from '../modals/UploadReceiptModal';
import { IssueInvoiceModal } from '../modals/IssueInvoiceModal';
import { ExportStatementModal } from '../modals/ExportStatementModal';
import { PreviewImageModal } from '../modals/PreviewImageModal';

interface ProfileLayoutProps {
  currentAccount: any;
  onNavigate: (view: string, params?: any) => void;
  extraAssets?: any[];
  globalOrders?: any[];
  globalResources?: any[];
  onUpgrade?: (orderId: string, planDetails: any) => void;
  onUpdateOrder?: (orderId: string, updates: any) => void;
  onUpdateResource?: (resourceId: string, updates: any) => void;
  onAddResource?: (resource: any) => void;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  currentAccount,
  onNavigate,
  extraAssets = [],
  globalOrders = [],
  globalResources = [],
  onUpgrade,
  onUpdateOrder,
  onUpdateResource,
  onAddResource,
}) => {
  const { userInfo, checkDeveloper } = useUserStore()
  const navigate = useNavigate();
  const location = useLocation();
  const { toastMsg, showToast } = useToast();
  const { activeModal, selectedItem, selectedVersion, openModal, closeModal, setSelectedItem } = useModal();
  const {
    invoiceHeaders,
    setInvoiceHeaders,
    selectedHeaderId,
    setSelectedHeaderId,
    editingInvoiceHeader,
    setEditingInvoiceHeader,
    showInvoiceHeaderForm,
    setShowInvoiceHeaderForm,
    addHeader,
    updateHeader,
    deleteHeader,
  } = useInvoiceHeaders();
  // 添加账单和发票状态
  const { bills, updateBill } = useBuyerBills();
  const { invoices, setInvoices, invoiceSubTab, setInvoiceSubTab, addInvoice } = useBuyerInvoices();
  const displayAccount = {
    ...currentAccount,
    avatar: userInfo?.avatar,
    displayName: userInfo?.name,
    orgInfo: `${userInfo?.tenantName} · ID: ${userInfo?.tenantId}`,
  };

  // 判断当前角色（从路径中提取）
  const isSellerRoute = location.pathname.includes('/profile/seller');
  const consoleMode: 'buyer' | 'seller' = isSellerRoute ? 'seller' : 'buyer';

  // 买家侧边栏导航项
  const buyerNavItems = [
    { path: '/profile/buyer/dashboard', label: '概览', icon: LayoutDashboard },
    { path: '/profile/buyer/orders', label: '订单管理', icon: FileText },
    { path: '/profile/buyer/bills', label: '账单管理', icon: FileText },
    { path: '/profile/buyer/invoices', label: '发票管理', icon: Receipt },
    { path: '/profile/buyer/resources', label: '我的资源', icon: Box },
    { path: '/profile/buyer/analysis', label: '成本分析', icon: PieChart },
    { path: '/profile/buyer/support', label: '服务支持', icon: Headphones },
  ];

  // 卖家侧边栏导航项
  const sellerNavItems = [
    { path: '/profile/seller/dashboard', label: '概览', icon: LayoutDashboard },
    { path: '/profile/seller/assets', label: '资产管理', icon: Box },
    { path: '/profile/seller/finance', label: '业务管理', icon: Wallet },
    { path: '/profile/seller/support', label: '工单服务', icon: LifeBuoy },
    { path: '/profile/seller/analysis', label: '运营分析', icon: BarChart2 },
    { path: '/profile/seller/health', label: '健康监控', icon: Activity },
  ];

  const navItems = consoleMode === 'buyer' ? buyerNavItems : sellerNavItems;

  // 处理导航
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // 渲染弹窗（与之前相同，略去重复代码，实际需保留所有弹窗渲染逻辑）
  const renderModal = () => {
    switch (activeModal) {
      case 'order_detail':
        return (
          <OrderDetailModal
            order={selectedItem}
            onClose={closeModal}
            onNavigate={onNavigate}
            onOpenModal={openModal}
          />
        );
      case 'monitoring_detail':
        return (
          <MonitoringDetailModal
            item={selectedItem}
            onClose={closeModal}
            onOpenModal={openModal}
          />
        );
      case 'bill_detail':
        return (
          <BillDetailModal
            bill={selectedItem}
            onClose={closeModal}
            onOpenModal={openModal}
          />
        );
      case 'refund_request':
        return (
          <RefundRequestModal
            order={selectedItem}
            onClose={closeModal}
            onSubmit={() => {}}
          />
        );
      case 'seller_refund_audit':
        return (
          <SellerRefundAuditModal
            refund={selectedItem}
            onClose={closeModal}
            onAudit={() => {}}
          />
        );
      case 'create_ticket':
        return (
          <CreateTicketModal
            onClose={closeModal}
            onSubmit={() => {}}
          />
        );
      case 'invoice_header':
        return (
          <InvoiceHeaderModal
            headers={invoiceHeaders}
            editingHeader={editingInvoiceHeader}
            showForm={showInvoiceHeaderForm}
            onClose={() => closeModal()}
            onSave={() => {}}
            onAdd={() => {}}
          />
        );
      case 'request_invoice':
        return (
          <RequestInvoiceModal
            item={selectedItem}
            headers={invoiceHeaders}
            selectedHeaderId={selectedHeaderId}
            setSelectedHeaderId={setSelectedHeaderId}
            onClose={closeModal}
            onSubmit={() => {}}
            onAddHeader={() => {}}
            isLoading={false}
          />
        );
      case 'pay_bill':
        return (
          <PayBillModal
            bill={selectedItem}
            onClose={closeModal}
            onPay={() => {}}
            isLoading={false}
          />
        );
      case 'edit_asset':
        return (
          <EditAssetModal
            asset={selectedItem}
            onClose={closeModal}
            onSave={() => {}}
            isLoading={false}
          />
        );
      case 'manage_version':
        return (
          <ManageVersionModal
            asset={selectedItem}
            version={selectedVersion}
            onClose={closeModal}
            onAction={() => {}}
            isLoading={false}
          />
        );
      case 'confirm_takedown':
        return (
          <ConfirmTakedownModal
            assetTitle={selectedItem?.title}
            onClose={closeModal}
            onConfirm={() => {}}
            isLoading={false}
          />
        );
      case 'under_development':
        return <UnderDevelopmentModal onClose={closeModal} />;
      case 'payment_application':
        return (
          <PaymentApplicationModal
            item={selectedItem}
            onClose={closeModal}
            onDownload={() => {}}
          />
        );
      case 'payment':
        return (
          <PaymentModal
            order={selectedItem}
            onClose={closeModal}
            onPay={() => {}}
          />
        );
      case 'generate_invoice':
        return (
          <GenerateInvoiceModal
            item={selectedItem}
            onClose={closeModal}
            onGenerate={() => {}}
            isLoading={false}
          />
        );
      case 'confirm_payment':
        return (
          <ConfirmPaymentModal
            item={selectedItem}
            onClose={closeModal}
            onConfirm={() => {}}
            isLoading={false}
          />
        );
      case 'upload_receipt':
        return (
          <UploadReceiptModal
            order={selectedItem}
            onClose={closeModal}
            onSubmit={() => {}}
            isLoading={false}
          />
        );
      case 'issue_invoice':
        return (
          <IssueInvoiceModal
            order={selectedItem}
            onClose={closeModal}
            onIssue={() => {}}
            isLoading={false}
          />
        );
      case 'export_statement':
        return (
          <ExportStatementModal
            bills={[]}
            onClose={closeModal}
            onExport={() => {}}
            isLoading={false}
          />
        );
      case 'preview_image':
        return (
          <PreviewImageModal
            imageUrl=""
            order={selectedItem}
            onClose={closeModal}
            onDownload={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-6 md:p-8 relative">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[60] animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {renderModal()}

      <div className="max-w-6xl mx-auto pb-20">
        <ProfileHeader
          displayAccount={displayAccount}
          consoleMode={consoleMode}
          setConsoleMode={(mode) => {
            navigate(mode === 'buyer' ? '/profile/buyer/dashboard' : '/profile/seller/dashboard');
          }}
          isViewer={checkDeveloper}
        />

        <div className="flex flex-col gap-6">
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? consoleMode === 'buyer'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </div>

          <Outlet context={{
            showToast,
            openModal,
            closeModal,
            onNavigate,
            currentAccount,
            extraAssets,
            globalOrders,
            globalResources,
            onUpgrade,
            onUpdateOrder,
            onUpdateResource,
            onAddResource,
            invoiceHeaders,
            setInvoiceHeaders,
            selectedHeaderId,
            setSelectedHeaderId,
            editingInvoiceHeader,
            setEditingInvoiceHeader,
            showInvoiceHeaderForm,
            setShowInvoiceHeaderForm,
            // 新增账单和发票相关
            bills,
            updateBill,
            invoices,
            setInvoices,
            invoiceSubTab,
            setInvoiceSubTab,
            addInvoice,
          }} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;