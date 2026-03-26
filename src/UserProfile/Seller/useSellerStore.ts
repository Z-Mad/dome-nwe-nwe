import { create } from 'zustand'
import { SELLER_MONITORING_MOCK, SELLER_REFUNDS_MOCK, RICH_ASSETS_MOCK } from './constants'

interface SellerState {
  monitoringData: any
  setMonitoringData: (data: any) => void
  sellerAssets: any[]
  setSellerAssets: (assets: any[]) => void
  sellerRefunds: any[]
  setSellerRefunds: (refunds: any[]) => void
}

export const useSellerStore = create<SellerState>((set) => ({
  monitoringData: SELLER_MONITORING_MOCK,
  setMonitoringData: (monitoringData) => set({ monitoringData }),
  sellerAssets: RICH_ASSETS_MOCK,
  setSellerAssets: (sellerAssets) => set({ sellerAssets }),
  sellerRefunds: SELLER_REFUNDS_MOCK,
  setSellerRefunds: (sellerRefunds) => set({ sellerRefunds }),
}))
