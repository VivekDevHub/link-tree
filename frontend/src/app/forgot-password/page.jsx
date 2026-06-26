"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/context/AuthContext";
import { forgotPassword } from "@/features/auth/api/auth.api";
import AuthWrapper from "@/features/auth/ui/jsx/AuthWrapper";
import AuthLogo from "@/features/auth/ui/jsx/AuthLogo";
import AuthInputField from "@/features/auth/ui/jsx/AuthInputField";
import AuthButton from "@/features/auth/ui/jsx/AuthButton";
import styles from "@/features/auth/ui/css/AuthPage.module.css";

function ForgotPasswordPage() {
    const { user } = useAuth();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

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
        if (isSubmitting || cooldown > 0) return;

        setIsSubmitting(true);
        try {
            await forgotPassword(email);
            setSent(true);
            setCooldown(60);
            toast.success("Reset link has been sent to your email");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <AuthWrapper>
                <AuthLogo />

                <section className={styles.header}>
                    <h1 className={styles.title}>Forgot your password?</h1>
                    <p className={styles.subtitle}>
                        Enter your email and we&apos;ll send you a link to reset your password.
                    </p>
                </section>

                {sent && (
                    <p style={{ textAlign: "center", color: "#10b981", fontSize: "0.9rem", marginTop: "1rem" }}>
                        Check your email for the reset link.
                    </p>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <AuthInputField
                        icon="mail"
                        id="forgot-email"
                        label="Email address"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <AuthButton disabled={isSubmitting || cooldown > 0} type="submit">
                        {cooldown > 0 ? `Resend in ${cooldown}s` : isSubmitting ? "Sending..." : "Send Reset Link"}
                    </AuthButton>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#64718a" }}>
                    <Link href="/auth" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}>
                        Back to Login
                    </Link>
                </p>
            </AuthWrapper>
        </div>
    );
}

export default ForgotPasswordPage;
