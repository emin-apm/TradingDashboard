import { NavLink } from "react-router-dom";

import styles from "./NavbarStyles.module.css";
import SideNavbar from "./SideNavbar";
import Login from "../../components/Login/Login";
import { useState } from "react";

export default function Navbar() {
  const [showLoginModal, setLoginModal] = useState(false);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.navLogo}>
            <h3>TradinBIT</h3>
          </NavLink>
          <div className={styles.navSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="search" name="" placeholder="Search" />
          </div>
          <div className={styles.navProfileWrapper}>
            <button className={styles.navThemeBtn}>
              <i className="fa-solid fa-moon"></i>
            </button>
            <div
              className={styles.navProfile}
              onClick={() => setLoginModal((x) => (x = true))}
            >
              <div className={styles.navProfilePhhoto}>
                <img
                  src="https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="photo"
                />
              </div>
              <h5>Name Here</h5>
            </div>
            <button className={styles.navMenuBtn}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
      <SideNavbar />
      {showLoginModal && <Login onClose={() => setLoginModal(false)} />}
    </>
  );
}
