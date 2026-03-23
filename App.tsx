import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useParams, useSearchParams } from "react-router-dom";
import MarketplaceSidebar from "./components/MarketplaceSidebar";
import Discovery from "./components/Discovery";
import ProductDetail from "./components/ProductDetail";
import PublishWizard from "./components/PublishWizard";
import UserProfile from "./components/UserProfile";
import DemandSquare from "./components/DemandSquare";
import CategoryListView from "./components/CategoryListView";
import AgentCategoryView from "./components/AgentCategoryView";
import DocumentationView from "./components/DocumentationView";
import SettingsView from "./components/SettingsView";
import MessageCenter from "./components/MessageCenter";
import ResourcePackView from "./components/ResourcePackView";

import { Account } from "./types";

// Mock Accounts
const ACCOUNTS: Account[] = [
  {
    id: "user_001",
    name: "王工程师 (Engineer Wang)",
    avatar: "https://picsum.photos/seed/wang/100/100",
    role: "developer",
    orgName: "宝武钢铁集团 · 冷轧厂",
    balance: "¥ 45,200",
    numericBalance: 45200,
    permissions: {
      canPublish: true,
      canManageFinance: true,
      canViewAnalytics: true,
    },
  },
  {
    id: "user_002",
    name: "张采购 (Purchaser Zhang)",
    avatar: "https://picsum.photos/seed/zhang/100/100",
    role: "viewer",
    orgName: "沙钢集团",
    balance: "¥ 0",
    numericBalance: 0,
    permissions: {
      canPublish: false,
      canManageFinance: false,
      canViewAnalytics: false,
    },
  },
];

