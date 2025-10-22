import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import styles from "./MarketDetailModal.module.css";

import { useTradeHandler } from "../../hook/useTradeHandler";

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string
];

type Candle = [number, number, number, number, number];
type Order = { price: number; amount: number };
type Trade = {
  time: string;
  price: number;
  amount: number;
  side: "buy" | "sell";
};

interface MarketDetailModalProps {
  symbol: string;
  onClose: () => void;
}

export default function MarketDetailModal({
  symbol,
  onClose,
}: MarketDetailModalProps) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  const { trade, isTrading } = useTradeHandler();

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

      return res.data.map((c) => [
        c[0], // time
        parseFloat(c[1]), // open
        parseFloat(c[2]), // high
        parseFloat(c[3]), // low
        parseFloat(c[4]), // close
      ]);
    },
  });

  useEffect(() => {
    if (data) setCandles(data);
  }, [data]);

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
          if (copy.length >= 10) copy.shift();
          copy.push(newCandle);
          return copy;
        });
      }

      // Trade updates
      if (msg.stream.endsWith("trade")) {
        const trade: Trade = {
          time: new Date(msg.data.T).toLocaleTimeString(),
          price: parseFloat(msg.data.p),
          amount: parseFloat(msg.data.q),
          side: msg.data.m ? "sell" : "buy",
        };
        setTrades((prev) => [trade, ...prev.slice(0, 9)]);
      }

      // Order book updates
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

  const chartData = candles.map((candle) => ({
    time: new Date(candle[0]).toLocaleTimeString(),
    close: parseFloat(candle[4].toFixed(6)),
  }));

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{symbol.toUpperCase()}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✖
          </button>
        </div>

        {isLoading && <p>Loading candles...</p>}
        {error && <p>Failed to load candles</p>}

        {/* Chart */}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis
                domain={[
                  (dataMin: number) => dataMin * 0.995,
                  (dataMax: number) => dataMax * 1.005,
                ]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
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

        <div className={styles.btnContainer}>
          <button
            className={`${styles.btnOutline} ${styles.buy}`}
            onClick={() =>
              trade({
                side: "buy",
                symbol,
                price: candles[candles.length - 1]?.[4] ?? 0,
                amount: 1,
              })
            }
            disabled={isTrading}
          >
            {isTrading ? "Processing..." : "Buy"}
          </button>

          <button
            className={`${styles.btnOutline} ${styles.sell}`}
            onClick={() =>
              trade({
                side: "sell",
                symbol,
                price: candles[candles.length - 1]?.[4] ?? 0,
                amount: 1,
              })
            }
            disabled={isTrading}
          >
            {isTrading ? "Processing..." : "Sell"}
          </button>
        </div>

        <div className={styles.grid3}>
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
