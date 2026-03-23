import { create } from 'zustand';
import { Account } from '../types';
import { ACCOUNTS } from '../data';

interface AuthState {
  token: string | null;
  refresh_token: string | null;
  tenantid: string | null;
  authorization: string | null;
  currentAccount: Account;
  
  initAuth: () => void;
  setCurrentAccount: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refresh_token: null,
  tenantid: null,
  authorization: null,
  currentAccount: ACCOUNTS[0],

  initAuth: () => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    let hasAuthParams = false;
    const authData: Partial<AuthState> = {};

    ['token', 'refresh_token', 'tenantid', 'Authorization'].forEach((key) => {
      const val = searchParams.get(key);
      if (val) {
        // Map Authorization to lowercase key for consistency in store
        const stateKey = key.toLowerCase() as keyof AuthState;
        (authData as any)[stateKey] = val;
        hasAuthParams = true;
        // Optionally store in localStorage here
        localStorage.setItem(`market_${stateKey}`, val);
        searchParams.delete(key);
      } else {
        // Try to recover from localStorage
        const storedVal = localStorage.getItem(`market_${key.toLowerCase()}`);
        if (storedVal) {
          (authData as any)[key.toLowerCase() as keyof AuthState] = storedVal;
        }
      }
    });

    if (hasAuthParams) {
      // Clean up URL
      const newUrl = `${window.location.pathname}${
        searchParams.toString() ? '?' + searchParams.toString() : ''
      }${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }

    set((state) => ({ ...state, ...authData }));
  },

  setCurrentAccount: (id: string) => {
    const account = ACCOUNTS.find((a) => a.id === id);
    if (account) {
      set({ currentAccount: account });
    }
  },
}));
