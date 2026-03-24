import React from "react";
import { Box, FileText, Headphones, LayoutDashboard, PieChart, Receipt } from "lucide-react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import TabNav, { TabItem } from "./TabNav";

export type BuyerTab =
  | "dashboard"
  | "orders"
  | "bills"
  | "invoices"
  | "resources"
  | "analysis"
  | "support";

const BUYER_TABS: TabItem<BuyerTab>[] = [
  { id: "dashboard", label: "概览", icon: LayoutDashboard },
  { id: "orders", label: "订单管理", icon: FileText },
  { id: "bills", label: "账单管理", icon: FileText },
  { id: "invoices", label: "发票管理", icon: Receipt },
  { id: "resources", label: "我的资源", icon: Box },
  { id: "analysis", label: "成本分析", icon: PieChart },
  { id: "support", label: "服务支持", icon: Headphones },
] as const;

export const isBuyerTab = (tab: string): tab is BuyerTab => {
  return BUYER_TABS.some((item) => item.id === tab);
};

interface BuyerConsoleProps {
  buyerTab: BuyerTab;
  onBuyerTabChange: (tab: BuyerTab) => void;
  renderDashboard: () => React.ReactNode;
  renderOrders: () => React.ReactNode;
  renderBills: () => React.ReactNode;
  renderInvoices: () => React.ReactNode;
  renderResources: () => React.ReactNode;
  renderAnalysis: () => React.ReactNode;
  renderSupport: () => React.ReactNode;
  renderBuyerModals: () => React.ReactNode;
}

const BuyerConsole: React.FC<BuyerConsoleProps> = ({
  buyerTab,
  onBuyerTabChange,
  renderDashboard,
  renderOrders,
  renderBills,
  renderInvoices,
  renderResources,
  renderAnalysis,
  renderSupport,
  renderBuyerModals,
}) => {
  const navigate = useNavigate();
  const buyerRoutes: Record<BuyerTab, () => React.ReactNode> = {
    dashboard: renderDashboard,
    orders: renderOrders,
    bills: renderBills,
    invoices: renderInvoices,
    resources: renderResources,
    analysis: renderAnalysis,
    support: renderSupport,
  };

  const handleBuyerTabChange = (tab: BuyerTab) => {
    onBuyerTabChange(tab);
    navigate(`/profile/buyer/${tab}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {renderBuyerModals()}
      <TabNav
        tabs={BUYER_TABS}
        currentTab={buyerTab}
        onChange={handleBuyerTabChange}
        activeClassName="border-blue-600 text-blue-600"
      />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<>{buyerRoutes.dashboard()}</>} />
        <Route path="orders" element={<>{buyerRoutes.orders()}</>} />
        <Route path="bills" element={<>{buyerRoutes.bills()}</>} />
        <Route path="invoices" element={<>{buyerRoutes.invoices()}</>} />
        <Route path="resources" element={<>{buyerRoutes.resources()}</>} />
        <Route path="analysis" element={<>{buyerRoutes.analysis()}</>} />
        <Route path="support" element={<>{buyerRoutes.support()}</>} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default BuyerConsole;
