import { useAuthStore } from "../../store/useAuthStore";
import styles from "./WalletStyles.module.css";
import { useNavigate } from "react-router-dom";

type Trade = {
  symbol: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  date: Date;
};

type WalletProps = {
  address: string | null;
  balance: string | number | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  tradeHistory: Trade[];
};
export default function Wallet({
  address,
  balance,
  connectWallet,
  disconnectWallet,
  tradeHistory,
}: WalletProps) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <section className={`container ${styles.wallet}`}>
      <div className={styles.walletBalance}>
        <h4>Total Balance:</h4>
        <h1>$ {balance}</h1>
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

      <div className={styles.walletCta}>
        <button
          className={styles.walletCtaBtn}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <p>Logout</p>
        </button>
      </div>

      <ul className={styles.walletTokens}>
        {tradeHistory.map((trade, index) => (
          <li className={styles.walletToken} key={index}>
            <div>
              <h4>{trade.symbol}</h4>
              <div>
                <p>${trade.price}</p>
                <div className={`small`}></div>
              </div>
            </div>
            <div className={styles.tokenRight}>
              <h4>{trade.amount}</h4>
              <p className={styles.date}>
                {" "}
                {new Date(trade.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className={styles.tradeButtons}>
              {trade.side === "buy" && (
                <button
                  className={styles.buyBtn}
                  onClick={() => console.log(`${trade.symbol} Buy`)}
                >
                  Buy{" "}
                  <span>
                    <i className="fa-solid fa-arrow-up"></i>
                  </span>
                </button>
              )}

              {/* Show only Sell button if side is 'sell' */}
              {trade.side === "sell" && (
                <button
                  className={styles.sellBtn}
                  onClick={() => console.log(`${trade.symbol} Sell`)}
                >
                  Sell{" "}
                  <span>
                    <i className="fa-solid fa-arrow-down"></i>
                  </span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
