import styles from "../css/ProfilePage.module.css";

function ProfileUsername({ username, textColor }) {
    return (
        <h1 className={styles.username} style={{ color: textColor }}>@{username}</h1>
    );
}

export default ProfileUsername;
