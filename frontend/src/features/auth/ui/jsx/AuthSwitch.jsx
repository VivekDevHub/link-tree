import styles from "../css/AuthSwitch.module.css";

function AuthSwitch({ actionLabel, label, onClick }) {
    return (
        <p className={styles.switchText}>
            <span>{label}</span>
            <button className={styles.switchButton} type="button" onClick={onClick}>
                {actionLabel}
            </button>
        </p>
    );
}

export default AuthSwitch;

