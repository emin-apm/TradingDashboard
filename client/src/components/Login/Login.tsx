import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { login, register } from "../../services/authServices";
import { validateForm } from "../../utils/validations";
import type { ValidationErrors } from "../../utils/validations";
import styles from "./LoginStyles.module.css";

type LoginProps = { onClose: () => void };

type Coin = { symbol: string; amount: number; buyPrice: number };
type Trade = {
  symbol: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  date: Date;
};

type AuthResponse = {
  userData: {
    email: string;
    id: string;
    myCoins: Coin[];
    tradeHistory: Trade[];
  };
  accessToken: string;
  refreshToken: string;
};

export default function Login({ onClose }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  // New auth store
  const { setIsLoggedIn, setToken, setName, setMyCoins, setHistory, setId } =
    useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
    onSuccess: (data: AuthResponse) => {
      setIsLoggedIn(true);
      setId(data.userData.id);
      setToken(data.accessToken);
      setName(data.userData.email);
      setMyCoins(data.userData.myCoins);
      setHistory(data.userData.tradeHistory);
      onClose();
    },
    onError: (err: any) => alert(err.response?.data?.message || "Login failed"),
  });

  const registerMutation = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      confirmPassword: string;
    }) => register(data),
    onSuccess: (data: AuthResponse) => {
      setIsLoggedIn(true);
      setToken(data.accessToken);
      setName(data.userData.email);
      setId(data.userData.id);
      setMyCoins(data.userData.myCoins);
      setHistory(data.userData.tradeHistory);
      onClose();
    },
    onError: (err: any) =>
      alert(err.response?.data?.message || "Register failed"),
  });

  const handleSubmit = () => {
    const validationErrors = validateForm(
      email,
      password,
      confirmPassword,
      isRegister
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (isRegister)
        registerMutation.mutate({ email, password, confirmPassword });
      else loginMutation.mutate({ email, password });
    }
  };

  const toggleRegister = () => {
    setIsRegister((old) => !old);
    setErrors({});
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.wrapper}>
        <span className={styles.close} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        <div className={`${styles.formBox} ${styles.login}`}>
          <h2>{isRegister ? "Register" : "Login"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className={styles.inputBox}>
              <span className={styles.icon}>
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className={styles.inputBox}>
              <span className={styles.icon}>
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            {isRegister && (
              <div className={styles.inputBox}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type="password"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label>Confirm Password</label>
                {errors.confirmPassword && (
                  <p className="error">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className={styles.btn}
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isRegister ? "Register" : "Login"}
            </button>

            <div className={styles.loginRegister}>
              {isRegister ? (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className={styles.registerLink}
                    onClick={toggleRegister}
                  >
                    Login
                  </button>
                </p>
              ) : (
                <p>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className={styles.registerLink}
                    onClick={toggleRegister}
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
