import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MarketplaceSidebar from './components/MarketplaceSidebar'

import { useAuthStore } from './store/authStore'
import { useMarketStore } from './store/marketStore'
import AppRouter from './router'
import { ACCOUNTS } from './data'
import { useUserStore } from './utils/user'

const App: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { checkDeveloper } = useUserStore()

  const { initAuth, currentAccount, setCurrentAccount } = useAuthStore()
  const {
    myOrders,
    myResources,
    extraAgents,
    systemNotifications,
    setMyOrders,
    setMyResources,
    handlePublish,
    handlePurchase,
    handleUpgrade,
    handleResourcePackPurchase,
  } = useMarketStore()

  const initialized = React.useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initAuth()
  }, [initAuth])

  const handleNavigate = (view: string, params?: any) => {
    let path = '/'
    let search = ''

    switch (view) {
      case 'discovery':
        path = '/discovery'
        break
      case 'detail':
        path = `/detail/${params?.id || ''}`
        if (params) {
          const searchParams = new URLSearchParams()
          if (params.action) searchParams.set('action', params.action)
          if (params.upgrade_instance_id)
            searchParams.set('upgrade_instance_id', params.upgrade_instance_id)
          if (params.instance_name) searchParams.set('instance_name', params.instance_name)
          if (params.instance_status) searchParams.set('instance_status', params.instance_status)
          search = searchParams.toString()
        }
        break
      case 'profile':
        console.log(params?.tab)
        if (params?.tab) {
          const tab = params.tab
          const buyerTabs = [
            'dashboard',
            'orders',
            'bills',
            'invoices',
            'resources',
            'analysis',
            'support',
          ]
          const sellerTabs = ['dashboard', 'assets', 'finance', 'support', 'analysis', 'health']
          if (buyerTabs.includes(tab)) {
            path = `/profile/buyer/${tab}`
          } else if (sellerTabs.includes(tab)) {
            path = `/profile/seller/${tab}`
          } else if (tab === 'assets') {
            path = '/profile/seller/assets'
          } else {
            path = '/profile/buyer/dashboard'
          }
        } else {
          path = checkDeveloper ? '/profile/seller/assets' : '/profile/buyer/dashboard'
        }
        break
      case 'messages':
        path = '/messages'
        break
      case 'settings':
        path = '/settings'
        break
      case 'demand_square':
        path = '/demand-square'
        break
      case 'categories':
        path = '/categories'
        break
      case 'method_agents':
        path = '/agents/method'
        break
      case 'analysis_agents':
        path = '/agents/analysis'
        break
      case 'services':
        path = '/services'
        break
      case 'documentation':
        path = '/documentation'
        break
      case 'resource_packs':
        path = '/resource-packs'
        break
      case 'publish_wizard':
        path = '/publish'
        if (params) {
          const searchParams = new URLSearchParams()
          if (params.mode) searchParams.set('mode', params.mode)
          search = searchParams.toString()
        }
        break
      default:
        path = '/discovery'
    }

    navigate(search ? `${path}?${search}` : path)
  }

  const onPublishDone = (data: any, mode?: string) => {
    handlePublish(data, mode)
    handleNavigate('profile', { tab: 'assets' })
  }

  const onResourcePackPurchaseDone = (
    items: any[],
    targetOrderId: string,
    version: string,
    method: string,
  ) => {
    handleResourcePackPurchase(items, targetOrderId, version, method)
    handleNavigate('profile', { tab: 'orders' })
  }

  const currentView = (() => {
    const path = location.pathname
    if (path.startsWith('/detail')) return 'detail'
    if (path.startsWith('/profile')) return 'profile'
    if (path.startsWith('/messages')) return 'messages'
    if (path.startsWith('/settings')) return 'settings'
    if (path.startsWith('/demand-square')) return 'demand_square'
    if (path.startsWith('/categories')) return 'categories'
    if (path.startsWith('/agents/method')) return 'method_agents'
    if (path.startsWith('/agents/analysis')) return 'analysis_agents'
    if (path.startsWith('/services')) return 'services'
    if (path.startsWith('/documentation')) return 'documentation'
    if (path.startsWith('/resource-packs')) return 'resource_packs'
    if (path.startsWith('/publish')) return 'publish_wizard'
    return 'discovery'
  })()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <MarketplaceSidebar
        currentView={currentView}
        onChangeView={handleNavigate}
        onPublish={() => handleNavigate('publish_wizard', { mode: 'create' })}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <AppRouter
          extraAgents={extraAgents}
          myOrders={myOrders}
          myResources={myResources}
          systemNotifications={systemNotifications}
          currentAccount={currentAccount}
          ACCOUNTS={ACCOUNTS}
          setCurrentAccount={setCurrentAccount}
          handleNavigate={handleNavigate}
          handlePurchase={handlePurchase}
          handleUpgrade={handleUpgrade}
          setMyOrders={setMyOrders}
          setMyResources={setMyResources}
          onPublishDone={onPublishDone}
          onResourcePackPurchaseDone={onResourcePackPurchaseDone}
        />
      </div>
    </div>
  )
}

export default App
