"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

const UPI_ID = "bhavyadhanwani1234@okicici";
const NAME = "linkters";
const QR_API = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${NAME}`)}`;

function Footer() {
    const [showQR, setShowQR] = useState(false);

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p className={styles.text}>If you like this project, consider supporting it!</p>
                <button className={styles.coffeeBtn} onClick={() => setShowQR(true)}>
                    Buy me a coffee
                </button>
            </div>

            {showQR && (
                <div className={styles.overlay} onClick={() => setShowQR(false)}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setShowQR(false)}>
                            &times;
                        </button>
                        <p className={styles.popupTitle}>Scan to Pay</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={QR_API} alt="UPI Payment QR Code" className={styles.qr} width={200} height={200} />
                        <p className={styles.upiId}>UPI ID: {UPI_ID}</p>
                    </div>
                </div>
            )}
        </footer>
    );
}

export default Footer;
