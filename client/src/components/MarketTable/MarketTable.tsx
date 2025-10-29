import { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import styles from "./MarketTable.module.css";
import MarketDetailModal from "./MarketDetailsModal";

type MarketData = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  sparkline: number[];
};

type MarketTableProps = {
  markets: MarketData[];
  favorites: MarketData[];
  onToggleFavorite: (symbol: string) => void;
};

export default function MarketTable({
  markets,
  favorites,
  onToggleFavorite,
}: MarketTableProps) {
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const visibleMarkets = markets.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);
  const handleCloseModal = () => setSelectedSymbol(null);

  return (
    <div className={styles.market}>
      {selectedSymbol && (
        <MarketDetailModal symbol={selectedSymbol} onClose={handleCloseModal} />
      )}

      <div className={styles.titleWrapper}>
        <h2 className={styles.sectionTitle}>Market Updates</h2>
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
            {visibleMarkets.map((m, index) => {
              const isFav = !!favorites.find((f) => f.symbol === m.symbol);
              return (
                <tr className={styles.tableRow} key={m.symbol}>
                  <td>
                    <button
                      className={styles.addToFav}
                      onClick={() => onToggleFavorite(m.symbol)}
                    >
                      <i
                        className={`${styles.addToFav} fa-solid fa-star ${
                          isFav ? styles.favorite : ""
                        }`}
                      ></i>
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
                  <td>
                    <button
                      className={styles.btnOutline}
                      onClick={() => setSelectedSymbol(m.symbol)}
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleCount < markets.length && (
          <div className={styles.visibleBtnContainer}>
            <button onClick={handleLoadMore} className={styles.btnOutline}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
