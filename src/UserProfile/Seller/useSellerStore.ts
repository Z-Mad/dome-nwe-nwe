import { create } from "zustand";
import { SELLER_MONITORING_MOCK, SELLER_REFUNDS_MOCK, RICH_ASSETS_MOCK } from "./constants";
import { MonitoringData, SellerAsset, Refund } from '../types/index';

interface SellerState {
  monitoringData: MonitoringData[];
  setMonitoringData: (data: MonitoringData[]) => void;
  sellerAssets: SellerAsset[];
  setSellerAssets: (assets: SellerAsset[]) => void;
  sellerRefunds: Refund[];
  setSellerRefunds: (refunds: Refund[]) => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  monitoringData: SELLER_MONITORING_MOCK,
  setMonitoringData: (monitoringData) => set({ monitoringData }),
  sellerAssets: RICH_ASSETS_MOCK,
  setSellerAssets: (sellerAssets) => set({ sellerAssets }),
  sellerRefunds: SELLER_REFUNDS_MOCK,
  setSellerRefunds: (sellerRefunds) => set({ sellerRefunds }),
}));
