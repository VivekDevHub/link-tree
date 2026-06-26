"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/context/AuthContext";
import { resetPassword } from "@/features/auth/api/auth.api";
import AuthWrapper from "@/features/auth/ui/jsx/AuthWrapper";
import AuthLogo from "@/features/auth/ui/jsx/AuthLogo";
import AuthInputField from "@/features/auth/ui/jsx/AuthInputField";
import AuthButton from "@/features/auth/ui/jsx/AuthButton";
import styles from "@/features/auth/ui/css/AuthPage.module.css";

function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    if (user) {
        return (
            <div className={styles.page}>
                <AuthWrapper>
                    <p style={{ textAlign: "center", color: "#64718a" }}>
                        You are already logged in.{" "}
                        <Link href="/dashboard" style={{ color: "#4f46e5" }}>Go to Dashboard</Link>
                    </p>
                </AuthWrapper>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword(token, password);
            setResetDone(true);
            toast.success("Password reset successfully");
            setTimeout(() => router.push("/auth"), 2000);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid or expired token");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <AuthWrapper>
                <AuthLogo />

                <section className={styles.header}>
                    <h1 className={styles.title}>Reset your password</h1>
                    <p className={styles.subtitle}>
                        Enter your new password below.
                    </p>
                </section>

                {resetDone ? (
                    <p style={{ textAlign: "center", color: "#10b981", fontSize: "0.9rem", marginTop: "1rem" }}>
                        Password reset! Redirecting to login...
                    </p>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <AuthInputField
                            icon="lock"
                            id="reset-password"
                            label="New Password"
                            name="password"
                            placeholder="Enter new password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            hint="At least 6 characters"
                        />

                        <AuthInputField
                            icon="lock"
                            id="reset-confirm"
                            label="Confirm Password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <AuthButton disabled={isSubmitting} type="submit">
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </AuthButton>
                    </form>
                )}

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#64718a" }}>
                    <Link href="/auth" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}>
                        Back to Login
                    </Link>
                </p>
            </AuthWrapper>
        </div>
    );
}

export default ResetPasswordPage;
