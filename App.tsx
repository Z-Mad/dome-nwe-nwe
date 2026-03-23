import React, { useState } from "react";
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
  const [currentView, setCurrentView] = useState("discovery");
  const [viewParams, setViewParams] = useState<any>({});

  // Data State
  const [myOrders, setMyOrders] = useState(INITIAL_ORDERS);
  const [myResources, setMyResources] = useState(INITIAL_RESOURCES);
  const [extraAgents, setExtraAgents] = useState<any[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);

  const handleNavigate = (view: string, params?: any) => {
    setCurrentView(view);
    if (params) setViewParams(params);
  };

  const handlePublish = (data: any) => {
    if (viewParams?.mode === "version") {
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

  const renderContent = () => {
    switch (currentView) {
      case "discovery":
        return (
          <Discovery
            onNavigateToDetail={(id) => handleNavigate("detail", { id })}
            extraAgents={extraAgents}
          />
        );
      case "detail":
        // Check for existing orders to determine context
        // We pass the full list of orders for this resource to ProductDetail
        const productOrders = viewParams?.id
          ? myOrders.filter((o) => o.resourceId === viewParams.id.toString())
          : [];
        return (
          <ProductDetail
            onBack={() => handleNavigate("discovery")}
            onNavigate={handleNavigate}
            onPurchase={handlePurchase}
            onUpgrade={handleUpgrade}
            initialParams={viewParams}
            productOrders={productOrders}
          />
        );
      case "profile":
        return (
          <UserProfile
            onNavigate={handleNavigate}
            currentAccount={currentAccount}
            initialParams={viewParams}
            extraAssets={extraAgents}
            globalOrders={myOrders}
            globalResources={myResources}
            onUpgrade={handleUpgrade}
            onUpdateOrder={(orderId, updates) =>
              setMyOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
              )
            }
            onUpdateResource={(resourceId, updates) =>
              setMyResources((prev) =>
                prev.map((r) => (r.id === resourceId ? { ...r, ...updates } : r)),
              )
            }
            onAddResource={(resource) =>
              setMyResources((prev) => [resource, ...prev])
            }
          />
        );
      case "messages":
        return (
          <MessageCenter
            initialParams={viewParams}
            systemNotifications={systemNotifications}
          />
        );
      case "settings":
        return (
          <SettingsView
            currentAccount={currentAccount}
            accounts={ACCOUNTS}
            onSwitchAccount={(id) =>
              setCurrentAccount(
                ACCOUNTS.find((a) => a.id === id) || ACCOUNTS[0],
              )
            }
          />
        );
      case "demand_square":
        return <DemandSquare />;
      case "categories":
        return <CategoryListView />;
      case "method_agents":
        return (
          <AgentCategoryView
            category="method"
            onNavigateToDetail={(id) => handleNavigate("detail", { id })}
          />
        );
      case "analysis_agents":
        return (
          <AgentCategoryView
            category="analysis"
            onNavigateToDetail={(id) => handleNavigate("detail", { id })}
          />
        );
      case "services":
        return (
          <AgentCategoryView
            category="service"
            onNavigateToDetail={(id) => handleNavigate("detail", { id })}
          />
        );
      case "documentation":
        return <DocumentationView />;
      case "resource_packs":
        return (
          <ResourcePackView
            orders={myOrders}
            onPurchase={handleResourcePackPurchase}
          />
        );
      case "publish_wizard":
        return (
          <PublishWizard
            onClose={() => handleNavigate("profile", { tab: "assets" })}
            onPublish={handlePublish}
            initialData={viewParams?.assetData}
            mode={viewParams?.mode}
          />
        );
      default:
        return (
          <Discovery
            onNavigateToDetail={() => handleNavigate("detail")}
            extraAgents={extraAgents}
          />
        );
    }
  };

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
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
