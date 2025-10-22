import { useEffect, useMemo } from "react";
import Wallet from "../components/Wallet/Wallet";
import { useAuthStore } from "../store/useAuthStore";
import { useModalStore } from "../store/useLoginModal";

const prices: Record<string, number> = {
  BTC: 30000,
  ETH: 2000,
  USDCUSDT: 1,
  USDEUSDT: 1,
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export default function WalletPage() {
  const { walletAddress, setWalletAddress, isLoggedIn, myCoins, history } =
    useAuthStore();
  const { openLoginModal } = useModalStore();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("MetaMask connection failed", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  useEffect(() => {
    if (walletAddress) {
      console.log("Wallet connected:", walletAddress);
    }
  }, [walletAddress]);

  const totalBalance = useMemo(() => {
    if (!myCoins || myCoins.length === 0) return 0;
    return myCoins.reduce((sum, coin) => {
      const price = prices[coin.symbol] ?? 0;
      return sum + coin.amount * price;
    }, 0);
  }, [myCoins]);

  const sortedHistory = useMemo(() => {
    if (!history) return [];
    return [...history].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [history]);
  console.log(myCoins);
  return (
    <>
      {isLoggedIn ? (
        <Wallet
          address={walletAddress}
          balance={totalBalance}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          tradeHistory={sortedHistory}
        />
      ) : (
        <div className="container">
          <br />
          <br />
          <br />
          <br />
          <h1>You need to log in first</h1>
          <button onClick={openLoginModal}>Login Here</button>
        </div>
      )}
    </>
  );
}
