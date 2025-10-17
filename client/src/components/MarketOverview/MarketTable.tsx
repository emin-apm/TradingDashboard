import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./MarketTable.module.css";
import MarketDetailModal from "./MarketDetailsModal";

type MarketData = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  sparkline: number[];
};

export default function MarketTable() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null); // <-- modal state

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
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      }
    };

    fetchMarkets();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMarkets((prev) =>
        prev.map((m) => {
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
        })
      );
    };

    return () => ws.close();
  }, []);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);
  const handleCloseModal = () => setSelectedSymbol(null);

  const visibleMarkets = markets.slice(0, visibleCount);

  return (
    <div className={styles.market}>
      {/* Modal */}
      {selectedSymbol && (
        <MarketDetailModal symbol={selectedSymbol} onClose={handleCloseModal} />
      )}

      <div className={styles.titleWrapper}>
        <h2 className={styles.sectionTitle}>Market Update</h2>
      </div>

      <div className={styles.marketTab}>
        <table className={styles.marketTable}>
          <thead className={styles.tableHead}>
            <tr className={`${styles.tableRow} ${styles.tableTitle}`}>
              <th></th>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h %</th>
              <th>Volume</th>
              <th>Chart</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {visibleMarkets.map((m, index) => (
              <tr className={styles.tableRow} key={m.symbol}>
                <td>
                  <button className={styles.addToFav}>
                    <i className="fa-solid fa-star"></i>
                  </button>
                </td>
                <th>{index + 1}</th>
                <td>
                  <h4 className={styles.coinName}>
                    {m.symbol.slice(0, -4)}
                    <span>{m.symbol.slice(-4)}</span>
                  </h4>
                </td>
                <td className={styles.lastPrice}>${m.price.toFixed(2)}</td>
                <td className={m.change24h >= 0 ? styles.green : styles.red}>
                  {m.change24h.toFixed(2)}%
                </td>
                <td className={styles.marketCap}>
                  {m.volume.toLocaleString()}
                </td>
                <td style={{ width: "120px", height: "40px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={(() => {
                        const values = m.sparkline;
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        const range = max - min || 1;
                        return values.map((v) => ({
                          value: ((v - min) / range) * 100,
                        }));
                      })()}
                      key={m.sparkline[m.sparkline.length - 1]}
                    >
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={m.change24h >= 0 ? "#28a745" : "#dc3545"}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </td>

                {/* Trade button opens modal */}
                <td>
                  <button
                    className={styles.btnOutline}
                    onClick={() => setSelectedSymbol(m.symbol)}
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < markets.length && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button onClick={handleLoadMore} className={styles.btnOutline}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
