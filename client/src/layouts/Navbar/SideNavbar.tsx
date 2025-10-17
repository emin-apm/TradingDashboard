import { Link } from "react-router-dom";
import styles from "./NavbarStyles.module.css";

export default function SideNavbar() {
  return (
    <>
      <div className={styles.sidebar}>
        <Link to={"/"}>
          <i className="fa-solid fa-house"></i>
          <h5>Home</h5>
        </Link>
        <Link to={"/marketoverview"}>
          <i className="fa-solid fa-money-bill-trend-up"></i>
          <h5>Market Overview</h5>
        </Link>
        <Link to={"/wallet"}>
          <i className="fa-solid fa-wallet"></i>
          <h5>My Wallet</h5>
        </Link>
      </div>
    </>
  );
}
