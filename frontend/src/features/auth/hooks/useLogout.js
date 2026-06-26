"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import { logoutUser } from "@/features/auth/api/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function useLogout() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            await logoutUser();
            logout();
            toast.success("Logged out successfully");
            router.push("/auth");
        } catch (error) {
            toast.error("Failed to logout");
        } finally {
            setIsLoggingOut(false);
        }
    }

    return { handleLogout, isLoggingOut };
}

export default useLogout;
