import { useState, useEffect } from 'react';

export const useBuyerOrders = (globalOrders: any[]) => {
  const [localOrders, setLocalOrders] = useState<any[]>(globalOrders);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  useEffect(() => {
    setLocalOrders(globalOrders);
  }, [globalOrders]);

  const updateOrder = (orderId: string, updates: any) => {
    setLocalOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setLocalOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return {
    localOrders,
    setLocalOrders,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    updateOrder,
    deleteOrder,
  };
};