import { create } from "zustand";
import { persist } from "zustand/middleware";

type Coin = {
  symbol: string;
  amount: number;
  buyPrice: number;
};

type AuthState = {
  walletAddress: string | null;
  token: string | null;
  isLoggedIn: boolean;
  myCoins: Coin[];
  name: string | null;
  history: Array<any>;
  id: string | null;
  setWalletAddress: (address: string | null) => void;
  setToken: (token: string | null) => void;
  setIsLoggedIn: (status: boolean) => void;
  setMyCoins: (coins: Coin[]) => void;
  setName: (name: string | null) => void;
  setHistory: (history: Array<any>) => void;
  setId: (id: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      walletAddress: null,
      token: null,
      isLoggedIn: false,
      myCoins: [],
      name: null,
      history: [],
      id: null,

      setWalletAddress: (address) => set({ walletAddress: address }),
      setToken: (token) => set({ token }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      setMyCoins: (coins) => set({ myCoins: coins }),
      setName: (name) => set({ name }),
      setHistory: (history) => set({ history }),
      setId: (id) => set({ id }),

      logout: () => {
        set({
          walletAddress: null,
          token: null,
          isLoggedIn: false,
          myCoins: [],
          name: null,
          history: [],
          id: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) =>
        ({
          token: state.token,
          name: state.name,
          myCoins: state.myCoins,
          walletAddress: state.walletAddress,
          history: state.history,
          isLoggedIn: state.isLoggedIn,
          id: state.id,
        } as AuthState),
    }
  )
);
