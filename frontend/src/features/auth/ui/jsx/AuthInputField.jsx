"use client";

import { useState } from "react";
import styles from "../css/AuthInputField.module.css";

function FieldIcon({ name }) {
    if (name === "mail") {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Z" />
                <path d="m5 7 7 5 7-5" />
            </svg>
        );
    }

    if (name === "lock") {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                <path d="M6.75 10h10.5A1.75 1.75 0 0 1 19 11.75v6.5A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25v-6.5A1.75 1.75 0 0 1 6.75 10Z" />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M2.75 12s3.25-6 9.25-6 9.25 6 9.25 6-3.25 6-9.25 6-9.25-6-9.25-6Z" />
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
    );
}

function AuthInputField({ hint, hintColor, icon, id, label, labelRight, name, placeholder, type = "text", value, onChange }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
                <label className={styles.label} htmlFor={id}>{label}</label>
                {labelRight && <span className={styles.labelRight}>{labelRight}</span>}
            </div>
            <div className={styles.inputWrap}>
                <span className={styles.icon}>
                    <FieldIcon name={icon} />
                </span>

                <input
                    className={styles.input}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    type={inputType}
                    autoComplete={isPassword ? "current-password" : name}
                    value={value}
                    onChange={onChange}
                />

                {isPassword && (
                    <button
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className={styles.eyeButton}
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                    >
                        <EyeIcon />
                    </button>
                )}
            </div>
            {hint && <p className={styles.hint} style={hintColor ? { color: hintColor } : undefined}>{hint}</p>}
        </div>
    );
}

export default AuthInputField;

