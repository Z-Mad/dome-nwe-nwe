import { useState } from 'react';
import { SELLER_MONITORING_MOCK } from '../constants/profile';
import type { SellerMonitoringItem } from '../types/profile';

export const useSellerMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState<SellerMonitoringItem[]>(
    SELLER_MONITORING_MOCK
  );

  const updateMonitoring = (id: string, updates: Partial<SellerMonitoringItem>) => {
    setMonitoringData((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  return { monitoringData, setMonitoringData, updateMonitoring };
};