import React, { createContext, useContext, useMemo } from 'react';
import { Account } from '@/types';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

interface UserProfileContextType {
  currentAccount: Account;
  displayAccount: Account & { displayName: string; orgInfo: string };
  consoleMode: 'buyer' | 'seller';
  globalOrders: any[];
  globalResources: any[];
  extraAssets: any[];
  onNavigate: (view: string, params?: any) => void;
  onUpgrade?: (orderId: string, planDetails: any) => void;
  onUpdateOrder?: (orderId: string, updates: any) => void;
  onUpdateResource?: (resourceId: string, updates: any) => void;
  onAddResource?: (resource: any) => void;
  
  // Shared State
  localOrders: any[];
  setLocalOrders: React.Dispatch<React.SetStateAction<any[]>>;
  localResources: any[];
  setLocalResources: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string) => void;
  
  // URL-driven state helpers
  activeModal: string | null;
  openModal: (modalName: string, params?: Record<string, string>) => void;
  closeModal: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  currentAccount: Account;
  consoleMode: 'buyer' | 'seller';
  globalOrders?: any[];
  globalResources?: any[];
  extraAssets?: any[];
  onNavigate: (view: string, params?: any) => void;
  onUpgrade?: (orderId: string, planDetails: any) => void;
  onUpdateOrder?: (orderId: string, updates: any) => void;
  onUpdateResource?: (resourceId: string, updates: any) => void;
  onAddResource?: (resource: any) => void;
}

export const UserProfileProvider: React.FC<ProviderProps> = ({
  children,
  currentAccount,
  consoleMode,
  globalOrders = [],
  globalResources = [],
  extraAssets = [],
  onNavigate,
  onUpgrade,
  onUpdateOrder,
  onUpdateResource,
  onAddResource,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localOrders, setLocalOrders] = React.useState<any[]>(globalOrders);
  const [localResources, setLocalResources] = React.useState<any[]>(globalResources);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalOrders(globalOrders);
  }, [globalOrders]);

  React.useEffect(() => {
    setLocalResources(globalResources);
  }, [globalResources]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const displayAccount = useMemo(() => ({
    ...currentAccount,
    displayName: currentAccount.role === 'developer' ? 'COMMANDER_01' : currentAccount.name,
    orgInfo: '宝信软件 (Baosight) · ID: 88293910',
  }), [currentAccount]);

  const activeModal = searchParams.get('modal');

  const openModal = (modalName: string, params?: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('modal', modalName);
      if (params) {
        Object.entries(params).forEach(([k, v]) => next.set(k, v));
      }
      return next;
    });
  };

  const closeModal = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('modal');
      // Also clean up any modal-specific params if needed
      return next;
    });
  };

  const value = {
    currentAccount,
    displayAccount,
    consoleMode,
    globalOrders,
    globalResources,
    extraAssets,
    onNavigate,
    onUpgrade,
    onUpdateOrder,
    onUpdateResource,
    onAddResource,
    localOrders,
    setLocalOrders,
    localResources,
    setLocalResources,
    showToast,
    activeModal,
    openModal,
    closeModal,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
      {/* Global Toast within the provider */}
      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}
    </UserProfileContext.Provider>
  );
};