// Helper to get a future date string
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const INITIAL_ORDERS = [
  {
    id: "ORD-TRIAL-ACT-001",
    resourceId: "1",
    productName: "数字冷轧质量管理 · 方法智能体",
    version: "v2.4.1",
    provider: "宝信软件 (Baosight)",
    orderType: "Trial",
    amount: 0,
    paymentStatus: "Paid",
    date: new Date().toISOString().split("T")[0],
    createTime: new Date().toLocaleString(),
    payTime: new Date().toLocaleString(),
    paymentMethod: "Free",
    invoiceStatus: "NotApplicable",
    snapshot: {
      plan: "体验试用 (30天)",
      period: "Trial",
      baseFee: 0,
      quota: { tokens: 500000, storage: 5 },
    },
    history: [{ date: new Date().toLocaleString(), event: "试用开启" }],
  },
  {
    id: "ORD-TRIAL-SUS-002",
    resourceId: "2",
    productName: "2025冷轧行业质量洞察与对标 · 分析智能体",
    version: "v2025.1",
    provider: "钢铁行业大数据中心",
    orderType: "Trial",
    amount: 0,
    paymentStatus: "Paid",
    date: "2025-05-01",
    createTime: "2025-05-01 10:00:00",
    payTime: "2025-05-01 10:05:00",
    paymentMethod: "Trial",
    invoiceStatus: "NotApplicable",
    snapshot: {
      plan: "体验试用 (30天)",
      period: "30 Days",
      baseFee: 0,
      quota: { tokens: 500000, storage: 5 },
    },
    history: [
      { date: "2025-05-01 10:00", event: "试用开启" },
      { date: "2025-06-01 00:00", event: "试用结束" },
    ],
  },
  {
    id: "ORD-ACTIVE-003",
    productName: "高炉热力学对象图谱",
    version: "v1.0",
    provider: "宝信软件 (Baosight)",
    orderType: "NewPurchase",
    amount: 12000,
    paymentStatus: "Paid",
    date: "2025-03-01",
    createTime: "2025-03-01 09:00:00",
    payTime: "2025-03-01 09:05:00",
    paymentMethod: "Alipay",
    invoiceStatus: "Issued",
    snapshot: {
      plan: "包年订阅",
      period: "Yearly",
      baseFee: 12000,
      quota: { tokens: 2000000, storage: 500, users: 20 },
    },
    history: [
      { date: "2025-03-01", event: "订单创建" },
      { date: "2025-03-01", event: "支付成功" },
    ],
  },
  {
    id: "ORD-RES-PACK-004",
    productName: "50k Token 资源包",
    version: "v1.0",
    provider: "维观云",
    orderType: "ResourcePack",
    amount: 299,
    paymentStatus: "Paid",
    date: "2025-04-10",
    createTime: "2025-04-10 14:00:00",
    payTime: "2025-04-10 14:05:00",
    paymentMethod: "WeChat",
    invoiceStatus: "Pending",
    snapshot: {
      plan: "资源包",
      period: "OneTime",
      baseFee: 299,
      quota: { tokens: 50000 },
    },
    history: [{ date: "2025-04-10", event: "购买成功" }],
  },
  {
    id: "ORD-EXPIRED-005",
    productName: "表面缺陷视觉检测模型",
    version: "v1.2",
    provider: "宝信软件 (Baosight)",
    orderType: "NewPurchase",
    amount: 5800,
    paymentStatus: "Paid",
    date: "2024-01-01",
    createTime: "2024-01-01 09:00:00",
    payTime: "2024-01-01 09:05:00",
    paymentMethod: "Alipay",
    invoiceStatus: "Issued",
    snapshot: {
      plan: "包月订阅",
      period: "Monthly",
      baseFee: 5800,
      quota: { tokens: 100000, storage: 100, users: 5 },
    },
    history: [
      { date: "2024-01-01", event: "订单创建" },
      { date: "2024-02-01", event: "服务到期" },
    ],
  },
  {
    id: "ORD-USAGE-006",
    productName: "冷轧2线 (测试环境)",
    version: "v2.0",
    provider: "宝信软件 (Baosight)",
    orderType: "NewPurchase",
    amount: 2650,
    paymentStatus: "Paid",
    date: "2025-04-01",
    createTime: "2025-04-01 10:00:00",
    payTime: "2025-04-01 10:05:00",
    paymentMethod: "Alipay",
    invoiceStatus: "Unissued",
    snapshot: { plan: "按量付费", period: "Usage", baseFee: 0 },
    history: [{ date: "2025-04-01", event: "开通按量付费" }],
  },
  {
    id: "ORD-FAILED-007",
    productName: "高炉热力学对象图谱",
    version: "v1.0",
    provider: "宝信软件 (Baosight)",
    orderType: "NewPurchase",
    amount: 12000,
    paymentStatus: "PaymentFailed",
    date: new Date().toISOString().split("T")[0],
    createTime: new Date().toLocaleString(),
    payTime: "-",
    paymentMethod: "Alipay",
    invoiceStatus: "NotApplicable",
    snapshot: {
      plan: "包年订阅",
      period: "Yearly",
      baseFee: 12000,
      quota: { tokens: 2000000, storage: 500, users: 20 },
    },
    history: [
      { date: new Date().toLocaleString(), event: "订单创建" },
      { date: new Date().toLocaleString(), event: "支付失败" },
    ],
  },
  {
    id: "ORD-REVIEW-008",
    productName: "数字冷轧质量管理 · 方法智能体",
    version: "v2.4.1",
    provider: "宝信软件 (Baosight)",
    orderType: "NewPurchase",
    amount: 58000,
    paymentStatus: "UnderReview",
    date: new Date().toISOString().split("T")[0],
    createTime: new Date().toLocaleString(),
    payTime: "-",
    paymentMethod: "CorporateRemittance",
    invoiceStatus: "NotApplicable",
    snapshot: {
      plan: "企业版包年",
      period: "Yearly",
      baseFee: 58000,
      quota: { tokens: 10000000, storage: 1000, users: 100 },
    },
    history: [
      { date: new Date().toLocaleString(), event: "订单创建" },
      { date: new Date().toLocaleString(), event: "上传付款回执，等待审核" },
    ],
  },
  {
    id: "ORD-REJECTED-009",
    productName: "高炉热力学对象图谱",
    version: "v1.0",
    provider: "宝信软件 (Baosight)",
    orderType: "NewPurchase",
    amount: 12000,
    paymentStatus: "Rejected",
    date: new Date().toISOString().split("T")[0],
    createTime: new Date().toLocaleString(),
    payTime: "-",
    paymentMethod: "CorporateRemittance",
    invoiceStatus: "NotApplicable",
    rejectReason: "付款回执模糊不清，请重新上传清晰的银行回执单。",
    snapshot: {
      plan: "包年订阅",
      period: "Yearly",
      baseFee: 12000,
      quota: { tokens: 2000000, storage: 500, users: 20 },
    },
    history: [
      { date: new Date().toLocaleString(), event: "订单创建" },
      { date: new Date().toLocaleString(), event: "上传付款回执" },
      { date: new Date().toLocaleString(), event: "审核驳回" },
    ],
  },
];

