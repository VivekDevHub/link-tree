"use client";

import Image from "next/image";
import Link from "next/link";
import darkLogo from "@/assets/darkLogo.png";
import lightLogo from "@/assets/lightLogo.png";
import styles from "../css/ProfilePage.module.css";

function isColorDark(hex) {
    if (!hex) return false;
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

function ProfileHeader({ bgColor, textColor, customLogo, customName, removeLinkterBranding }) {
    const useLightLogo = bgColor && isColorDark(bgColor);
    const logoTextColor = textColor || "#333";

    if (removeLinkterBranding) {
        if (!customLogo && !customName) return null;
        return (
            <div className={styles.header} style={{ justifyContent: "center", gap: 12 }}>
                {customLogo && (
                    <Image
                        src={customLogo}
                        alt={customName || "Brand"}
                        width={40}
                        height={40}
                        unoptimized
                        style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                )}
                {customName && (
                    <h2 className={styles.logoText} style={{ color: logoTextColor }}>{customName}</h2>
                )}
            </div>
        );
    }

    return (
        <Link className={styles.header} href="/">
            <Image
                alt="Logo of linkter"
                src={useLightLogo ? lightLogo : darkLogo}
                className={styles.logo}
            />
            <h2 className={styles.logoText} style={{ color: logoTextColor }}>Linkter</h2>
        </Link>
    );
}

export default ProfileHeader;
