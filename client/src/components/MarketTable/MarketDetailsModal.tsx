import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./MarketDetailModal.module.css";

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

  // Generate initial candles
  useEffect(() => {
    const now = Date.now();
    const initialCandles: Candle[] = Array.from({ length: 30 }).map((_, i) => {
      const time = now - (30 - i) * 60_000;
      const open = 100 + Math.random() * 10;
      const close = open + (Math.random() - 0.5) * 2;
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();
      return [time, open, high, low, close];
    });
    setCandles(initialCandles);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const newClose = last[4] + (Math.random() - 0.5);
        const newCandle: Candle = [
          Date.now(),
          last[4],
          Math.max(last[4], newClose),
          Math.min(last[4], newClose),
          newClose,
        ];
        return [...prev.slice(1), newCandle];
      });

      setBids((prev) => {
        const newBid: Order = {
          price: 100 + Math.random() * 5,
          amount: +(Math.random() * 2).toFixed(2),
        };
        return [newBid, ...prev].slice(0, 3); // keep only latest 5
      });
      setAsks((prev) => {
        const newAsk: Order = {
          price: 105 + Math.random() * 5,
          amount: +(Math.random() * 2).toFixed(2),
        };
        return [newAsk, ...prev].slice(0, 3); // keep only latest 5
      });
      setTrades((prev) => {
        const newTrade: Trade = {
          time: new Date().toLocaleTimeString(),
          price: +(100 + Math.random() * 10).toFixed(2),
          amount: +(Math.random() * 0.5).toFixed(3),
          side: Math.random() > 0.5 ? "buy" : "sell",
        };
        return [newTrade, ...prev].slice(0, 6); // keep only latest 20
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartData = candles.map(([time, , , , close]) => ({
    time: new Date(time).toLocaleTimeString(),
    close,
  }));
  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modalContainer}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{symbol} </h2>

          <button onClick={onClose} className={styles.closeButton}>
            ✖
          </button>
        </div>

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
                  <span>{b.amount}</span>
                  <span>Bid</span>
                </div>
              ))}
              {asks.map((a, i) => (
                <div key={i} className={`${styles.listRow} ${styles.textRed}`}>
                  <span>{a.price.toFixed(2)}</span>
                  <span>{a.amount}</span>
                  <span>Ask</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade History */}
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
