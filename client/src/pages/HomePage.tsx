import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MarketOverview from "../components/MarketOverview/MarketOverview";
import MarketTable from "../components/MarketTable/MarketTable";
import { fetchMarkets } from "../services/marketService";
import type { MarketData } from "../services/marketService";
import Spinner from "../components/Spinner/Spinner";

type BinanceMiniTicker = {
  e: string;
  E: number;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
};

export default function HomePage() {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<MarketData[]>([]);
  const url = "https://api.binance.com/api/v3/ticker/24hr";

  const {
    data: markets = [],
    isLoading,
    error,
  } = useQuery<MarketData[]>({
    queryKey: ["markets"],
    queryFn: () => fetchMarkets(url),
  });

  useEffect(() => {
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      localStorage.removeItem("favorites");
    }
  }, [favorites, markets]);

  //WebSocket
  useEffect(() => {
    if (markets.length === 0) return;

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event) => {
      const data: BinanceMiniTicker[] = JSON.parse(event.data);

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
      <MarketOverview
        favorites={
          favorites.length > 0
            ? favorites
            : [
                {
                  symbol: "Add Star",
                  price: 0,
                  change24h: 0,
                  sparkline: [],
                  volume: 0,
                },
              ]
        }
        onRemoveFavorite={toggleFavorite}
      />
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
