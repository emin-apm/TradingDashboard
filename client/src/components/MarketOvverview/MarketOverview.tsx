import styles from "./MarketStyles.module.css";
import Sparkline from "./SparkLine";

type MarketData = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  sparkline: number[];
};

export default function MarketOverview() {
  const dummyData: MarketData[] = [
    {
      symbol: "BTCUSDT",
      lastPrice: "68250.45",
      priceChangePercent: "1.25",
      volume: "14521.30",
      sparkline: [67000, 67400, 67850, 68100, 68200, 68250],
    },
    {
      symbol: "ETHUSDT",
      lastPrice: "2309.10",
      priceChangePercent: "-0.85",
      volume: "10234.10",
      sparkline: [2350, 2340, 2330, 2320, 2310, 2309],
    },
    {
      symbol: "SOLUSDT",
      lastPrice: "156.30",
      priceChangePercent: "3.21",
      volume: "5120.75",
      sparkline: [150, 152, 154, 156, 157, 156],
    },
  ];

  return (
    <div className="container">
      <div className={styles.mainHeader}>
        <h1>Overview</h1>
      </div>
      <section className={styles.mainCards}>
        {dummyData.map((coin) => {
          const isPositive = parseFloat(coin.priceChangePercent) > 0;
          return (
            <article key={coin.symbol} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <h3>{coin.symbol.replace("USDT", "")}</h3>
                </div>
                <div
                  className={styles.headerRight}
                  style={{ color: isPositive ? "lime" : "red" }}
                >
                  {coin.priceChangePercent}%
                </div>
              </div>
              <div className={styles.cardBody}>
                <h1>${coin.lastPrice}</h1>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.footerLeft}>
                  <h6 className="small">Volume</h6>
                  <h5>{coin.volume}</h5>
                </div>
                <div className={styles.footerRight}>
                  <h6 className="small">Sparkline</h6>
                  <div className={styles.sparklineWrapper}>
                    <Sparkline data={coin.sparkline} positive={isPositive} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
