import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./MarketDetailModal.module.css";

// -------- Types --------

// Binance Kline raw array
type BinanceKline = [
  number, // 0: open time
  string, // 1: open
  string, // 2: high
  string, // 3: low
  string, // 4: close
  string, // 5: volume
  number, // 6: close time
  string, // 7: quote asset volume
  number, // 8: trades
  string, // 9: taker buy base asset volume
  string, // 10: taker buy quote asset volume
  string // 11: ignore
];

type Candle = [number, number, number, number, number]; // [time, open, high, low, close]
type Order = { price: number; amount: number };
type Trade = {
  time: string;
  price: number;
  amount: number;
  side: "buy" | "sell";
};

interface MarketDetailModalProps {
  symbol: string; // e.g. BTCUSDT
  onClose: () => void;
}

// -------- Component --------

export default function MarketDetailModal({
  symbol,
  onClose,
}: MarketDetailModalProps) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  // ✅ Fetch initial candles using React Query + Axios
  const { data, isLoading, error } = useQuery<Candle[]>({
    queryKey: ["candles", symbol],
    queryFn: async () => {
      const res = await axios.get<BinanceKline[]>(
        "https://api.binance.com/api/v3/klines",
        {
          params: {
            symbol: symbol.toUpperCase(),
            interval: "1m",
            limit: 30,
          },
        }
      );

      // Map raw Binance data to our Candle type
      return res.data.map((c) => [
        c[0], // time
        parseFloat(c[1]), // open
        parseFloat(c[2]), // high
        parseFloat(c[3]), // low
        parseFloat(c[4]), // close
      ]);
    },
    staleTime: 60_000, // optional cache duration
  });

  // Initialize candles state when query completes
  useEffect(() => {
    if (data) setCandles(data);
  }, [data]);

  // ✅ WebSocket live updates
  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${symbol.toLowerCase()}@kline_1m/${symbol.toLowerCase()}@trade/${symbol.toLowerCase()}@depth5`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // Candle updates
      if (msg.stream.endsWith("kline_1m")) {
        const k = msg.data.k;
        const newCandle: Candle = [
          k.t,
          parseFloat(k.o),
          parseFloat(k.h),
          parseFloat(k.l),
          parseFloat(k.c),
        ];
        setCandles((prev) => {
          const copy = [...prev];
          if (copy.length >= 30) copy.shift();
          copy.push(newCandle);
          return copy;
        });
      }

      // Recent Trades
      if (msg.stream.endsWith("trade")) {
        const trade: Trade = {
          time: new Date(msg.data.T).toLocaleTimeString(),
          price: parseFloat(msg.data.p),
          amount: parseFloat(msg.data.q),
          side: msg.data.m ? "sell" : "buy",
        };
        setTrades((prev) => [trade, ...prev.slice(0, 15)]);
      }

      // Order Book Depth
      if (msg.stream.endsWith("depth5")) {
        const { bids, asks } = msg.data;
        setBids(
          bids.map(([price, amount]: [string, string]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
          }))
        );
        setAsks(
          asks.map(([price, amount]: [string, string]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
          }))
        );
      }
    };

    return () => ws.close();
  }, [symbol]);

  // More readable chart mapping
  const chartData = candles.map((candle) => ({
    time: new Date(candle[0]).toLocaleTimeString(),
    close: candle[4],
  }));

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{symbol.toUpperCase()}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✖
          </button>
        </div>

        {/* Loading / Error */}
        {isLoading && <p>Loading candles...</p>}
        {error && <p>Failed to load candles</p>}

        {/* Chart */}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                labelStyle={{ color: "#333" }}
                formatter={(value) => [`$${value}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Buttons */}
        <div className={styles.btnContainer}>
          <button className={`${styles.btnOutline} ${styles.buy}`}>Buy</button>
          <button className={`${styles.btnOutline} ${styles.sell}`}>
            Sell
          </button>
        </div>

        {/* Order Book & Trades */}
        <div className={styles.grid3}>
          {/* Order Book */}
          <div className={styles.listContainer}>
            <h3 className={styles.listHeaderTitle}>Order Book</h3>
            <div className={styles.listHeader}>
              <span>Price</span>
              <span>Amount</span>
              <span>Type</span>
            </div>
            <div className={styles.list}>
              {bids.map((b, i) => (
                <div
                  key={i}
                  className={`${styles.listRow} ${styles.textGreen}`}
                >
                  <span>{b.price.toFixed(2)}</span>
                  <span>{b.amount.toFixed(4)}</span>
                  <span>Bid</span>
                </div>
              ))}
              {asks.map((a, i) => (
                <div key={i} className={`${styles.listRow} ${styles.textRed}`}>
                  <span>{a.price.toFixed(2)}</span>
                  <span>{a.amount.toFixed(4)}</span>
                  <span>Ask</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className={`${styles.listContainer} ${styles.tradeContainer}`}>
            <h3 className={styles.listHeaderTitle}>Recent Trades</h3>
            <div className={styles.listHeader}>
              <span>Time</span>
              <span>Price</span>
              <span>Amount</span>
              <span>Side</span>
            </div>
            <div className={styles.list}>
              {trades.map((t, i) => (
                <div
                  key={i}
                  className={`${styles.listRow} ${
                    t.side === "buy" ? styles.textGreen : styles.textRed
                  }`}
                >
                  <span>{t.time}</span>
                  <span>{t.price}</span>
                  <span>{t.amount}</span>
                  <span>{t.side}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
