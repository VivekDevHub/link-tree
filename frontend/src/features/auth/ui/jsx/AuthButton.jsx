import styles from "../css/AuthButton.module.css";

function AuthButton({ children, disabled = false, type = "button" }) {
    return (
        <button className={styles.button} disabled={disabled} type={type}>
            {children}
        </button>
    );
}

export default AuthButton;
