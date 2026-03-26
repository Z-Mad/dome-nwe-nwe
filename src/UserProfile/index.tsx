import { type Account } from '@/types'
import { useUserStore } from '@/utils/user'
import React, { Suspense, lazy, useCallback, useEffect, useMemo } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { type BuyerTab, isBuyerTab } from './Buyer/buyerTabs'
import { useUserProfileStore } from './Core/useUserProfileStore'
import { type SellerTab, isSellerTab } from './Seller/sellerTabs'

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
      displayName: userInfo?.userName || '',
      orgInfo: userInfo ? `${userInfo.tenantName} ID:${userInfo.tenantId}` : '',
    }),
    [currentAccount, userInfo],
  )

  const navigateBuyerTab = useCallback(
    (tab: BuyerTab) => {
      setConsoleMode('buyer')
      navigate(`/profile/buyer/${tab}`)
    },
    [navigate],
  )

  const navigateSellerTab = useCallback(
    (tab: SellerTab) => {
      if (currentAccount.role === 'viewer') {
        navigate('/profile/buyer/dashboard', { replace: true })
        return
      }
      setConsoleMode('seller')
      navigate(`/profile/seller/${tab}`)
    },
    [currentAccount.role, navigate],
  )

  useEffect(() => {
    if (
      initialParams?.tab &&
      !location.pathname.startsWith('/profile/buyer/') &&
      !location.pathname.startsWith('/profile/seller/')
    ) {
      if (initialParams.tab === 'assets') {
        navigateSellerTab('assets')
      } else if (initialParams.tab === 'orders') {
        navigateBuyerTab('orders')
      } else if (isBuyerTab(initialParams.tab)) {
        navigateBuyerTab(initialParams.tab)
      } else if (isSellerTab(initialParams.tab)) {
        navigateSellerTab(initialParams.tab)
      } else {
        navigateBuyerTab('dashboard')
      }
      return
    }
    const queryTab = searchParams.get('tab')
    if (queryTab) {
      if (queryTab === 'assets') {
        navigateSellerTab('assets')
      } else if (queryTab === 'orders') {
        navigateBuyerTab('orders')
      } else if (isBuyerTab(queryTab)) {
        navigateBuyerTab(queryTab)
      } else if (isSellerTab(queryTab)) {
        navigateSellerTab(queryTab)
      } else {
        navigateBuyerTab('dashboard')
      }
      return
    }
    if (location.pathname === '/profile' || location.pathname === '/profile/') {
      if (currentAccount.role === 'viewer') {
        navigate('/profile/buyer/dashboard', { replace: true })
      } else {
        navigate('/profile/seller/assets', { replace: true })
      }
      return
    }
    const pathParts = location.pathname.split('/').filter(Boolean)
    const routeMode = pathParts[1]
    const routeTab = pathParts[2]
    if (routeMode === 'buyer' && routeTab && isBuyerTab(routeTab)) {
      setConsoleMode('buyer')
      return
    }
    if (routeMode === 'seller' && routeTab && isSellerTab(routeTab)) {
      if (currentAccount.role === 'viewer') {
        navigate('/profile/buyer/dashboard', { replace: true })
        return
      }
      setConsoleMode('seller')
      return
    }
    if (currentAccount.role === 'viewer') {
      navigate('/profile/buyer/dashboard', { replace: true })
    } else {
      navigate('/profile/seller/assets', { replace: true })
    }
  }, [initialParams, location.pathname, searchParams, currentAccount.role])

  const handleConsoleModeChange = useCallback(
    (mode: 'buyer' | 'seller') => {
      if (mode === 'buyer') {
        navigateBuyerTab('dashboard')
        return
      }
      navigateSellerTab('assets')
    },
    [navigateBuyerTab, navigateSellerTab],
  )

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
            role={currentAccount.role}
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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}
    </>
  )
}

export default UserProfile
