import { useEffect, useMemo } from "react";
import Wallet from "../components/Wallet/Wallet";
import { useAuthStore } from "../store/useAuthStore";
import { useModalStore } from "../store/useLoginModal";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export default function WalletPage() {
  const {
    walletAddress,
    setWalletAddress,
    isLoggedIn,
    myCoins,
    history,
    name,
  } = useAuthStore();
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

  const totalBalance = useMemo(() => {
    if (!myCoins || myCoins.length === 0) return 0;
    return myCoins.reduce((sum, coin) => sum + coin.amount, 0);
  }, [myCoins]);

  useEffect(() => {
    if (walletAddress) {
      console.log("Wallet connected:", walletAddress);
    }
  }, [walletAddress]);

  return (
    <>
      {isLoggedIn ? (
        <Wallet
          address={walletAddress}
          balance={totalBalance}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          tradeHistory={history}
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
