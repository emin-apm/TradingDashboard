// services/marketService.ts
import axios from "axios";

export type MarketData = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  sparkline: number[];
};

type BinanceTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
};

export const fetchMarkets = async (url: string): Promise<MarketData[]> => {
  const { data } = await axios.get<BinanceTicker[]>(url);

  const top = data
    .filter((d) => d.symbol.endsWith("USDT"))
    .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, 100);

  return top.map((d) => ({
    symbol: d.symbol,
    price: parseFloat(d.lastPrice),
    change24h: parseFloat(d.priceChangePercent),
    volume: parseFloat(d.quoteVolume),
    sparkline: Array(10).fill(parseFloat(d.lastPrice)),
  }));
};
