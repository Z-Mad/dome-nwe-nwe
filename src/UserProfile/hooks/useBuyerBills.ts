import { useState } from 'react';
import { INITIAL_BILLS } from '../constants/profile';
import type { BuyerBill } from '../types/profile';

export const useBuyerBills = () => {
  const [bills, setBills] = useState<BuyerBill[]>(INITIAL_BILLS);

  const updateBill = (billId: string, updates: Partial<BuyerBill>) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, ...updates } : b))
    );
  };

  return { bills, setBills, updateBill };
};