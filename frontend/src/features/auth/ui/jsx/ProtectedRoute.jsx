"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return children;
}

export default ProtectedRoute;