const INITIAL_RESOURCES = [
  {
    id: "RES-001",
    orderId: "ORD-TRIAL-ACT-001",
    productName: "数字冷轧质量管理 · 方法智能体",
    version: "v2.4.1",
    provider: "宝信软件 (Baosight)",
    instanceName: "测试环境-冷轧01",
    status: "Running",
    expireDate: getFutureDate(5),
    autoRenew: false,
    quota: { tokens: 500000, storage: 5 },
    usage: { tokens: 120000, storage: 1.2 },
  },
  {
    id: "RES-002",
    orderId: "ORD-TRIAL-SUS-002",
    productName: "2025冷轧行业质量洞察与对标 · 分析智能体",
    version: "v2025.1",
    provider: "钢铁行业大数据中心",
    instanceName: "洞察-试用实例",
    status: "Expired",
    expireDate: "2025-06-01",
    autoRenew: false,
    quota: { tokens: 500000, storage: 5 },
    usage: { tokens: 500000, storage: 5 },
  },
  {
    id: "RES-003",
    orderId: "ORD-ACTIVE-003",
    productName: "高炉热力学对象图谱",
    version: "v1.0",
    provider: "宝信软件 (Baosight)",
    instanceName: "高炉-2号",
    status: "Running",
    expireDate: getFutureDate(300),
    autoRenew: true,
    quota: { tokens: 2000000, storage: 500, users: 20 },
    usage: { tokens: 450000, storage: 120, users: 5 },
  },
  {
    id: "RES-005",
    orderId: "ORD-EXPIRED-005",
    productName: "表面缺陷视觉检测模型",
    version: "v1.2",
    provider: "宝信软件 (Baosight)",
    instanceName: "检测线-01",
    status: "Expired",
    expireDate: "2024-02-01",
    autoRenew: false,
    quota: { tokens: 100000, storage: 100, users: 5 },
    usage: { tokens: 100000, storage: 80, users: 5 },
  },
  {
    id: "RES-006",
    orderId: "ORD-USAGE-006",
    productName: "冷轧2线 (测试环境)",
    version: "v2.0",
    provider: "宝信软件 (Baosight)",
    instanceName: "测试环境-02",
    status: "Running",
    expireDate: "-",
    autoRenew: true,
    quota: { plan: "按量付费" },
    usage: { tokens: 1500000, storage: 200 },
  },
  {
    id: "RES-007",
    orderId: "ORD-NEW-007",
    productName: "设备预测性维护智能体",
    version: "v3.0",
    provider: "宝信软件 (Baosight)",
    instanceName: "-",
    status: "PendingActivation",
    expireDate: "-",
    autoRenew: false,
    quota: { tokens: 1000000, storage: 50 },
    usage: { tokens: 0, storage: 0 },
  },
];

