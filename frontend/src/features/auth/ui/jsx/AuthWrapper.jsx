import styles from "../css/AuthWrapper.module.css";

function AuthWrapper({ children }) {
    return (
        <section className={styles.wrapper}>
            {children}
        </section>
    );
}

export default AuthWrapper;

