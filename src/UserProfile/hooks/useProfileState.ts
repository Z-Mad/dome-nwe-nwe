import { useState, useEffect } from 'react';


export const useProfileState = (initialParams?: { tab?: string }, currentAccountRole?: string) => {
  const [consoleMode, setConsoleMode] = useState<'buyer' | 'seller'>(
    initialParams?.tab === 'assets'
      ? 'seller'
      : currentAccountRole === 'viewer'
        ? 'buyer'
        : 'seller'
  );
  const [buyerTab, setBuyerTab] = useState<
    'dashboard' | 'orders' | 'bills' | 'invoices' | 'resources' | 'analysis' | 'support'
  >('dashboard');
  const [sellerTab, setSellerTab] = useState<
    'dashboard' | 'assets' | 'finance' | 'support' | 'analysis' | 'health'
  >('dashboard');

  useEffect(() => {
    if (initialParams?.tab) {
      if (initialParams.tab === 'assets') {
        setConsoleMode('seller');
        setSellerTab('assets');
      } else {
        setBuyerTab(initialParams.tab as any);
      }
    }
  }, [initialParams]);

  return {
    consoleMode,
    setConsoleMode,
    buyerTab,
    setBuyerTab,
    sellerTab,
    setSellerTab,
  };
};