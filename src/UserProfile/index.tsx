import React, { Suspense, lazy, useCallback, useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { Account } from "@/types";
import { type BuyerTab, isBuyerTab } from "./Buyer/buyerTabs";
import { type SellerTab, isSellerTab } from "./Seller/sellerTabs";
import { useUserProfileStore } from "./Core/useUserProfileStore";
import { useUserStore } from "@/utils/user";

const BuyerConsole = lazy(() => import('./Buyer/BuyerConsole'))
const SellerConsole = lazy(() => import('./Seller/SellerConsole'))
const ProfileHeader = lazy(() => import('./Shared/components/organisms/ProfileHeader'))

interface UserProfileProps {
  onNavigate: (view: string, params?: any) => void
  currentAccount: Account
  initialParams?: { tab?: string; conversationId?: string }
  extraAssets?: any[]
  globalOrders?: any[]
  globalResources?: any[]
  onUpgrade?: (orderId: string, planDetails: any) => void
  onUpdateOrder?: (orderId: string, updates: any) => void
  onUpdateResource?: (resourceId: string, updates: any) => void
  onAddResource?: (resource: any) => void
}

const UserProfileContent: React.FC<UserProfileProps> = ({ currentAccount, initialParams }) => {
  const { userInfo } = useUserStore()

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const consoleMode = useUserProfileStore((state) => state.consoleMode)
  const setConsoleMode = useUserProfileStore((state) => state.setConsoleMode)

  const displayAccount = useMemo(
    () => ({
      ...currentAccount,
      avatar: userInfo?.avatar,
      displayName: userInfo?.userName,
      orgInfo: `${userInfo?.tenantName} ID:${userInfo?.tenantId}`,
    }),
    [currentAccount, userInfo],
  )

  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const routeMode = pathParts[1];
    const routeTab = pathParts[2];
    if (routeMode === "buyer" && routeTab && isBuyerTab(routeTab)) {
      setConsoleMode("buyer");
    }
    if (routeMode === "seller" && routeTab && isSellerTab(routeTab)) {
      setConsoleMode("seller");
    }

  }, [location.pathname, setConsoleMode, isBuyerTab, isSellerTab]);
  const handleConsoleModeChange = (mode: "buyer" | "seller") => {
    if (mode === consoleMode) return
    navigate(`/profile/${mode}/dashboard`)
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-6 md:p-8 relative">
      <div className="max-w-6xl mx-auto pb-20">

        <Suspense
          fallback={
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">
              加载中...
            </div>
          }
        >
          <ProfileHeader
            displayAccount={displayAccount}
            consoleMode={consoleMode}
            onConsoleModeChange={handleConsoleModeChange}
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">
              工作台加载中...
            </div>
          }
        >
          <Routes>
            <Route path="buyer/*" element={<BuyerConsole />} />
            <Route path="seller/*" element={<SellerConsole />} />
            <Route
              path="*"
              element={
                <Navigate
                  to={currentAccount.role === 'viewer' ? 'buyer/dashboard' : 'seller/assets'}
                  replace
                />
              }
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  const initStore = useUserProfileStore((state) => state.initStore)
  const toastMsg = useUserProfileStore((state) => state.toastMsg)
  const setActiveModal = useUserProfileStore((state) => state.setActiveModal)
  const [, setSearchParams] = useSearchParams()
  const location = useLocation()

  useEffect(() => {
    initStore({
      ...props,
      consoleMode: props.currentAccount.role === 'viewer' ? 'buyer' : 'seller',
    })
  }, [props, initStore])

  useEffect(() => {
    // Only set it once or if it changes
    useUserProfileStore.setState({ setSearchParamsFn: setSearchParams })
  }, [setSearchParams])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setActiveModal(params.get('modal'))
  }, [location.search, setActiveModal])

  return (
    <>
      <UserProfileContent {...props} />
      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4" >
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}
    </>
  )
}

export default UserProfile