const App: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState<Account>(ACCOUNTS[0]);
  const navigate = useNavigate();
  const location = useLocation();

  // Data State
  const [myOrders, setMyOrders] = useState(INITIAL_ORDERS);
  const [myResources, setMyResources] = useState(INITIAL_RESOURCES);
  const [extraAgents, setExtraAgents] = useState<any[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);

  const handleNavigate = (view: string, params?: any) => {
    let path = "/";
    let search = "";

    switch (view) {
      case "discovery":
        path = "/discovery";
        break;
      case "detail":
        path = `/detail/${params?.id || ""}`;
        if (params) {
           const searchParams = new URLSearchParams();
           if (params.action) searchParams.set("action", params.action);
           if (params.upgrade_instance_id) searchParams.set("upgrade_instance_id", params.upgrade_instance_id);
           if (params.instance_name) searchParams.set("instance_name", params.instance_name);
           if (params.instance_status) searchParams.set("instance_status", params.instance_status);
           search = searchParams.toString();
        }
        break;
      case "profile":
        path = "/profile";
        if (params?.tab) {
          search = `?tab=${params.tab}`;
        }
        break;
      case "messages":
        path = "/messages";
        break;
      case "settings":
        path = "/settings";
        break;
      case "demand_square":
        path = "/demand-square";
        break;
      case "categories":
        path = "/categories";
        break;
      case "method_agents":
        path = "/agents/method";
        break;
      case "analysis_agents":
        path = "/agents/analysis";
        break;
      case "services":
        path = "/services";
        break;
      case "documentation":
        path = "/documentation";
        break;
      case "resource_packs":
        path = "/resource-packs";
        break;
      case "publish_wizard":
        path = "/publish";
        if (params) {
           const searchParams = new URLSearchParams();
           if (params.mode) searchParams.set("mode", params.mode);
           search = searchParams.toString();
        }
        break;
      default:
        path = "/discovery";
    }

    navigate(search ? `${path}?${search}` : path);
  };

  const handlePublish = (data: any, mode?: string) => {
    if (mode === "version") {
      // Handle Version Update (In a real app, this would update the specific asset)
      // For now, we mock it by adding to the list but visually distinct or updated
      console.log("Published new version for:", data.title, data.nextVersion);
      // We could update extraAgents to reflect the new version if needed
      // For simplicity, we just navigate back to assets which will show updated mock data (if connected)
    } else {
      // Handle New Asset
      setExtraAgents([
        ...extraAgents,
        {
          ...data,
          id: `new_${Date.now()}`,
          currentVersion: data.nextVersion, // The first version
        },
      ]);
    }
    handleNavigate("profile", { tab: "assets" });
  };

  const handlePurchase = (product: any, planDetails: any) => {
    // Mock purchase logic
    const isTrial = planDetails.type === "trial";
    const amount = planDetails.amount || 0;

    const newOrder = {
      id: `ORD-${Date.now()}`,
      productName: product.title || product.name, // handle agent vs cart item
      version: planDetails.version || product.version,
      resourceId: product.id,
      provider: product.provider || "维观云",
      type: isTrial ? "Subscription" : planDetails.type, // Trial is a type of subscription in the backend usually, or we can keep it distinct
      orderType: isTrial ? "Trial" : "New",
      amount: amount,
      status: isTrial
        ? "Trial"
        : planDetails.paymentMethod === "CorporateRemittance"
          ? "Pending"
          : "Active",
      paymentStatus: (amount === 0 || planDetails.paymentMethod !== "CorporateRemittance") ? "Paid" : "PendingPayment",
      autoRenew: !isTrial,
      date: new Date().toISOString().split("T")[0],
      createTime: new Date().toLocaleString(),
      payTime:
        (amount === 0 || planDetails.paymentMethod !== "CorporateRemittance")
          ? new Date().toLocaleString()
          : "-",
      paymentMethod: planDetails.paymentMethod || (amount === 0 ? "Free" : "Alipay"),
      invoiceStatus: isTrial ? "NotRequired" : "Unissued",
      instanceName:
        planDetails.instanceName ||
        (isTrial
          ? `Trial-Instance-${Date.now().toString().slice(-4)}`
          : `Instance-${Date.now().toString().slice(-4)}`),
      apiKey: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      expireDate: isTrial
        ? getFutureDate(planDetails.trialConfig?.duration || 7)
        : planDetails.period === "Monthly"
          ? getFutureDate(30)
          : getFutureDate(365),
      snapshot: planDetails,
      history: [
        {
          date: new Date().toLocaleString(),
          event: isTrial ? "试用开启" : "订单创建",
        },
      ],
    };

    // For trials with installation fee, we might want to adjust the status if it's pending payment
    if (isTrial && amount > 0 && planDetails.paymentMethod === "CorporateRemittance") {
      newOrder.status = "Pending"; // Wait for installation fee payment
    }

    // For Paid purchases, we allow multiple instances (add to list)
    // For Trial, we allow multiple trials
    setMyOrders((prevOrders) => [newOrder, ...prevOrders]);

    // Create resource if payment is successful
    if (newOrder.paymentStatus === "Paid") {
      const newResource = {
        id: `RES-${Date.now()}`,
        orderId: newOrder.id,
        orderType: newOrder.orderType,
        productName: newOrder.productName,
        version: newOrder.version,
        provider: newOrder.provider,
        instanceName: newOrder.instanceName || "默认实例",
        status: "PendingActivation",
        expireDate: newOrder.expireDate,
        autoRenew: newOrder.autoRenew,
        quota: { tokens: 500000, storage: 5 }, // Mock quota
        usage: { tokens: 0, storage: 0 },
      };
      setMyResources((prev) => [newResource, ...prev]);
    }

    // Add Notification
    if (isTrial) {
      setSystemNotifications((prev) => [
        ...prev,
        {
          id: `sys-notif-${Date.now()}`,
          senderId: "sys_01",
          text: `您的试用申请已通过！产品：${product.name}，有效期至：${getFutureDate(planDetails.trialConfig?.duration || 7)}。`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "text",
        },
      ]);
    }
  };

  const handleUpgrade = (orderId: string, planDetails: any) => {
    const orderToUpdate = myOrders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const updatedOrder = {
      ...orderToUpdate,
      status:
        planDetails.paymentMethod === "CorporateRemittance"
          ? "Pending"
          : "Active",
      paymentStatus: planDetails.paymentMethod === "CorporateRemittance" ? "PendingPayment" : "Paid",
      type: "Subscription", // Ensure it's subscription
      orderType: "Renewal",
      amount: planDetails.amount,
      autoRenew: true,
      payTime:
        planDetails.paymentMethod === "CorporateRemittance"
          ? "-"
          : new Date().toLocaleString(),
      paymentMethod: planDetails.paymentMethod || "Alipay",
      invoiceStatus: "Unissued",
      expireDate:
        planDetails.period === "Monthly"
          ? getFutureDate(30)
          : getFutureDate(365),
      snapshot: {
        ...orderToUpdate.snapshot,
        plan: planDetails.planName,
        period: planDetails.period,
        quota: planDetails.quota,
      },
      history: [
        ...orderToUpdate.history,
        { date: new Date().toLocaleString(), event: "升级为付费版" },
      ],
    };

    setMyOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
    );

    if (updatedOrder.paymentStatus === "Paid") {
      setMyResources((prev) =>
        prev.map((r) => {
          if (r.orderId === orderId) {
            return {
              ...r,
              expireDate: updatedOrder.expireDate,
              status: r.status === "Expired" ? "Running" : r.status,
            };
          }
          return r;
        })
      );
    }
  };

  const handleResourcePackPurchase = (
    items: any[],
    targetOrderId: string,
    version: string,
    method: string,
  ) => {
    // Find target order to get product name and instance name
    const targetOrder = myOrders.find((o) => o.id === targetOrderId);
    const targetProductName = targetOrder
      ? targetOrder.productName
      : "Unknown Product";
    const targetInstanceName = targetOrder
      ? targetOrder.instanceName
      : "Unknown Instance";
    const targetVersion = targetOrder ? targetOrder.version : version;

    // Mock logic for resource pack purchase
    const orders = items.map((item) => ({
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productName: item.name,
      version: targetVersion,
      resourceId: item.id,
      provider: "维观云",
      type: "ResourcePack",
      orderType: "ResourcePack",
      targetOrderId: targetOrderId,
      amount: item.subtotal,
      status: method === "offline" ? "Pending" : "Active",
      paymentStatus: method === "offline" ? "PendingPayment" : "Paid",
      autoRenew: false,
      date: new Date().toISOString().split("T")[0],
      createTime: new Date().toLocaleString(),
      payTime: method === "offline" ? "-" : new Date().toLocaleString(),
      paymentMethod:
        method === "offline"
          ? "CorporateRemittance"
          : method === "wechat"
            ? "WeChat"
            : "Alipay",
      invoiceStatus: "Unissued",
      instanceName: `挂载: ${targetProductName} (${targetInstanceName})`,
      mountedOn: {
        name: targetProductName,
        version: targetVersion,
        instanceId: targetOrderId,
      },
      expireDate: "2025-10-18",
      snapshot: item,
      history: [{ date: new Date().toLocaleString(), event: "购买成功" }],
    }));
    setMyOrders([...orders, ...myOrders]);

    // Update resource quota if payment is successful
    if (method !== "offline") {
      setMyResources((prev) =>
        prev.map((r) => {
          if (r.orderId === targetOrderId) {
            return {
              ...r,
              quota: {
                tokens: (r.quota?.tokens || 0) + 100000, // Mock addition
                storage: (r.quota?.storage || 0) + 10,
              },
            };
          }
          return r;
        })
      );
    }

    handleNavigate("profile", { tab: "orders" });
  };

  const currentView = (() => {
    const path = location.pathname;
    if (path.startsWith("/detail")) return "detail";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/messages")) return "messages";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/demand-square")) return "demand_square";
    if (path.startsWith("/categories")) return "categories";
    if (path.startsWith("/agents/method")) return "method_agents";
    if (path.startsWith("/agents/analysis")) return "analysis_agents";
    if (path.startsWith("/services")) return "services";
    if (path.startsWith("/documentation")) return "documentation";
    if (path.startsWith("/resource-packs")) return "resource_packs";
    if (path.startsWith("/publish")) return "publish_wizard";
    return "discovery";
  })();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <MarketplaceSidebar
        currentView={currentView}
        onChangeView={handleNavigate}
        onPublish={() => handleNavigate("publish_wizard", { mode: "create" })}
        currentAccount={currentAccount}
        accounts={ACCOUNTS}
        onSwitchAccount={(id) =>
          setCurrentAccount(ACCOUNTS.find((a) => a.id === id) || ACCOUNTS[0])
        }
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <Routes>
          <Route path="/" element={<Navigate to="/discovery" replace />} />
          <Route path="/discovery" element={<Discovery onNavigateToDetail={(id) => handleNavigate("detail", { id })} extraAgents={extraAgents} />} />
          <Route path="/detail/:id" element={<ProductDetailWrapper myOrders={myOrders} handleNavigate={handleNavigate} handlePurchase={handlePurchase} handleUpgrade={handleUpgrade} />} />
          <Route path="/detail" element={<Navigate to="/discovery" replace />} />
          <Route path="/profile" element={<UserProfileWrapper currentAccount={currentAccount} handleNavigate={handleNavigate} extraAgents={extraAgents} myOrders={myOrders} myResources={myResources} handleUpgrade={handleUpgrade} setMyOrders={setMyOrders} setMyResources={setMyResources} />} />
          <Route path="/messages" element={<MessageCenterWrapper systemNotifications={systemNotifications} />} />
          <Route path="/settings" element={<SettingsView currentAccount={currentAccount} accounts={ACCOUNTS} onSwitchAccount={(id) => setCurrentAccount(ACCOUNTS.find((a) => a.id === id) || ACCOUNTS[0])} />} />
          <Route path="/demand-square" element={<DemandSquare />} />
          <Route path="/categories" element={<CategoryListView />} />
          <Route path="/agents/method" element={<AgentCategoryView category="method" onNavigateToDetail={(id) => handleNavigate("detail", { id })} />} />
          <Route path="/agents/analysis" element={<AgentCategoryView category="analysis" onNavigateToDetail={(id) => handleNavigate("detail", { id })} />} />
          <Route path="/services" element={<AgentCategoryView category="service" onNavigateToDetail={(id) => handleNavigate("detail", { id })} />} />
          <Route path="/documentation" element={<DocumentationView />} />
          <Route path="/resource-packs" element={<ResourcePackView orders={myOrders} onPurchase={handleResourcePackPurchase} />} />
          <Route path="/publish" element={<PublishWizardWrapper handleNavigate={handleNavigate} handlePublish={handlePublish} />} />
          <Route path="*" element={<Navigate to="/discovery" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// Wrappers to pass URL params to components expecting initialParams
const ProductDetailWrapper = ({ myOrders, handleNavigate, handlePurchase, handleUpgrade }: any) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action") as any;
  const upgrade_instance_id = searchParams.get("upgrade_instance_id") as string | undefined;
  const instance_name = searchParams.get("instance_name") as string | undefined;
  const instance_status = searchParams.get("instance_status") as string | undefined;

  const params = { id, action, upgrade_instance_id, instance_name, instance_status };
  const productOrders = id ? myOrders.filter((o: any) => o.resourceId === id.toString()) : [];

  return (
    <ProductDetail
      onBack={() => handleNavigate("discovery")}
      onNavigate={handleNavigate}
      onPurchase={handlePurchase}
      onUpgrade={handleUpgrade}
      initialParams={params}
      productOrders={productOrders}
    />
  );
};

