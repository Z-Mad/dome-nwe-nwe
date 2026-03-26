import React from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import TabNav from '../Shared/components/molecules/TabNav'
import { SELLER_TABS, type SellerTab } from './sellerTabs'
import { Dashboard, Assets, Finance, Support, Analysis, Health } from './tabs'
import { SellerModals } from './SellerModals'

const SellerConsole: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = (location.pathname.split('/').pop() as SellerTab) || 'dashboard'

  const handleSellerTabChange = (tab: SellerTab) => {
    navigate(`/profile/seller/${tab}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <SellerModals />
      <TabNav
        tabs={SELLER_TABS}
        currentTab={currentTab}
        onChange={handleSellerTabChange}
        activeClassName="border-indigo-600 text-indigo-600"
      />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="finance" element={<Finance />} />
        <Route path="support" element={<Support />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="health" element={<Health />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default SellerConsole
