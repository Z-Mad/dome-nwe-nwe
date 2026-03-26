import { create } from 'zustand'
import { INITIAL_ORDERS, INITIAL_RESOURCES, getFutureDate } from '../data'

interface MarketState {
  myOrders: any[]
  myResources: any[]
  extraAgents: any[]
  systemNotifications: any[]

  setMyOrders: (updater: any) => void
  setMyResources: (updater: any) => void

  handlePublish: (data: any, mode?: string) => void
  handlePurchase: (product: any, planDetails: any) => void
  handleUpgrade: (orderId: string, planDetails: any) => void
  handleResourcePackPurchase: (
    items: any[],
    targetOrderId: string,
    version: string,
    method: string,
  ) => void
}

export const useMarketStore = create<MarketState>((set, get) => ({
  myOrders: INITIAL_ORDERS,
  myResources: INITIAL_RESOURCES,
  extraAgents: [],
  systemNotifications: [],

  setMyOrders: (updater: any) => {
    set((state) => ({
      myOrders: typeof updater === 'function' ? updater(state.myOrders) : updater,
    }))
  },

  setMyResources: (updater: any) => {
    set((state) => ({
      myResources: typeof updater === 'function' ? updater(state.myResources) : updater,
    }))
  },

  handlePublish: (data: any, mode?: string) => {
    if (mode === 'version') {
      console.log('Published new version for:', data.title, data.nextVersion)
    } else {
      set((state) => ({
        extraAgents: [
          ...state.extraAgents,
          {
            ...data,
            id: `new_${Date.now()}`,
            currentVersion: data.nextVersion,
          },
        ],
      }))
    }
  },

  handlePurchase: (product: any, planDetails: any) => {
    const isTrial = planDetails.type === 'trial'
    const amount = planDetails.amount || 0

    const newOrder = {
      id: `ORD-${Date.now()}`,
      productName: product.title || product.name,
      version: planDetails.version || product.version,
      resourceId: product.id,
      provider: product.provider || '维观云',
      type: isTrial ? 'Subscription' : planDetails.type,
      orderType: isTrial ? 'Trial' : 'New',
      amount: amount,
      status: isTrial
        ? 'Trial'
        : planDetails.paymentMethod === 'CorporateRemittance'
          ? 'Pending'
          : 'Active',
      paymentStatus:
        amount === 0 || planDetails.paymentMethod !== 'CorporateRemittance'
          ? 'Paid'
          : 'PendingPayment',
      autoRenew: !isTrial,
      date: new Date().toISOString().split('T')[0],
      createTime: new Date().toLocaleString(),
      payTime:
        amount === 0 || planDetails.paymentMethod !== 'CorporateRemittance'
          ? new Date().toLocaleString()
          : '-',
      paymentMethod: planDetails.paymentMethod || (amount === 0 ? 'Free' : 'Alipay'),
      invoiceStatus: isTrial ? 'NotRequired' : 'Unissued',
      instanceName:
        planDetails.instanceName ||
        (isTrial
          ? `Trial-Instance-${Date.now().toString().slice(-4)}`
          : `Instance-${Date.now().toString().slice(-4)}`),
      apiKey: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      expireDate: isTrial
        ? getFutureDate(planDetails.trialConfig?.duration || 7)
        : planDetails.period === 'Monthly'
          ? getFutureDate(30)
          : getFutureDate(365),
      snapshot: planDetails,
      history: [
        {
          date: new Date().toLocaleString(),
          event: isTrial ? '试用开启' : '订单创建',
        },
      ],
    }

    if (isTrial && amount > 0 && planDetails.paymentMethod === 'CorporateRemittance') {
      newOrder.status = 'Pending'
    }

    set((state) => ({
      myOrders: [newOrder, ...state.myOrders],
    }))

    if (newOrder.paymentStatus === 'Paid') {
      const newResource = {
        id: `RES-${Date.now()}`,
        orderId: newOrder.id,
        orderType: newOrder.orderType,
        productName: newOrder.productName,
        version: newOrder.version,
        provider: newOrder.provider,
        instanceName: newOrder.instanceName || '默认实例',
        status: 'PendingActivation',
        expireDate: newOrder.expireDate,
        autoRenew: newOrder.autoRenew,
        quota: { tokens: 500000, storage: 5 },
        usage: { tokens: 0, storage: 0 },
      }
      set((state) => ({
        myResources: [newResource, ...state.myResources],
      }))
    }

    if (isTrial) {
      set((state) => ({
        systemNotifications: [
          ...state.systemNotifications,
          {
            id: `sys-notif-${Date.now()}`,
            senderId: 'sys_01',
            text: `您的试用申请已通过！产品：${product.name || product.title}，有效期至：${getFutureDate(planDetails.trialConfig?.duration || 7)}。`,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: 'text',
          },
        ],
      }))
    }
  },

  handleUpgrade: (orderId: string, planDetails: any) => {
    const { myOrders, myResources } = get()
    const orderToUpdate = myOrders.find((o) => o.id === orderId)
    if (!orderToUpdate) return

    const updatedOrder = {
      ...orderToUpdate,
      status: planDetails.paymentMethod === 'CorporateRemittance' ? 'Pending' : 'Active',
      paymentStatus:
        planDetails.paymentMethod === 'CorporateRemittance' ? 'PendingPayment' : 'Paid',
      type: 'Subscription',
      orderType: 'Renewal',
      amount: planDetails.amount,
      autoRenew: true,
      payTime:
        planDetails.paymentMethod === 'CorporateRemittance' ? '-' : new Date().toLocaleString(),
      paymentMethod: planDetails.paymentMethod || 'Alipay',
      invoiceStatus: 'Unissued',
      expireDate: planDetails.period === 'Monthly' ? getFutureDate(30) : getFutureDate(365),
      snapshot: {
        ...orderToUpdate.snapshot,
        plan: planDetails.planName,
        period: planDetails.period,
        quota: planDetails.quota,
      },
      history: [
        ...orderToUpdate.history,
        { date: new Date().toLocaleString(), event: '升级为付费版' },
      ],
    }

    set({
      myOrders: myOrders.map((order) => (order.id === orderId ? updatedOrder : order)),
    })

    if (updatedOrder.paymentStatus === 'Paid') {
      set({
        myResources: myResources.map((r) => {
          if (r.orderId === orderId) {
            return {
              ...r,
              expireDate: updatedOrder.expireDate,
              status: r.status === 'Expired' ? 'Running' : r.status,
            }
          }
          return r
        }),
      })
    }
  },

  handleResourcePackPurchase: (
    items: any[],
    targetOrderId: string,
    version: string,
    method: string,
  ) => {
    const { myOrders, myResources } = get()
    const targetOrder = myOrders.find((o) => o.id === targetOrderId)
    const targetProductName = targetOrder ? targetOrder.productName : 'Unknown Product'
    const targetInstanceName = targetOrder ? targetOrder.instanceName : 'Unknown Instance'
    const targetVersion = targetOrder ? targetOrder.version : version

    const newOrders = items.map((item) => ({
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productName: item.name,
      version: targetVersion,
      resourceId: item.id,
      provider: '维观云',
      type: 'ResourcePack',
      orderType: 'ResourcePack',
      targetOrderId: targetOrderId,
      amount: item.subtotal,
      status: method === 'offline' ? 'Pending' : 'Active',
      paymentStatus: method === 'offline' ? 'PendingPayment' : 'Paid',
      autoRenew: false,
      date: new Date().toISOString().split('T')[0],
      createTime: new Date().toLocaleString(),
      payTime: method === 'offline' ? '-' : new Date().toLocaleString(),
      paymentMethod:
        method === 'offline' ? 'CorporateRemittance' : method === 'wechat' ? 'WeChat' : 'Alipay',
      invoiceStatus: 'Unissued',
      instanceName: `挂载: ${targetProductName} (${targetInstanceName})`,
      mountedOn: {
        name: targetProductName,
        version: targetVersion,
        instanceId: targetOrderId,
      },
      expireDate: '2025-10-18',
      snapshot: item,
      history: [{ date: new Date().toLocaleString(), event: '购买成功' }],
    }))

    set({
      myOrders: [...newOrders, ...myOrders],
    })

    if (method !== 'offline') {
      set({
        myResources: myResources.map((r) => {
          if (r.orderId === targetOrderId) {
            return {
              ...r,
              quota: {
                tokens: (r.quota?.tokens || 0) + 100000,
                storage: (r.quota?.storage || 0) + 10,
              },
            }
          }
          return r
        }),
      })
    }
  },
}))
