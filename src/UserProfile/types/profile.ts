import type { Account } from '@/types';

// ========== 通用 ==========
export type ModalType =
  | 'none'
  | 'ticket_detail'
  | 'order_detail'
  | 'monitoring_detail'
  | 'bill_detail'
  | 'refund_request'
  | 'health_diag'
  | 'seller_refund_audit'
  | 'seller_reply_ticket'
  | 'create_ticket'
  | 'invoice_header'
  | 'request_invoice'
  | 'pay_bill'
  | 'edit_asset'
  | 'manage_version'
  | 'confirm_takedown'
  | 'upgrade_plan'
  | 'export_statement'
  | 'under_development'
  | 'payment_application'
  | 'payment'
  | 'generate_invoice'
  | 'confirm_payment'
  | 'upload_receipt'
  | 'issue_invoice'
  | 'preview_image';

// ========== 买家 ==========
export interface BuyerOrder {
  id: string;
  productName: string;
  provider: string;
  version: string;
  orderType: string;
  amount: number;
  createTime: string;
  payTime?: string;
  expireDate?: string;
  paymentStatus: string;
  paymentMethod?: string;
  status: string;
  resourceId?: string;
  snapshot?: any;
  invoiceStatus?: string;
  rejectReason?: string;
  history?: any[];
}

export interface BuyerBill {
  id: string;
  period: string;
  date: string;
  amount: number;
  count: number;
  status: 'paid' | 'unpaid';
  invoiceStatus: 'unissued' | 'issued' | 'Pending';
  details?: any[];
}

export interface BuyerInvoice {
  id: string;
  relatedId: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  title: string;
}

export interface BuyerResource {
  id: string;
  productName: string;
  instanceName: string;
  status: string;
  expireDate: string;
  quota?: { tokens: number; storage: number };
  usage?: { tokens: number; storage: number };
  orderType?: string;
}

// ========== 卖家 ==========
export interface SellerAsset {
  id: string;
  title: string;
  status: 'live' | 'review' | 'draft' | 'takedown';
  category: string;
  desc: string;
  versions: {
    ver: string;
    date: string;
    health: number;
    installs: number;
    status: string;
    log: string;
  }[];
}

export interface SellerMonitoringItem {
  id: string;
  buyer: string;
  asset: string;
  version: string;
  instanceName: string;
  instanceId: string;
  orderId: string;
  plan: string;
  period: string;
  usage: { tokens: string; storage: string };
  unitPrice: string;
  feeBreakdown: { tokens: number; storage: number };
  estimatedCost: number;
  status: string;
  unbilledPeriod?: string;
  billedPeriods?: string[];
}

export interface SellerRefund {
  id: string;
  orderId: string;
  amount: number;
  buyer: string;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SellerTransaction {
  id: string;
  type: 'income' | 'refund';
  asset: string;
  buyer: string;
  amount: number;
  status: 'settled' | 'pending';
  date: string;
}

// ========== 发票抬头 ==========
export interface InvoiceHeader {
  id: string;
  type: 'enterprise' | 'special' | 'personal';
  title: string;
  taxId: string;
  address?: string;
  phone?: string;
  bank?: string;
  account?: string;
  isDefault: boolean;
}

// ========== 工单 ==========
export interface SupportTicket {
  id: string;
  title: string;
  status: 'processing' | 'closed';
  date: string;
  type: string;
}

// ========== 健康指标 ==========
export interface HealthMetric {
  name: string;
  status: 'healthy' | 'degraded';
  latency: number[];
  avg: string;
}

// ========== 组件 Props ==========
export interface UserProfileProps {
  onNavigate: (view: string, params?: any) => void;
  currentAccount: Account;
  initialParams?: { tab?: string; conversationId?: string };
  extraAssets?: any[];
  globalOrders?: any[];
  globalResources?: any[];
  onUpgrade?: (orderId: string, planDetails: any) => void;
  onUpdateOrder?: (orderId: string, updates: any) => void;
  onUpdateResource?: (resourceId: string, updates: any) => void;
  onAddResource?: (resource: any) => void;
}