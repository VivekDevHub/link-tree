import Image from "next/image";
import logo from "@/assets/darkLogo.png";
import styles from "../css/AuthLogo.module.css";

function AuthLogo() {
    return (
        <div className={styles.logoWrap}>
            <Image
                className={styles.logo}
                src={logo}
                alt="Linkters"
                width={140}
                height={40}
                priority
            />
        </div>
    );
}

export default AuthLogo;

