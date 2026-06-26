"use client";

import Link from "next/link";
import useAuthForm from "../../hooks/useAuthForm";
import useUsernameCheck from "../../hooks/useUsernameCheck";
import AuthButton from "./AuthButton";
import AuthInputField from "./AuthInputField";
import AuthLogo from "./AuthLogo";
import AuthSwitch from "./AuthSwitch";
import AuthWrapper from "./AuthWrapper";
import styles from "../css/AuthPage.module.css";

function getUsernameHint(status, formatError) {
    if (formatError) {
        return { text: formatError, color: "#ff4757" };
    }
    switch (status) {
        case "checking":
            return { text: "Checking availability...", color: "#888" };
        case "available":
            return { text: "This username is available", color: "#10b981" };
        case "taken":
            return { text: "This username is not available", color: "#ff4757" };
        default:
            return { text: "", color: "" };
    }
}

function AuthPanel() {
    const {
        authMode,
        formValues,
        isLogin,
        isSubmitting,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        switchAuthMode,
    } = useAuthForm();

    const { status: usernameStatus, formatError } = useUsernameCheck(formValues.name);
    const usernameHint = isLogin ? null : getUsernameHint(usernameStatus, formatError);

    const allChecked = formValues.privacyPolicyAccepted && formValues.termsAccepted;
    const canSubmit = isSubmitting || (!isLogin && (usernameStatus === "taken" || usernameStatus === "invalid")) || (!isLogin && !allChecked);

    return (
        <AuthWrapper>
            <AuthLogo />

            <section className={styles.header}>
                <h1 className={styles.title}>{isLogin ? "Welcome back!" : "Create your account"}</h1>
                <p className={styles.subtitle}>
                    {isLogin ? "Login to access your dashboard" : "Start managing your links and analytics"}
                </p>
            </section>

            <form className={styles.form} onSubmit={handleSubmit}>
                {!isLogin && (
                    <AuthInputField
                        icon="user"
                        id="signup-name"
                        label="User name"
                        name="name"
                        placeholder="Enter your user name"
                        type="text"
                        value={formValues.name}
                        onChange={handleInputChange}
                        hint={usernameHint.text}
                        hintColor={usernameHint.color}
                    />
                )}

                <AuthInputField
                    icon="mail"
                    id={authMode + "-email"}
                    label="Email address"
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                />

                <AuthInputField
                    hint={!isLogin ? "At least 8 characters" : undefined}
                    icon="lock"
                    id={authMode + "-password"}
                    label="Password"
                    labelRight={isLogin ? <Link href="/forgot-password" style={{ fontSize: "0.85rem", color: "#4f46e5", textDecoration: "none" }}>Forgot password?</Link> : undefined}
                    name="password"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    type="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                />

                {!isLogin && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4, marginBottom: 8 }}>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.82rem", color: "#64718a", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                name="privacyPolicyAccepted"
                                checked={formValues.privacyPolicyAccepted}
                                onChange={handleCheckboxChange}
                                style={{ marginTop: 3, accentColor: "#4f46e5" }}
                            />
                            <span>
                                I agree to the{" "}
                                <Link href="/privacy-policy" target="_blank" style={{ color: "#4f46e5", textDecoration: "none" }}>Privacy Policy</Link>
                            </span>
                        </label>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.82rem", color: "#64718a", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formValues.termsAccepted}
                                onChange={handleCheckboxChange}
                                style={{ marginTop: 3, accentColor: "#4f46e5" }}
                            />
                            <span>
                                I agree to the{" "}
                                <Link href="/terms" target="_blank" style={{ color: "#4f46e5", textDecoration: "none" }}>Terms &amp; Conditions</Link>
                            </span>
                        </label>
                    </div>
                )}

                <AuthButton disabled={canSubmit} type="submit">
                    {isSubmitting ? "Please wait" : isLogin ? "Log in" : "Sign up"}
                </AuthButton>
            </form>

            <AuthSwitch
                actionLabel={isLogin ? "Sign up" : "Log in"}
                label={isLogin ? "Don't have an account?" : "Already have an account?"}
                onClick={switchAuthMode}
            />
        </AuthWrapper>
    );
}

export default AuthPanel;
