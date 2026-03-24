import { create } from "zustand";
import { BuyerTab } from "../components/buyerTabs";
import { SellerTab } from "../components/sellerTabs";
import { OrderStatusFilter } from "../utils/orderUtils";

interface UserProfileUIState {
  buyerTab: BuyerTab;
  sellerTab: SellerTab;
  orderSearch: string;
  orderStatusFilter: OrderStatusFilter;
  setBuyerTab: (tab: BuyerTab) => void;
  setSellerTab: (tab: SellerTab) => void;
  setOrderSearch: (value: string) => void;
  setOrderStatusFilter: (value: OrderStatusFilter) => void;
}

export const useUserProfileUIStore = create<UserProfileUIState>((set) => ({
  buyerTab: "dashboard",
  sellerTab: "dashboard",
  orderSearch: "",
  orderStatusFilter: "all",
  setBuyerTab: (buyerTab) => set({ buyerTab }),
  setSellerTab: (sellerTab) => set({ sellerTab }),
  setOrderSearch: (orderSearch) => set({ orderSearch }),
  setOrderStatusFilter: (orderStatusFilter) => set({ orderStatusFilter }),
}));