const UserProfileWrapper = ({ currentAccount, handleNavigate, extraAgents, myOrders, myResources, handleUpgrade, setMyOrders, setMyResources }: any) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "assets";
  return (
    <UserProfile
      onNavigate={handleNavigate}
      currentAccount={currentAccount}
      initialParams={{ tab }}
      extraAssets={extraAgents}
      globalOrders={myOrders}
      globalResources={myResources}
      onUpgrade={handleUpgrade}
      onUpdateOrder={(orderId: string, updates: any) =>
        setMyOrders((prev: any[]) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
        )
      }
      onUpdateResource={(resourceId: string, updates: any) =>
        setMyResources((prev: any[]) =>
          prev.map((r) => (r.id === resourceId ? { ...r, ...updates } : r))
        )
      }
      onAddResource={(resource: any) => setMyResources((prev: any[]) => [resource, ...prev])}
    />
  );
};

const MessageCenterWrapper = ({ systemNotifications }: any) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all";
  return (
    <MessageCenter
      initialParams={{ tab }}
      systemNotifications={systemNotifications}
    />
  );
};

const PublishWizardWrapper = ({ handleNavigate, handlePublish }: any) => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "create";
  return (
    <PublishWizard
      onClose={() => handleNavigate("profile", { tab: "assets" })}
      onPublish={(data: any) => handlePublish(data, mode)}
      initialData={undefined} // Since we mock it, we pass undefined or handle assetData
      mode={mode as any}
    />
  );
};

export default App;
