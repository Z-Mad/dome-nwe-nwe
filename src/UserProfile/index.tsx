import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { BillDetailModal } from './components/modals/BillDetailModal';
import { RefundRequestModal } from './components/modals/RefundRequestModal';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Box,
  Activity,
  DollarSign,
  CreditCard,
  FileText,
  Headphones,
  Heart,
  Settings,
  ShieldCheck,
  ChevronRight,
  Search,
  Download,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
  AlertCircle,
  Edit3,
  Trash2,
  Home,
  CheckCircle,
  X,
  BarChart2,
  HardHat,
  Copy,
  RefreshCw,
  Loader2,
  Send,
  Key,
  Wallet,
  PieChart,
  GitCommit,
  History,
  Package,
  RotateCcw,
  Filter,
  LayoutDashboard,
  Calendar,
  Eye,
  Receipt,
  MapPin,
  Grid,
  Wrench,
  MoreHorizontal,
  ChevronDown,
  FilePlus,
  MessageSquare,
  Server,
  Database,
  Cpu,
  Users,
  Zap,
  LifeBuoy,
  Building2,
  Mail,
  Camera,
  HelpCircle,
  Check,
  PlayCircle,
  LogOut,
  Info,
  LineChart,
  BadgeCheck,
  Star,
  MessageSquare as MessageIcon,
  Coins,
  ExternalLink,
  PlusCircle,
  Phone,
  ArrowUpRight,
  ArrowDownLeft,
  Terminal,
  PauseCircle,
  Play,
  Archive,
  Scale,
  RefreshCcw,
  Repeat,
  Scan,
  Building,
  Upload,
  BellRing,
} from "lucide-react";
import { Account } from "@/types";
import { BuyerTab, isBuyerTab } from "./Buyer/buyerTabs";
import { SellerTab, isSellerTab } from "./Seller/sellerTabs";
import { useDebouncedValue } from "./Shared/useDebouncedValue";
import { useOrderFilterWorker } from "./Order/useOrderFilterWorker";
import { useVirtualPagination } from "./Shared/useVirtualPagination";
import { useUserProfileUIStore } from "./Core/useUserProfileUIStore";
import { getOrderStatusLabel, getPaymentMethodLabel, ORDER_STATUS_OPTIONS, OrderStatusFilter } from "./Order/orderUtils";
import { BUYER_STATS, RESOURCE_TREND_DATA, INITIAL_BILLS, INITIAL_INVOICE_HEADERS, COST_BREAKDOWN, SUPPORT_TICKETS, FAQ_ITEMS } from "./Buyer/constants";
import { SELLER_STATS, SELLER_REVENUE_CHART_DATA, SELLER_TRANSACTIONS, SELLER_MONITORING_MOCK, SELLER_ORDERS_MOCK, SELLER_REFUNDS_MOCK, HEALTH_METRICS, RICH_ASSETS_MOCK } from "./Seller/constants";
import { REFUND_REASONS } from "./Order/constants";
import { PaymentStatusBadge, StatusBadge } from "./Shared/badges";

const BuyerConsole = lazy(() => import("./Buyer/BuyerConsole"));
const SellerConsole = lazy(() => import("./Seller/SellerConsole"));
const ProfileHeader = lazy(() => import("./Shared/ProfileHeader"));

