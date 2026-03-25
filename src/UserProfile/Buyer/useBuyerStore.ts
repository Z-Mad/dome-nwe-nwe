import { create } from "zustand";
import { INITIAL_BILLS } from "./constants";

interface BuyerState {
  bills: any[];
  setBills: (bills: any[]) => void;
  invoices: any[];
  setInvoices: (invoices: any[]) => void;
}

export const useBuyerStore = create<BuyerState>((set) => ({
  bills: INITIAL_BILLS,
  setBills: (bills) => set({ bills }),
  invoices: [
    {
      id: "INV-20250301-001",
      relatedId: "2025年2月 账单",
      amount: 9800.0,
      type: "增值税电子普通发票",
      status: "issued",
      date: "2025-03-05",
      title: "企业名称",
    },
    {
      id: "INV-20250402-002",
      relatedId: "2025年3月 账单",
      amount: 11200.0,
      type: "增值税电子普通发票",
      status: "Pending",
      date: "2025-04-02",
      title: "企业名称",
    }
  ],
  setInvoices: (invoices) => set({ invoices }),
}));
