import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type TradePayload = {
  side: "buy" | "sell";
  symbol: string;
  price: number;
  amount: number;
};

export function useTradeHandler() {
  const { id, isLoggedIn, setMyCoins, setHistory } = useAuthStore();

  const tradeMutation = useMutation({
    mutationFn: async ({ side, symbol, price, amount }: TradePayload) => {
      console.log(isLoggedIn, id);
      if (!isLoggedIn || !id) {
        throw new Error("You must be logged in to trade.");
      }

      const { data } = await axios.post(`${API_BASE_URL}/order/${side}`, {
        userId: id,
        symbol,
        price,
        amount,
      });

      return data.user;
    },

    onSuccess: (user) => {
      setMyCoins(user.myCoins);
      setHistory(user.tradeHistory);
      console.log("Trade successful!");
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Trade failed.";
      console.log(message);
    },
  });

  return {
    trade: tradeMutation.mutate,
    isTrading: tradeMutation.isPending,
  };
}
