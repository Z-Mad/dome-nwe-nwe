import { create } from 'zustand'
import { SELLER_MONITORING_MOCK, SELLER_REFUNDS_MOCK, RICH_ASSETS_MOCK } from './constants'

interface MonitoringItem {
  id: string
  buyer: string
  orderId: string
  asset: string
  version: string
  [key: string]: any
}

interface SellerState {
  monitoringData: MonitoringItem[]
  setMonitoringData: (
    data: MonitoringItem[] | ((prev: MonitoringItem[]) => MonitoringItem[]),
  ) => void
  sellerAssets: any[]
  setSellerAssets: (assets: any[]) => void
  sellerRefunds: any[]
  setSellerRefunds: (refunds: any[]) => void
}

export const useSellerStore = create<SellerState>((set) => ({
  monitoringData: SELLER_MONITORING_MOCK,
  setMonitoringData: (updater) =>
    set((state) => ({
      monitoringData: typeof updater === 'function' ? updater(state.monitoringData) : updater,
    })),
  sellerAssets: RICH_ASSETS_MOCK,
  setSellerAssets: (sellerAssets) => set({ sellerAssets }),
  sellerRefunds: SELLER_REFUNDS_MOCK,
  setSellerRefunds: (sellerRefunds) => set({ sellerRefunds }),
}))
