import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import TabNav, { TabItem } from "../Shared/TabNav";
import { BUYER_TABS, BuyerTab } from "./buyerTabs";

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
        tabs={BUYER_TABS as TabItem<BuyerTab>[]}
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

export default React.memo(BuyerConsole);
