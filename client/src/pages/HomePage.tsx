// HomePage.tsx
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MarketOverview from "../components/MarketOverview/MarketOverview";
import MarketTable from "../components/MarketTable/MarketTable";
import { fetchMarkets } from "../services/marketService";
import type { MarketData } from "../services/marketService";
import Spinner from "../components/Spinner/Spinner";

type BinanceMiniTicker = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
};

export default function HomePage() {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<MarketData[]>([]);
  const url = "https://api.binance.com/api/v3/ticker/24hr";

  // Fetch markets with React Query
  const {
    data: markets = [],
    isLoading,
    error,
  } = useQuery<MarketData[]>({
    queryKey: ["markets"],
    queryFn: () => fetchMarkets(url),
    refetchInterval: 60000,
  });

  // Initialize BTC as favorite once
  useEffect(() => {
    if (markets.length === 0 || favorites.length > 0) return;
    const btc = markets.find((c) => c.symbol === "BTCUSDT");
    if (btc) setFavorites([btc]);
  }, [markets, favorites]);

  // WebSocket for live updates
  useEffect(() => {
    if (markets.length === 0) return;

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event) => {
      const data: BinanceMiniTicker[] = JSON.parse(event.data);

      // Update all markets in React Query cache
      queryClient.setQueryData<MarketData[]>(["markets"], (oldMarkets) => {
        if (!oldMarkets) return [];

        return oldMarkets.map((m) => {
          const update = data.find((d) => d.s === m.symbol);
          if (!update) return m;

          const newPrice = parseFloat(update.c);
          const openPrice = parseFloat(update.o);
          const change24h =
            openPrice !== 0 ? ((newPrice - openPrice) / openPrice) * 100 : 0;

          const newSparkline = [...m.sparkline, newPrice];
          if (newSparkline.length > 20) newSparkline.shift();

          return {
            ...m,
            price: newPrice,
            change24h,
            volume: parseFloat(update.v),
            sparkline: newSparkline,
          };
        });
      });

      // Update favorites in real-time
      setFavorites((prevFavs) =>
        prevFavs.map((f) => {
          const updated = data.find((d) => d.s === f.symbol);
          if (!updated) return f;

          const newPrice = parseFloat(updated.c);
          const openPrice = parseFloat(updated.o);
          return {
            ...f,
            price: newPrice,
            change24h:
              openPrice !== 0 ? ((newPrice - openPrice) / openPrice) * 100 : 0,
          };
        })
      );
    };

    return () => ws.close();
  }, [markets, queryClient]);

  // Toggle favorite
  const toggleFavorite = (symbol: string) => {
    if (!markets || markets.length === 0) return;

    const coin = markets.find((m) => m.symbol === symbol);
    if (!coin) return;

    setFavorites((prev) =>
      prev.find((x) => x.symbol === symbol)
        ? prev.filter((x) => x.symbol !== symbol)
        : [...prev, coin]
    );
  };

  return (
    <>
      <MarketOverview favorites={favorites} onRemoveFavorite={toggleFavorite} />
      {error && <p>Failed to load markets</p>}
      {isLoading ? (
        <Spinner />
      ) : (
        <MarketTable
          markets={markets}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
