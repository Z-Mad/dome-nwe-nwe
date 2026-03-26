import { create } from 'zustand'
import { INITIAL_BILLS, INITIAL_INVOICE_HEADERS } from './constants'

interface BuyerState {
  bills: any[]
  setBills: (bills: any[] | ((prev: any[]) => any[])) => void
  invoices: any[]
  setInvoices: (invoices: any[]) => void
  invoiceHeaders: any[]
  setInvoiceHeaders: (headers: any[] | ((prev: any[]) => any[])) => void
}

export const useBuyerStore = create<BuyerState>((set) => ({
  bills: INITIAL_BILLS,
  setBills: (updater) =>
    set((state) => ({
      bills: typeof updater === 'function' ? updater(state.bills) : updater,
    })),
  invoiceHeaders: INITIAL_INVOICE_HEADERS,
  setInvoiceHeaders: (updater) =>
    set((state) => ({
      invoiceHeaders: typeof updater === 'function' ? updater(state.invoiceHeaders) : updater,
    })),
  invoices: [
    {
      id: 'INV-20250301-001',
      relatedId: '2025年2月 账单',
      amount: 9800.0,
      type: '增值税电子普通发票',
      status: 'issued',
      date: '2025-03-05',
      title: '企业名称',
    },
    {
      id: 'INV-20250402-002',
      relatedId: '2025年3月 账单',
      amount: 11200.0,
      type: '增值税电子普通发票',
      status: 'Pending',
      date: '2025-04-02',
      title: '企业名称',
    },
  ],
  setInvoices: (invoices) => set({ invoices }),
}))
