import { create } from 'zustand';
import type { Account } from '@/types';
import type { Order, Resource, UserProfileCallbacks } from '../types/index';

interface UserProfileState extends UserProfileCallbacks {
  currentAccount: Account | null;
  displayAccount: (Account & { displayName: string; orgInfo: string }) | null;
  consoleMode: 'buyer' | 'seller';
  setConsoleMode: (mode: 'buyer' | 'seller') => void;
  globalOrders: Order[];
  globalResources: Resource[];
  extraAssets: any[];

  localOrders: Order[];
  setLocalOrders: (orders: Order[] | ((prev: Order[]) => Order[])) => void;

  localResources: Resource[];
  setLocalResources: (resources: Resource[] | ((prev: Resource[]) => Resource[])) => void;

  toastMsg: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;

  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  setSearchParamsFn: ((fn: (prev: URLSearchParams) => URLSearchParams) => void) | null;
  openModal: (modalName: string, params?: Record<string, string>) => void;
  closeModal: () => void;

  processSuccessfulPayment: (order: Order) => void;

  initStore: (props: Partial<UserProfileState>) => void;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  currentAccount: null,
  displayAccount: null,
  consoleMode: 'buyer',
  setConsoleMode: (mode) => set({ consoleMode: mode }),
  globalOrders: [],
  globalResources: [],
  extraAssets: [],

  onNavigate: () => { },

  localOrders: [],
  setLocalOrders: (updater) =>
    set((state) => ({
      localOrders: typeof updater === 'function' ? updater(state.localOrders) : updater,
    })),

  localResources: [],
  setLocalResources: (updater) =>
    set((state) => ({
      localResources: typeof updater === 'function' ? updater(state.localResources) : updater,
    })),

  toastMsg: null,
  showToast: (msg) => {
    set({ toastMsg: msg })
    setTimeout(() => set({ toastMsg: null }), 3000)
  },
  hideToast: () => set({ toastMsg: null }),

  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),

  setSearchParamsFn: null,
  openModal: (modalName, params) => {
    const fn = get().setSearchParamsFn
    if (fn) {
      fn((prev: URLSearchParams) => {
        const next = new URLSearchParams(prev)
        next.set('modal', modalName)
        if (params) {
          Object.entries(params).forEach(([k, v]) => next.set(k, v))
        }
        return next
      })
    }
  },
  closeModal: () => {
    const fn = get().setSearchParamsFn
    if (fn) {
      fn((prev: URLSearchParams) => {
        const next = new URLSearchParams(prev)
        next.delete('modal')
        return next
      })
    }
  },

  processSuccessfulPayment: (order) => {
    const state = get()
    if (order.orderType === 'New' || order.orderType === 'Trial') {
      if (state.onAddResource) {
        state.onAddResource({
          id: `RES-${Date.now()}`,
          orderId: order.id,
          orderType: order.orderType,
          productName: order.productName,
          version: order.version || '',
          provider: order.provider || '',
          instanceName: order.instanceName || '默认实例',
          status: 'PendingActivation',
          expireDate: order.expireDate || '',
          autoRenew: order.autoRenew || false,
          quota: { tokens: 500000, storage: 5 },
          usage: { tokens: 0, storage: 0 },
        })
      }
    } else if (order.orderType === 'Renewal') {
      if (state.onUpdateResource) {
        const existingResource = state.localResources.find((r) => r.orderId === order.id)
        if (existingResource) {
          state.onUpdateResource(existingResource.id, {
            expireDate: order.expireDate,
            status: existingResource.status === 'Expired' ? 'Running' : existingResource.status,
          })
        }
      }
    } else if (order.orderType === 'ResourcePack') {
      if (state.onUpdateResource && order.targetOrderId) {
        const existingResource = state.localResources.find((r) => r.orderId === order.targetOrderId)
        if (existingResource) {
          state.onUpdateResource(existingResource.id, {
            quota: {
              tokens: (existingResource.quota?.tokens || 0) + 100000,
              storage: (existingResource.quota?.storage || 0) + 10,
            },
          })
        }
      }
    }
  },

  initStore: (props) =>
    set((state) => {
      let nextDisplayAccount = state.displayAccount
      if (props.currentAccount && props.currentAccount !== state.currentAccount) {
        nextDisplayAccount = {
          ...props.currentAccount,
          displayName:
            props.currentAccount.role === 'developer'
              ? 'COMMANDER_01111'
              : props.currentAccount.name,
          orgInfo: '宝信软件 (Baosight) · ID: 88293910',
        }
      }

      let nextLocalOrders = state.localOrders
      if (props.globalOrders && props.globalOrders !== state.globalOrders) {
        nextLocalOrders = props.globalOrders
      }

      let nextLocalResources = state.localResources
      if (props.globalResources && props.globalResources !== state.globalResources) {
        nextLocalResources = props.globalResources
      }

      return {
        ...props,
        ...(props.currentAccount ? { displayAccount: nextDisplayAccount } : {}),
        ...(props.globalOrders ? { localOrders: nextLocalOrders } : {}),
        ...(props.globalResources ? { localResources: nextLocalResources } : {}),
      }
    }),
}))

export const useUserProfile = () => useUserProfileStore()
