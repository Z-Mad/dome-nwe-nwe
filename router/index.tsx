import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom'

const Discovery = lazy(() => import('@/src/Discovery/index'))
const ProductDetail = lazy(() => import('@/src/ProductDetail/index'))
const PublishWizard = lazy(() => import('@/src/PublishWizard/index'))
const UserProfile = lazy(() => import('@/src/UserProfile/index'))
const DemandSquare = lazy(() => import('@/src/DemandSquare/index'))
const CategoryListView = lazy(() => import('@/src/CategoryListView/index'))
const AgentCategoryView = lazy(() => import('@/src/AgentCategoryView/index'))
const DocumentationView = lazy(() => import('@/src/DocumentationView/index'))
const SettingsView = lazy(() => import('@/src/SettingsView/index'))
const MessageCenter = lazy(() => import('@/src/MessageCenter/index'))
const ResourcePackView = lazy(() => import('@/src/ResourcePackView/index'))

interface AppRouterProps {
  extraAgents: any
  myOrders: any
  myResources: any
  systemNotifications: any
  currentAccount: any
  ACCOUNTS: any
  setCurrentAccount: any
  handleNavigate: (view: string, params?: any) => void
  handlePurchase: any
  handleUpgrade: any
  setMyOrders: any
  setMyResources: any
  onPublishDone: (data: any, mode?: string) => void
  onResourcePackPurchaseDone: (
    items: any[],
    targetOrderId: string,
    version: string,
    method: string,
  ) => void
}

const AppRouter: React.FC<AppRouterProps> = ({
  extraAgents,
  myOrders,
  myResources,
  systemNotifications,
  currentAccount,
  ACCOUNTS,
  setCurrentAccount,
  handleNavigate,
  handlePurchase,
  handleUpgrade,
  setMyOrders,
  setMyResources,
  onPublishDone,
  onResourcePackPurchaseDone,
}) => {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">页面加载中...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/discovery" replace />} />
        <Route
          path="/discovery"
          element={
            <Discovery
              onNavigateToDetail={(id) => handleNavigate('detail', { id })}
              extraAgents={extraAgents}
            />
          }
        />
        <Route
          path="/detail/:id"
          element={
            <ProductDetailWrapper
              myOrders={myOrders}
              handleNavigate={handleNavigate}
              handlePurchase={handlePurchase}
              handleUpgrade={handleUpgrade}
            />
          }
        />
        <Route path="/detail" element={<Navigate to="/discovery" replace />} />
        <Route
          path="/profile/*"
          element={
            <UserProfileWrapper
              currentAccount={currentAccount}
              handleNavigate={handleNavigate}
              extraAgents={extraAgents}
              myOrders={myOrders}
              myResources={myResources}
              handleUpgrade={handleUpgrade}
              setMyOrders={setMyOrders}
              setMyResources={setMyResources}
            />
          }
        />
        <Route
          path="/messages"
          element={<MessageCenterWrapper systemNotifications={systemNotifications} />}
        />
        <Route
          path="/settings"
          element={
            <SettingsView
              currentAccount={currentAccount}
              accounts={ACCOUNTS}
              onSwitchAccount={setCurrentAccount}
            />
          }
        />
        <Route path="/demand-square" element={<DemandSquare />} />
        <Route path="/categories" element={<CategoryListView />} />
        <Route
          path="/agents/method"
          element={
            <AgentCategoryView
              category="method"
              onNavigateToDetail={(id) => handleNavigate('detail', { id })}
            />
          }
        />
        <Route
          path="/agents/analysis"
          element={
            <AgentCategoryView
              category="analysis"
              onNavigateToDetail={(id) => handleNavigate('detail', { id })}
            />
          }
        />
        <Route
          path="/services"
          element={
            <AgentCategoryView
              category="service"
              onNavigateToDetail={(id) => handleNavigate('detail', { id })}
            />
          }
        />
        <Route path="/documentation" element={<DocumentationView />} />
        <Route
          path="/resource-packs"
          element={<ResourcePackView orders={myOrders} onPurchase={onResourcePackPurchaseDone} />}
        />
        <Route
          path="/publish"
          element={
            <PublishWizardWrapper handleNavigate={handleNavigate} handlePublish={onPublishDone} />
          }
        />
        <Route path="*" element={<Navigate to="/discovery" replace />} />
      </Routes>
    </Suspense>
  )
}

// Wrappers to pass URL params to components expecting initialParams
const ProductDetailWrapper = ({ myOrders, handleNavigate, handlePurchase, handleUpgrade }: any) => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action') as any
  const upgrade_instance_id = searchParams.get('upgrade_instance_id') as string | undefined
  const instance_name = searchParams.get('instance_name') as string | undefined
  const instance_status = searchParams.get('instance_status') as string | undefined

  const params = { id, action, upgrade_instance_id, instance_name, instance_status }
  const productOrders = id ? myOrders.filter((o: any) => o.resourceId === id.toString()) : []

  return (
    <ProductDetail
      onBack={() => handleNavigate('discovery')}
      onNavigate={handleNavigate}
      onPurchase={handlePurchase}
      onUpgrade={handleUpgrade}
      initialParams={params}
      productOrders={productOrders}
    />
  )
}

const UserProfileWrapper = ({
  currentAccount,
  handleNavigate,
  extraAgents,
  myOrders,
  myResources,
  handleUpgrade,
  setMyOrders,
  setMyResources,
}: any) => {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'assets'
  return (
    <UserProfile
      onNavigate={handleNavigate}
      currentAccount={currentAccount}
      initialParams={{ tab }}
      extraAssets={extraAgents}
      globalOrders={myOrders}
      globalResources={myResources}
      onUpgrade={handleUpgrade}
      onUpdateOrder={(orderId: string, updates: any) =>
        setMyOrders((prev: any[]) =>
          prev.map((o: any) => (o.id === orderId ? { ...o, ...updates } : o)),
        )
      }
      onUpdateResource={(resourceId: string, updates: any) =>
        setMyResources((prev: any[]) =>
          prev.map((r: any) => (r.id === resourceId ? { ...r, ...updates } : r)),
        )
      }
      onAddResource={(resource: any) => setMyResources((prev: any[]) => [resource, ...prev])}
    />
  )
}

const MessageCenterWrapper = ({ systemNotifications }: any) => {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'all'
  return <MessageCenter initialParams={{ tab }} systemNotifications={systemNotifications} />
}

const PublishWizardWrapper = ({ handleNavigate, handlePublish }: any) => {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'create'
  return (
    <PublishWizard
      onClose={() => handleNavigate('profile', { tab: 'assets' })}
      onPublish={(data: any) => handlePublish(data, mode)}
      initialData={undefined}
      mode={mode as any}
    />
  )
}

export default AppRouter
