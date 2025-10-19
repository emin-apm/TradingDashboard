import styles from "./WalletStyles.module.css";

type WalletProps = {
  address: string | null;
  balance: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

export default function Wallet({
  address,
  balance,
  connectWallet,
  disconnectWallet,
}: WalletProps) {
  return (
    <section className={`container ${styles.wallet}`}>
      <div className={styles.walletBalance}>
        <h4>Total Balance:</h4>
        <h1>{balance ? `${balance} ETH` : "$0"}</h1>
        <h2>{address ?? "Wallet not connected"}</h2>

        <div className={styles.walletCta}>
          {!address ? (
            <button className={styles.walletCtaBtn} onClick={connectWallet}>
              <i className="fa-solid fa-right-to-bracket"></i>
              <p>Connect Wallet</p>
            </button>
          ) : (
            <button className={styles.walletCtaBtn} onClick={disconnectWallet}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <p>Disconnect Wallet</p>
            </button>
          )}
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
            <button
              className={styles.buyBtn}
              onClick={() => console.log("BTC Buy")}
            >
              Buy{" "}
              <span>
                <i className="fa-solid fa-arrow-up"></i>
              </span>
            </button>
            <button
              className={styles.sellBtn}
              onClick={() => console.log("BTC Sell")}
            >
              Sell{" "}
              <span>
                <i className="fa-solid fa-arrow-down"></i>
              </span>
            </button>
          </div>
        </li>
      </ul>
    </section>
  );
}
