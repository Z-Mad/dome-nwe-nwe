import React from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import TabNav, { type TabItem } from '../Shared/components/molecules/TabNav'
import { BUYER_TABS, type BuyerTab } from './buyerTabs'
import { Dashboard, Orders, Bills, Invoices, Resources, Analysis, Support } from './tabs'
import { BuyerModals } from './BuyerModals'

const BuyerConsole: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = (location.pathname.split('/').pop() as BuyerTab) || 'dashboard'

  const handleBuyerTabChange = (tab: BuyerTab) => {
    navigate(`/profile/buyer/${tab}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <BuyerModals />
      <TabNav
        tabs={BUYER_TABS as TabItem<BuyerTab>[]}
        currentTab={currentTab}
        onChange={handleBuyerTabChange}
        activeClassName="border-blue-600 text-blue-600"
      />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="bills" element={<Bills />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="resources" element={<Resources />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default React.memo(BuyerConsole)
