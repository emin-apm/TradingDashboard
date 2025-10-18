import { useState } from "react";
import styles from "./LoginStyles.module.css";

type LoginProps = {
  onClose: () => void;
};

export default function Login({ onClose }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);

  const toggleRegister = () => {
    setIsRegister((old) => (old = !isRegister));
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.wrapper}>
        <span className={styles.close} onClick={() => onClose()}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        <div className={`${styles.formBox} ${styles.login}`}>
          <h2>{isRegister ? "Register" : "Login"}</h2>

          <form>
            {/* Email */}
            <div className={styles.inputBox}>
              <span className={styles.icon}>
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input type="email" placeholder=" " />
              <label>Email</label>
            </div>

            {/* Password */}
            <div className={styles.inputBox}>
              <span className={styles.icon}>
                <i className="fa-solid fa-lock"></i>
              </span>
              <input type="password" placeholder=" " />
              <label>Password</label>
            </div>

            {/* Confirm Password (for register example) */}
            {isRegister && (
              <div className={styles.inputBox}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input type="password" placeholder=" " />
                <label>Confirm Password</label>
              </div>
            )}

            <button type="button" className={styles.btn}>
              {isRegister ? "Register" : "Login"}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <button type="button" className={styles.btn}>
              <i className="fa-brands fa-google"></i>
              {isRegister ? "Register " : "Login "}
              with Google
            </button>

            <div className={styles.loginRegister}>
              {isRegister ? (
                <p>
                  Already have an account?
                  <button
                    type="button"
                    className={styles.registerLink}
                    onClick={() => toggleRegister()}
                  >
                    Login
                  </button>
                </p>
              ) : (
                <p>
                  Don’t have an account?
                  <button
                    type="button"
                    className={styles.registerLink}
                    onClick={() => toggleRegister()}
                  >
                    Register
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