interface UserProfileProps {
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

type ModalType =
  | "none"
  | "ticket_detail"
  | "order_detail"
  | "monitoring_detail"
  | "bill_detail"
  | "refund_request"
  | "health_diag"
  | "seller_refund_audit"
  | "seller_reply_ticket"
  | "create_ticket"
  | "invoice_header"
  | "request_invoice"
  | "pay_bill"
  | "edit_asset"
  | "manage_version"
  | "confirm_takedown"
  | "upgrade_plan"
  | "export_statement"
  | "under_development"
  | "payment_application"
  | "payment"
  | "generate_invoice"
  | "confirm_payment"
  | "upload_receipt"
  | "issue_invoice"
  | "preview_image";

// --- MOCK DATA ---




import { UserProfileProvider } from "./Core/UserProfileContext";

const UserProfileContent: React.FC<UserProfileProps> = ({
  onNavigate,
  currentAccount,
  initialParams,
  globalOrders = [],
  globalResources = [],
  extraAssets = [],
  onUpgrade,
  onUpdateOrder,
  onUpdateResource,
  onAddResource,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Determine display info
  const displayAccount = useMemo(
    () => ({
      ...currentAccount,
      displayName:
        currentAccount.role === "developer"
          ? "COMMANDER_01"
          : currentAccount.name,
      orgInfo: "宝信软件 (Baosight) · ID: 88293910",
    }),
    [currentAccount],
  );

  // --- State ---
  const [consoleMode, setConsoleMode] = useState<"buyer" | "seller">(
    currentAccount.role === "viewer" ? "buyer" : "seller",
  );

  const buyerTab = useUserProfileUIStore((state) => state.buyerTab);
  const setBuyerTab = useUserProfileUIStore((state) => state.setBuyerTab);
  const sellerTab = useUserProfileUIStore((state) => state.sellerTab);
  const setSellerTab = useUserProfileUIStore((state) => state.setSellerTab);
  const [monitoringData, setMonitoringData] = useState(SELLER_MONITORING_MOCK);
  const [resourceSubTab, setResourceSubTab] = useState<
    "purchased" | "favorites"
  >("purchased");

  // Seller Assets State
  const [sellerAssetFilter, setSellerAssetFilter] = useState("all");
  const [sellerAssets, setSellerAssets] = useState(RICH_ASSETS_MOCK);

  const [sellerFinanceSubTab, setSellerFinanceSubTab] = useState<
    "overview" | "monitoring" | "transactions"
  >("overview");

  // Order Filter State
  const orderSearch = useUserProfileUIStore((state) => state.orderSearch);
  const setOrderSearch = useUserProfileUIStore((state) => state.setOrderSearch);
  const orderStatusFilter = useUserProfileUIStore((state) => state.orderStatusFilter);
  const setOrderStatusFilter = useUserProfileUIStore((state) => state.setOrderStatusFilter);

  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<any>(null); // For version management
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [receiptForm, setReceiptForm] = useState({ 
    companyName: "", 
    phone: "", 
    file: null as File | null, 
    transactionId: "",
    bankAccount: "",
    paymentAmount: "",
    paymentDate: "",
    remark: "",
    rejectReason: ""
  });
  const [invoiceForm, setInvoiceForm] = useState({ type: "enterprise", title: "", taxId: "", email: "", address: "", bank: "", account: "" });
  const [invoiceEndDate, setInvoiceEndDate] = useState("");
  const [isQueryingUsage, setIsQueryingUsage] = useState(false);
  const [queriedUsage, setQueriedUsage] = useState<any>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Form State
  const [ticketForm, setTicketForm] = useState({ type: "technical", desc: "" });
  const [auditComment, setAuditComment] = useState("");
  const [diagStep, setDiagStep] = useState(0);
  const [refundReason, setRefundReason] = useState("");
  const [refundReasonTag, setRefundReasonTag] = useState("");

  // Edit Asset Form State
  const [editAssetForm, setEditAssetForm] = useState({
    title: "",
    desc: "",
    tags: "",
  });

  // Instance Name Edit State
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(null);
  const [editingInstanceName, setEditingInstanceName] = useState("");
  const [activatingInstanceId, setActivatingInstanceId] = useState<string | null>(null);
  const [activatingInstanceName, setActivatingInstanceName] = useState("");

  // Invoice State
  const [invoiceHeaders, setInvoiceHeaders] = useState(INITIAL_INVOICE_HEADERS);
  const [selectedHeaderId, setSelectedHeaderId] = useState("h1");
  const [editingInvoiceHeader, setEditingInvoiceHeader] = useState<any>(null);
  const [showInvoiceHeaderForm, setShowInvoiceHeaderForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [invoices, setInvoices] = useState([
    {
      id: "INV-20250301-001",
      relatedId: "2025年2月 账单",
      amount: 9800.0,
      type: "增值税电子普通发票",
      status: "issued",
      date: "2025-03-05",
      title: "企业名称",
    },
    {
      id: "INV-20250402-002",
      relatedId: "2025年3月 账单",
      amount: 11200.0,
      type: "增值税电子普通发票",
      status: "Pending",
      date: "2025-04-02",
      title: "企业名称",
    }
  ]);
  const [invoiceSubTab, setInvoiceSubTab] = useState<"invoiceable" | "history">("invoiceable");

  // Data State
  const [localOrders, setLocalOrders] = useState<any[]>(globalOrders);
  const [localResources, setLocalResources] = useState<any[]>(globalResources);
  const [sellerRefunds, setSellerRefunds] =
    useState<any[]>(SELLER_REFUNDS_MOCK);
  const orderListRef = useRef<HTMLDivElement | null>(null);
  const debouncedOrderSearch = useDebouncedValue(orderSearch, 160);
  const filteredOrders = useOrderFilterWorker(
    localOrders,
    orderStatusFilter,
    debouncedOrderSearch,
  );
  const virtualOrders = useVirtualPagination(filteredOrders, {
    itemHeight: 260,
    containerHeight: 720,
    pageSize: 20,
    overscan: 3,
  });
  const resetVirtualOrders = virtualOrders.reset;
  const virtualOrderContainerStyle = useMemo(() => ({ height: "720px" }), []);

  useEffect(() => {
    setLocalOrders(globalOrders);
  }, [globalOrders]);

  useEffect(() => {
    setLocalResources(globalResources);
  }, [globalResources]);

  useEffect(() => {
    resetVirtualOrders();
    if (orderListRef.current) {
      orderListRef.current.scrollTop = 0;
    }
  }, [localOrders.length, orderStatusFilter, debouncedOrderSearch, resetVirtualOrders]);

  useEffect(() => {
    if (activeModal === "generate_invoice" && selectedItem) {
      // Just a small visual delay to simulate fetching the unbilled data
      setIsQueryingUsage(true);
      const timer = setTimeout(() => {
        setIsQueryingUsage(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeModal, selectedItem]);

  const navigateBuyerTab = useCallback((tab: BuyerTab) => {
    setConsoleMode("buyer");
    setBuyerTab(tab);
    navigate(`/profile/buyer/${tab}`);
  }, [navigate]);

  const navigateSellerTab = useCallback((tab: SellerTab) => {
    if (currentAccount.role === "viewer") {
      navigate("/profile/buyer/dashboard", { replace: true });
      return;
    }
    setConsoleMode("seller");
    setSellerTab(tab);
    navigate(`/profile/seller/${tab}`);
  }, [currentAccount.role, navigate]);

  useEffect(() => {
    if (initialParams?.tab && !location.pathname.startsWith("/profile/buyer/") && !location.pathname.startsWith("/profile/seller/")) {
      if (initialParams.tab === "assets") {
        navigateSellerTab("assets");
      } else if (initialParams.tab === "orders") {
        navigateBuyerTab("orders");
      } else if (isBuyerTab(initialParams.tab)) {
        navigateBuyerTab(initialParams.tab);
      } else if (isSellerTab(initialParams.tab)) {
        navigateSellerTab(initialParams.tab);
      } else {
        navigateBuyerTab("dashboard");
      }
      return;
    }
    const queryTab = searchParams.get("tab");
    if (queryTab) {
      if (queryTab === "assets") {
        navigateSellerTab("assets");
      } else if (queryTab === "orders") {
        navigateBuyerTab("orders");
      } else if (isBuyerTab(queryTab)) {
        navigateBuyerTab(queryTab);
      } else if (isSellerTab(queryTab)) {
        navigateSellerTab(queryTab);
      } else {
        navigateBuyerTab("dashboard");
      }
      return;
    }
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      if (currentAccount.role === "viewer") {
        navigate("/profile/buyer/dashboard", { replace: true });
      } else {
        navigate("/profile/seller/assets", { replace: true });
      }
      return;
    }
    const pathParts = location.pathname.split("/").filter(Boolean);
    const routeMode = pathParts[1];
    const routeTab = pathParts[2];
    if (routeMode === "buyer" && routeTab && isBuyerTab(routeTab)) {
      setConsoleMode("buyer");
      setBuyerTab(routeTab);
      return;
    }
    if (routeMode === "seller" && routeTab && isSellerTab(routeTab)) {
      if (currentAccount.role === "viewer") {
        navigate("/profile/buyer/dashboard", { replace: true });
        return;
      }
      setConsoleMode("seller");
      setSellerTab(routeTab);
      return;
    }
    if (currentAccount.role === "viewer") {
      navigate("/profile/buyer/dashboard", { replace: true });
    } else {
      navigate("/profile/seller/assets", { replace: true });
    }
  }, [initialParams, location.pathname, searchParams, currentAccount.role]);

  // Sync extraAssets (newly published) into rich assets for display
  useEffect(() => {
    if (extraAssets.length > 0) {
      const newRichAssets = extraAssets.map((a) => ({
        id: a.id,
        title: a.title,
        status: "live",
        category: a.type,
        desc: a.desc || "No description",
        versions: [
          {
            ver: a.currentVersion || "v1.0.0",
            date: new Date().toISOString().split("T")[0],
            health: 100,
            installs: 0,
            status: "active",
            log: "Initial release",
          },
        ],
      }));
      // Merge avoiding duplicates (simple logic for mock)
      const combined = [
        ...RICH_ASSETS_MOCK,
        ...newRichAssets.filter(
          (na) => !RICH_ASSETS_MOCK.find((ra) => ra.title === na.title),
        ),
      ];
      setSellerAssets(combined);
    }
  }, [extraAssets]);

  // --- Helpers ---
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openModal = (
    type: ModalType,
    item: any = null,
    subItem: any = null,
  ) => {
    setSelectedItem(item);
    if (subItem) setSelectedVersion(subItem);
    setActiveModal(type);

    // Reset forms based on modal type
    if (type === "create_ticket")
      setTicketForm({ type: "technical", desc: "" });
    if (type === "seller_refund_audit") setAuditComment("");
    if (type === "refund_request") {
      setRefundReason("");
      setRefundReasonTag("");
    }
    if (type === "health_diag") {
      setDiagStep(0);
      const timers = [
        setTimeout(() => setDiagStep(1), 500),
        setTimeout(() => setDiagStep(2), 1500),
        setTimeout(() => setDiagStep(3), 2500),
        setTimeout(() => setDiagStep(4), 3500),
      ];
    }
    if (type === "generate_invoice") {
      if (item && item.unbilledPeriod) {
        const [start, end] = item.unbilledPeriod.split(" ~ ");
        setInvoiceStartDate(start);
        setInvoiceEndDate(end);
      } else {
        setInvoiceStartDate("");
        setInvoiceEndDate("");
      }
      setQueriedUsage(null);
      setDateError(null);
    }
    if (type === "edit_asset" && item) {
      setEditAssetForm({
        title: item.title,
        desc: item.desc || "",
        tags: "", // Tags mocked as empty for now
      });
    }
  };

  const closeModal = () => {
    setActiveModal("none");
    setSelectedItem(null);
    setSelectedVersion(null);
  };

  // --- Actions ---
  const handleCreateTicket = () => {
    if (!ticketForm.desc) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("工单已提交，技术人员将尽快与您联系。");
      closeModal();
    }, 1000);
  };

  const handleSellerRefundAudit = (approved: boolean) => {
    if (!selectedItem) return;
    if (!approved && !auditComment.trim()) {
      alert("拒绝申请必须填写审核意见，说明原因。");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setSellerRefunds((prev) => prev.filter((r) => r.id !== selectedItem.id));
      setIsLoading(false);
      showToast(
        approved
          ? `已同意退款，订单 ${selectedItem.orderId} 将自动执行退款。`
          : `已拒绝退款申请，订单 ${selectedItem.orderId} 状态已恢复。`,
      );
      closeModal();
    }, 1000);
  };

  const contactConsultant = () => {
    onNavigate("messages", { conversationId: "manager_james" });
  };

  const handleRenew = (order: any) => {
    // Navigate to Product Detail Page with purchase action
    onNavigate("detail", { id: order.resourceId, action: "purchase" });
  };

  const handleRepurchase = (order: any) => {
    openModal("payment", order);
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("确定要取消此订单吗？")) {
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)),
      );
      if (onUpdateOrder) {
        onUpdateOrder(orderId, { status: "Cancelled" });
      }
      showToast("订单已取消");
    }
  };

  const processSuccessfulPayment = (order: any) => {
    if (order.orderType === "New" || order.orderType === "Trial") {
      if (onAddResource) {
        onAddResource({
          id: `RES-${Date.now()}`,
          orderId: order.id,
          orderType: order.orderType,
          productName: order.productName,
          version: order.version,
          provider: order.provider,
          instanceName: order.instanceName || "默认实例",
          status: "PendingActivation",
          expireDate: order.expireDate,
          autoRenew: order.autoRenew,
          quota: { tokens: 500000, storage: 5 }, // Mock quota
          usage: { tokens: 0, storage: 0 },
        });
      }
    } else if (order.orderType === "Renewal") {
      if (onUpdateResource) {
        const existingResource = localResources.find(r => r.orderId === order.id);
        if (existingResource) {
          onUpdateResource(existingResource.id, {
            expireDate: order.expireDate,
            status: existingResource.status === "Expired" ? "Running" : existingResource.status
          });
        }
      }
    } else if (order.orderType === "ResourcePack") {
      if (onUpdateResource && order.targetOrderId) {
        const existingResource = localResources.find(r => r.orderId === order.targetOrderId);
        if (existingResource) {
          onUpdateResource(existingResource.id, {
            quota: {
              tokens: (existingResource.quota?.tokens || 0) + 100000, // Mock addition
              storage: (existingResource.quota?.storage || 0) + 10
            }
          });
        }
      }
    }
  };

  const handleSimulatePayment = (success: boolean) => {
    if (!selectedItem) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      if (!success) {
        // Offline payment selected
        setLocalOrders((prev) =>
          prev.map((o) =>
            o.id === selectedItem.id ? { ...o, paymentStatus: "PendingPayment", status: "PendingPayment", paymentMethod: "CorporateRemittance" } : o,
          ),
        );
        showToast("已选择线下支付，请及时上传付款回执");
      } else {
        // Online payment success
        const newStatus = "Paid";
        const updatedOrder = { ...selectedItem, paymentStatus: newStatus, status: newStatus, paymentMethod: "Alipay" };
        setLocalOrders((prev) =>
          prev.map((o) =>
            o.id === selectedItem.id ? updatedOrder : o,
          ),
        );
        processSuccessfulPayment(updatedOrder);
        setMonitoringData((prev) => {
          const existing = prev.find(m => m.orderId === selectedItem?.id);
          if (existing) {
            return prev.map(m => m.orderId === selectedItem?.id ? { ...m, status: "paid" } : m);
          } else {
            return [
              ...prev,
              {
                id: `MON-${Date.now()}`,
                buyer: "当前用户",
                asset: selectedItem?.productName || "未知产品",
                version: selectedItem?.version || "v1.0",
                instanceName: selectedItem?.instanceName || "默认实例",
                instanceId: `ins-${Date.now().toString().slice(-6)}`,
                orderId: selectedItem?.id || "",
                plan: selectedItem?.snapshot?.plan || "标准版",
                period: "当前周期",
                usage: { tokens: "0", storage: "0 GB" },
                unitPrice: "-",
                feeBreakdown: { tokens: 0, storage: 0 },
                estimatedCost: selectedItem?.amount || 0,
                status: "paid",
                unbilledPeriod: "-",
                billedPeriods: [],
              }
            ];
          }
        });
        showToast("支付已完成，等待系统核销");
      }
      
      closeModal();
    }, 1500);
  };

  const handleRefundRequest = () => {
    if (!refundReason) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("退款申请已提交，请等待审核");
      closeModal();
    }, 1500);
  };

  const handlePayBill = (bill: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, status: "paid" } : b)),
      );
      showToast("账单支付成功");
      closeModal();
    }, 1500);
  };

  const handleSubmitInvoiceRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setBills((prev) =>
        prev.map((b) =>
          b.id === selectedItem.id ? { ...b, invoiceStatus: "issued" } : b,
        ),
      );
      showToast("发票申请已提交，电子发票将在24小时内发送至您的邮箱");
      closeModal();
    }, 1500);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("确定要删除此订单记录吗？删除后不可恢复。")) {
      setLocalOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast("订单记录已删除");
    }
  };

  const handleSaveAssetInfo = () => {
    if (!selectedItem) return;
    // Mock save
    setIsLoading(true);
    setTimeout(() => {
      setSellerAssets((prev) =>
        prev.map((a) =>
          a.id === selectedItem.id
            ? { ...a, title: editAssetForm.title, desc: editAssetForm.desc }
            : a,
        ),
      );
      setIsLoading(false);
      showToast("资产信息已更新");
      closeModal();
    }, 1000);
  };

  const handleTakedownAsset = () => {
    if (!selectedItem) return;
    setIsLoading(true);
    setTimeout(() => {
      setSellerAssets((prev) =>
        prev.map((a) =>
          a.id === selectedItem.id ? { ...a, status: "takedown" } : a,
        ),
      );
      setIsLoading(false);
      showToast("资产已下架");
      closeModal();
    }, 1000);
  };

  const handleVersionAction = (action: "rollback" | "deprecate") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(
        action === "rollback" ? "已回滚至该版本" : "该版本已标记为弃用",
      );
      closeModal();
    }, 1000);
  };

  const handlePublishNewVersion = (asset: any) => {
    onNavigate("publish_wizard", { mode: "version", assetData: asset });
  };

  const handlePublishNewAsset = () => {
    onNavigate("publish_wizard", { mode: "create" });
  };

  // --- RENDERERS ---

  const renderOrderDetailModal = () => <OrderDetailModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} closeModal={closeModal} onNavigate={onNavigate} setActiveModal={setActiveModal} setPreviewImageUrl={setPreviewImageUrl} />;


  const renderBillDetailModal = () => <BillDetailModal selectedItem={selectedItem} closeModal={closeModal} openModal={openModal} />;


  const renderUnderDevelopmentModal = () => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-8 text-center">
          <div className="w-32 h-32 mb-6 text-gray-200 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-xl mb-2">功能开发中</h3>
          <p className="text-gray-500 text-sm mb-6">敬请期待</p>
          <button
            onClick={closeModal}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-md"
          >
            我知道了
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentApplicationModal = () => {
    if (!selectedItem) return null;
    const item = selectedItem;
    const isBill = "period" in item;
    const id = item.id;
    const amount = item.amount;
    const purpose = isBill
      ? `${item.period} 平台服务费及资源使用费`
      : `${item.productName} 购买费用`;
    const label = isBill ? "账单编号" : "订单编号";

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> 支付申请单预览
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
            <div
              className="bg-white p-10 shadow-sm border border-gray-200 mx-auto max-w-xl"
              style={{ minHeight: "600px" }}
            >
              <div className="text-center mb-8 border-b-2 border-gray-900 pb-4">
                <h1 className="text-2xl font-bold tracking-widest text-gray-900">
                  支付申请单
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  PAYMENT APPLICATION FORM
                </p>
              </div>

              <div className="flex justify-between text-sm mb-6">
                <div>
                  <span className="text-gray-500">申请日期：</span>{" "}
                  {new Date().toLocaleDateString()}
                </div>
                <div>
                  <span className="text-gray-500">{label}：</span> {id}
                </div>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 bg-gray-50 w-32 font-medium">
                      收款方名称
                    </td>
                    <td className="border border-gray-300 p-3 font-bold">
                      AI Studio 平台运营方
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      收款方账号
                    </td>
                    <td className="border border-gray-300 p-3 font-mono">
                      1234 5678 9012 3456
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      开户银行
                    </td>
                    <td className="border border-gray-300 p-3">
                      招商银行股份有限公司北京分行
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      支付金额
                    </td>
                    <td className="border border-gray-300 p-3">
                      <span className="font-bold text-lg">
                        ¥{" "}
                        {amount.toLocaleString("zh-CN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      款项用途
                    </td>
                    <td className="border border-gray-300 p-3">{purpose}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      备注说明
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-600">
                      请在汇款附言中注明{label}：{id}，以便财务及时核销。
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
                <div className="text-center w-32">
                  <div className="border-b border-gray-400 h-8 mb-2"></div>
                  <span className="text-sm text-gray-500">申请人签字</span>
                </div>
                <div className="text-center w-32">
                  <div className="border-b border-gray-400 h-8 mb-2"></div>
                  <span className="text-sm text-gray-500">部门主管审批</span>
                </div>
                <div className="text-center w-32">
                  <div className="border-b border-gray-400 h-8 mb-2"></div>
                  <span className="text-sm text-gray-500">财务审批</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
            >
              关闭
            </button>
            <button
              onClick={() => {
                showToast("正在生成 PDF...");
                setTimeout(() => showToast("PDF 下载完成"), 1500);
              }}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download size={16} /> 下载 PDF
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <FileText size={16} /> 打印单据
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRefundRequestModal = () => <RefundRequestModal selectedItem={selectedItem} closeModal={closeModal} />;

  const renderCreateTicketModal = () => <CreateTicketModal closeModal={closeModal} showToast={showToast} />;

  const renderInvoiceHeaderModal = () => {
    if (showInvoiceHeaderForm && editingInvoiceHeader) {
      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Settings size={18} className="text-blue-600" /> {editingInvoiceHeader.id ? '编辑发票抬头' : '新增发票抬头'}
              </h3>
              <button onClick={() => setShowInvoiceHeaderForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发票类型</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={editingInvoiceHeader.type === "enterprise"} onChange={() => setEditingInvoiceHeader({ ...editingInvoiceHeader, type: "enterprise" })} className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">增值税普通发票</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={editingInvoiceHeader.type === "special"} onChange={() => setEditingInvoiceHeader({ ...editingInvoiceHeader, type: "special" })} className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">增值税专用发票</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发票抬头 <span className="text-red-500">*</span></label>
                <input type="text" value={editingInvoiceHeader.title} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入企业全称" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">纳税人识别号 <span className="text-red-500">*</span></label>
                <input type="text" value={editingInvoiceHeader.taxId} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, taxId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入18位统一社会信用代码" />
              </div>
              {editingInvoiceHeader.type === "special" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">注册地址及电话 <span className="text-red-500">*</span></label>
                    <input type="text" value={editingInvoiceHeader.address || ''} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入注册地址及电话" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开户行及账号 <span className="text-red-500">*</span></label>
                    <input type="text" value={editingInvoiceHeader.bank || ''} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, bank: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入开户行及账号" />
                  </div>
                </>
              )}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingInvoiceHeader.isDefault} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, isDefault: e.target.checked })} className="text-blue-600 focus:ring-blue-500 rounded" />
                  <span className="text-sm font-medium text-gray-700">设为默认发票抬头</span>
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowInvoiceHeaderForm(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">取消</button>
              <button onClick={() => {
                if (!editingInvoiceHeader.title || !editingInvoiceHeader.taxId) {
                  showToast("请填写必填项");
                  return;
                }
                let newHeaders = [...invoiceHeaders];
                if (editingInvoiceHeader.isDefault) {
                  newHeaders = newHeaders.map(h => ({ ...h, isDefault: false }));
                }
                if (editingInvoiceHeader.id) {
                  setInvoiceHeaders(newHeaders.map(h => h.id === editingInvoiceHeader.id ? editingInvoiceHeader : h));
                  showToast("修改成功");
                } else {
                  setInvoiceHeaders([...newHeaders, { ...editingInvoiceHeader, id: `h${Date.now()}` }]);
                  showToast("新增成功");
                }
                setShowInvoiceHeaderForm(false);
              }} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">保存</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Settings size={18} className="text-blue-600" /> 发票抬头管理
            </h3>
            <button onClick={() => { closeModal(); setShowInvoiceHeaderForm(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {invoiceHeaders.map(header => (
              <div key={header.id} className="border border-gray-200 rounded-xl p-4 relative hover:border-blue-300 transition-colors">
                {header.isDefault && <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">默认</span>}
                <div className="font-bold text-gray-900 mb-2 pr-12">{header.title}</div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><span className="text-gray-400">税号：</span>{header.taxId}</div>
                  <div><span className="text-gray-400">类型：</span>{header.type === 'special' ? '增值税专用发票' : '增值税普通发票'}</div>
                  <div className="col-span-2"><span className="text-gray-400">开户行及账号：</span>{header.bank || '-'}</div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => { setEditingInvoiceHeader(header); setShowInvoiceHeaderForm(true); }} className="text-blue-600 text-sm font-medium hover:text-blue-800">编辑</button>
                  <button onClick={() => {
                    setInvoiceHeaders(prev => prev.filter(h => h.id !== header.id));
                    showToast("删除成功");
                  }} className="text-red-600 text-sm font-medium hover:text-red-800">删除</button>
                </div>
              </div>
            ))}
            <button onClick={() => {
              setEditingInvoiceHeader({ id: '', type: 'enterprise', title: '', taxId: '', address: '', bank: '', isDefault: false });
              setShowInvoiceHeaderForm(true);
            }} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> 新增发票抬头
            </button>
          </div>
        </div>
      </div>
    );
  };
  const handleSubmitReceipt = () => {
    if (!receiptForm.companyName || !receiptForm.bankAccount || !receiptForm.paymentAmount || !receiptForm.paymentDate || !receiptForm.transactionId) {
      showToast("请填写完整的付款信息和流水号");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("回执上传成功，等待审核");
      setLocalOrders((prev) =>
        prev.map((o) =>
          o.id === selectedItem?.id ? { ...o, paymentStatus: "UnderReview", status: "UnderReview" } : o
        )
      );
      setMonitoringData((prev) => {
        const existing = prev.find(m => m.orderId === selectedItem?.id);
        if (existing) {
          return prev.map(m => m.orderId === selectedItem?.id ? { ...m, status: "under_review" } : m);
        } else {
          // Create a mock monitoring entry for the seller to review
          return [
            ...prev,
            {
              id: `MON-${Date.now()}`,
              buyer: "当前用户",
              asset: selectedItem?.productName || "未知产品",
              version: selectedItem?.version || "v1.0",
              instanceName: selectedItem?.instanceName || "默认实例",
              instanceId: `ins-${Date.now().toString().slice(-6)}`,
              orderId: selectedItem?.id || "",
              plan: selectedItem?.snapshot?.plan || "标准版",
              period: "当前周期",
              usage: { tokens: "0", storage: "0 GB" },
              unitPrice: "-",
              feeBreakdown: { tokens: 0, storage: 0 },
              estimatedCost: selectedItem?.amount || 0,
              status: "under_review",
              unbilledPeriod: "-",
              billedPeriods: [],
            }
          ];
        }
      });
      closeModal();
    }, 1000);
  };

  const renderUploadReceiptModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Upload size={18} className="text-blue-600" /> 上传付款回执
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side: Bank Info */}
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Building size={16} /> 收款方信息
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-blue-600/70 mb-1">公司名称</div>
                    <div className="font-medium text-blue-900">上海维观科技有限公司</div>
                  </div>
                  <div>
                    <div className="text-blue-600/70 mb-1">开户银行</div>
                    <div className="font-medium text-blue-900">招商银行上海分行</div>
                  </div>
                  <div>
                    <div className="text-blue-600/70 mb-1">银行账号</div>
                    <div className="font-medium text-blue-900 font-mono">1234 5678 9012 3456</div>
                  </div>
                  <div>
                    <div className="text-blue-600/70 mb-1">应付金额</div>
                    <div className="font-bold text-blue-600 text-lg font-mono">¥{selectedItem.amount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Right side: Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款公司名称 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={receiptForm.companyName}
                      onChange={(e) => setReceiptForm({ ...receiptForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="请输入打款公司全称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款银行账号 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={receiptForm.bankAccount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, bankAccount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="请输入付款银行账号"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款金额 <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={receiptForm.paymentAmount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, paymentAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="请输入实际付款金额"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">付款日期 <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={receiptForm.paymentDate}
                      onChange={(e) => setReceiptForm({ ...receiptForm, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">银行流水号 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={receiptForm.transactionId}
                    onChange={(e) => setReceiptForm({ ...receiptForm, transactionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入银行转账流水号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <input
                    type="text"
                    value={receiptForm.remark}
                    onChange={(e) => setReceiptForm({ ...receiptForm, remark: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="选填，如有其他说明请填写"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">付款回执单 <span className="text-red-500">*</span></label>
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group block">
                    <input type="file" className="hidden" onChange={(e) => setReceiptForm({ ...receiptForm, file: e.target.files?.[0] || null })} />
                    <Upload className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" size={24} />
                    <div className="text-sm text-gray-600 group-hover:text-blue-600">
                      {receiptForm.file ? receiptForm.file.name : "点击上传或拖拽文件到此处"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">支持 JPG, PNG, PDF 格式，最大 5MB</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmitReceipt}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "提交审核"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleRequestInvoice = () => {
    if (!selectedHeaderId) {
      showToast("请选择发票抬头");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("发票申请已提交，预计1-3个工作日内开具");
      
      const newInvoice = {
        id: `INV-${Date.now()}`,
        relatedId: selectedItem?.period ? `${selectedItem.period} 账单` : `${selectedItem?.id} 订单`,
        amount: selectedItem?.amount || 0,
        type: "增值税电子普通发票",
        status: "Pending",
        date: new Date().toISOString().split('T')[0],
        title: invoiceHeaders.find(h => h.id === selectedHeaderId)?.title || "企业名称",
      };
      setInvoices(prev => [newInvoice, ...prev]);

      if (selectedItem?.period) {
        setBills((prev) =>
          prev.map((b) =>
            b.id === selectedItem?.id ? { ...b, invoiceStatus: "Pending" } : b
          )
        );
      } else {
        setLocalOrders((prev) =>
          prev.map((o) =>
            o.id === selectedItem?.id ? { ...o, invoiceStatus: "Pending" } : o
          )
        );
      }
      closeModal();
    }, 1000);
  };

  const renderRequestInvoiceModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> 申请发票
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">关联账单：</span>
                <span className="font-medium text-gray-900">{selectedItem.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">开票金额：</span>
                <span className="font-bold text-blue-600 font-mono">¥{selectedItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择发票抬头 <span className="text-red-500">*</span></label>
              <div className="space-y-3">
                {invoiceHeaders.map(header => (
                  <label key={header.id} className={`block border rounded-xl p-4 cursor-pointer transition-all ${selectedHeaderId === header.id ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <input type="radio" name="invoiceHeader" checked={selectedHeaderId === header.id} onChange={() => setSelectedHeaderId(header.id)} className="text-blue-600 focus:ring-blue-500" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{header.title}</div>
                        <div className="text-xs text-gray-500 mt-1">税号: {header.taxId} | {header.type === 'special' ? '专票' : '普票'}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={() => { closeModal(); setTimeout(() => openModal("invoice_header"), 300); }} className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"><Plus size={14} /> 新增抬头</button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">接收邮箱 <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={invoiceForm.email || "finance@example.com"}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="用于接收电子发票"
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleRequestInvoice}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "提交申请"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  const renderPayBillModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" /> 支付账单
            </h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">支付金额</div>
              <div className="text-3xl font-bold text-gray-900 font-mono">¥{selectedItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-gray-400 mt-1">账单编号: {selectedItem.id}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">选择支付方式</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPaymentMethod("online")} className={`p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "online" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  <Wallet size={24} className={paymentMethod === "online" ? "text-blue-600" : "text-gray-400"} />
                  企业网银 / 支付宝
                </button>
                <button onClick={() => setPaymentMethod("offline")} className={`p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "offline" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  <Building size={24} className={paymentMethod === "offline" ? "text-blue-600" : "text-gray-400"} />
                  对公银行汇款
                </button>
              </div>
            </div>

            {paymentMethod === "offline" && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-sm animate-in slide-in-from-top-2">
                 <div className="font-bold text-gray-900 mb-2">平台收款账户信息</div>
                 <div className="flex justify-between"><span className="text-gray-500">公司名称：</span><span className="font-medium">上海维观科技有限公司</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">开户银行：</span><span className="font-medium">招商银行上海分行</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">银行账号：</span><span className="font-medium font-mono">1234 5678 9012 3456</span></div>
                 <div className="mt-4 pt-4 border-t border-gray-200">
                   <label className="block text-sm font-medium text-gray-700 mb-2">上传付款凭证 (必填)</label>
                   <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                 </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">取消</button>
            <button onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setBills(prev => prev.map(b => b.id === selectedItem.id ? { ...b, status: paymentMethod === "online" ? "paid" : "under_review" } : b));
                showToast(paymentMethod === "online" ? "支付成功！" : "凭证已提交，等待财务审核");
                closeModal();
              }, 1500);
            }} disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "确认支付"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- NEW SELLER MODALS ---

  const renderSellerRefundAuditModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-orange-500" /> 退款审核处理
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">关联订单</span>
            <span className="text-xs text-gray-500">申请金额</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                {selectedItem?.orderId}
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded border border-blue-100">
                企业版订阅
              </span>
            </div>
            <span className="font-bold text-red-600 text-lg">
              ¥ {selectedItem?.amount}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block mb-1">买家账户</span>
              <span className="text-gray-800 font-medium">
                {selectedItem?.buyer}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">申请时间</span>
              <span className="text-gray-800 font-medium">
                {selectedItem?.date}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-blue-600" />
            <span className="text-sm font-bold text-gray-900">
              使用情况评估 (Usage Assessment)
            </span>
          </div>
          <div className="space-y-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">运行时长 (Runtime)</span>
                <span className="font-bold text-gray-900">
                  2天 / 30天 (6.7%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[6.7%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">API 调用量 (Token Usage)</span>
                <span className="font-bold text-gray-900">
                  1,240 / 10,000 (12.4%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[12.4%]"></div>
              </div>
            </div>
          </div>
          <div className="mt-2 bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-start gap-2">
            <AlertCircle
              size={14}
              className="text-orange-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-orange-700 leading-relaxed">
              提示：买家在使用期间产生过 3 次 4xx
              错误调用，可能遇到兼容性问题。建议参考买家描述。
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            买家申请理由
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
            {selectedItem?.reason}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            审核意见 (必填/Optional)
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-xl p-3 text-sm h-20 focus:border-blue-500 outline-none resize-none"
            placeholder="若是拒绝申请，请务必在此说明原因，以便买家理解..."
            value={auditComment}
            onChange={(e) => setAuditComment(e.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSellerRefundAudit(false)}
            className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            拒绝申请
          </button>
          <button
            onClick={() => handleSellerRefundAudit(true)}
            className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg"
          >
            同意退款
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditAssetModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <Edit3 size={20} className="text-blue-600" /> 编辑资产信息
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              资产名称 (Title)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              value={editAssetForm.title}
              onChange={(e) =>
                setEditAssetForm({ ...editAssetForm, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              分类 (Category)
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            >
              <option>
                {selectedItem?.category === "method"
                  ? "方法智能体"
                  : "分析智能体"}
              </option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">
              分类一旦创建不可修改，如需变更请重新发布。
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              简介 (Description)
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 focus:border-blue-500 outline-none resize-none"
              value={editAssetForm.desc}
              onChange={(e) =>
                setEditAssetForm({ ...editAssetForm, desc: e.target.value })
              }
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              标签 (Tags)
            </label>
            <input
              type="text"
              placeholder="输入标签，用逗号分隔..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              value={editAssetForm.tags}
              onChange={(e) =>
                setEditAssetForm({ ...editAssetForm, tags: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSaveAssetInfo}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "保存修改"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderManageVersionModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Settings size={20} className="text-gray-500" /> 版本管理:{" "}
            {selectedVersion?.ver}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Asset ID: {selectedItem?.id} · Published: {selectedVersion?.date}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Status Card */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedVersion?.status === "active" || selectedVersion?.status === "stable" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}
              >
                <Activity size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">
                  当前状态:{" "}
                  {selectedVersion?.status === "active" || selectedVersion?.status === "stable"
                    ? "正常 (Normal)"
                    : "弃用 (Deprecated)"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {selectedVersion?.status === "active" || selectedVersion?.status === "stable" ? (
                <button
                  onClick={() => handleVersionAction("deprecate")}
                  className="text-xs border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50 font-bold"
                >
                  弃用版本
                </button>
              ) : (
                <button
                  onClick={() => handleVersionAction("rollback")}
                  className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-bold"
                >
                  回滚至此
                </button>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">当前获取量 (Current Installs)</div>
              <div className="font-bold text-xl text-gray-900">
                {selectedVersion?.installs}
              </div>
            </div>
          </div>

          {/* Log Terminal */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Terminal size={16} /> 版本日志 (Change Log)
            </h4>
            <div className="bg-gray-900 text-gray-300 p-4 rounded-xl font-mono text-xs leading-relaxed">
              <p className="text-gray-500">
                # {selectedVersion?.date} by Developer
              </p>
              <p>&gt; {selectedVersion?.log}</p>
              <p className="mt-2 text-gray-500"># System Check</p>
              <p>&gt; Integrity: OK</p>
              <p>&gt; Security Scan: Passed</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpgradeModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> 升级至付费版
          </h3>
          <button onClick={closeModal}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 text-sm mb-1">
              无缝升级说明
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              升级后，您的实例 ID、API Key
              及所有历史数据将完整保留。无需重新部署或迁移数据。
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all ring-2 ring-transparent hover:ring-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900">
                  企业版订阅
                </span>
                <span className="text-blue-600 font-bold">¥5,800 / 月</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> 100,000
                  Tokens/月
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> 500GB
                  向量存储
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> 20
                  用户并发
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all ring-2 ring-transparent hover:ring-blue-100 opacity-60">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900">
                  私有化部署 (永久授权)
                </span>
                <span className="text-gray-900 font-bold">¥128,000</span>
              </div>
              <div className="text-xs text-gray-400">
                需联系销售顾问进行部署评估
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onUpgrade && selectedItem) {
                setIsLoading(true);
                setTimeout(() => {
                  onUpgrade(selectedItem.id, {
                    planName: "企业版订阅",
                    period: "Monthly",
                    amount: 5800,
                    quota: { tokens: 100000, storage: 500, users: 20 },
                  });
                  setIsLoading(false);
                  showToast("升级成功！实例已自动切换至企业版配置。");
                  closeModal();
                }, 1500);
              }
            }}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "确认升级并支付 ¥5,800"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfirmPaymentModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              确认收款
            </h3>
            <button
              onClick={() => setActiveModal("none")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              请确认您已通过线下对公账户收到来自 <span className="font-bold text-gray-900">{selectedItem.buyer || "买家"}</span> 的款项 <span className="font-bold text-indigo-600 font-mono">¥ {selectedItem.amount.toFixed(2)}</span>。
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>确认后，该账单将标记为“已支付”，代表您已完成该笔款项的线下核销。此操作不可逆。</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">收款公司名称 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={receiptForm.companyName}
                    onChange={(e) => setReceiptForm({ ...receiptForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="请输入收款公司全称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={receiptForm.phone}
                    onChange={(e) => setReceiptForm({ ...receiptForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="请输入联系电话"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收款银行流水号 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={receiptForm.transactionId}
                  onChange={(e) => setReceiptForm({ ...receiptForm, transactionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="请输入银行收款流水号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收款凭证单 <span className="text-red-500">*</span></label>
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer group block">
                  <input type="file" className="hidden" onChange={(e) => setReceiptForm({ ...receiptForm, file: e.target.files?.[0] || null })} />
                  <Upload className="mx-auto text-gray-400 group-hover:text-green-500 mb-2" size={20} />
                  <div className="text-sm text-gray-600 group-hover:text-green-600">
                    {receiptForm.file ? receiptForm.file.name : "点击上传收款凭证"}
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">驳回原因 (仅驳回时需要)</label>
                <input
                  type="text"
                  value={receiptForm.rejectReason || ""}
                  onChange={(e) => setReceiptForm({ ...receiptForm, rejectReason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="如果驳回，请填写驳回原因"
                />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={() => setActiveModal("none")}
              className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                if (!receiptForm.rejectReason) {
                  showToast("请填写驳回原因");
                  return;
                }
                showToast("已驳回付款申请");
                setMonitoringData((prev) =>
                  prev.map((item) =>
                    (item.id === selectedItem.id || item.orderId === selectedItem.id) ? { ...item, status: "rejected" } : item
                  )
                );
                setLocalOrders((prev) =>
                  prev.map((o) =>
                    o.id === (selectedItem.orderId || selectedItem.id) ? { ...o, paymentStatus: "Rejected", status: "Rejected", rejectReason: receiptForm.rejectReason } : o
                  )
                );
                setActiveModal("none");
              }}
              className="px-5 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors shadow-sm border border-red-200"
            >
              驳回申请
            </button>
            <button
              onClick={() => {
                if (!receiptForm.companyName || !receiptForm.phone || !receiptForm.transactionId) {
                  showToast("请填写完整的公司信息和流水号");
                  return;
                }
                showToast("收款已确认，状态已更新");
                setMonitoringData((prev) =>
                  prev.map((item) =>
                    (item.id === selectedItem.id || item.orderId === selectedItem.id) ? { ...item, status: "paid" } : item
                  )
                );
                let updatedOrderToProcess = null;
                setLocalOrders((prev) => {
                  const newOrders = prev.map((o) => {
                    if (o.id === (selectedItem.orderId || selectedItem.id)) { // Use selectedItem.orderId or id since it maps to localOrders now
                      // Extend expire date by 30 days for mock
                      const currentExpire = new Date(o.expireDate || new Date());
                      currentExpire.setDate(currentExpire.getDate() + 30);
                      
                      // Add to history
                      const newHistory = [...(o.history || [])];
                      newHistory.push({
                        date: new Date().toLocaleString(),
                        event: "线下付款已确认，服务已顺延",
                      });

                      const updatedOrder = {
                        ...o,
                        status: "Paid", // Set status to Paid
                        paymentStatus: "Paid", // Also update paymentStatus
                        expireDate: currentExpire.toISOString().split("T")[0],
                        history: newHistory,
                        payTime: new Date().toLocaleString(),
                        paymentMethod: "CorporateRemittance",
                      };
                      updatedOrderToProcess = updatedOrder;
                      return updatedOrder;
                    }
                    return o;
                  });
                  return newOrders;
                });
                if (updatedOrderToProcess) {
                  processSuccessfulPayment(updatedOrderToProcess);
                }
                setActiveModal("none");
              }}
              className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
            >
              确认已收款
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderIssueInvoiceModal = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-orange-600" /> 开具发票
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">关联订单：</span>
                <span className="font-medium text-gray-900">{selectedItem.id}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">开票金额：</span>
                <span className="font-bold text-orange-600 font-mono text-lg">¥{selectedItem.amount?.toLocaleString() || "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">买方名称：</span>
                <span className="font-medium text-gray-900">{selectedItem.provider || "某企业客户"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">纳税人识别号：</span>
                <span className="font-medium text-gray-900 font-mono">91310000XXXXXXXXXX</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发票号码 <span className="text-red-500">*</span></label>
                <input type="text" placeholder="请输入发票号码" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发票代码</label>
                <input type="text" placeholder="请输入发票代码（选填）" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电子发票文件 <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-orange-300 transition-colors cursor-pointer">
                  <Upload size={24} className="mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">点击或拖拽上传发票文件</p>
                  <p className="text-xs text-gray-400 mt-1">支持 PDF, JPG, PNG 格式，最大 5MB</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  showToast("发票已开具并发送至买家邮箱");
                  setLocalOrders((prev) =>
                    prev.map((o) =>
                      o.id === selectedItem.id ? { ...o, invoiceStatus: "Issued" } : o
                    )
                  );
                  closeModal();
                }, 1500);
              }}
              disabled={isLoading}
              className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "确认开票"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGenerateInvoiceModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-indigo-600" />
              生成请款单
            </h3>
            <button
              onClick={() => setActiveModal("none")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
              <div className="text-sm text-indigo-600 font-medium mb-1">
                用户名
              </div>
              <div className="text-lg font-bold text-gray-900">
                {selectedItem.buyer}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">待结算账期</h4>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">系统自动带出</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={invoiceStartDate}
                  disabled
                  className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                />
                <span className="text-gray-400">至</span>
                <input
                  type="date"
                  value={invoiceEndDate}
                  disabled
                  className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                />
              </div>
              {dateError && (
                <div className="text-xs text-red-500">{dateError}</div>
              )}
              {selectedItem.billedPeriods?.length > 0 && (
                <div className="text-xs text-gray-500">
                  <span className="text-red-500">*</span> 以下周期已生成请款单，不可重复选择：
                  <ul className="list-disc pl-4 mt-1">
                    {selectedItem.billedPeriods.map((bp: string, i: number) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                账单明细
                {isQueryingUsage && (
                  <span className="text-xs text-indigo-600 font-normal flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" /> 计算中...
                  </span>
                )}
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 text-sm relative">
                {isQueryingUsage && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl z-10" />
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">订阅资产</span>
                  <span className="font-medium text-gray-900">
                    {selectedItem.asset} ({selectedItem.version})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">订单编号</span>
                  <span className="font-mono text-gray-900">
                    {selectedItem.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">计费模式</span>
                  <span className="font-medium text-gray-900">
                    {selectedItem.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">单价</span>
                  <span className="font-medium text-gray-900">
                    {selectedItem.unitPrice}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-500">Token消耗</span>
                  <span className="font-mono text-gray-900">
                    {selectedItem.usage.tokens}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">存储占用</span>
                  <span className="font-mono text-gray-900">
                    {selectedItem.usage.storage}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-500">Token费用</span>
                  <span className="font-mono text-gray-900">
                    ¥ {selectedItem.feeBreakdown.tokens.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">存储费用</span>
                  <span className="font-mono text-gray-900">
                    ¥ {selectedItem.feeBreakdown.storage.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">费用合计</span>
                  <span className="text-xl font-bold text-indigo-600 font-mono">
                    ¥ {selectedItem.estimatedCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-xs flex gap-2 items-start">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p>
                请在提交订单后，下载《支付申请单》并进行对公转账，支付成功后请上传付款回执凭证。款项确认到账后请前往已购资源激活智能体。
              </p>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={() => setActiveModal("none")}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setActiveModal("none");
                  showToast("请款单生成成功，已通知客户");
                  setMonitoringData((prev) =>
                    prev.map((item) => {
                      if (item.id === selectedItem.id) {
                        return {
                          ...item,
                          status: "under_review",
                          billedPeriods: [
                            ...(item.billedPeriods || []),
                            `${invoiceStartDate} ~ ${invoiceEndDate}`,
                          ],
                        };
                      }
                      return item;
                    })
                  );
                  setLocalOrders((prev) =>
                    prev.map((o) =>
                      o.id === selectedItem.orderId ? { ...o, paymentStatus: "PendingPayment", status: "PendingPayment", paymentMethod: "CorporateRemittance" } : o
                    )
                  );
                }, 1500);
              }}
              disabled={isLoading || isQueryingUsage || !!dateError || !invoiceStartDate || !invoiceEndDate}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download size={18} />
                  生成并下载请款单
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
            <Wallet size={20} className="text-blue-600" /> 支付收银台
          </h3>
          <div className="mb-6 text-center">
            <div className="text-sm text-gray-500 mb-1">支付金额</div>
            <div className="text-3xl font-bold font-mono text-gray-900">
              ¥{selectedItem.amount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              订单号: {selectedItem.id}
            </div>
          </div>
          
          <div className="space-y-4">
            <div 
              onClick={() => handleSimulatePayment(true)}
              className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Scan size={18} />
                  </div>
                  微信/支付宝扫码直付
                </div>
              </div>
              <p className="text-xs text-gray-500 pl-10">资金将直接结算至卖家/平台商户号，不经过平台余额。</p>
            </div>

            <div 
              onClick={() => handleSimulatePayment(false)}
              className="border border-gray-200 rounded-xl p-4 hover:border-indigo-500 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Building size={18} />
                  </div>
                  线下对公转账
                </div>
              </div>
              <p className="text-xs text-gray-500 pl-10">请在提交订单后，下载《支付申请单》并进行对公转账，支付成功后请上传付款回执凭证。款项确认到账后请前往已购资源激活智能体。</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={closeModal}
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              稍后支付
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmTakedownModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">确认下架资产？</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          下架后，该资产将不再在市场中公开展示，新用户无法搜索或购买。已有用户的服务不受影响。
          <br />
          <span className="text-xs text-red-400 mt-2 block">
            (操作不可逆，需重新审核上架)
          </span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleTakedownAsset}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "确认下架"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // --- BUYER DASHBOARD RENDERERS (Fully Implemented) ---

  const renderBuyerDashboard = () => {
    const chartMax =
      Math.max(...RESOURCE_TREND_DATA.map((d) => d.token + d.storage)) * 1.1;

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              本月已付款 (PAID)
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {BUYER_STATS.spend}
            </div>
            <div className="text-xs text-red-500 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> {BUYER_STATS.spendTrend}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold mb-2">活跃实例</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {BUYER_STATS.activeInstances}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold mb-2">待支付</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {BUYER_STATS.unpaid}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold mb-2">工单</div>
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {BUYER_STATS.tickets}
            </div>
          </div>
        </div>

        {/* Resource Overview Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">
              资源概览 (Resource Overview)
            </h3>
          </div>

          {/* Chart Container */}
          <div className="h-48 flex items-end justify-between gap-2 px-4 pb-2 border-b border-gray-100 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="border-t border-dashed border-gray-100 w-full h-0 last:border-0"
                ></div>
              ))}
            </div>

            {RESOURCE_TREND_DATA.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end group h-full relative z-10"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg z-20 transition-all">
                  <div className="font-bold mb-0.5">Day {i + 1}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Token: {d.token}k
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-200 rounded-full"></div>
                    Storage: {d.storage}GB
                  </div>
                </div>

                <div
                  className="w-full bg-[#fcd3a4] rounded-t-sm hover:brightness-95 transition-all relative z-0"
                  style={{ height: `${(d.storage / chartMax) * 100}%` }}
                ></div>
                <div
                  className="w-full bg-[#3b82f6] rounded-t-sm hover:brightness-110 transition-all relative z-10 -mt-0.5 pt-0.5"
                  style={{ height: `${(d.token / chartMax) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div>
              <span>Token 消耗</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#fcd3a4] rounded-sm"></div>
              <span>存储占用</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBuyerOrders = () => (
    <div className="space-y-4 animate-in fade-in">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {ORDER_STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setOrderStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {getOrderStatusLabel(status)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="搜索订单号或产品..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Orders List */}
      <div
        ref={orderListRef}
        onScroll={virtualOrders.onScroll}
        style={virtualOrderContainerStyle}
        className="space-y-4 overflow-y-auto pr-1"
      >
        {virtualOrders.topSpacerHeight > 0 && (
          <div style={{ height: virtualOrders.topSpacerHeight }} />
        )}
        {virtualOrders.visibleItems.map((order) => (
          <div
            key={order.id}
            style={{ height: 260 }}
            className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
          >
              {/* Order Header: ID, Time, Status */}
              <div className="bg-gray-50/50 px-4 py-2.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-gray-600">
                    订单号: {order.id}
                  </span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>{order.createTime}</span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>
                    支付方式: {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                </div>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>

              <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Left: Product Info (Full Name) */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 mt-1 bg-white text-blue-600`}
                  >
                    <Box size={24} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 leading-tight mb-1">
                        {order.productName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                          {order.version}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">
                          {order.orderType === "Trial" ? "试用订单" : order.orderType === "Renewal" ? "续费订单" : order.orderType === "ResourcePack" ? "扩展资源包订单" : "新购订单"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4 lg:gap-6 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-left sm:text-right lg:text-right min-w-[100px]">
                    <div className="font-bold text-gray-900 text-lg font-mono">
                      ¥ {order.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {order.orderType === "ResourcePack"
                        ? "一次性支付"
                        : "实付金额"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                      {order.paymentStatus === "PendingPayment" && order.paymentMethod === "CorporateRemittance" && (
                        <button
                          onClick={() => openModal("upload_receipt", order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                        >
                          <Upload size={12} />
                          上传付款回执
                        </button>
                      )}
                      {order.paymentStatus === "PendingPayment" && order.paymentMethod !== "CorporateRemittance" && (
                        <button
                          onClick={() => openModal("payment_application", order)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                        >
                          <Download size={12} />
                          去支付
                        </button>
                      )}
                      {order.paymentStatus === "PaymentFailed" && (
                        <button
                          onClick={() =>
                            onNavigate("detail", {
                              id: order.resourceId,
                              action: "purchase",
                            })
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                        >
                          <Repeat size={12} />
                          重新支付
                        </button>
                      )}
                      {order.paymentStatus === "UnderReview" && (
                        <button
                          onClick={() => openModal("upload_receipt", order)}
                          className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
                        >
                          重新上传回执
                        </button>
                      )}
                      {order.paymentStatus === "Rejected" && (
                        <button
                          onClick={() => openModal("upload_receipt", order)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
                        >
                          重新上传回执
                        </button>
                      )}
                      {order.paymentStatus === "Paid" &&
                        (order.orderType === "Trial" || order.orderType === "New" || order.orderType === "Renewal") && (
                          <button
                            onClick={() =>
                              onNavigate("detail", {
                                id: order.resourceId,
                                action: "purchase",
                                upgrade_instance_id: order.id,
                              })
                            }
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 whitespace-nowrap"
                          >
                            续费
                          </button>
                        )}
                      {order.paymentStatus === "Paid" &&
                        order.orderType !== "ResourcePack" && order.orderType !== "Trial" && (
                          <button
                            onClick={() =>
                              onNavigate("resource_packs", {
                                id: order.resourceId,
                                action: "purchase",
                              })
                            }
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 whitespace-nowrap"
                          >
                            补充资源包
                          </button>
                        )}
                      {order.invoiceStatus === "Unissued" && order.paymentStatus === "Paid" && order.amount > 0 && (
                        <button
                          onClick={() => openModal("request_invoice", order)}
                          className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                        >
                          <FileText size={12} />
                          申请发票
                        </button>
                      )}
                      {order.invoiceStatus === "Pending" && (
                        <div className="px-3 py-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1">
                          <Clock size={12} />
                          开票中
                        </div>
                      )}
                      {order.invoiceStatus === "Issued" && (
                        <div className="px-3 py-2 bg-green-50 text-green-600 border border-green-100 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1">
                          <CheckCircle size={12} />
                          已开票
                        </div>
                      )}
                      <button
                        onClick={() => openModal("order_detail", order)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap"
                      >
                        详情
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除记录"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* Status Banners */}
                    {order.status === "Pending" && order.paymentMethod === "CorporateRemittance" && (
                      <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100 flex items-center gap-1 justify-end">
                        <AlertCircle size={12} /> 如已线下付款，请及时上传付款回执
                      </div>
                    )}
                    {order.status === "UnderReview" && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 flex items-center gap-1 justify-end">
                        <Clock size={12} /> 付款回执审核中，请耐心等待
                      </div>
                    )}
                    {order.status === "Rejected" && (
                      <div className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 flex items-center gap-1 justify-end">
                        <AlertTriangle size={12} /> 驳回原因：{order.rejectReason || "回执信息有误"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </div>
        ))}
        {virtualOrders.bottomSpacerHeight > 0 && (
          <div style={{ height: virtualOrders.bottomSpacerHeight }} />
        )}
        {filteredOrders.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 font-bold">暂无相关订单</div>
          </div>
        )}
        {filteredOrders.length > 0 && virtualOrders.loadedCount < filteredOrders.length && (
          <div className="text-center text-xs text-gray-400 py-2">
            已加载 {virtualOrders.loadedCount}/{filteredOrders.length}，继续滚动加载下一页
          </div>
        )}
      </div>
    </div>
  );

  const renderExportStatementModal = () => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Download size={18} className="text-blue-600" /> 导出综合月度对账单
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              综合对账单包含您在选定月份内的<strong>所有消费记录</strong>，包括：
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>预付费订单（包年/包月订阅、资源包购买等）</li>
                <li>后付费账单（按量计费的资源消耗）</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择账单月份</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                {Array.from(new Set(bills.map(b => b.period))).map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="exportFormat" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Excel (.xlsx)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="exportFormat" className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">CSV (.csv)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="exportFormat" className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">PDF (.pdf)</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  showToast("综合对账单导出成功");
                  closeModal();
                }, 1500);
              }}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "确认导出"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBuyerBills = () => (
    <div className="space-y-4 animate-in fade-in">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" /> 账单管理 (Bills)
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("export_statement")}
            className="text-gray-600 text-sm font-medium hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <Download size={14} /> 导出综合月度对账单
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">账期 (Period)</th>
              <th className="px-6 py-4 font-medium">出账日期</th>
              <th className="px-6 py-4 font-medium">账单金额</th>
              <th className="px-6 py-4 font-medium">包含订单数</th>
              <th className="px-6 py-4 font-medium">状态</th>
              <th className="px-6 py-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bills.map((bill) => (
              <tr
                key={bill.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4 font-bold text-gray-900">
                  {bill.period}
                </td>
                <td className="px-6 py-4 text-gray-600">{bill.date}</td>
                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                  ¥
                  {bill.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-gray-600">{bill.count}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${bill.status === "paid" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {bill.status === "paid" ? "已结清" : "待支付"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-4">
                    <button
                      onClick={() => openModal("bill_detail", bill)}
                      className="text-blue-600 font-bold hover:text-blue-800 transition-colors text-xs"
                    >
                      账单明细
                    </button>
                    {bill.status === "unpaid" ? (
                      <>
                        <button
                          onClick={() => openModal("pay_bill", bill)}
                          className="text-red-600 font-bold hover:text-red-700 text-xs"
                        >
                          去支付
                        </button>
                        <button
                          onClick={() => openModal("payment_application", bill)}
                          className="text-orange-600 font-bold hover:text-orange-700 text-xs flex items-center gap-1"
                        >
                          <Download size={12} /> 支付申请单
                        </button>
                      </>
                    ) : (
                      <>
                        {bill.invoiceStatus === "unissued" && (
                          <button
                            onClick={() => openModal("request_invoice", bill)}
                            className="text-blue-600 font-bold hover:text-blue-800 text-xs transition-colors"
                          >
                            申请发票
                          </button>
                        )}
                        {bill.invoiceStatus === "Pending" && (
                          <span className="text-orange-500 font-bold text-xs">开票中</span>
                        )}
                        {bill.invoiceStatus === "issued" && (
                          <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle size={12} /> 已开票
                          </span>
                        )}
                        <button
                          onClick={() => {
                            showToast("正在下载账单明细...");
                            setTimeout(() => showToast("账单下载成功 (PDF)"), 1500);
                          }}
                          className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs transition-colors"
                        >
                          <Download size={12} /> 下载账单
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBuyerInvoices = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Receipt size={20} className="text-blue-600" /> 发票管理 (Invoices)
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("invoice_header")}
            className="text-gray-600 text-sm font-medium hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <Settings size={14} /> 发票抬头管理
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setInvoiceSubTab("invoiceable")}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
            invoiceSubTab === "invoiceable"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FilePlus size={18} /> 可开票账单
        </button>
        <button
          onClick={() => setInvoiceSubTab("history")}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
            invoiceSubTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History size={18} /> 开票记录
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {invoiceSubTab === "invoiceable" ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">关联账单</th>
                <th className="px-6 py-4 font-medium">可开票金额</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bills.filter(b => b.status === "paid" && b.invoiceStatus === "unissued").map((bill) => (
                <tr
                  key={bill.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {bill.period} 账单
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    ¥
                    {bill.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-xs">未开票</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openModal("request_invoice", bill)}
                      className="text-blue-600 font-bold hover:text-blue-700 text-xs"
                    >
                      申请发票
                    </button>
                  </td>
                </tr>
              ))}
              {localOrders.filter(o => o.paymentStatus === "Paid" && o.invoiceStatus === "Unissued" && o.amount > 0).map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {order.id} 订单
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    ¥
                    {order.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-xs">未开票</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openModal("request_invoice", order)}
                      className="text-blue-600 font-bold hover:text-blue-700 text-xs"
                    >
                      申请发票
                    </button>
                  </td>
                </tr>
              ))}
              {bills.filter(b => b.status === "paid" && b.invoiceStatus === "unissued").length === 0 && localOrders.filter(o => o.paymentStatus === "Paid" && o.invoiceStatus === "Unissued" && o.amount > 0).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    暂无可开票账单/订单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">发票编号</th>
                <th className="px-6 py-4 font-medium">关联账单</th>
                <th className="px-6 py-4 font-medium">发票金额</th>
                <th className="px-6 py-4 font-medium">发票类型</th>
                <th className="px-6 py-4 font-medium">申请日期</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {invoice.relatedId}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    ¥
                    {invoice.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.type}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4">
                    {invoice.status === "issued" || invoice.status === "Issued" ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckCircle size={12} /> 已开票
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
                        <Clock size={12} /> 开票中
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-4">
                      {invoice.status === "issued" || invoice.status === "Issued" ? (
                        <button
                          onClick={() =>
                            window.open("/invoice-preview.pdf", "_blank")
                          }
                          className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 text-xs transition-colors"
                        >
                          <ExternalLink size={12} /> 预览发票
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderBuyerResources = () => {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Sub Tabs */}
        <div className="flex gap-8 border-b border-gray-200">
          <button
            onClick={() => setResourceSubTab("purchased")}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
              resourceSubTab === "purchased"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Box size={18} /> 已购资源 (Purchased)
          </button>
          <button
            onClick={() => setResourceSubTab("favorites")}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all ${
              resourceSubTab === "favorites"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Heart size={18} /> 我的收藏 (Favorites)
          </button>
        </div>

        {/* Content */}
        {resourceSubTab === "purchased" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localResources
              .filter((r) => r.status !== "Expired")
              .map((resource) => {
                const totalTokens = resource.quota?.tokens || 10000;
                const usedTokens = resource.usage?.tokens || 0;
                const usagePercent = Math.floor(
                  (usedTokens / totalTokens) * 100,
                );

                const totalStorage = resource.quota?.storage || 50;
                const usedStorage = resource.usage?.storage || 0;
                const storageUsagePercent = Math.floor(
                  (usedStorage / totalStorage) * 100,
                );

                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Box size={24} />
                      </div>
                      <StatusBadge
                        status={resource.status}
                        expireDate={resource.expireDate}
                      />
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                        {resource.productName}
                      </h3>
                      {editingInstanceId === resource.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingInstanceName}
                            onChange={(e) => setEditingInstanceName(e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (onUpdateResource && editingInstanceName.trim()) {
                                onUpdateResource(resource.id, { instanceName: editingInstanceName.trim() });
                              }
                              setEditingInstanceId(null);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingInstanceId(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <p className="text-xs text-gray-500">
                            {resource.instanceName !== "-" ? resource.instanceName : "未分配实例"}
                          </p>
                          {resource.status !== "PendingActivation" && (
                            <button
                              onClick={() => {
                                setEditingInstanceId(resource.id);
                                setEditingInstanceName(resource.instanceName !== "-" ? resource.instanceName : "");
                              }}
                              className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit3 size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="space-y-4 mb-6 flex-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>有效至</span>
                        <span className="font-medium text-gray-900">
                          {resource.expireDate}
                        </span>
                      </div>

                      {resource.status !== "PendingActivation" && (
                        <>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">
                                Token 用量 ({(usedTokens / 1000).toFixed(1)}k /{" "}
                                {(totalTokens / 1000).toFixed(1)}k)
                              </span>
                              <span className="font-bold text-gray-900">
                                {usagePercent}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`${usagePercent > 80 ? "bg-red-500" : "bg-blue-600"} h-full rounded-full`}
                                style={{ width: `${usagePercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="border-t border-gray-50 pt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 flex items-center gap-1">
                                <Database size={12} /> 存储空间 ({usedStorage}GB /{" "}
                                {totalStorage}GB)
                              </span>
                              <span className="font-bold text-gray-900">
                                {storageUsagePercent}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`${storageUsagePercent > 80 ? "bg-red-500" : "bg-purple-600"} h-full rounded-full`}
                                style={{ width: `${storageUsagePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      {resource.status === "PendingActivation" ? (
                        activatingInstanceId === resource.id ? (
                          <div className="col-span-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={activatingInstanceName}
                              onChange={(e) => setActivatingInstanceName(e.target.value)}
                              placeholder="输入实例名称"
                              className="text-xs border border-gray-300 rounded px-2 py-2 w-full focus:outline-none focus:border-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (onUpdateResource && activatingInstanceName.trim()) {
                                  onUpdateResource(resource.id, {
                                    status: resource.orderType === "Trial" ? "Trial" : "Running",
                                    instanceName: activatingInstanceName.trim(),
                                  });
                                }
                                setActivatingInstanceId(null);
                              }}
                              className="flex items-center justify-center py-2 px-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                            >
                              确认
                            </button>
                            <button
                              onClick={() => setActivatingInstanceId(null)}
                              className="flex items-center justify-center py-2 px-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setActivatingInstanceId(resource.id);
                              setActivatingInstanceName("");
                            }}
                            className="col-span-2 flex items-center justify-center gap-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                          >
                            <Zap size={14} /> 激活
                          </button>
                        )
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              onNavigate("detail", {
                                id: resource.id,
                                instance_name: resource.instanceName,
                                instance_status: resource.status,
                              })
                            }
                            className="col-span-2 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <ExternalLink size={14} /> 进入维观AI平台
                          </button>
                          <button
                            onClick={() =>
                              onNavigate("detail", {
                                id: resource.id,
                                instance_name: resource.instanceName,
                                action: "purchase",
                              })
                            }
                            className="flex items-center justify-center gap-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                          >
                            续费
                          </button>
                          <button
                            onClick={() =>
                              onNavigate("resource_packs", {
                                id: resource.id,
                                action: "purchase",
                              })
                            }
                            className="flex items-center justify-center gap-1 border border-blue-200 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
                          >
                            补充资源包
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            {/* Add "New" Card */}
            <div
              onClick={() => onNavigate("discovery")}
              className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500 transition-all cursor-pointer min-h-[300px]"
            >
              <PlusCircle size={40} className="mb-2 opacity-50" />
              <span className="font-bold text-sm">订阅新服务</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Heart size={48} className="mb-4 text-gray-200" />
            <p className="text-sm">暂无收藏的资产</p>
            <button
              onClick={() => onNavigate("discovery")}
              className="mt-4 text-blue-600 text-sm font-bold hover:underline"
            >
              去市场看看
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderBuyerAnalysis = () => {
    // Chart Mock Data Calculation
    const chartData = [
      { month: "1月", sub: 9800, pack: 0, usage: 200, total: 10000 },
      { month: "2月", sub: 9800, pack: 0, usage: 300, total: 10100 },
      { month: "3月", sub: 9800, pack: 2000, usage: 400, total: 12200 },
      { month: "4月", sub: 5800, pack: 2000, usage: 650, total: 8450 },
      { month: "5月", sub: 5800, pack: 2000, usage: 300, total: 8100 },
      { month: "6月", sub: 5800, pack: 1000, usage: 500, total: 7300 },
    ];
    const maxTotal = Math.max(...chartData.map((d) => d.total)) * 1.1;

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Cost Analysis Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-purple-600" />
            <h3 className="font-bold text-gray-900">
              成本与用量分析 (Cost Analysis)
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chart Area */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-gray-800">
                  月度支出趋势
                </h4>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    订阅费
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    资源包
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    按量付费
                  </div>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between gap-3 relative border-b border-gray-100 pb-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="border-t border-dashed border-gray-100 w-full h-0"
                    ></div>
                  ))}
                </div>
                {chartData.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end h-full gap-0.5 relative group cursor-pointer"
                  >
                    <div
                      className="w-full bg-orange-400 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${(d.usage / maxTotal) * 100}%` }}
                    ></div>
                    <div
                      className="w-full bg-purple-400 rounded-sm opacity-90 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${(d.pack / maxTotal) * 100}%` }}
                    ></div>
                    <div
                      className="w-full bg-blue-500 rounded-b-sm opacity-90 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${(d.sub / maxTotal) * 100}%` }}
                    ></div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg z-10 whitespace-nowrap">
                      <div className="font-bold mb-1">
                        {d.month} 总计: ¥{d.total}
                      </div>
                      <div>订阅: {d.sub}</div>
                      <div>资源包: {d.pack}</div>
                      <div>按量: {d.usage}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-2 text-xs text-gray-400">
                {chartData.map((d) => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="w-full lg:w-72 border-l border-gray-100 pl-8 pt-2">
              <div className="mb-6">
                <div className="text-xs text-gray-500 mb-1">本月总支出</div>
                <div className="text-3xl font-bold text-gray-900">
                  ¥ 12,450.00
                </div>
                <div className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> ↑ 12% 环比增长
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">基础订阅费</span>
                    <span className="font-bold text-gray-900">¥ 9,800</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[80%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">资源包增购</span>
                    <span className="font-bold text-gray-900">¥ 2,000</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full w-[20%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">按量付费</span>
                    <span className="font-bold text-gray-900">¥ 650</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full w-[5%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown Table */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">
            成本构成明细 (Cost Breakdown)
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">费用项 (Item)</th>
                  <th className="px-6 py-4">计费模式</th>
                  <th className="px-6 py-4 text-right">用量 (Usage)</th>
                  <th className="px-6 py-4 text-right">金额 (Amount)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {COST_BREAKDOWN.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.item}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-600">
                      {item.usage}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                      ¥{" "}
                      {item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderBuyerSupport = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Row: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Implementation Center Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Headphones size={20} className="text-blue-600" /> 维观实施中心
            (Implementation Center)
          </h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="https://picsum.photos/seed/manager_james/200/200"
                  alt="James"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">
                张大伟 (James)
              </h4>
              <div className="text-xs text-gray-500 mb-1">
                大客户经理 · 宝信软件
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>{" "}
                在线
              </div>
            </div>
            <button
              onClick={contactConsultant}
              className="ml-auto bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
            >
              发起会话
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">服务热线</span>
              <span className="font-bold text-gray-900 font-mono">
                400-820-8820
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">技术支持邮箱</span>
              <span className="font-bold text-gray-900 font-mono">
                support@baosight.com
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Center Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageIcon size={20} className="text-orange-500" /> 工单中心
            </h3>
            <button
              onClick={() => openModal("create_ticket")}
              className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-colors"
            >
              新建工单
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {SUPPORT_TICKETS.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800 text-sm">
                    {ticket.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      ticket.status === "processing"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ticket.status === "processing" ? "处理中" : "已关闭"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>{ticket.id}</span>
                  <span>{ticket.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle size={20} className="text-purple-600" /> 常见问题
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors cursor-pointer flex justify-between items-center group"
            >
              <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                {item}
              </span>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-blue-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- SELLER DASHBOARD RENDERERS ---

  const renderSellerDashboard = () => {
    const chartMax =
      Math.max(...SELLER_REVENUE_CHART_DATA.map((d) => d.value)) * 1.1;

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* 1. Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                本月预估已收款
              </div>
              <div className="text-3xl font-bold mb-2">
                {SELLER_STATS.revenue}
              </div>
              <div className="text-xs text-indigo-100 bg-indigo-500/50 px-2 py-1 rounded w-fit flex items-center gap-1">
                <TrendingUp size={12} /> {SELLER_STATS.revenueTrend} 环比
              </div>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
              <Wallet size={100} />
            </div>
          </div>

          {/* Active Subs Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                活跃订阅
              </div>
              <div className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                <ArrowUpRight size={10} /> {SELLER_STATS.subsTrend}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {SELLER_STATS.subs}
            </div>
            <div className="text-xs text-gray-400">较上月增长</div>
          </div>

          {/* API Calls Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-purple-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                API 调用量
              </div>
              <div className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                <Activity size={10} /> {SELLER_STATS.callsTrend}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {SELLER_STATS.calls}
            </div>
            <div className="text-xs text-gray-400">本月累计</div>
          </div>

          {/* Health Score Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-green-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                服务健康度
              </div>
              <div className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-bold">
                运行正常
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {SELLER_STATS.health}%
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-green-500 h-full w-[98%]"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 2. Main Revenue Chart */}
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BarChart2 size={20} className="text-indigo-600" />
                <h3 className="font-bold text-gray-900">
                  收款趋势分析 (Collection Trend)
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                  月度收款
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-4 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="border-t border-dashed border-gray-100 w-full h-0"
                  ></div>
                ))}
              </div>

              {SELLER_REVENUE_CHART_DATA.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end group h-full relative z-10 cursor-pointer"
                >
                  <div
                    className="w-full bg-green-400 rounded-t-sm hover:bg-green-500 transition-all relative"
                    style={{ height: `${(d.value / chartMax) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      ¥{d.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-2 font-medium">
                    {d.month}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Right Sidebar: Actions & Top Assets */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">快捷操作</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePublishNewAsset}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
                >
                  <PlusCircle
                    size={20}
                    className="text-gray-400 group-hover:text-indigo-600"
                  />
                  <span className="text-xs font-bold">发布版本</span>
                </button>
                <button
                  onClick={() => navigateSellerTab("support")}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors group"
                >
                  <LifeBuoy
                    size={20}
                    className="text-gray-400 group-hover:text-orange-600"
                  />
                  <span className="text-xs font-bold">查看工单</span>
                </button>
                <button
                  onClick={() => navigateSellerTab("health")}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                >
                  <Activity
                    size={20}
                    className="text-gray-400 group-hover:text-blue-600"
                  />
                  <span className="text-xs font-bold">健康诊断</span>
                </button>
              </div>
            </div>

            {/* Top Assets */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                热销资产排行
                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                  本月
                </span>
              </h3>
              <div className="space-y-4">
                {[
                  { name: "数字冷轧质量管理", income: "¥32,400", trend: "up" },
                  { name: "热连轧振动预测", income: "¥8,500", trend: "down" },
                  { name: "表面缺陷检测模型", income: "¥4,300", trend: "up" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-700"}`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-gray-700 truncate w-24">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-900">
                        {item.income}
                      </div>
                      <div
                        className={`text-[10px] flex items-center justify-end gap-0.5 ${item.trend === "up" ? "text-red-500" : "text-green-500"}`}
                      >
                        {item.trend === "up" ? (
                          <ArrowUpRight size={8} />
                        ) : (
                          <ArrowDownLeft size={8} />
                        )}
                        {item.trend === "up" ? "Hot" : "Cool"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-gray-400" /> 最近动态 (Recent
              Activity)
            </h3>
            <button className="text-xs text-blue-600 hover:underline">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {/* Mock items mixed orders/refunds */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    新订单: 冷轧板形控制专家 (企业版)
                  </div>
                  <div className="text-xs text-gray-500">
                    买家: 宝武钢铁集团 · 刚刚
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">
                  + ¥5,800.00
                </div>
                <div className="text-[10px] text-gray-400">交易成功</div>
              </div>
            </div>

            <div
              onClick={() => {
                setSellerFinanceSubTab("transactions");
                navigateSellerTab("finance");
              }}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 relative">
                  <RotateCcw size={18} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    退款申请: 热连轧机组振动预测
                  </div>
                  <div className="text-xs text-gray-500">
                    买家: 某独立研究院 · 10分钟前
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">待审核</div>
                <button className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1">
                  去处理
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    新用户注册试用
                  </div>
                  <div className="text-xs text-gray-500">
                    来自: 鞍钢股份 · 30分钟前
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-500">
                  试用期 7天
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

    const renderMonitoringDetailModal = () => {
    if (!selectedItem) return null;
    const order = localOrders.find(o => o.id === selectedItem.orderId);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end animate-in fade-in">
        <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> 监控与订单详情 (Monitoring & Order Details)
            </h3>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
            {/* 1. Main Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Box size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedItem.asset}
                      </h2>
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                        {selectedItem.version}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mb-1">
                      监控ID: {selectedItem.id} <span className="mx-1">|</span>{" "}
                      客户: {selectedItem.buyer}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {selectedItem.status === "unbilled" && <span className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-100">待请款</span>}
                  {selectedItem.status === "under_review" && <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-medium border border-purple-100">待确认收款</span>}
                  {selectedItem.status === "rejected" && <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium border border-red-100">已驳回</span>}
                  {selectedItem.status === "paid" && <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100">已支付</span>}
                  {selectedItem.status === "running" && <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-100">正常运行中</span>}
                  <div className="text-2xl font-bold text-gray-900 mt-2 font-mono">
                    ¥ {selectedItem.estimatedCost?.toLocaleString() || "0.00"}
                  </div>
                </div>
              </div>

              {/* Key Value Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 mb-1">计费规则</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {selectedItem.plan}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-xs text-gray-400 mb-1">实例名称</div>
                  <div className="font-bold text-gray-900 text-sm break-all">
                    {selectedItem.instanceName || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">实例ID</div>
                  <div className="font-bold text-gray-900 text-sm font-mono">
                    {selectedItem.instanceId}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">关联订单</div>
                  <div className="font-bold text-gray-900 text-sm font-mono">
                    {selectedItem.orderId}
                  </div>
                </div>
                {order && (
                  <>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">订单创建时间</div>
                      <div className="font-bold text-gray-900 text-sm font-mono">
                        {order.createTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">订单到期时间</div>
                      <div className="font-bold text-gray-900 text-sm font-mono">
                        {order.expireDate}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. Usage & Fee Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Scale size={18} className="text-orange-500" />{" "}
                用量与费用明细 (USAGE & FEES)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">
                    当前计费周期
                  </div>
                  <div className="font-bold text-gray-900 text-lg font-mono">
                    {selectedItem.period}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    单价: {selectedItem.unitPrice}
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3">计费项</th>
                      <th className="px-4 py-3 text-right">用量</th>
                      <th className="px-4 py-3 text-right">费用小计</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedItem.usage?.tokens && (
                      <tr className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">Token 消耗</td>
                        <td className="px-4 py-3 text-right font-mono text-gray-600">{selectedItem.usage.tokens}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">¥ {selectedItem.feeBreakdown?.tokens?.toFixed(2) || "0.00"}</td>
                      </tr>
                    )}
                    {selectedItem.usage?.storage && (
                      <tr className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">存储占用</td>
                        <td className="px-4 py-3 text-right font-mono text-gray-600">{selectedItem.usage.storage}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">¥ {selectedItem.feeBreakdown?.storage?.toFixed(2) || "0.00"}</td>
                      </tr>
                    )}
                    <tr className="bg-gray-50/50 font-bold">
                      <td colSpan={2} className="px-4 py-4 text-right text-gray-900">
                        合计 (Total)
                      </td>
                      <td className="px-4 py-4 text-right text-indigo-600 font-mono text-lg">
                        ¥ {selectedItem.estimatedCost?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSellerFinance = () => {
    const maxRev = Math.max(...SELLER_REVENUE_CHART_DATA.map((d) => d.value)) * 1.1;
    const underReviewItems = localOrders.filter((item) => item.paymentStatus === "UnderReview");
    const pendingInvoices = localOrders.filter((item) => item.invoiceStatus === "Pending");
    const pendingRefunds = sellerRefunds.filter(r => r.status === "pending");

    return (
      <div className="space-y-8 animate-in fade-in pb-10">
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-gray-100">
          {["overview", "monitoring", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSellerFinanceSubTab(tab as any)}
              className={`pb-4 text-sm font-bold relative transition-colors ${
                sellerFinanceSubTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "overview" ? "综合看板" : tab === "monitoring" ? "资产与订单监控" : "财务流水明细"}
              {sellerFinanceSubTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {sellerFinanceSubTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* 1. Header Cards */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg shadow-blue-200 lg:w-1/3 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">本月已收款 (RECEIVED)</div>
                  <div className="text-4xl font-bold mb-8">{SELLER_STATS.revenue}</div>
                </div>
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-blue-500 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute right-4 top-4 text-blue-400 opacity-20"><CreditCard size={100} /></div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:w-1/3 flex flex-col justify-between">
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">待买家付款 (PENDING)</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{SELLER_STATS.pending}</div>
                  <div className="text-xs text-gray-400">包含已出账单及待核销款项</div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:w-1/3 flex flex-col justify-between">
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">累计已收款 (TOTAL)</div>
                  <div className="text-4xl font-bold text-gray-900 mb-4">{SELLER_STATS.total}</div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-2/3 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Action Center (待办中心) */}
            {(underReviewItems.length > 0 || pendingInvoices.length > 0 || pendingRefunds.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BellRing size={20} className="text-orange-500" /> 待办中心
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Financial Audit */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                      <div className="font-bold text-indigo-900 flex items-center gap-2">
                        <Receipt size={16} className="text-indigo-600" /> 财务审核
                      </div>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{underReviewItems.length}</span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
                      {underReviewItems.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-4">暂无待审核项</div>
                      ) : (
                        underReviewItems.map(item => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-900">{item.buyer || "买家"}</span>
                              <span className="font-mono text-indigo-600 font-bold">¥{item.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{item.id}</div>
                            <button onClick={() => openModal("confirm_payment", item)} className="w-full py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors">
                              审核收款
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Invoice Management */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                      <div className="font-bold text-orange-900 flex items-center gap-2">
                        <FileText size={16} className="text-orange-600" /> 发票开具
                      </div>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingInvoices.length}</span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
                      {pendingInvoices.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-4">暂无待开票项</div>
                      ) : (
                        pendingInvoices.map(item => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-900">{item.provider}</span>
                              <span className="font-mono text-orange-600 font-bold">¥{item.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{item.id}</div>
                            <button onClick={() => {
                                openModal("issue_invoice", item);
                              }} className="w-full py-1.5 bg-orange-600 text-white rounded-md text-xs font-bold hover:bg-orange-700 transition-colors">
                              开具发票
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Refund Audit */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-red-50/50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
                      <div className="font-bold text-red-900 flex items-center gap-2">
                        <RefreshCw size={16} className="text-red-600" /> 退款处理
                      </div>
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingRefunds.length}</span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
                      {pendingRefunds.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-4">暂无待退款项</div>
                      ) : (
                        pendingRefunds.map(refund => (
                          <div key={refund.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-900">{refund.buyer}</span>
                              <span className="font-mono text-red-600 font-bold">¥{refund.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{refund.orderId}</div>
                            <button onClick={() => openModal("seller_refund_audit", refund)} className="w-full py-1.5 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors">
                              审核处理
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CHART */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-8 pl-2">
                <h3 className="font-bold text-gray-800">近12个月收款趋势</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> 总收款</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-200"></div> 平均值</span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 relative px-4">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[1, 2, 3, 4].map((l) => (<div key={l} className="border-t border-dashed border-gray-100 w-full h-0"></div>))}
                </div>
                {SELLER_REVENUE_CHART_DATA.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full gap-2 group cursor-pointer relative z-10">
                    <div className="w-full bg-green-400 rounded-t-sm hover:bg-green-500 transition-all relative" style={{ height: `${(d.value / maxRev) * 100}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        ¥{d.value.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 text-center">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MONITORING TAB */}
        {sellerFinanceSubTab === "monitoring" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">资产与订单监控</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="搜索客户名称或资产..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Filter size={16} /> 筛选
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">客户与订单</th>
                    <th className="px-6 py-4 font-medium">资产与实例</th>
                    <th className="px-6 py-4 font-medium">计费规则</th>
                    <th className="px-6 py-4 font-medium">用量与明细</th>
                    <th className="px-6 py-4 font-medium">费用合计</th>
                    <th className="px-6 py-4 font-medium">状态</th>
                    <th className="px-6 py-4 font-medium text-right sticky right-0 bg-gray-50 z-10">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monitoringData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.buyer}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{item.orderId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{item.asset} <span className="text-gray-500 font-normal text-xs">({item.version})</span></div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.instanceName}</span>
                          <span className="font-mono">{item.instanceId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{item.plan}</span>
                          <span className="text-gray-500 text-xs">{item.period}</span>
                        </div>
                        <div className="text-xs text-gray-500">{item.unitPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between gap-4">
                            <span>Token: <span className="font-mono text-gray-900">{item.usage.tokens}</span></span>
                            <span className="font-mono text-gray-900">¥ {item.feeBreakdown.tokens.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span>存储: <span className="font-mono text-gray-900">{item.usage.storage}</span></span>
                            <span className="font-mono text-gray-900">¥ {item.feeBreakdown.storage.toFixed(2)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600 text-base">¥ {item.estimatedCost.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {item.status === "unbilled" && <span className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-100">待请款</span>}
                        {item.status === "under_review" && <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-medium border border-purple-100">待确认收款</span>}
                        {item.status === "rejected" && <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium border border-red-100">已驳回</span>}
                        {item.status === "paid" && <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100">已支付</span>}
                        {item.status === "running" && <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-100">正常运行中</span>}
                      </td>
                      <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50/50 transition-colors z-10">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => {
                            openModal("monitoring_detail", item);
                          }} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm">
                            <FileText size={14} /> 详情
                          </button>
                          {item.plan === "按量计费" ? (
                            item.status === "unbilled" ? (
                              <button onClick={() => openModal("generate_invoice", item)} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-sm">
                                <FileText size={14} /> 生成请款单
                              </button>
                            ) : item.status === "under_review" ? (
                              <button onClick={() => openModal("confirm_payment", item)} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm">
                                <CheckCircle size={14} /> 确认收款
                              </button>
                            ) : item.status === "rejected" ? (
                              <button disabled className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-400 cursor-not-allowed bg-gray-50">
                                <CheckCircle size={14} /> 待重新上传
                              </button>
                            ) : (
                              <button disabled className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-400 cursor-not-allowed bg-gray-50">
                                <CheckCircle size={14} /> 已支付
                              </button>
                            )
                          ) : item.status === "under_review" ? (
                            <button onClick={() => openModal("confirm_payment", item)} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm">
                              <CheckCircle size={14} /> 确认收款
                            </button>
                          ) : item.status === "rejected" ? (
                            <button disabled className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-400 cursor-not-allowed bg-gray-50">
                              <CheckCircle size={14} /> 待重新上传
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center justify-end gap-1 px-3 py-1.5">无需请款</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {sellerFinanceSubTab === "transactions" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">财务流水明细</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 font-bold bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">流水号</th>
                    <th className="px-4 py-3">类型</th>
                    <th className="px-4 py-3">关联订单/资产</th>
                    <th className="px-4 py-3 text-right">金额</th>
                    <th className="px-4 py-3 text-center">状态</th>
                    <th className="px-4 py-3 text-right">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {SELLER_TRANSACTIONS.map((trx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-mono text-gray-500">{trx.id}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${trx.type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          {trx.type === "income" ? "收款" : "退款"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-800">{trx.asset}</div>
                        <div className="text-xs text-gray-400">Buyer: {trx.buyer}</div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-green-600">+{trx.amount.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${trx.status === "settled" ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                          {trx.status === "settled" ? "已核销" : "待核销"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-400 text-xs">{trx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

const renderSellerAnalysis = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">
            总访客数 (Unique Visitors)
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">45,230</div>
          <div className="text-xs text-green-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> +12%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">
            平均转化率 (Conversion Rate)
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2.4%</div>
          <div className="text-xs text-green-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> +0.3%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 uppercase font-bold mb-2">
            平均停留时长 (Avg. Session)
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">4m 12s</div>
          <div className="text-xs text-gray-400 font-bold">稳定</div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. User Persona */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> 用户画像分析 (User
            Persona)
          </h3>

          <div className="space-y-6">
            <div>
              <div className="text-xs text-gray-500 mb-3">企业类型分布</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">大型国企 (SOE)</span>
                    <span className="font-bold text-gray-900">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[45%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">民营钢企 (Private)</span>
                    <span className="font-bold text-gray-900">35%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[35%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">科研院所 (Research)</span>
                    <span className="font-bold text-gray-900">20%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[20%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">主要用户角色</div>
              <div className="flex flex-wrap gap-2">
                {["工艺工程师", "IT 管理员", "采购经理", "产线厂长"].map(
                  (role) => (
                    <span
                      key={role}
                      className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {role}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Usage Scenarios */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-orange-600" />{" "}
            调用场景分布 (Usage Scenarios)
          </h3>
          <div className="h-48 flex items-end justify-between px-4 gap-4">
            {[
              { name: "质量分析", val: 80, color: "bg-blue-500" },
              { name: "工艺优化", val: 65, color: "bg-cyan-500" },
              { name: "能耗管理", val: 45, color: "bg-green-500" },
              { name: "设备预维", val: 30, color: "bg-orange-500" },
              { name: "其他", val: 15, color: "bg-gray-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-12 md:w-16 rounded-t-lg relative ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                  style={{ height: `${item.val}%` }}
                ></div>
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. User Growth */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">用户增长趋势</h3>
          <div className="h-48 flex items-end justify-between gap-1 md:gap-2">
            {[10, 15, 25, 20, 30, 35, 45, 40, 50, 60, 65, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors"
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[10px] text-gray-400">{i + 1}月</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. API Error Rates */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">
            API 错误率分布 (Error Rates)
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">
                  401 鉴权失败 (Unauthorized)
                </span>
                <span className="font-bold text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">
                  429 请求过多 (Too Many Requests)
                </span>
                <span className="font-bold text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[30%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">
                  500 服务器内部错误 (Internal Error)
                </span>
                <span className="font-bold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSellerHealth = () => (
    <div className="space-y-4 animate-in fade-in">
      {activeModal === "health_diag" ? (
        <div className="bg-gray-900 text-white p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-green-400 animate-pulse" />
            <h3 className="font-bold text-lg">系统深度诊断中...</h3>
          </div>
          <div className="space-y-4 font-mono text-sm">
            <div
              className={`flex items-center gap-3 ${diagStep >= 1 ? "text-green-400" : "text-gray-600"}`}
            >
              {diagStep >= 1 ? (
                <CheckCircle size={16} />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-600" />
              )}
              检查节点连通性... {diagStep >= 1 && "OK"}
            </div>
            <div
              className={`flex items-center gap-3 ${diagStep >= 2 ? "text-green-400" : "text-gray-600"}`}
            >
              {diagStep >= 2 ? (
                <CheckCircle size={16} />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-600" />
              )}
              验证数据库一致性... {diagStep >= 2 && "OK"}
            </div>
            <div
              className={`flex items-center gap-3 ${diagStep >= 3 ? "text-green-400" : "text-gray-600"}`}
            >
              {diagStep >= 3 ? (
                <CheckCircle size={16} />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-600" />
              )}
              分析 API 响应延迟... {diagStep >= 3 && "OK"}
            </div>
            {diagStep >= 4 && (
              <div className="mt-4 pt-4 border-t border-gray-700 text-green-400 font-bold">
                诊断完成，系统运行正常。
                <button
                  onClick={closeModal}
                  className="ml-4 text-white underline text-xs"
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900">服务健康状态</h3>
            <button
              onClick={() => openModal("health_diag")}
              className="text-indigo-600 text-sm font-bold hover:underline"
            >
              开始诊断
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEALTH_METRICS.map((metric, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-sm text-gray-800">
                    {metric.name}
                  </div>
                  <div
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${metric.status === "healthy" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${metric.status === "healthy" ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    {metric.status === "healthy" ? "正常" : "降级"}
                  </div>
                </div>
                <div className="h-16 flex items-end justify-between gap-1 mt-2">
                  {metric.latency.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-indigo-100 rounded-t-sm relative group"
                      style={{ height: `${Math.min(100, (val / 300) * 100)}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {val}ms
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right text-xs text-gray-400 mt-2">
                  Avg: {metric.avg}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderSellerSupport = () => (
    <div className="space-y-4 animate-in fade-in">
      <h3 className="font-bold text-gray-900 mb-2">用户工单列表</h3>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {[
          {
            id: "T-250418-01",
            user: "沙钢集团",
            title: "API 调用返回 500 错误",
            date: "2025-04-18",
            status: "pending",
          },
          {
            id: "T-250417-05",
            user: "某独立研究院",
            title: "发票开具有误",
            date: "2025-04-17",
            status: "resolved",
          },
          {
            id: "T-250416-02",
            user: "宝武集团",
            title: "新版本 SDK 兼容性咨询",
            date: "2025-04-16",
            status: "pending",
          },
        ].map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${ticket.status === "pending" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}
                >
                  {ticket.status === "pending" ? "待处理" : "已解决"}
                </span>
                <h4 className="font-bold text-sm text-gray-900">
                  {ticket.title}
                </h4>
              </div>
              <div className="text-xs text-gray-500">
                {ticket.id} · 来自 {ticket.user} · {ticket.date}
              </div>
            </div>
            <button className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
              查看回复
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSellerAssets = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { id: "all", label: "全部" },
          { id: "live", label: "已发布" },
          { id: "review", label: "审核中" },
          { id: "draft", label: "草稿箱" },
          { id: "takedown", label: "已下架" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSellerAssetFilter(tab.id)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              sellerAssetFilter === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 text-right pb-2">
          <button
            onClick={handlePublishNewAsset}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 ml-auto shadow-md"
          >
            <Plus size={16} /> 发布新资产
          </button>
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-6">
        {sellerAssets
          .filter(
            (a) =>
              sellerAssetFilter === "all" || a.status === sellerAssetFilter,
          )
          .map((asset, i) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Asset Header */}
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {asset.status === "live" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  )}
                  {asset.status === "review" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  )}
                  {asset.status === "draft" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  )}
                  {asset.status === "takedown" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900">
                    {asset.title}
                  </h3>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                      asset.status === "live"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : asset.status === "review"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : asset.status === "takedown"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {asset.status === "takedown" ? "已下架" : asset.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openModal("edit_asset", asset)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
                  >
                    <Edit3 size={12} /> 编辑信息
                  </button>
                  {asset.status === "live" && (
                    <button
                      onClick={() => openModal("confirm_takedown", asset)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> 下架
                    </button>
                  )}
                </div>
              </div>

              {/* Version Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-gray-500 font-bold border-b border-gray-50 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-40">版本 (Version)</th>
                      <th className="px-6 py-4 w-40">发布日期</th>
                      <th className="px-6 py-4 w-40">获取数 (Installs)</th>
                      <th className="px-6 py-4 w-32">状态</th>
                      <th className="px-6 py-4 text-right">管理</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {asset.versions.map((ver, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-indigo-600 font-mono">
                          {ver.ver}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{ver.date}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {ver.installs}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              ver.status === "active" || ver.status === "stable"
                                ? "bg-green-50 text-green-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {ver.status === "active" || ver.status === "stable" ? "正常" : "弃用"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              openModal("manage_version", asset, ver)
                            }
                            className="text-gray-400 hover:text-indigo-600 font-medium transition-colors"
                          >
                            管理
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Action */}
              <div className="bg-gray-50/30 p-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => handlePublishNewVersion(asset)}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  + 发布新版本 (Release New Version)
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderPreviewImageModal = () => {
    if (!previewImageUrl) return null;
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in">
        <div className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Receipt size={18} className="text-indigo-600" />
              付款凭证预览
            </h3>
            <button
              onClick={() => setActiveModal("order_detail")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 bg-gray-100 flex justify-center items-center min-h-[400px]">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg">
                <div className="text-center mb-6 border-b border-dashed border-gray-200 pb-4">
                  <h4 className="text-xl font-bold text-gray-900 tracking-widest">电子付款凭证</h4>
                  <p className="text-sm text-gray-500 mt-1">Electronic Payment Voucher</p>
                </div>
                
                {selectedItem && (
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">订单编号：</span>
                      <span className="font-mono text-gray-900">{selectedItem.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">商品名称：</span>
                      <span className="text-gray-900">{selectedItem.appName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">交易金额：</span>
                      <span className="font-mono font-bold text-gray-900">¥ {selectedItem.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">交易日期：</span>
                      <span className="font-mono text-gray-900">{selectedItem.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">支付方式：</span>
                      <span className="text-gray-900">
                        {selectedItem.paymentMethod === "Alipay" ? "支付宝" :
                         selectedItem.paymentMethod === "WeChat" ? "微信支付" :
                         selectedItem.paymentMethod === "CorporateRemittance" ? "企业汇款" : "其他"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-2 rounded border border-gray-100 flex justify-center">
                  <img src={previewImageUrl} alt="Preview" className="max-w-full h-auto max-h-[40vh] object-contain rounded" />
                </div>
                
                <div className="mt-6 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-xs text-gray-400">
                  <span>仅供参考，不作为发票使用</span>
                  <span>AI Studio 平台生成</span>
                </div>
             </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = previewImageUrl;
                link.download = 'receipt.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              下载凭证
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBuyerModals = () => (
    <>
      {activeModal === "order_detail" && renderOrderDetailModal()}
      {activeModal === "bill_detail" && renderBillDetailModal()}
      {activeModal === "refund_request" && renderRefundRequestModal()}
      {activeModal === "create_ticket" && renderCreateTicketModal()}
      {activeModal === "invoice_header" && renderInvoiceHeaderModal()}
      {activeModal === "request_invoice" && renderRequestInvoiceModal()}
      {activeModal === "pay_bill" && renderPayBillModal()}
      {activeModal === "payment_application" && renderPaymentApplicationModal()}
      {activeModal === "payment" && renderPaymentModal()}
      {activeModal === "confirm_payment" && renderConfirmPaymentModal()}
      {activeModal === "upload_receipt" && renderUploadReceiptModal()}
      {activeModal === "export_statement" && renderExportStatementModal()}
      {activeModal === "preview_image" && renderPreviewImageModal()}
    </>
  );

  const renderSellerModals = () => (
    <>
      {activeModal === "monitoring_detail" && renderMonitoringDetailModal()}
      {activeModal === "seller_refund_audit" && renderSellerRefundAuditModal()}
      {activeModal === "edit_asset" && renderEditAssetModal()}
      {activeModal === "manage_version" && renderManageVersionModal()}
      {activeModal === "confirm_takedown" && renderConfirmTakedownModal()}
      {activeModal === "under_development" && renderUnderDevelopmentModal()}
      {activeModal === "generate_invoice" && renderGenerateInvoiceModal()}
      {activeModal === "issue_invoice" && renderIssueInvoiceModal()}
      {activeModal === "health_diag" && renderSellerHealth()}
    </>
  );

  const handleConsoleModeChange = useCallback((mode: "buyer" | "seller") => {
    if (mode === "buyer") {
      navigateBuyerTab("dashboard");
      return;
    }
    navigateSellerTab("assets");
  }, [navigateBuyerTab, navigateSellerTab]);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-6 md:p-8 relative">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[60] animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto pb-20">
        <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">加载中...</div>}>
          <ProfileHeader
            displayAccount={displayAccount}
            consoleMode={consoleMode}
            onConsoleModeChange={handleConsoleModeChange}
            role={currentAccount.role}
          />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">工作台加载中...</div>}>
          <Routes>
          <Route
            path="buyer/*"
            element={
              <BuyerConsole
                renderBuyerModals={renderBuyerModals}
              />
            }
          />
          <Route
            path="seller/*"
            element={
              <SellerConsole
                renderSellerModals={renderSellerModals}
              />
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={currentAccount.role === "viewer" ? "buyer/dashboard" : "seller/assets"}
                replace
              />
            }
          />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

const UserProfile: React.FC<UserProfileProps> = (props) => {
  return (
    <UserProfileProvider {...props} consoleMode={props.currentAccount.role === "viewer" ? "buyer" : "seller"}>
      <UserProfileContent {...props} />
    </UserProfileProvider>
  );
};

export default UserProfile;
