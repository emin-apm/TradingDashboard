import { useEffect, useState } from "react";
import MarketOverview from "../components/MarketOverview/MarketOverview";
import MarketTable from "../components/MarketTable/MarketTable";

type MarketData = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  sparkline: number[];
};

export default function HomePage() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [favorites, setFavorites] = useState<MarketData[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const data = await res.json();

        const top = data
          .filter((d: any) => d.symbol.endsWith("USDT"))
          .sort(
            (a: any, b: any) =>
              parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
          )
          .slice(0, 100);

        const formatted = top.map((d: any) => ({
          symbol: d.symbol,
          price: parseFloat(d.lastPrice),
          change24h: parseFloat(d.priceChangePercent),
          volume: parseFloat(d.quoteVolume),
          sparkline: Array(10).fill(parseFloat(d.lastPrice)),
        }));

        setMarkets(formatted);
        const btc = formatted.find((c: MarketData) => c.symbol === "BTCUSDT");
        if (btc) setFavorites([btc]);
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      }
    };

    fetchMarkets();
  }, []);

  // Live updates via WebSocket
  useEffect(() => {
    if (markets.length === 0) return;

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMarkets((prevMarkets) => {
        const updatedMarkets = prevMarkets.map((m) => {
          const update = data.find((d: any) => d.s === m.symbol);
          if (!update) return m;

          const newPrice = parseFloat(update.c);
          const openPrice = parseFloat(update.o);
          const change24h =
            openPrice !== 0 ? ((newPrice - openPrice) / openPrice) * 100 : 0;

          const newSparkline = [...m.sparkline, newPrice];
          if (newSparkline.length > 10) newSparkline.shift();

          return {
            ...m,
            price: newPrice,
            change24h,
            volume: parseFloat(update.v),
            sparkline: newSparkline,
          };
        });

        // Update favorites with new market data
        setFavorites((prevFavs) =>
          prevFavs.map((f) => {
            const updated = updatedMarkets.find((m) => m.symbol === f.symbol);
            return updated ? updated : f;
          })
        );

        return updatedMarkets;
      });
    };

    return () => ws.close();
  }, [markets.length]);

  const toggleFavorite = (symbol: string) => {
    if (!markets || markets.length === 0) return;

    const coin = markets.find((m) => m.symbol === symbol);
    if (!coin) return;

    setFavorites((prev) => {
      if (prev.find((x) => x.symbol === symbol)) {
        return prev.filter((x) => x.symbol !== symbol);
      } else {
        return [...prev, coin];
      }
    });
  };

  return (
    <>
      <MarketOverview favorites={favorites} onRemoveFavorite={toggleFavorite} />
      <MarketTable
        markets={markets}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </>
  );
}
