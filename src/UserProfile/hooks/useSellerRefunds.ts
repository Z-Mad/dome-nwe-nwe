import { useState } from 'react';
import { SELLER_REFUNDS_MOCK } from '../constants/profile';
import type { SellerRefund } from '../types/profile';

export const useSellerRefunds = () => {
  const [sellerRefunds, setSellerRefunds] = useState<SellerRefund[]>(SELLER_REFUNDS_MOCK);

  const removeRefund = (id: string) => {
    setSellerRefunds((prev) => prev.filter((r) => r.id !== id));
  };

  return { sellerRefunds, setSellerRefunds, removeRefund };
};