import { useState } from "react";
import MarketDetailModal from "../MarketTable/MarketDetailsModal";
import styles from "./MarketStyles.module.css";

type MarketData = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  sparkline: number[];
};

type MarketOverviewProps = {
  favorites: MarketData[];
  onRemoveFavorite: (symbol: string) => void;
};

export default function MarketOverview({
  favorites = [],
  onRemoveFavorite,
}: MarketOverviewProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleCardClick = (symbol: string) => setSelectedSymbol(symbol);
  const handleCloseModal = () => setSelectedSymbol(null);

  return (
    <div className="container">
      {selectedSymbol && (
        <MarketDetailModal symbol={selectedSymbol} onClose={handleCloseModal} />
      )}

      <div className={styles.mainHeader}>
        <h1>Overview</h1>
      </div>

      <section className={styles.mainCards}>
        {favorites.map((coin) => {
          const isPositive = coin.change24h >= 0;
          return (
            <article
              key={coin.symbol}
              className={`${styles.card} cursor-pointer hover:shadow-lg transition`}
              onClick={() => handleCardClick(coin.symbol)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <h3>{coin.symbol.replace("USDT", "")}</h3>
                </div>
                <div
                  className={styles.headerRight}
                  style={{ color: isPositive ? "lime" : "red" }}
                >
                  {coin.change24h.toFixed(2)}%
                </div>
              </div>

              <div className={styles.cardBody}>
                <h1>${coin.price.toFixed(2)}</h1>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.footerLeft}>
                  <h6 className="small">Volume</h6>
                  <h5>{coin.volume.toLocaleString()}</h5>
                </div>

                <div className={styles.footerRight}>
                  <button
                    className={styles.btnOutline}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(coin.symbol);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
