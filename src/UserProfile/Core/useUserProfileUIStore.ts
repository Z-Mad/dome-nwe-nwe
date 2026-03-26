import { create } from 'zustand'
import { OrderStatusFilter } from '../Order/orderUtils'

interface UserProfileUIState {
  orderSearch: string
  orderStatusFilter: OrderStatusFilter
  setOrderSearch: (value: string) => void
  setOrderStatusFilter: (value: OrderStatusFilter) => void
}

export const useUserProfileUIStore = create<UserProfileUIState>((set) => ({
  orderSearch: '',
  orderStatusFilter: 'all',
  setOrderSearch: (orderSearch) => set({ orderSearch }),
  setOrderStatusFilter: (orderStatusFilter) => set({ orderStatusFilter }),
}))
