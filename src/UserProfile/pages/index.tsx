// pages/profile/index.tsx
import { Routes, Route } from 'react-router-dom';
import ProfileLayout from './ProfileLayout';
import BuyerDashboard from './buyer/Dashboard';
import BuyerOrders from './buyer/Orders';
import BuyerBills from './buyer/Bills';
import BuyerInvoices from './buyer/Invoices';
import BuyerResources from './buyer/Resources';
import BuyerAnalysis from './buyer/Analysis';
import BuyerSupport from './buyer/Support';
import SellerDashboard from './seller/Dashboard';
import SellerAssets from './seller/Assets';
import SellerFinance from './seller/Finance';
import SellerSupport from './seller/Support';
import SellerAnalysis from './seller/Analysis';
import SellerHealth from './seller/Health';

export const ProfileRoutes = (props: any) => {
  return (
    <Route path="/profile" element={<ProfileLayout {...props} />}>
      {/* 买家路由 */}
      <Route path="buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="buyer/orders" element={<BuyerOrders />} />
      <Route path="buyer/bills" element={<BuyerBills />} />
      <Route path="buyer/invoices" element={<BuyerInvoices />} />
      <Route path="buyer/resources" element={<BuyerResources />} />
      <Route path="buyer/analysis" element={<BuyerAnalysis />} />
      <Route path="buyer/support" element={<BuyerSupport />} />

      {/* 卖家路由 */}
      <Route path="seller/dashboard" element={<SellerDashboard />} />
      <Route path="seller/assets" element={<SellerAssets />} />
      <Route path="seller/finance" element={<SellerFinance />} />
      <Route path="seller/support" element={<SellerSupport />} />
      <Route path="seller/analysis" element={<SellerAnalysis />} />
      <Route path="seller/health" element={<SellerHealth />} />

      {/* 重定向 */}
      <Route index element={<BuyerDashboard />} />
    </Route>
  );
};