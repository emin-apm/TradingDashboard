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
  const { walletAddress, setWalletAddress, isLoggedIn } = useAuthStore();
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
      setWalletAddress(accounts[0]); // store address globally
    } catch (error) {
      console.error("MetaMask connection failed", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <Wallet
          address={walletAddress}
          balance={null} // backend will provide this later
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
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
