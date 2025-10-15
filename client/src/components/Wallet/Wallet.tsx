import styles from "./WalletStyles.module.css";

export default function Wallet() {
  return (
    <>
      <section className={`container ${styles.wallet}`}>
        <div className={styles.walletBalance}>
          <h4>Total Balance:</h4>
          <h1>$1234,323,123</h1>
          <h2>wallet adres here</h2>
          <div className={styles.walletCta}>
            <button className={styles.walletCtaBtn}>
              <i className="fa-solid fa-right-to-bracket"></i>
              <p>Connect Wallet</p>
            </button>
            <button className={styles.walletCtaBtn}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <p>Disconnect Wallet</p>
            </button>
          </div>
        </div>

        <ul className={styles.walletTokens}>
          <li className={styles.walletToken}>
            <div>
              <h4>Bitcoin</h4>
              <div>
                <p>$55,000</p>
                <div className={`small`}></div>
              </div>
            </div>
            <div className={styles.tokenRight}>
              <h4>1 BTC</h4>
              <p>$55,000</p>
            </div>
            <div className={styles.tradeButtons}>
              <button onClick={() => console.log("BTC")}>Buy</button>
              <button onClick={() => console.log("BTC")}>Sell</button>
            </div>
          </li>
          <li className={styles.walletToken}>
            <div>
              <h4>Bitcoin</h4>
              <div>
                <p>$55,000</p>
                <div className={`small`}></div>
              </div>
            </div>
            <div className={styles.tokenRight}>
              <h4>1 BTC</h4>
              <p>$55,000</p>
            </div>
            <div className={styles.tradeButtons}>
              <button onClick={() => console.log("BTC")}>Buy</button>
              <button onClick={() => console.log("BTC")}>Sell</button>
            </div>
          </li>
          <li className={styles.walletToken}>
            <div>
              <h4>Bitcoin</h4>
              <div>
                <p>$55,000</p>
                <div className={`small`}></div>
              </div>
            </div>
            <div className={styles.tokenRight}>
              <h4>1 BTC</h4>
              <p>$55,000</p>
            </div>
            <div className={styles.tradeButtons}>
              <button onClick={() => console.log("BTC")}>Buy</button>
              <button onClick={() => console.log("BTC")}>Sell</button>
            </div>
          </li>
          <li className={styles.walletToken}>
            <div>
              <h4>Bitcoin</h4>
              <div>
                <p>$55,000</p>
                <div className={`small`}></div>
              </div>
            </div>
            <div className={styles.tokenRight}>
              <h4>1 BTC</h4>
              <p>$55,000</p>
            </div>
            <div className={styles.tradeButtons}>
              <button onClick={() => console.log("BTC")}>Buy</button>
              <button onClick={() => console.log("BTC")}>Sell</button>
            </div>
          </li>
          <li className={styles.walletToken}>
            <div>
              <h4>Bitcoin</h4>
              <div>
                <p>$55,000</p>
                <div className={`small`}></div>
              </div>
            </div>
            <div className={styles.tokenRight}>
              <h4>1 BTC</h4>
              <p>$55,000</p>
            </div>
            <div className={styles.tradeButtons}>
              <button onClick={() => console.log("BTC")}>Buy</button>
              <button onClick={() => console.log("BTC")}>Sell</button>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
