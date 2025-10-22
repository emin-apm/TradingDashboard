import { Link, NavLink } from "react-router-dom";
import styles from "./NavbarStyles.module.css";
import SideNavbar from "./SideNavbar";
import Login from "../../components/Login/Login";
import { useModalStore } from "../../store/useLoginModal";
import { useAuthStore } from "../../store/useAuthStore";

export default function Navbar() {
  const { showLoginModal, openLoginModal, closeLoginModal } = useModalStore();
  const { name, isLoggedIn } = useAuthStore();

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.navLogo}>
            <h3>TradinBIT</h3>
          </NavLink>

          <div className={styles.navSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="search" placeholder="Search" />
          </div>

          <div className={styles.navProfileWrapper}>
            {/* <button className={styles.navThemeBtn}>
              <i className="fa-solid fa-moon"></i>
            </button> */}

            {isLoggedIn ? (
              <Link to="/wallet" className={styles.navProfile}>
                <div className={styles.navProfilePhoto}>
                  <img
                    src="https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="profile"
                  />
                </div>
                <h5>{name}</h5>
              </Link>
            ) : (
              <div className={styles.navProfile} onClick={openLoginModal}>
                <div className={styles.navProfilePhoto}>
                  <img
                    src="https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="profile"
                  />
                </div>
                <h5>Login</h5>
              </div>
            )}

            <button className={styles.navMenuBtn}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      <SideNavbar />
      {showLoginModal && <Login onClose={closeLoginModal} />}
    </>
  );
}
