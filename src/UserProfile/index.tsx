import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { BillDetailModal } from './components/modals/BillDetailModal';
import { RefundRequestModal } from './components/modals/RefundRequestModal';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Activity,
  CreditCard,
  FileText,
  Settings,
  ShieldCheck,
  Download,
  AlertTriangle,
  Plus,
  TrendingUp,
  AlertCircle,
  Edit3,
  CheckCircle,
  X,
  Loader2,
  Wallet,
  Receipt,
  MessageSquare as MessageIcon,
  Terminal,
  Scale,
  Scan,
  Building,
  Upload,
} from "lucide-react";
import { Account } from "@/types";
import { BuyerTab, isBuyerTab } from "./Buyer/buyerTabs";
import { SellerTab, isSellerTab } from "./Seller/sellerTabs";
import { useDebouncedValue } from "./Shared/useDebouncedValue";
import { useOrderFilterWorker } from "./Order/useOrderFilterWorker";
import { useVirtualPagination } from "./Shared/useVirtualPagination";
import { useUserProfileUIStore } from "./Core/useUserProfileUIStore";
import {  INITIAL_BILLS, INITIAL_INVOICE_HEADERS} from "./Buyer/constants";
import {  SELLER_MONITORING_MOCK, SELLER_REFUNDS_MOCK,  RICH_ASSETS_MOCK } from "./Seller/constants";


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

  const [monitoringData, setMonitoringData] = useState(SELLER_MONITORING_MOCK);


  // Seller Assets State
  const [sellerAssets, setSellerAssets] = useState(RICH_ASSETS_MOCK);



  // Order Filter State
  const orderSearch = useUserProfileUIStore((state) => state.orderSearch);
  const orderStatusFilter = useUserProfileUIStore((state) => state.orderStatusFilter);

  const [activeModal, setActiveModal] = useState<string>("none");
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
    navigate(`/profile/buyer/${tab}`);
  }, [navigate]);

  const navigateSellerTab = useCallback((tab: SellerTab) => {
    if (currentAccount.role === "viewer") {
      navigate("/profile/buyer/dashboard", { replace: true });
      return;
    }
    setConsoleMode("seller");
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
      return;
    }
    if (routeMode === "seller" && routeTab && isSellerTab(routeTab)) {
      if (currentAccount.role === "viewer") {
        navigate("/profile/buyer/dashboard", { replace: true });
        return;
      }
      setConsoleMode("seller");
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
    type: string,
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
