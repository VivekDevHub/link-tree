"use client";

import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthPanel from "./AuthPanel";
import styles from "../css/AuthPage.module.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

function AuthPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    if (isLoading || user) {
        return null;
    }

    return (
        <main className={[styles.page, poppins.className].join(" ")}>
            <AuthPanel />
        </main>
    );
}

export default AuthPage;
