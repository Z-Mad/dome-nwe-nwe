import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import TabNav, { TabItem } from "./TabNav";
import { SELLER_TABS, SellerTab } from "./sellerTabs";

interface SellerConsoleProps {
  sellerTab: SellerTab;
  onSellerTabChange: (tab: SellerTab) => void;
  renderDashboard: () => React.ReactNode;
  renderAssets: () => React.ReactNode;
  renderFinance: () => React.ReactNode;
  renderSupport: () => React.ReactNode;
  renderAnalysis: () => React.ReactNode;
  renderHealth: () => React.ReactNode;
  renderSellerModals: () => React.ReactNode;
}

const SellerConsole: React.FC<SellerConsoleProps> = ({
  sellerTab,
  onSellerTabChange,
  renderDashboard,
  renderAssets,
  renderFinance,
  renderSupport,
  renderAnalysis,
  renderHealth,
  renderSellerModals,
}) => {
  const navigate = useNavigate();
  const sellerRoutes: Record<SellerTab, () => React.ReactNode> = {
    dashboard: renderDashboard,
    assets: renderAssets,
    finance: renderFinance,
    support: renderSupport,
    analysis: renderAnalysis,
    health: renderHealth,
  };

  const handleSellerTabChange = (tab: SellerTab) => {
    onSellerTabChange(tab);
    navigate(`/profile/seller/${tab}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {renderSellerModals()}
      <TabNav
        tabs={SELLER_TABS as TabItem<SellerTab>[]}
        currentTab={sellerTab}
        onChange={handleSellerTabChange}
        activeClassName="border-indigo-600 text-indigo-600"
      />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<>{sellerRoutes.dashboard()}</>} />
        <Route path="assets" element={<>{sellerRoutes.assets()}</>} />
        <Route path="finance" element={<>{sellerRoutes.finance()}</>} />
        <Route path="support" element={<>{sellerRoutes.support()}</>} />
        <Route path="analysis" element={<>{sellerRoutes.analysis()}</>} />
        <Route path="health" element={<>{sellerRoutes.health()}</>} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default SellerConsole;
