import styles from "./SpinnerStyles.module.css";

export default function Spinner() {
  return (
    <div className={styles.spinerContainer}>
      <span className={styles.loader}></span>
    </div>
  );
}
