import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  walletAddress: string | null;
  token: string | null;
  isLoggedIn: boolean;
  balance: number | null;
  name: string | null;
  history: Array<any>;
  setWalletAddress: (address: string | null) => void;
  setToken: (token: string) => void;
  setIsLoggedIn: (status: boolean) => void;
  setBalance: (balance: number | null) => void;
  setName: (name: string | null) => void;
  setHistory: (history: Array<any>) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      walletAddress: null,
      token: null,
      isLoggedIn: false,
      balance: null,
      name: null,
      history: [],

      setWalletAddress: (address) => set({ walletAddress: address }),
      setToken: (token) => set({ token }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      setBalance: (balance) => set({ balance }),
      setName: (name) => set({ name }),
      setHistory: (history) => set({ history }),

      logout: () => {
        set({
          walletAddress: null,
          token: null,
          isLoggedIn: false,
          balance: null,
          name: null,
          history: [],
        });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) =>
        ({
          token: state.token,
          name: state.name,
          balance: state.balance,
          walletAddress: state.walletAddress,
          history: state.history,
          isLoggedIn: state.isLoggedIn,
        } as AuthState),
    }
  )
);
